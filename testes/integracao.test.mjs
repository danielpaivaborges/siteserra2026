import test from 'node:test';
import assert from 'node:assert/strict';
import {montarConsulta,obterPeriodoMovel,higienizarRegistro,consultarSeisMeses} from '../integracoes/despesa-extra.mjs';

test('rota real é singular e parâmetros preservados',()=>{
 const url=montarConsulta({inicio:'2026-04-16',fim:'2026-10-16',pagina:1});
 assert.equal(url.pathname,'/publico/despesaExtra');
 assert.equal(url.searchParams.get('datInicio'),'2026-04-16');
 assert.equal(url.searchParams.get('pagina'),'1');
});
test('seis meses móveis de Brasília',()=>{
 const period=obterPeriodoMovel(new Date('2026-10-16T15:00:00Z'));
 assert.deepEqual(period,{inicio:'2026-04-16',fim:'2026-10-16'});
});
test('oculta identificação pessoal na resposta pública',()=>{
 const output=higienizarRegistro({codDespesaExtra:1,datMovimento:'2026-09-30',desConta:'IMPAS',nomCredor:'TESTE',vlrDespesa:250.99,numDocumentoCredor:'123.456.789-00'});
 assert.equal('numDocumentoCredor' in output,false);
 assert.equal(output.vlrDespesa,250.99);
});
test('concatena todas as páginas e calcula total somente ao final',async()=>{
 const calls=[];
 const fake=async url=>{
  const page=Number(url.searchParams.get('pagina'));calls.push(page);
  return {
   ok:true,headers:{get:()=>null},
   text:async()=>JSON.stringify({content:[{codDespesaExtra:page,datMovimento:'2026-10-01',nomCredor:'CREDOR',desConta:'CONTA',desClassificacao:'2188',vlrDespesa:page*10}],totalPages:2,totalElements:2,number:page-1,last:page===2})
  };
 };
 const result=await consultarSeisMeses({agora:new Date('2026-10-16T16:00:00Z'),fetchImpl:fake});
 assert.deepEqual(calls,[1,2]);assert.equal(result.resumo.totalMovimentado,30);
 assert.equal(result.dados.length,2);assert.equal(result.metadados.completo,true);
});
test('falha ao invés de publicar totais parciais',async()=>{
 const fake=async url=>{
   const page=Number(url.searchParams.get('pagina'));
   if(page===2)throw new Error('erro simulado');
   return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({content:[{codDespesaExtra:1,datMovimento:'2026-09-01',nomCredor:'A',desConta:'B',vlrDespesa:1}],totalPages:2,totalElements:2,number:0,last:false})};
 };
 await assert.rejects(()=>consultarSeisMeses({agora:new Date('2026-10-16T15:00:00Z'),fetchImpl:fake}));
});
