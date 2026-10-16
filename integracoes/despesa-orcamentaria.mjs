/**
 * Consultas de DESPESAS ORÇAMENTÁRIAS (movimentos: empenho, liquidação, pagamento).
 * O endpoint público foi identificado em requisição XHR e o formato Spring Page
 * foi confirmado por amostra de 6.468 registros / 324 páginas.
 * Nenhum dado pessoal bruto da fonte pode sair deste conector.
 */
import { obterPeriodoMovel, isoDataValida, CABECALHOS_XHR } from './despesa-extra.mjs';

export const ENDPOINT_ORC = 'https://transparencia.serradasaudade.mg.gov.br/publico/despesaDetalhada';
export const ITENS_ORC = 100;
export const MAX_PAGINAS_ORC = 1000;
const MAX_REGISTROS = 100000;
const PARALELISMO = 5;

function erro(mensagem, codigo='FONTE_INVALIDA'){
  const e = new Error(mensagem);
  e.codigo=codigo;e.status=502;return e;
}
export function montarConsultaOrc({inicio, fim, pagina=1, itens=ITENS_ORC}){
  if(!isoDataValida(inicio)||!isoDataValida(fim)||inicio>fim)throw new RangeError('Datas inválidas');
  if(!Number.isSafeInteger(pagina)||pagina<1||pagina>MAX_PAGINAS_ORC)throw new RangeError('Página inválida');
  if(!Number.isSafeInteger(itens)||itens<1||itens>100)throw new RangeError('Tamanho de página inválido');
  const u=new URL(ENDPOINT_ORC);
  const args={
    elementosPorPagina:itens, pagina, termoBase64:'', indAgrupamento:'FOR',
    datInicio:inicio,datFim:fim,desNatureza:'',codAdministracao:'2',
    filtrarApenasCovid:'false',numEmpenho:'',numCpfCnpjFornecedor:''
  };
  for(const [k,v] of Object.entries(args))u.searchParams.set(k,String(v));
  return u;
}
export function interpretarPaginaOrc(obj,pagina){
  if(!obj||typeof obj!=='object'||Array.isArray(obj)||!Array.isArray(obj.content))throw erro('JSON inesperado','ESQUEMA_INVALIDO');
  const {content, totalElements, totalPages, number, last, size} = obj;
  if(!Number.isSafeInteger(totalPages)||totalPages<0||totalPages>MAX_PAGINAS_ORC
    || !Number.isSafeInteger(totalElements)||totalElements<0||totalElements>MAX_REGISTROS
    || !Number.isSafeInteger(number)||number!==pagina-1
    ||typeof last!=='boolean'||last!==(pagina>=totalPages)
    ||!Number.isSafeInteger(size)||size<1
    ||!content.every(row=>row&&typeof row==='object'&&!Array.isArray(row))
    ||(totalPages>0 && pagina>totalPages)
    ||(totalElements>0 && totalPages===0)
    ||(totalPages>0&&Math.ceil(totalElements/size)!==totalPages))
    throw erro('Paginação inconsistente','PAGINACAO_INVALIDA');
  return {content,totalElements,totalPages,size};
}
function valorNumerico(v){
  if(typeof v==='number'&&Number.isFinite(v))return v;
  if(typeof v==='string'&&/^-?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^-?\d+(?:,\d{1,2})?$/.test(v.trim())){
    const n=Number(v.trim().replaceAll('.','').replace(',','.'));
    if(Number.isFinite(n))return n;
  }
  throw erro('Valor de movimento inválido','VALOR_INVALIDO');
}
function tipoMovimento(v){
  const texto=String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  if(texto.includes('anul')||texto.includes('estorn')||texto.includes('cancela'))return 'Outros';
  if(texto.includes('empenh'))return 'Empenho';
  if(texto.includes('liquid'))return 'Liquidação';
  if(texto.includes('pagam')||texto==='pago')return 'Pagamento';
  return 'Outros';
}
function limparIdentificacao(texto){
  return String(texto??'')
    .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g,'')
    .replace(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g,'')
    .replace(/\b\d{11}\b|\b\d{14}\b/g,'')
    .replace(/\s{2,}/g,' ').trim();
}
function nomeFornecedor(r){
  let s=String(r.nomFornecedor??'').trim();
  if(s && s.toLowerCase()!=='null')return limparIdentificacao(s).slice(0,180)||'Não informado';
  const agrup=String(r.desAgrupamento??'');
  // Nunca reaproveitar CPF/CNPJ; o texto após " - " é a denominação exibida.
  const p=agrup.indexOf(' - ');
  s=(p>=0?agrup.slice(p+3):'').trim();
  return s&&s.toLowerCase()!=='null'?(limparIdentificacao(s).slice(0,180)||'Não informado'):'Não informado';
}
export function normalizarOrc(r){
  if(!r||typeof r!=='object')throw erro('Registro inesperado','REGISTRO_INVALIDO');
  const data=(typeof r.datMovimento==='string'&&isoDataValida(r.datMovimento))?r.datMovimento:null;
  const numero=String(r.numEmpenho??'').replace(/[^\d]/g,'').slice(0,15);
  const ano=Number.isSafeInteger(r.numAnoEmpenho)?r.numAnoEmpenho:null;
  const tipo=tipoMovimento(r.desMovimento);
  return {
    empenho:numero,
    ano:ano,
    movimento:tipo,
    movimentoOriginal:String(r.desMovimento??'Não informado').slice(0,75),
    valor:valorNumerico(r.vlrMovimento),
    data,
    fornecedor:nomeFornecedor(r),
    modalidade:String(r.desModalidade??'').slice(0,100),
    processo:String(r.desProcessoEmpenho??'').slice(0,45),
    licitacao:String(r.desLicitacaoEmpenhoFormatado??'').slice(0,45)
  };
}
export async function consultarPaginaOrc({inicio,fim,pagina=1,fetchImpl=fetch, itens=ITENS_ORC}){
  const url=montarConsultaOrc({inicio,fim,pagina,itens});
  let response;
  try {response=await fetchImpl(url,{method:'GET',headers:CABECALHOS_XHR,
    signal:AbortSignal.timeout(18000),redirect:'error'});}
  catch {throw erro('Falha na conexão da consulta','FONTE_INACESSIVEL');}
  if(!response.ok)throw erro(`Serviço de consulta respondeu HTTP ${response.status}`,'FONTE_HTTP');
  const length=Number(response.headers?.get?.('content-length')||0);
  if(length>8_000_000)throw erro('Resposta extensa demais','RESPOSTA_EXTENSA');
  let raw;
  try{raw=await response.text();}catch{throw erro('Erro de leitura da resposta','LEITURA_FALHOU');}
  if(raw.length>8_000_000)throw erro('Resposta extensa demais','RESPOSTA_EXTENSA');
  let json;
  try{json=JSON.parse(raw);}catch{throw erro('JSON inválido','FONTE_NAO_JSON');}
  return interpretarPaginaOrc(json,pagina);
}
export async function consultarSeisMesesOrc({agora=new Date(),fetchImpl=fetch,onProgress=()=>{}}={}){
  const periodo=obterPeriodoMovel(agora);
  const primeira=await consultarPaginaOrc({...periodo,pagina:1,fetchImpl});
  const {totalPages,totalElements,size}=primeira;
  const paginas=new Array(totalPages);
  if(totalPages)paginas[0]=primeira.content;
  let coletadas=totalPages?1:0;
  onProgress({paginasColetadas:coletadas,totalPaginas:totalPages,registros:primeira.content.length});
  let proxima=2;
  let erros=null;
  let registros=primeira.content.length;
  async function worker(){
    for(;;){
      if(erros)return;
      const p=proxima++;
      if(p>totalPages)return;
      let pagina;
      try {
        pagina=await consultarPaginaOrc({...periodo,pagina:p,fetchImpl,itens:size});
        if(pagina.totalPages!==totalPages||pagina.totalElements!==totalElements||pagina.size!==size)
          throw erro('Paginação alterada durante a consulta','FONTE_ALTERADA');
      } catch(e){erros=e;return;}
      paginas[p-1]=pagina.content;
      registros+=pagina.content.length;
      coletadas++;
      onProgress({paginasColetadas:coletadas,totalPaginas:totalPages,registros});
    }
  }
  await Promise.all(Array.from({length:Math.min(PARALELISMO,Math.max(0,totalPages-1))},worker));
  if(erros)throw erros;
  const bruto=paginas.flat();
  if(bruto.length!==totalElements)throw erro('A coleta não corresponde à quantidade anunciada','CONTAGEM_INCONSISTENTE');
  const dados=bruto.map(normalizarOrc);
  if(dados.some(r=>r.data&&(r.data<periodo.inicio||r.data>periodo.fim)))
    throw erro('O servidor de origem retornou movimentos fora do período solicitado.','PERIODO_INCONSISTENTE');
  // Não inferir valores contábeis a partir de vlrEmpenhado/vlrLiquidado/vlrPago:
  // a amostra do portal repete alguns desses campos em movimentos de Empenho.
  const grupos={Empenho:{quantidade:0,centavos:0},'Liquidação':{quantidade:0,centavos:0},
    Pagamento:{quantidade:0,centavos:0},Outros:{quantidade:0,centavos:0}};
  for(const d of dados){
    grupos[d.movimento].quantidade++;
    grupos[d.movimento].centavos+=Math.round(d.valor*100);
  }
  const resumo=Object.fromEntries(Object.entries(grupos).map(([k,v])=>[k,{quantidade:v.quantidade,valor:v.centavos/100}]));
  return {
    dados,resumo,
    metadados:{
      periodo,paginas:totalPages,totalElementos:totalElements,completo:true,
      natureza:'ORCAMENTARIA',consultadoEm:new Date().toISOString(),
      semData:dados.filter(d=>!d.data).length,
      observacao:'Os indicadores somam valores de movimentos classificados (empenho, liquidação e pagamento), não saldos contábeis. A API pode omitir datas e demais campos.'
    }
  };
}
