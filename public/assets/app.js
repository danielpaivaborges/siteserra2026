
const BASE=document.querySelector('meta[name="app-base-path"]')?.content||'';
const PORTAL='Portal da Transparência - Pref.Mun.de Serra da Saudade MG';
const ROOT=document.getElementById('conteudo');
const routes=[
  {path:'/',label:'Visão geral',icon:'layout-dashboard',section:'Início',description:'Panorama e acesso aos dados públicos da administração municipal.'},
  {path:'/receitas',label:'Receitas públicas',icon:'trending-up',section:'Finanças',description:'Arrecadação, origem dos recursos, evolução mensal e detalhamento.'},
  {path:'/despesas/orcamentarias',label:'Despesas orçamentárias',icon:'wallet',section:'Finanças',description:'Despesas empenhadas, liquidadas e pagas por período, credor e classificação.'},
  {path:'/despesas/extraorcamentarias',label:'Despesas extraorçamentárias',icon:'receipt-text',section:'Finanças',description:'Movimentações extraorçamentárias detalhadas dos últimos seis meses.',ready:true},
  {path:'/demonstrativos',label:'Demonstrativos fiscais',icon:'chart-no-axes-combined',section:'Finanças',description:'RREO, RGF, balanços e relatórios de execução fiscal.'},
  {path:'/licitacoes',label:'Licitações e editais',icon:'gavel',section:'Contratações',description:'Procedimentos licitatórios e respectivos arquivos publicados no PNCP.'},
  {path:'/contratos',label:'Contratos',icon:'file-check',section:'Contratações',description:'Contratos administrativos, vigência, objeto, valores e anexos.'},
  {path:'/atas',label:'Atas de registro de preços',icon:'clipboard-list',section:'Contratações',description:'Atas, fornecedores registrados, objetos e documentos associados.'},
  {path:'/pessoal',label:'Recursos humanos',icon:'users',section:'Informações',description:'Quadro de pessoal, remuneração e dados funcionais de interesse público.'},
  {path:'/legislacao',label:'Legislação municipal',icon:'scale',section:'Informações',description:'Leis, atos e normas municipais, organizados por assunto e exercício.'},
  {path:'/documentos',label:'Documentos públicos',icon:'folder-open',section:'Informações',description:'Biblioteca de relatórios, anexos e documentos públicos.'},
  {path:'/acesso-informacao',label:'Acesso à informação',icon:'message-circle-question',section:'Atendimento',description:'Orientações sobre pedidos de acesso à informação e canais oficiais.'}
];
const iconPaths={
'layout-dashboard':'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
'trending-up':'<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
'wallet':'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18"/><path d="M16 15h2"/>',
'receipt-text':'<path d="M4 3h16v18l-4-2-4 2-4-2-4 2V3Z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
'chart-no-axes-combined':'<path d="M3 3v18h18"/><path d="m7 15 4-4 4 2 5-7"/><path d="M20 6h-5v5"/>',
'gavel':'<path d="m14 5 5 5M11 8l5 5M10 7l5-5 4 4-5 5M4 13l4 4 5-5-4-4zM2 22h16"/>',
'file-check':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6m-12 7 3 3 5-5"/>',
'clipboard-list':'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M9 10h6m-6 4h6m-6 4h4"/>',
'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
'scale':'<path d="M12 3v18M5 7h14M3 7l-2 6h6L5 7Zm16 0-2 6h6l-4-6ZM7 21h10"/>',
'folder-open':'<path d="M3 7V5a2 2 0 0 1 2-2h6l2 3h6a2 2 0 0 1 2 2v3"/><path d="M3 11h19l-3 10H2l1-10Z"/>',
'message-circle-question':'<path d="M12 22a10 10 0 1 0-8-4L2 22l5-2"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01"/>',
'search':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
'menu':'<path d="M4 7h16M4 12h16M4 17h16"/>',
'x':'<path d="M18 6 6 18M6 6l12 12"/>',
'shield-check':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
'circle-help':'<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01"/>',
'arrow-right':'<path d="M5 12h14m-6-6 6 6-6 6"/>',
'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
'calendar-days':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
'file-bar-chart':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 17v-3m4 3v-5m4 5v-7"/>',
'activity':'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
'refresh-cw':'<path d="M20 7a8 8 0 0 0-13-2L4 8m0-5v5h5M4 17a8 8 0 0 0 13 2l3-3m0 5v-5h-5"/>',
'download':'<path d="M12 3v12m-5-5 5 5 5-5M5 17v3h14v-3"/>',
'info':'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
'alert-circle':'<circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>',
'check-circle':'<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
'files':'<path d="M6 4h12v15H6zM3 7v14h12"/>',
'filter':'<path d="M3 4h18l-7 8v7l-4 2v-9z"/>',
'chevron-right':'<path d="m9 18 6-6-6-6"/>'
};
function icon(name,cls=''){return `<svg class="${cls}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.info}</svg>`}
function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function urlFor(path){return (BASE||'')+path}
function actualPath(){let p=decodeURI(location.pathname);if(BASE&&p.startsWith(BASE))p=p.slice(BASE.length)||'/';return p==='/'?p:p.replace(/\/+$/,'')}
function money(value){return Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function fmtDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return '—';const [y,m,d]=value.split('-');return `${d}/${m}/${y}`}
function navA(path,text,cls='',extra=''){return `<a data-link href="${esc(urlFor(path))}" class="${cls}" ${extra}>${text}</a>`}
function injectIcons(scope=document){scope.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon)})}
function heading(eyebrow,title,description,action=''){return `<div class="page-heading"><div class="eyebrow"><span class="eyebrow-line"></span>${esc(eyebrow)}</div><div class="page-heading-row"><div><h1 class="headline">${esc(title)}</h1><p class="lede">${esc(description)}</p></div>${action}</div></div>`}
function sectionHead(title,right=''){return `<div class="section-head"><h2>${title}</h2>${right}</div>`}
function moduleCard(entry){
  return navA(entry.path,`<div class="module-icon">${icon(entry.icon)}</div><div><h3>${esc(entry.label)}</h3><p>${esc(entry.description)}</p></div><div class="module-footer"><span class="chip ${entry.ready?'green':'soft'}">${entry.ready?'Consulta integrada':'Em implantação'}</span><span class="module-arrow">${icon('arrow-up-right')}</span></div>`,'module-card');
}
function dashboard(){
 return `${heading('Governo aberto · Informação pública','Transparência para todos.','Acompanhe as informações da administração municipal, explore os relatórios públicos e encontre o que você precisa em poucos cliques.')}
 <section class="hero" aria-label="Conheça o novo portal">
   <div class="hero-content"><span class="hero-kicker"><span class="pulse"></span> PORTAL INSTITUCIONAL · 2026</span>
   <h2>Dados públicos.<br><em>Acesso descomplicado.</em></h2>
   <p>Um novo jeito de acompanhar receitas, despesas, compras públicas e informações municipais — com organização, clareza e responsabilidade.</p>
   <div class="hero-actions">${navA('/despesas/extraorcamentarias',`${icon('arrow-up-right')} Explorar dados financeiros`,'primary-button')}
   ${navA('/licitacoes',`${icon('file-check')} Licitações e contratos`,'secondary-button')}</div></div>
   <div class="hero-watermark" aria-hidden="true"><svg viewBox="0 0 150 160" fill="none" stroke="#C7FFF1" stroke-width="1.5"><path d="m75 8 60 30v80l-60 30-60-30V38L75 8Z"/><path d="m25 113 50 25 50-25V44L75 20 25 44v69Z"/><path d="m40 115V61L75 41l35 20v54M58 124V72h34v52M75 72v52"/></svg></div>
 </section>
 ${sectionHead('O que você encontra aqui','<span class="section-note">A estrutura dos módulos será aprimorada continuamente</span>')}
 <div class="stat-grid">
   <div class="stat-card"><div class="stat-top"><span>Período dos painéis financeiros</span><span class="icon-square">${icon('calendar-days')}</span></div><div class="stat-value small">6 meses</div><div class="stat-sub">Janela móvel, atualizada automaticamente</div></div>
   <div class="stat-card"><div class="stat-top"><span>Consultas financeiras</span><span class="icon-square blue">${icon('activity')}</span></div><div class="stat-value small">Extraorçamentárias</div><div class="stat-sub"><strong>Conector implementado</strong> · dados reais sob consulta</div></div>
   <div class="stat-card"><div class="stat-top"><span>Navegação</span><span class="icon-square gold">${icon('layout-dashboard')}</span></div><div class="stat-value small">${routes.length} áreas</div><div class="stat-sub">Estrutura modular em construção</div></div>
 </div>
 ${sectionHead('Acesse por assunto',navA('/despesas/extraorcamentarias',`Ver consulta disponível ${icon('arrow-right')}`))}
 <div class="module-grid">${[routes[1],routes[2],routes[3],routes[5],routes[6],routes[9]].map(moduleCard).join('')}</div>
 <div class="notice-banner">${icon('info')}<div><strong>Estamos construindo o novo portal, módulo por módulo.</strong><p>Os espaços assinalados como “Em implantação” ainda não exibem dados. Nenhum valor demonstrativo será apresentado como informação oficial.</p></div></div>`;
}
function placeholder(entry){
 const isPNCP=['/licitacoes','/contratos','/atas'].includes(entry.path);
 const isFinance=['/receitas','/despesas/orcamentarias'].includes(entry.path);
 const expl=isPNCP?'Essa área será alimentada por dados públicos do Portal Nacional de Contratações Públicas (PNCP), incluindo detalhes e arquivos efetivamente disponíveis.':isFinance?'Esta área terá consulta automática dos últimos seis meses, com totais calculados apenas após recuperar todos os registros.':'O conteúdo será organizado, pesquisável e acessível, com preservação dos documentos e informações exigidos.';
 return `${heading(entry.section,entry.label,entry.description)}
 <div class="status-empty"><div class="empty-icon">${icon(entry.icon)}</div>
 <div><span class="chip blue">PRÓXIMA ETAPA</span><h2>Uma nova experiência está a caminho.</h2><p>${esc(expl)} A navegação já está pronta; a fonte de dados deste módulo ainda não foi integrada.</p>
 ${navA('/',`${icon('arrow-right')} Voltar à visão geral`,'small-action')}</div></div>
 ${sectionHead('Como esta área será organizada')}
 <div class="small-info"><div class="info-item">${icon('search')}<h3>Busca e filtros</h3><p>Localize registros com poucos passos.</p></div><div class="info-item">${icon('file-bar-chart')}<h3>Informação compreensível</h3><p>Detalhes e indicadores com contexto.</p></div><div class="info-item">${icon('download')}<h3>Documentos e exportação</h3><p>Acesso aos arquivos que forem publicados.</p></div></div>`;
}
const expenseState={data:null,loading:false,error:null,search:'',sort:'date-desc',page:1};
const pageSize=15;
function expenseShell(){
 const data=expenseState.data;
 const period=data?.metadados?.periodo;
 let stats=data ? `<div class="stat-grid">
 <div class="stat-card"><div class="stat-top"><span>Total movimentado no período</span><span class="icon-square">${icon('wallet')}</span></div><div class="stat-value">${money(data.resumo.totalMovimentado)}</div><div class="stat-sub">Despesas extraorçamentárias · conjunto completo</div></div>
 <div class="stat-card"><div class="stat-top"><span>Movimentações registradas</span><span class="icon-square blue">${icon('receipt-text')}</span></div><div class="stat-value">${Number(data.resumo.quantidade).toLocaleString('pt-BR')}</div><div class="stat-sub">Registros obtidos em todas as páginas</div></div>
 <div class="stat-card"><div class="stat-top"><span>Credores / Contas</span><span class="icon-square gold">${icon('users')}</span></div><div class="stat-value">${Number(data.resumo.credores)} <span class="quiet-em">/</span> ${Number(data.resumo.contas)}</div><div class="stat-sub">Identificações distintas no intervalo</div></div></div>`
 : `<div class="stat-grid">${['Total movimentado','Movimentações registradas','Credores / Contas'].map((name,i)=>`<div class="stat-card"><div class="stat-top"><span>${name}</span><span class="icon-square ${i===1?'blue':i===2?'gold':''}">${icon(i===0?'wallet':i===1?'receipt-text':'users')}</span></div><div class="stat-value">—</div><div class="stat-sub">Aguardando consulta completa</div></div>`).join('')}</div>`;
 return `${heading('Finanças públicas · Movimentações','Despesas extraorçamentárias','Consulta automática dos últimos seis meses, com consolidação de todas as páginas de registros.',`<button id="refresh-expenses" type="button" class="small-action">${icon('refresh-cw')} Atualizar consulta</button>`)}
 <div class="meta-tags" class="meta-margin"><span class="tag">${icon('calendar-days')} ${period?fmtDate(period.inicio)+' até '+fmtDate(period.fim):'Período móvel · seis meses'}</span><span class="tag">${icon('shield-check')} Dados consultados pelo servidor municipal</span>${data?`<span class="tag">${icon('check-circle')} Coleta completa · ${Number(data.metadados.paginas)} páginas</span>`:''}</div>
 ${stats}
 ${sectionHead('Detalhamento das movimentações',`<span class="section-note">Atualização sob demanda · cache temporário</span>`)}
 ${expenseState.loading?`<div class="panel loading-block" role="status"><div class="spinner"></div>Consultando e validando todos os registros do período...</div>`:''}
 ${expenseState.error?`<div class="error-panel" role="alert">${icon('alert-circle')}<div><strong>Não foi possível carregar a consulta.</strong>${esc(expenseState.error)} Os totais não serão apresentados até a coleta estar completa.</div></div>`:''}
 ${data?`<div class="data-toolbar"><div class="input-with-icon">${icon('search')}<input class="text-input" id="expense-search" placeholder="Buscar credor, conta ou classificação..." value="${esc(expenseState.search)}" aria-label="Buscar movimentações"></div>
 <select class="select-input" id="expense-sort" aria-label="Ordenação"><option value="date-desc" ${expenseState.sort==='date-desc'?'selected':''}>Mais recentes</option><option value="date-asc" ${expenseState.sort==='date-asc'?'selected':''}>Mais antigas</option><option value="value-desc" ${expenseState.sort==='value-desc'?'selected':''}>Maior valor</option><option value="value-asc" ${expenseState.sort==='value-asc'?'selected':''}>Menor valor</option></select>
 <button id="expense-export" class="toolbar-button" type="button">${icon('download')} Exportar CSV</button></div>
 <div class="data-layout"><section class="panel"><div class="overview-title"><h2>Registros do período</h2><span class="chip green">${data.dados.length.toLocaleString('pt-BR')} registros obtidos</span></div><div id="expense-table-area"></div></section>
 <section class="panel"><h2>Principais credores por valor</h2><p class="lede" class="detail-note">Ranking a partir do conjunto completo da consulta.</p><div id="expense-ranking-area"></div></section></div>`:''}
 <div class="notice-banner">${icon('info')}<div><strong>Como interpretar estes valores?</strong><p>Este módulo apresenta movimentações extraorçamentárias, como consignações e repasses, e não representa a despesa orçamentária total da Prefeitura. O período móvel é definido no servidor e não pode ser ampliado por filtros.</p></div></div>`;
}
function filteredExpenses(){
 if(!expenseState.data)return [];
 const term=expenseState.search.toLocaleLowerCase('pt-BR').trim();
 return expenseState.data.dados.filter(row=>!term||[row.nomCredor,row.desConta,row.desClassificacao,fmtDate(row.datMovimento)].some(v=>String(v??'').toLocaleLowerCase('pt-BR').includes(term)))
 .sort((a,b)=>expenseState.sort==='date-desc'?b.datMovimento.localeCompare(a.datMovimento):expenseState.sort==='date-asc'?a.datMovimento.localeCompare(b.datMovimento):expenseState.sort==='value-desc'?b.vlrDespesa-a.vlrDespesa:a.vlrDespesa-b.vlrDespesa);
}
function renderExpenseResults(){
 if(!expenseState.data)return;
 const rows=filteredExpenses(), pages=Math.max(1,Math.ceil(rows.length/pageSize));
 expenseState.page=Math.max(1,Math.min(expenseState.page,pages));
 const sliced=rows.slice((expenseState.page-1)*pageSize,expenseState.page*pageSize);
 document.getElementById('expense-table-area').innerHTML=`
 <div class="table-wrap"><table class="data-table"><thead><tr><th>Data</th><th>Conta / Classificação</th><th>Credor</th><th class="text-right">Valor</th></tr></thead><tbody>${sliced.length?sliced.map(row=>`<tr><td>${fmtDate(row.datMovimento)}</td><td><strong>${esc(row.desConta||'—')}</strong><br><span class="subclass">${esc(row.desClassificacao||'')}</span></td><td>${esc(row.nomCredor||'Não informado')}</td><td class="value-inline">${money(row.vlrDespesa)}</td></tr>`).join(''):'<tr><td colspan="4" class="centered">Nenhum registro corresponde à busca.</td></tr>'}</tbody></table></div>
 <div class="table-footer"><span>${rows.length===0?'Nenhum registro':`${(expenseState.page-1)*pageSize+1}–${Math.min(expenseState.page*pageSize,rows.length)} de ${rows.length} registros filtrados`}</span><div class="page-buttons"><button type="button" data-expense-page="prev" ${expenseState.page<=1?'disabled':''}>Anterior</button><span class="page-counter">${expenseState.page} / ${pages}</span><button type="button" data-expense-page="next" ${expenseState.page>=pages?'disabled':''}>Próxima</button></div></div>`;
 const ranks=new Map();
 for(const row of expenseState.data.dados){const k=(row.nomCredor||'Não informado').trim();ranks.set(k,(ranks.get(k)||0)+row.vlrDespesa)}
 const ranking=[...ranks].sort((a,b)=>b[1]-a[1]).slice(0,7),top=Math.max(1,ranking[0]?.[1]||0);
 document.getElementById('expense-ranking-area').innerHTML=ranking.length?`<ol class="ranking">${ranking.map(([name,value],i)=>`<li><div class="rank-heading"><span class="rank-name" title="${esc(name)}">${i+1}. ${esc(name)}</span><strong>${money(value)}</strong></div><progress class="rank-progress" max="100" value="${Math.max(0,Math.min(100,value/top*100)).toFixed(1)}" aria-label="Participação relativa de ${esc(name)}"></progress></li>`).join('')}</ol>`:'<p class="muted-message">Nenhum credor para o período.</p>';
}
function exportCSV(){
 if(!expenseState.data)return;
 const safe=v=>{let s=String(v??''); if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
 const rows=[['Data','Classificação','Conta','Credor','Valor'],...filteredExpenses().map(r=>[r.datMovimento,r.desClassificacao,r.desConta,r.nomCredor,r.vlrDespesa.toFixed(2).replace('.',',')])];
 const csv='\uFEFF'+rows.map(cols=>cols.map(safe).join(';')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='despesas-extraorcamentarias-ultimos-6-meses.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function loadExpenses(force=false){
 if(expenseState.loading)return;
 if(expenseState.data&&!force){return renderExpenseResults()}
 expenseState.loading=true;expenseState.error=null;expenseState.data=null;
 ROOT.innerHTML=expenseShell();
 try{
  const response=await fetch(urlFor('/api/despesas/extraorcamentarias'),{cache:'no-store'});
  if(!response.ok)throw new Error('O serviço de dados está temporariamente indisponível (HTTP '+response.status+').');
  const body=await response.json();
  if(!body.metadados?.completo||!Array.isArray(body.dados)||!body.resumo)throw new Error('A consulta não retornou dados completos e validados.');
  expenseState.data=body;
 }catch(e){expenseState.error=e.message||'Falha de conexão.'}
 finally{expenseState.loading=false;if(actualPath()==='/despesas/extraorcamentarias'){ROOT.innerHTML=expenseShell();renderExpenseResults()}}
}
function showRoute(){
 let route=actualPath();const entry=routes.find(r=>r.path===route);
 document.title=(entry?entry.label+' | ':'')+PORTAL;
 const name=entry?.label||'Página não encontrada';
 document.getElementById('header-location').textContent=name;
 document.querySelectorAll('[data-route]').forEach(node=>{const active=node.dataset.route===route;node.classList.toggle('active',active);if(active)node.setAttribute('aria-current','page');else node.removeAttribute('aria-current')});
 if(!entry){ROOT.innerHTML=heading('Navegação','Página não encontrada','A página solicitada não existe neste portal.')+navA('/','Voltar à visão geral','small-action');return}
 if(route==='/'){ROOT.innerHTML=dashboard();return}
 if(route==='/despesas/extraorcamentarias'){ROOT.innerHTML=expenseShell();if(expenseState.data)renderExpenseResults();else void loadExpenses();return}
 ROOT.innerHTML=placeholder(entry);
}
function navigate(path){
 if(!routes.some(x=>x.path===path)){path='/'}
 history.pushState({},'',urlFor(path));window.scrollTo({top:0,behavior:'instant'});hideMenu();closeSearch();showRoute();ROOT.focus({preventScroll:true});
}
function hideMenu(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-shade').hidden=true;document.getElementById('menu-toggle').setAttribute('aria-expanded','false')}
function openSearch(){document.getElementById('search-modal').hidden=false;document.getElementById('search-input').value='';renderSearch('');document.getElementById('search-input').focus()}
function closeSearch(){document.getElementById('search-modal').hidden=true}
function renderSearch(term){
 let t=term.trim().toLocaleLowerCase('pt-BR');
 const hits=routes.filter(r=>(r.label+' '+r.section+' '+r.description).toLocaleLowerCase('pt-BR').includes(t));
 document.getElementById('search-results').innerHTML=hits.length?hits.map(r=>navA(r.path,`<span class="hit-icon">${icon(r.icon)}</span><span><strong>${esc(r.label)}</strong><small>${esc(r.section)} · ${r.ready?'Consulta integrada':'Seção do portal'}</small></span><span class="hit-arrow">${icon('chevron-right')}</span>`,'search-hit','role="option"')).join(''):'<p class="muted-message centered">Nenhuma página encontrada. Tente outro termo.</p>';
}
function setClock(){document.getElementById('clock').textContent=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'short',year:'numeric'}).format(new Date()).replace('.','')}
document.addEventListener('click',event=>{
 const link=event.target.closest('a[data-link]');
 if(link && !event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&event.button===0){
  event.preventDefault();let target=new URL(link.href).pathname;if(BASE&&target.startsWith(BASE))target=target.slice(BASE.length)||'/';navigate(target);return;
 }
 if(event.target.closest('#menu-toggle')){const s=document.getElementById('sidebar');const open=s.classList.toggle('open');document.getElementById('sidebar-shade').hidden=!open;document.getElementById('menu-toggle').setAttribute('aria-expanded',String(open));}
 if(event.target.closest('#sidebar-shade'))hideMenu();
 if(event.target.closest('#global-search'))openSearch();
 if(event.target.closest('#close-search')||event.target.closest('[data-close-search]'))closeSearch();
 if(event.target.closest('#refresh-expenses')){expenseState.search='';expenseState.page=1;void loadExpenses(true)}
 if(event.target.closest('#expense-export'))exportCSV();
 const paging=event.target.closest('[data-expense-page]');if(paging){expenseState.page+=paging.dataset.expensePage==='next'?1:-1;renderExpenseResults();}
});
document.addEventListener('input',event=>{
 if(event.target.id==='search-input')renderSearch(event.target.value);
 if(event.target.id==='expense-search'){expenseState.search=event.target.value;expenseState.page=1;renderExpenseResults();}
});
document.addEventListener('change',event=>{if(event.target.id==='expense-sort'){expenseState.sort=event.target.value;expenseState.page=1;renderExpenseResults()}});
document.addEventListener('keydown',event=>{
 if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch()}
 if(event.key==='Escape'){closeSearch();hideMenu()}
 if(event.key==='Enter'&&document.activeElement?.id==='search-input'){const first=document.querySelector('.search-hit');if(first)first.click()}
});
window.addEventListener('popstate',()=>{hideMenu();showRoute()});
injectIcons();setClock();showRoute();
