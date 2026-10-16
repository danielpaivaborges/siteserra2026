import { obterPeriodoMovel, isoDataValida, CABECALHOS_XHR } from './despesa-extra.mjs';
export const ENDPOINT_RECEITA='https://transparencia.serradasaudade.mg.gov.br/publico/receita';
const TIPOS=new Set(['RECEITA','SUBRECEITA','DESRUBRICARECEITA','DESFONTERECEITA','DETALHE']);
function falha(msg,code='FONTE_INVALIDA'){const e=new Error(msg);e.status=502;e.codigo=code;return e}
export function montarConsultaReceita({inicio,fim}){
 if(!isoDataValida(inicio)||!isoDataValida(fim)||inicio>fim)throw new RangeError('Datas inválidas');
 const url=new URL(ENDPOINT_RECEITA);
 for(const [k,v] of Object.entries({a:'1',datInicio:inicio,datFim:fim,codAdministracao:'2',filtrarApenasCovid:'false'}))url.searchParams.set(k,v);
 return url;
}
function numero(v){
 if(v===null||v===undefined)return null;
 if(typeof v==='number'&&Number.isFinite(v))return v;
 if(typeof v==='string'&&/^-?\d+(?:\.\d+)?$/.test(v.trim()))return Number(v);
 throw falha('Valor inválido','VALOR_INVALIDO');
}
const txt=(v,n=420)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n);
export function normalizarReceita(r){
 if(!r||typeof r!=='object'||Array.isArray(r))throw falha('Registro inválido');
 const nivel=txt(r.desFonteReceita,40);
 if(!TIPOS.has(nivel))throw falha('Classificação não reconhecida');
 return {codigo:txt(r.desClassificacaoReceita,32),receita:txt(r.desReceita||r.titulo,300),nivel,
 fonte:txt(r.desFonteRecurso),previsao:numero(r.vlrReceita),arrecadado:numero(r.vlrArrecadado)};
}
export function interpretarReceita(obj,periodo){
 if(!obj||!Array.isArray(obj.content))throw falha('Estrutura de dados inesperada');
 const {content,totalPages,totalElements,number,last,size,numberOfElements}=obj;
 if(!Number.isSafeInteger(totalPages)||totalPages!==1||!Number.isSafeInteger(totalElements)||totalElements<0||
 totalElements>10000||number!==0||last!==true||!Number.isSafeInteger(size)||size<0||
 (numberOfElements!==undefined&&numberOfElements!==content.length)||totalElements!==content.length)
 throw falha('Consulta não retornou todas as linhas; paginação ainda não validada','PAGINACAO_INCOMPLETA');
 return {dados:content.map(normalizarReceita),metadados:{periodo,registros:totalElements,completo:true,
 consultadoEm:new Date().toISOString(),natureza:'RECEITA_ORCAMENTARIA',
 aviso:'Classificações são hierárquicas e não aditivas. A previsão informada pode ser anual.'}};
}
export async function consultarSeisMesesReceita({agora=new Date(),fetchImpl=fetch}={}){
 const periodo=obterPeriodoMovel(agora);
 let r;try{r=await fetchImpl(montarConsultaReceita(periodo),{method:'GET',headers:CABECALHOS_XHR,
 redirect:'error',signal:AbortSignal.timeout(25000)})}
 catch{throw falha('Falha na conexão','FONTE_INACESSIVEL')}
 if(!r.ok)throw falha('Resposta HTTP '+r.status,'FONTE_HTTP');
 if(Number(r.headers?.get?.('content-length')||0)>10000000)throw falha('Resposta muito extensa');
 let raw;try{raw=await r.text()}catch{throw falha('Falha na leitura')}
 if(raw.length>10000000)throw falha('Resposta muito extensa');
 let obj;try{obj=JSON.parse(raw)}catch{throw falha('JSON inválido')}
 return interpretarReceita(obj,periodo);
}
