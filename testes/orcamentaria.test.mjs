import test from 'node:test';
import assert from 'node:assert/strict';
import {
  montarConsultaOrc,interpretarPaginaOrc,normalizarOrc,consultarSeisMesesOrc
} from '../integracoes/despesa-orcamentaria.mjs';

const intervalo={inicio:'2026-04-16',fim:'2026-10-16'};
test('utiliza endpoint e parâmetros reais da despesa detalhada',()=>{
  const url=montarConsultaOrc({...intervalo,pagina:3});
  assert.equal(url.pathname,'/publico/despesaDetalhada');
  assert.equal(url.searchParams.get('datInicio'),'2026-04-16');
  assert.equal(url.searchParams.get('datFim'),'2026-10-16');
  assert.equal(url.searchParams.get('indAgrupamento'),'FOR');
  assert.equal(url.searchParams.get('codAdministracao'),'2');
  assert.equal(url.searchParams.get('filtrarApenasCovid'),'false');
  assert.equal(url.searchParams.get('pagina'),'3');
  assert.equal(url.searchParams.get('elementosPorPagina'),'100');
});
test('interpreta amostra paginada com mais de 150 páginas',()=>{
  const page=interpretarPaginaOrc({content:[{numEmpenho:'0001'}],totalPages:324,totalElements:6468,size:20,number:0,last:false},1);
  assert.equal(page.totalPages,324);
});
test('fornecedor sem CPF e dados nulos sem data fictícia',()=>{
  const r=normalizarOrc({
    numEmpenho:'006749',numAnoEmpenho:2026,datMovimento:null,
    nomFornecedor:null,desAgrupamento:'***.059.466-** - NOME DE EXEMPLO',
    desDocumentoFornecedor:'09705946663',desMovimento:'Empenho',vlrMovimento:'1.240,55',
    vlrEmpenhado:1240.55,vlrLiquidado:1240.55,vlrPago:0
  });
  assert.equal(r.fornecedor,'NOME DE EXEMPLO');
  assert.equal(r.data,null);
  assert.equal(r.valor,1240.55);
  assert.equal('desDocumentoFornecedor' in r,false);
  assert.equal('vlrLiquidado' in r,false);
  assert.equal(normalizarOrc({desAgrupamento:'00.000.000/0001-00 - EXEMPLO 12345678901',desMovimento:'Empenho',vlrMovimento:'10,00'}).fornecedor,'EXEMPLO');
});
test('soma movimento classificado sem duplicar valores acumulados',async()=>{
  const seen=[];
  const build=(page)=>{
    const row=page===1?{desMovimento:'Empenho',vlrMovimento:'700,00'}:
      {desMovimento:'Pagamento',vlrMovimento:'200,00'};
    return {content:[{...row,datMovimento:null,numEmpenho:String(page),
      numAnoEmpenho:2026,desAgrupamento:'00.000.000/0001-00 - TESTE',
      vlrEmpenhado:700,vlrLiquidado:700,vlrPago:200}],
      totalPages:2,totalElements:2,number:page-1,last:page===2,size:1};
  };
  const fake=async url=>{
    const page=Number(url.searchParams.get('pagina'));seen.push(page);
    return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(build(page))};
  };
  const res=await consultarSeisMesesOrc({agora:new Date('2026-10-16T15:00:00Z'),fetchImpl:fake});
  assert.deepEqual(seen,[1,2]);
  assert.equal(res.metadados.completo,true);
  assert.equal(res.metadados.semData,2);
  assert.equal(res.resumo.Empenho.valor,700);
  assert.equal(res.resumo.Pagamento.valor,200);
  assert.equal(res.resumo['Liquidação'].valor,0);
  assert.equal(res.metadados.periodo.inicio,'2026-04-16');
});
test('não publica conjunto incompleto quando alguma página falha',async()=>{
 const fetchImpl=async url=>{
   const page=Number(url.searchParams.get('pagina'));
   if(page===2)throw new Error('Falha de rede');
   return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({
     content:[{numEmpenho:'1',numAnoEmpenho:2026,desMovimento:'Empenho',vlrMovimento:'1,00'}],
     totalPages:2,totalElements:2,size:1,number:0,last:false
   })};
 };
 await assert.rejects(()=>consultarSeisMesesOrc({fetchImpl}));
});
