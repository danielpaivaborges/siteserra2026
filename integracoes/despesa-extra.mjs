/**
 * Despesa360 — despesas EXTRAORÇAMENTÁRIAS de Serra da Saudade/MG.
 * API confirmada pelo usuário: GET /publico/despesaExtra, payload Spring Page.
 * O servidor é a única parte que chama a origem. Não reutilizar cookies ou tokens.
 */
export const FONTE = 'https://transparencia.serradasaudade.mg.gov.br/publico/despesaExtra';
export const ITENS_POR_PAGINA = 20;
/** Cabeçalhos relevantes observados na chamada XHR pública do portal.
 * Não incluem cookies, IP do visitante, chaves ou qualquer identidade pessoal.
 */
export const CABECALHOS_XHR = Object.freeze({
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'X-Requested-With': 'XMLHttpRequest',
  'Referer': 'https://transparencia.serradasaudade.mg.gov.br/'
});
export const MAX_PAGINAS = 150;
const TZ = 'America/Sao_Paulo';

export const isoDataValida = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === value;
};
function dataLocalBR(agora) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone:TZ, year:'numeric', month:'2-digit', day:'2-digit'
  }).formatToParts(agora);
  const obj=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return `${obj.year}-${obj.month}-${obj.day}`;
}
function subtrairMesesISO(data,meses){
  const [y,m,d]=data.split('-').map(Number);
  const primeiro=new Date(Date.UTC(y,m-1-meses,1));
  const yy=primeiro.getUTCFullYear(),mm=primeiro.getUTCMonth()+1;
  const ultimo=new Date(Date.UTC(yy,mm,0)).getUTCDate();
  return `${yy}-${String(mm).padStart(2,'0')}-${String(Math.min(d,ultimo)).padStart(2,'0')}`;
}
/** Seis meses móveis até hoje (inclusive), usando o calendário de Brasília. */
export function obterPeriodoMovel(agora=new Date()){
  const fim=dataLocalBR(agora);
  return {inicio:subtrairMesesISO(fim,6),fim};
}
export function montarConsulta({inicio,fim,pagina=1}) {
  if (!isoDataValida(inicio)||!isoDataValida(fim)||inicio>fim) throw new RangeError('Período inválido.');
  if(!Number.isSafeInteger(pagina)||pagina<1||pagina>MAX_PAGINAS)throw new RangeError('Página inválida.');
  const url=new URL(FONTE);
  for(const [k,v] of Object.entries({elementosPorPagina:ITENS_POR_PAGINA,pagina,termoBase64:'',datInicio:inicio,datFim:fim}))url.searchParams.set(k,String(v));
  return url;
}
function falha(msg,codigo='FONTE_INVALIDA'){
  const e=new Error(msg);e.status=502;e.codigo=codigo;return e;
}
/** A resposta real é uma página Spring Data: {content, totalPages, totalElements, number, last}. */
export function interpretarPagina(body,numeroSolicitado){
  if(!body||typeof body!=='object'||Array.isArray(body)||!Array.isArray(body.content))throw falha('Resposta do portal fora do formato esperado.','ESQUEMA_INVALIDO');
  const {content,totalPages,totalElements,number,last}=body;
  if(!Number.isSafeInteger(totalPages)||totalPages<0||
     !Number.isSafeInteger(totalElements)||totalElements<0||
     !Number.isSafeInteger(number)||number!==numeroSolicitado-1||
     typeof last!=='boolean'||
     !content.every(v=>v&&typeof v==='object'&&!Array.isArray(v)))
    throw falha('Metadados de paginação inconsistentes.','PAGINACAO_INVALIDA');
  if(totalPages>MAX_PAGINAS)throw falha('A consulta ultrapassa o limite seguro de páginas; necessário ajustar a estratégia de coleta.','LIMITE_PAGINAS');
  if(totalElements>0&&totalPages===0)throw falha('Total incompatível com a paginação.','PAGINACAO_INVALIDA');
  if(totalPages>0&&numeroSolicitado>totalPages)throw falha('O portal retornou página fora do intervalo.','PAGINACAO_INVALIDA');
  if(last!==(numeroSolicitado>=totalPages))throw falha('Indicador de última página inconsistente.','PAGINACAO_INVALIDA');
  return {content,totalPages,totalElements};
}
export function higienizarRegistro(r){
  // Lista permissiva: descarta numDocumentoCredor e outros dados pessoais por padrão.
  if(!r||typeof r!=='object')return null;
  if(typeof r.datMovimento!=='string'||!isoDataValida(r.datMovimento))throw falha('Registro sem data válida.','REGISTRO_INVALIDO');
  if(typeof r.vlrDespesa!=='number'||!Number.isFinite(r.vlrDespesa))throw falha('Registro sem valor numérico.','REGISTRO_INVALIDO');
  return {
    codDespesaExtra:Number.isSafeInteger(r.codDespesaExtra)?r.codDespesaExtra:null,
    datMovimento:r.datMovimento,
    desClassificacao:String(r.desClassificacao??'').slice(0,45),
    desConta:String(r.desConta??'').slice(0,220),
    nomCredor:String(r.nomCredor??'').slice(0,220),
    vlrDespesa:r.vlrDespesa
  };
}
export async function consultarPagina({inicio,fim,pagina=1,fetchImpl=fetch}){
  const url=montarConsulta({inicio,fim,pagina});
  let response;
  try {response=await fetchImpl(url,{method:'GET',headers:CABECALHOS_XHR,signal:AbortSignal.timeout(15000),redirect:'error'});}
  catch{throw falha('Não foi possível acessar a fonte pública.','FONTE_INACESSIVEL');}
  if(!response.ok){
    // O código 404 veio do portal consultado, não do frontend do Despesa360.
    const mensagem=response.status===404
      ? 'O portal de origem respondeu HTTP 404 à consulta automática. Execute npm run diagnosticar para comparar a requisição do navegador e a do servidor.'
      : `O portal de origem respondeu HTTP ${response.status}. Execute npm run diagnosticar se a falha persistir.`;
    throw falha(mensagem,'FONTE_HTTP');
  }
  const cl=Number(response.headers?.get?.('content-length')??0);
  if(cl>4_000_000)throw falha('Resposta excedeu o limite permitido.','RESPOSTA_EXTENSA');
  let str;
  try{str=await response.text();}catch{throw falha('Não foi possível ler a resposta do portal.','LEITURA_FALHOU');}
  if(str.length>4_000_000)throw falha('Resposta excedeu o limite permitido.','RESPOSTA_EXTENSA');
  let body;
  try{body=JSON.parse(str);}catch{throw falha('A fonte não retornou JSON válido.','FONTE_NAO_JSON');}
  return interpretarPagina(body,pagina);
}
export async function consultarSeisMeses({agora=new Date(),fetchImpl=fetch}={}){
  const periodo=obterPeriodoMovel(agora);
  const all=[];
  let totalPages=null,totalElements=null;
  for(let pagina=1;;pagina++){
    if(pagina>MAX_PAGINAS)throw falha('Limite de páginas atingido.','LIMITE_PAGINAS');
    const resposta=await consultarPagina({...periodo,pagina,fetchImpl});
    if(totalPages===null){totalPages=resposta.totalPages;totalElements=resposta.totalElements;}
    if(resposta.totalPages!==totalPages||resposta.totalElements!==totalElements)
      throw falha('Os totais mudaram durante a coleta. Faça uma nova tentativa para evitar duplicidade.','FONTE_ALTERADA');
    for(const r of resposta.content){
      const item=higienizarRegistro(r);
      if(item.datMovimento>=periodo.inicio&&item.datMovimento<=periodo.fim)all.push(item);
    }
    if(pagina>=totalPages)break;
  }
  // A verificação evita apresentar como completo um conjunto truncado por alteração da origem.
  if(all.length!==totalElements)throw falha('O portal devolveu quantidade diferente do total anunciado, ou registros fora do período.','CONTAGEM_INCONSISTENTE');
  const ids=new Set(all.filter(x=>x.codDespesaExtra!==null).map(x=>x.codDespesaExtra));
  if(ids.size!==all.filter(x=>x.codDespesaExtra!==null).length)throw falha('O portal retornou registros repetidos entre páginas.','PAGINAS_REPETIDAS');
  const centavos=all.reduce((s,r)=>s+Math.round(r.vlrDespesa*100),0);
  return {
    dados:all,
    resumo:{quantidade:all.length,totalMovimentado:centavos/100,
      credores:new Set(all.map(x=>x.nomCredor).filter(Boolean)).size,
      contas:new Set(all.map(x=>x.desConta).filter(Boolean)).size},
    metadados:{periodo,paginas:totalPages,totalElementos:totalElements,
      completo:true,natureza:'EXTRAORCAMENTARIA',
      fonte:'Portal da Transparência — Prefeitura de Serra da Saudade/MG',
      consultadoEm:new Date().toISOString(),
      observacao:'Os valores são movimentações extraorçamentárias; não representam o total das despesas orçamentárias municipais.'}
  };
}
