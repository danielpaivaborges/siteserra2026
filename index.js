import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { consultarSeisMeses, obterPeriodoMovel } from './integracoes/despesa-extra.mjs';
import { consultarSeisMesesOrc } from './integracoes/despesa-orcamentaria.mjs';
import { consultarSeisMesesReceita } from './integracoes/receita-orcamentaria.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const rawBase = String(process.env.BASE_PATH || '').trim();
if (rawBase && !/^\/[a-zA-Z0-9/_-]*$/.test(rawBase)) throw new Error('BASE_PATH inválido');
const BASE = rawBase.replace(/\/+$/, '');
const VERSION = '1.3.0';
const PORT = Number(process.env.PORT || process.env.PORT_INDEX || process.env.PORT_APP || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const TTL = 5 * 60_000;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8'
};
const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
const isProduction = process.env.NODE_ENV === 'production';
let cached = null, inFlight = null;
let orcJob = null;
let receitaCache=null, receitaPendente=null;
const ORC_TTL = 5 * 60_000;
function iniciarColetaOrc(){
  const key=getPeriodKey(), agora=Date.now();
  if(orcJob?.key===key && (orcJob.estado==='coletando' ||
      (orcJob.estado==='pronto' && agora-orcJob.concluidoEm<ORC_TTL) ||
      (orcJob.estado==='erro' && agora-orcJob.concluidoEm<30000)))return orcJob;
  const job={key,estado:'coletando',paginasColetadas:0,totalPaginas:null,registros:0,dados:null,erro:null,concluidoEm:null};
  orcJob=job;
  void consultarSeisMesesOrc({onProgress:p=>{
    job.paginasColetadas=p.paginasColetadas;
    job.totalPaginas=p.totalPaginas;
    job.registros=p.registros;
  }}).then(d=>{
    job.dados=d;job.estado='pronto';job.concluidoEm=Date.now();
  }).catch(e=>{
    console.error('[despesas orcamentárias]',e?.codigo||'ERRO',e?.message||'falha');
    job.erro=e?.codigo||'FONTE_INDISPONIVEL';job.estado='erro';job.concluidoEm=Date.now();
  });
  return job;
}

async function getReceitas(){
 const key=getPeriodKey(),now=Date.now();
 if(receitaCache?.key===key&&now-receitaCache.at<TTL)return receitaCache.data;
 if(receitaPendente?.key===key)return receitaPendente.promise;
 const promise=consultarSeisMesesReceita().then(data=>{receitaCache={key,at:Date.now(),data};return data});
 receitaPendente={key,promise};
 try{return await promise}finally{if(receitaPendente?.promise===promise)receitaPendente=null}
}
function commonHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Só ativar após confirmar que a URL pública já atende HTTPS válido.
  if (isProduction && process.env.HTTPS_READY === '1') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  }
}
function respondJSON(res, statusCode, data, method = 'GET') {
  const raw = JSON.stringify(data);
  res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'});
  res.end(method === 'HEAD' ? undefined : raw);
}
function getPeriodKey() {
  const periodo = obterPeriodoMovel();
  return `${periodo.inicio}|${periodo.fim}`;
}
async function getExpenses() {
  const key = getPeriodKey();
  if (cached?.key === key && Date.now() - cached.at < TTL) return cached.data;
  if (inFlight?.key === key) return inFlight.promise;
  const promise = consultarSeisMeses().then(data => {
    cached = {key, at: Date.now(), data};
    return data;
  });
  inFlight = {key, promise};
  try { return await promise; }
  finally { if (inFlight?.promise === promise) inFlight = null; }
}
async function serveAsset(res, relativePath, method) {
  const target = path.resolve(PUBLIC, '.' + relativePath);
  if (!target.startsWith(PUBLIC + path.sep)) return respondJSON(res, 403, {erro:'Acesso negado.'}, method);
  const ext = path.extname(target);
  if (!(ext in MIME) || ext === '.html' || ext === '.json') return respondJSON(res,404,{erro:'Recurso não encontrado.'},method);
  try {
    if (!(await stat(target)).isFile()) throw Object.assign(new Error('missing'),{code:'ENOENT'});
    const raw=await readFile(target);
    // JavaScript e CSS devem ser sempre obtidos na versão atual, evitando módulos desatualizados.
    const cacheControl = ['.js', '.css'].includes(ext) ? 'no-store' : 'public, max-age=900';
    res.writeHead(200, {'Content-Type':MIME[ext], 'Cache-Control':cacheControl});
    res.end(method==='HEAD'?undefined:raw);
  } catch(e) {
    return respondJSON(res, e.code==='ENOENT'?404:500,
      {erro:e.code==='ENOENT'?'Recurso não encontrado.':'Falha ao carregar recurso.'},method);
  }
}
async function serveApp(res, method) {
  try {
    const doc=(await readFile(path.join(PUBLIC,'index.html'),'utf8'))
      .replaceAll('__APP_BASE_PATH__', BASE);
    res.writeHead(200, {'Content-Type':MIME['.html'],'Cache-Control':'no-store'});
    res.end(method==='HEAD'?undefined:doc);
  } catch {
    respondJSON(res,500,{erro:'Interface indisponível.'},method);
  }
}
export const server=createServer(async(req,res)=>{
  commonHeaders(res);
  if(!['GET','HEAD'].includes(req.method)){
    return respondJSON(res,405,{erro:'Método não permitido.'},req.method);
  }
  let parsed;
  try { parsed=new URL(req.url,'http://localhost'); } catch { return respondJSON(res,400,{erro:'URL inválida.'},req.method); }
  let pathname;
  try { pathname=decodeURIComponent(parsed.pathname); } catch { return respondJSON(res,400,{erro:'URL inválida.'},req.method); }
  if (BASE && pathname === BASE) {
    res.writeHead(308,{Location:BASE+'/'});
    return res.end();
  }
  if(BASE && pathname!==BASE && !pathname.startsWith(BASE+'/')){
    return respondJSON(res,404,{erro:'Página não encontrada.'},req.method);
  }
  const localPath=BASE?pathname.slice(BASE.length)||'/':pathname;
  if(localPath==='/api/health'){
    return respondJSON(res,200,{
      sistema:'Portal da Transparência - Pref.Mun.de Serra da Saudade MG',
      version:VERSION, status:'online'
    }, req.method);
  }
  if(localPath==='/api/periodo'){
    return respondJSON(res,200,{
      periodo:obterPeriodoMovel(),
      regra:'seis_meses_moveis', fuso:'America/Sao_Paulo'
    },req.method);
  }
  if(localPath==='/api/receitas/orcamentarias'){
    if(parsed.searchParams.size)return respondJSON(res,400,{erro:'Período automático de seis meses.'},req.method);
    try{return respondJSON(res,200,await getReceitas(),req.method)}
    catch(e){console.error('[receita orçamentária]',e?.codigo||'ERRO',e?.message||'falha');
      return respondJSON(res,e?.status||502,{codigo:e?.codigo||'FONTE_INDISPONIVEL',
      erro:'Não foi possível concluir a consulta. Nenhum resultado parcial é exibido.'},req.method);}
  }
  if(localPath==='/api/despesas/extraorcamentarias'){
    if(parsed.searchParams.size){
      return respondJSON(res,400,{
        erro:'O período é automático. Não são aceitos parâmetros de consulta.'
      }, req.method);
    }
    try { return respondJSON(res,200,await getExpenses(),req.method); }
    catch (e) {
      console.error('[integração financeira]', e?.codigo || 'ERRO', e?.message || 'falha');
      return respondJSON(res,e?.status || 502,{
        codigo:e?.codigo || 'FONTE_INDISPONIVEL',
        erro:'Não foi possível concluir a consulta de despesas. Tente novamente mais tarde.'
      },req.method);
    }
  }
  if(localPath==='/api/despesas/orcamentarias'){
    if(parsed.searchParams.size)return respondJSON(res,400,{
      erro:'O período é automático. Não são aceitos parâmetros de consulta.'
    },req.method);
    const job=iniciarColetaOrc();
    if(job.estado==='pronto')return respondJSON(res,200,job.dados,req.method);
    if(job.estado==='erro')return respondJSON(res,502,{
      codigo:job.erro,erro:'Não foi possível concluir a consulta de despesas orçamentárias.'
    },req.method);
    return respondJSON(res,202,{
      status:'coletando',paginasColetadas:job.paginasColetadas,
      totalPaginas:job.totalPaginas,registros:job.registros
    },req.method);
  }
  if(localPath.startsWith('/api/')){
    return respondJSON(res,404,{erro:'Rota de API não encontrada.'},req.method);
  }
  if(localPath.startsWith('/assets/') || localPath==='/favicon.svg') {
    return serveAsset(res,localPath,req.method);
  }
  // Rotas de interface: navegação diretamente por URL funciona inclusive em /transparencia.
  if(localPath==='/' || /^\/[a-zA-Z0-9/_-]*$/.test(localPath)){
    return serveApp(res,req.method);
  }
  return respondJSON(res,404,{erro:'Página não encontrada.'},req.method);
});
if(process.env.NODE_ENV!=='test'){
  server.listen(PORT,HOST,()=>{
    console.log(`Portal da Transparência v${VERSION}: http://localhost:${PORT}${BASE || '/'}`);
    console.log('HTTPS público: configurar certificado/proxy da KingHost antes da publicação.');
  });
}
