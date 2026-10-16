import test from 'node:test';import assert from 'node:assert/strict';
import {montarConsultaReceita,normalizarReceita,interpretarReceita,consultarSeisMesesReceita} from '../integracoes/receita-orcamentaria.mjs';
const period={inicio:'2026-04-16',fim:'2026-10-16'};
const row=t=>({desFonteReceita:t,desReceita:'IPTU',desClassificacaoReceita:'1112500100',desFonteRecurso:'Recursos',vlrReceita:1000,vlrArrecadado:400});
const page=content=>({content,totalPages:1,totalElements:content.length,number:0,last:true,size:content.length,numberOfElements:content.length});
test('URL correta',()=>{const u=montarConsultaReceita(period);assert.equal(u.pathname,'/publico/receita');assert.equal(u.searchParams.get('datInicio'),'2026-04-16');assert.equal(u.searchParams.get('codAdministracao'),'2')});
test('não soma níveis sobrepostos',()=>{const d=interpretarReceita(page([row('RECEITA'),row('DETALHE')]),period);assert.equal(d.dados.length,2);assert.ok(!('totalArrecadado' in d))});
test('não aceita página incompleta',()=>assert.throws(()=>interpretarReceita({...page([row('DETALHE')]),totalPages:2,last:false,totalElements:10},period)));
test('calcula últimos seis meses',async()=>{let url;const mock=async u=>{url=new URL(u);return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(page([row('DETALHE')]))}};await consultarSeisMesesReceita({agora:new Date('2026-10-16T15:00:00Z'),fetchImpl:mock});assert.equal(url.searchParams.get('datInicio'),'2026-04-16')});
