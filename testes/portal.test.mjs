import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';

process.env.NODE_ENV='test';
process.env.BASE_PATH='';
const {server}=await import('../index.js');
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const base=`http://127.0.0.1:${port}`;
test.after(()=>new Promise(resolve=>server.close(resolve)));

test('responde indicador de funcionamento',async()=>{
 const r=await fetch(base+'/api/health');const d=await r.json();
 assert.equal(r.status,200);assert.equal(d.status,'online');assert.equal(d.version,'1.3.0');
 assert.match(d.sistema,/Pref\.Mun\.de Serra da Saudade MG/);
 assert.equal(r.headers.get('x-content-type-options'),'nosniff');
});
test('bloqueia filtro externo e mantém a janela móvel',async()=>{
 const r=await fetch(base+'/api/despesas/extraorcamentarias?datInicio=2010-01-01');
 assert.equal(r.status,400);
 const d=await (await fetch(base+'/api/periodo')).json();
 assert.match(d.periodo.inicio,/^\d{4}-\d\d-\d\d$/);
 assert.equal(d.regra,'seis_meses_moveis');
});
test('permite links diretos dos módulos e devolve HTML',async()=>{
 const r=await fetch(base+'/licitacoes');
 const text=await r.text();
 assert.equal(r.status,200);assert.match(text,/Portal da Transparência/);
 assert.match(text,/assets\/app\.js\?v=1\.3\.0/);
 assert.doesNotMatch(text,/transparencia\.serradasaudade\.mg\.gov\.br/);
});
test('entrega CSS com cabeçalhos restritivos',async()=>{
 const r=await fetch(base+'/assets/styles.css');
 assert.equal(r.status,200);
 assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'none'/);
 assert.match(r.headers.get('content-type'),/text\/css/);
});
test('não entrega arquivos sensíveis',async()=>{
 const r=await fetch(base+'/.env');
 assert.notEqual(r.status,200);
 const f=await fetch(base+'/api/desconhecida');
 assert.equal(f.status,404);
});

test('protege as datas do novo módulo e inicia coleta em segundo plano',async()=>{
  const invalid=await fetch(base+'/api/despesas/orcamentarias?datInicio=2024-01-01');
  assert.equal(invalid.status,400);
  const invalidBody=await invalid.json();
  assert.match(invalidBody.erro,/automático/);
  const webpage=await fetch(base+'/despesas/orcamentarias');
  assert.equal(webpage.status,200);
  const html=await webpage.text();
  assert.match(html,/Portal da Transparência/);
});

test('evita carregar JavaScript antigo após atualização',async()=>{
  const page=await (await fetch(base+'/despesas/orcamentarias')).text();
  assert.match(page,/assets\/app\.js\?v=1\.3\.0/);
  assert.match(page,/assets\/styles\.css\?v=1\.3\.0/);
  const js=await fetch(base+'/assets/app.js?v=1.3.0');
  assert.equal(js.status,200);
  assert.equal(js.headers.get('cache-control'),'no-store');
  const code=await js.text();
  assert.match(code,/if\(route==='\/despesas\/orcamentarias'\)/);
  assert.match(code,/loadOrc\(\)/);
  const css=await fetch(base+'/assets/styles.css?v=1.3.0');
  assert.equal(css.headers.get('cache-control'),'no-store');
});

test('listagem de fornecedores substitui rankings financeiros',async()=>{
 const js=await (await fetch(base+'/assets/app.js?v=1.3.0')).text();
 assert.match(js,/Fornecedores e movimentações/);
 assert.match(js,/data-label="Fornecedor"/);
 assert.doesNotMatch(js,/expense-ranking-area|orc-ranking-area|Principais credores por valor|Fornecedores por movimentos de empenho/);
});
test('tabelas financeiras adaptam as colunas para cartão no celular',async()=>{
 const css=await (await fetch(base+'/assets/styles.css?v=1.3.0')).text();
 assert.match(css,/\.supplier-list \.responsive-table thead\{display:none\}/);
 assert.match(css,/content:attr\(data-label\)/);
 assert.match(css,/\.data-toolbar\{display:grid/);
});
