
const BASE=document.querySelector('meta[name="app-base-path"]')?.content||'';
const PORTAL='Portal da Transparência - Pref.Mun.de Serra da Saudade MG';
const ROOT=document.getElementById('conteudo');
const routes=[
  {path:'/',label:'Visão geral',icon:'layout-dashboard',section:'Início',description:'Panorama e acesso aos dados públicos da administração municipal.'},
  {path:'/receitas',label:'Receitas públicas',icon:'trending-up',section:'Finanças',description:'Receitas por classificação, previsão e arrecadação.',ready:true},
  {path:'/despesas/orcamentarias',label:'Despesas orçamentárias',icon:'wallet',section:'Finanças',description:'Movimentos de empenho, liquidação e pagamento, por fornecedor e processo.',ready:true},
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
   <div class="stat-card"><div class="stat-top"><span>Consultas financeiras</span><span class="icon-square blue">${icon('activity')}</span></div><div class="stat-value small">3 modalidades</div><div class="stat-sub"><strong>Receitas e despesas</strong> · consulta automatizada</div></div>
   <div class="stat-card"><div class="stat-top"><span>Navegação</span><span class="icon-square gold">${icon('layout-dashboard')}</span></div><div class="stat-value small">${routes.length} áreas</div><div class="stat-sub">Estrutura modular em construção</div></div>
 </div>
 ${sectionHead('Acesse por assunto',navA('/despesas/orcamentarias',`Consultar despesas orçamentárias ${icon('arrow-right')}`))}
 <div class="module-grid">${[routes[1],routes[2],routes[3],routes[5],routes[6],routes[9]].map(moduleCard).join('')}</div>
 <div class="notice-banner">${icon('info')}<div><strong>Estamos construindo o novo portal, módulo por módulo.</strong><p>Os espaços assinalados como “Em implantação” ainda não exibem dados. Nenhum valor demonstrativo será apresentado como informação oficial.</p></div></div>`;
}
function placeholder(entry){
 const isPNCP=['/licitacoes','/contratos','/atas'].includes(entry.path);
 const isFinance=['/receitas'].includes(entry.path);
 const expl=isPNCP?'Essa área será alimentada por dados públicos do Portal Nacional de Contratações Públicas (PNCP), incluindo detalhes e arquivos efetivamente disponíveis.':isFinance?'Esta área terá consulta automática dos últimos seis meses, com totais calculados apenas após recuperar todos os registros.':'O conteúdo será organizado, pesquisável e acessível, com preservação dos documentos e informações exigidos.';
 return `${heading(entry.section,entry.label,entry.description)}
 <div class="status-empty"><div class="empty-icon">${icon(entry.icon)}</div>
 <div><span class="chip blue">PRÓXIMA ETAPA</span><h2>Uma nova experiência está a caminho.</h2><p>${esc(expl)} A navegação já está pronta; a fonte de dados deste módulo ainda não foi integrada.</p>
 ${navA('/',`${icon('arrow-right')} Voltar à visão geral`,'small-action')}</div></div>
 ${sectionHead('Como esta área será organizada')}
 <div class="small-info"><div class="info-item">${icon('search')}<h3>Busca e filtros</h3><p>Localize registros com poucos passos.</p></div><div class="info-item">${icon('file-bar-chart')}<h3>Informação compreensível</h3><p>Detalhes e indicadores com contexto.</p></div><div class="info-item">${icon('download')}<h3>Documentos e exportação</h3><p>Acesso aos arquivos que forem publicados.</p></div></div>`;
}
const expenseState={data:null,loading:false,error:null,search:'',sort:'supplier-asc',page:1};
const pageSize=15;
function expenseShell(){
 const data=expenseState.data;
 const period=data?.metadados?.periodo;
 return `${heading('Finanças públicas · Movimentações','Despesas extraorçamentárias','Consulta automática dos últimos seis meses, com consolidação de todas as páginas de registros.',`<button id="refresh-expenses" type="button" class="small-action">${icon('refresh-cw')} Atualizar consulta</button>`)}
 <div class="meta-tags" class="meta-margin"><span class="tag">${icon('calendar-days')} ${period?fmtDate(period.inicio)+' até '+fmtDate(period.fim):'Período móvel · seis meses'}</span><span class="tag">${icon('shield-check')} Dados consultados pelo servidor municipal</span>${data?`<span class="tag">${icon('check-circle')} Coleta completa · ${Number(data.metadados.paginas)} páginas</span>`:''}</div>
 ${sectionHead('Listagem de fornecedores',`<span class="section-note">Atualização sob demanda · cache temporário</span>`)}
 ${expenseState.loading?`<div class="panel loading-block" role="status"><div class="spinner"></div>Consultando e validando todos os registros do período...</div>`:''}
 ${expenseState.error?`<div class="error-panel" role="alert">${icon('alert-circle')}<div><strong>Não foi possível carregar a consulta.</strong>${esc(expenseState.error)} Os totais não serão apresentados até a coleta estar completa.</div></div>`:''}
 ${data?`<div class="data-toolbar"><div class="input-with-icon">${icon('search')}<input class="text-input" id="expense-search" placeholder="Buscar credor, conta ou classificação..." value="${esc(expenseState.search)}" aria-label="Buscar movimentações"></div>
 <select class="select-input" id="expense-sort" aria-label="Ordenação"><option value="supplier-asc" ${expenseState.sort==='supplier-asc'?'selected':''}>Fornecedor A–Z</option><option value="supplier-desc" ${expenseState.sort==='supplier-desc'?'selected':''}>Fornecedor Z–A</option><option value="date-desc" ${expenseState.sort==='date-desc'?'selected':''}>Mais recentes</option><option value="date-asc" ${expenseState.sort==='date-asc'?'selected':''}>Mais antigas</option><option value="value-desc" ${expenseState.sort==='value-desc'?'selected':''}>Maior valor</option><option value="value-asc" ${expenseState.sort==='value-asc'?'selected':''}>Menor valor</option></select>
 <button id="expense-export" class="toolbar-button" type="button">${icon('download')} Exportar CSV</button></div>
 <section class="panel supplier-list"><div class="overview-title"><h2>Fornecedores e movimentações</h2><span class="chip green">${data.dados.length.toLocaleString('pt-BR')} registros obtidos</span></div><div id="expense-table-area"></div></section>
 `:''}
 <div class="notice-banner">${icon('info')}<div><strong>Como interpretar estes valores?</strong><p>Este módulo apresenta movimentações extraorçamentárias, como consignações e repasses, e não representa a despesa orçamentária total da Prefeitura. O período móvel é definido no servidor e não pode ser ampliado por filtros.</p></div></div>`;
}
function filteredExpenses(){
 if(!expenseState.data)return [];
 const term=expenseState.search.toLocaleLowerCase('pt-BR').trim();
 return expenseState.data.dados.filter(row=>!term||[row.nomCredor,row.desConta,row.desClassificacao,fmtDate(row.datMovimento)].some(v=>String(v??'').toLocaleLowerCase('pt-BR').includes(term)))
 .sort((a,b)=>expenseState.sort==='supplier-asc'?String(a.nomCredor||'').localeCompare(String(b.nomCredor||''),'pt-BR'):expenseState.sort==='supplier-desc'?String(b.nomCredor||'').localeCompare(String(a.nomCredor||''),'pt-BR'):expenseState.sort==='date-desc'?b.datMovimento.localeCompare(a.datMovimento):expenseState.sort==='date-asc'?a.datMovimento.localeCompare(b.datMovimento):expenseState.sort==='value-desc'?b.vlrDespesa-a.vlrDespesa:a.vlrDespesa-b.vlrDespesa);
}
function renderExpenseResults(){
 if(!expenseState.data)return;
 const rows=filteredExpenses(), pages=Math.max(1,Math.ceil(rows.length/pageSize));
 expenseState.page=Math.max(1,Math.min(expenseState.page,pages));
 const sliced=rows.slice((expenseState.page-1)*pageSize,expenseState.page*pageSize);
 document.getElementById('expense-table-area').innerHTML=`
 <div class="table-wrap"><table class="data-table responsive-table"><thead><tr><th>Fornecedor</th><th>Conta / Classificação</th><th>Data</th><th class="text-right">Valor</th></tr></thead><tbody>${sliced.length?sliced.map(row=>`<tr><td data-label="Fornecedor"><strong class="supplier-name">${esc(row.nomCredor||'Não informado')}</strong></td><td data-label="Conta / classificação"><strong>${esc(row.desConta||'—')}</strong><span class="subclass">${esc(row.desClassificacao||'')}</span></td><td data-label="Data">${fmtDate(row.datMovimento)}</td><td data-label="Valor" class="value-inline">${money(row.vlrDespesa)}</td></tr>`).join(''):'<tr><td colspan="4" class="centered">Nenhum registro corresponde à busca.</td></tr>'}</tbody></table></div>
 <div class="table-footer"><span>${rows.length===0?'Nenhum registro':`${(expenseState.page-1)*pageSize+1}–${Math.min(expenseState.page*pageSize,rows.length)} de ${rows.length} registros filtrados`}</span><div class="page-buttons"><button type="button" data-expense-page="prev" ${expenseState.page<=1?'disabled':''}>Anterior</button><span class="page-counter">${expenseState.page} / ${pages}</span><button type="button" data-expense-page="next" ${expenseState.page>=pages?'disabled':''}>Próxima</button></div></div>`;
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

const orcState={data:null,loading:false,error:null,search:'',sort:'supplier-asc',tipo:'Todos',page:1,progresso:null};
function orcShell(){
 const data=orcState.data, periodo=data?.metadados?.periodo;
 let progresso='';
 if(orcState.loading){
  const p=orcState.progresso||{};
  progresso=`<div class="panel loading-block" role="status"><div class="spinner"></div><div><strong>Consultando despesas orçamentárias…</strong><br>
  <span class="detail-note">${Number.isInteger(p.totalPaginas)?`${Number(p.paginasColetadas||0)} de ${Number(p.totalPaginas)} páginas coletadas`:'Iniciando consulta e conferindo a paginação'}${p.registros?' · '+Number(p.registros).toLocaleString('pt-BR')+' registros':''}</span></div></div>`;
 }
 return `${heading('Finanças públicas · Execução orçamentária','Despesas orçamentárias','Consulta automatizada dos últimos seis meses, organizada por empenho, liquidação e pagamento.',`<button id="refresh-orc" type="button" class="small-action">${icon('refresh-cw')} Atualizar consulta</button>`)}
 <div class="meta-tags"><span class="tag">${icon('calendar-days')} ${periodo?fmtDate(periodo.inicio)+' até '+fmtDate(periodo.fim):'Últimos seis meses · período automático'}</span>
 <span class="tag">${icon('shield-check')} Consulta protegida pelo servidor</span>${data?`<span class="tag">${icon('check-circle')} Coleta completa · ${Number(data.metadados.paginas)} páginas</span>`:''}</div>
  ${sectionHead('Listagem de fornecedores','<span class="section-note">Atualização sob demanda · cache de 5 minutos</span>')}
 ${progresso}
 ${orcState.error?`<div class="error-panel" role="alert">${icon('alert-circle')}<div><strong>Não foi possível concluir a coleta.</strong><p>${esc(orcState.error)} Nenhum total parcial será exibido.</p></div></div>`:''}
 ${data?`<div class="data-toolbar">
 <div class="input-with-icon">${icon('search')}<input class="text-input" id="orc-search" placeholder="Fornecedor, número do empenho ou processo…" value="${esc(orcState.search)}" aria-label="Pesquisar despesas orçamentárias"></div>
 <select class="select-input" id="orc-tipo" aria-label="Tipo de movimentação">${['Todos','Empenho','Liquidação','Pagamento','Outros'].map(x=>`<option value="${esc(x)}" ${orcState.tipo===x?'selected':''}>${x==='Todos'?'Todos os movimentos':x}</option>`).join('')}</select>
 <select class="select-input" id="orc-sort" aria-label="Ordenar despesas"><option value="supplier-asc" ${orcState.sort==='supplier-asc'?'selected':''}>Fornecedor A–Z</option><option value="supplier-desc" ${orcState.sort==='supplier-desc'?'selected':''}>Fornecedor Z–A</option><option value="empenho-desc" ${orcState.sort==='empenho-desc'?'selected':''}>Empenho (decrescente)</option><option value="empenho-asc" ${orcState.sort==='empenho-asc'?'selected':''}>Empenho (crescente)</option><option value="value-desc" ${orcState.sort==='value-desc'?'selected':''}>Maior valor</option><option value="value-asc" ${orcState.sort==='value-asc'?'selected':''}>Menor valor</option></select>
 <button id="orc-export" class="toolbar-button" type="button">${icon('download')} Exportar CSV</button></div>
 <section class="panel supplier-list"><div class="overview-title"><h2>Fornecedores e movimentações</h2><span class="chip green">${data.dados.length.toLocaleString('pt-BR')} registros</span></div><div id="orc-table-area"></div></section>
 `:''}
 <div class="notice-banner">${icon('info')}<div><strong>Como interpretar estes dados?</strong><p>Esta listagem mostra movimentos individuais por fornecedor. Os valores apresentados não representam necessariamente pagamentos. A origem pode não informar a data de alguns registros${data?` (${Number(data.metadados.semData).toLocaleString('pt-BR')} sem data)` :''}; nesses casos exibimos “—”, sem inventar datas. A restrição aos últimos seis meses é aplicada na consulta feita pelo servidor.</p></div></div>`;
}
function filteredOrc(){
 if(!orcState.data)return [];
 const q=orcState.search.trim().toLocaleLowerCase('pt-BR');
 return orcState.data.dados.filter(r=>(orcState.tipo==='Todos'||r.movimento===orcState.tipo)&&
  (!q||[r.fornecedor,r.empenho,r.ano,r.processo,r.licitacao,r.modalidade,r.movimentoOriginal].some(v=>String(v??'').toLocaleLowerCase('pt-BR').includes(q))))
  .sort((a,b)=>orcState.sort==='supplier-asc'?a.fornecedor.localeCompare(b.fornecedor,'pt-BR'):orcState.sort==='supplier-desc'?b.fornecedor.localeCompare(a.fornecedor,'pt-BR'):orcState.sort==='value-desc'?b.valor-a.valor:
      orcState.sort==='value-asc'?a.valor-b.valor:
      orcState.sort==='empenho-asc'?(a.ano-b.ano || Number(a.empenho)-Number(b.empenho)):
      (b.ano-a.ano || Number(b.empenho)-Number(a.empenho)));
}
function renderOrcResults(){
 if(!orcState.data)return;
 const el=document.getElementById('orc-table-area');
 if(!el)return;
 const filtrados=filteredOrc(), paginas=Math.max(1,Math.ceil(filtrados.length/pageSize));
 orcState.page=Math.min(paginas,Math.max(1,orcState.page));
 const selecionados=filtrados.slice((orcState.page-1)*pageSize,orcState.page*pageSize);
 el.innerHTML=`<div class="table-wrap"><table class="data-table responsive-table"><thead><tr><th>Fornecedor</th><th>Empenho / movimento</th><th>Processo / modalidade</th><th>Data</th><th class="text-right">Valor do movimento</th></tr></thead>
 <tbody>${selecionados.length?selecionados.map(r=>`<tr><td data-label="Fornecedor"><strong class="supplier-name">${esc(r.fornecedor)}</strong></td><td data-label="Empenho / movimento"><strong>${esc(r.empenho||'—')}/${esc(r.ano??'—')}</strong><span class="subclass">${esc(r.movimentoOriginal)}</span></td><td data-label="Processo / modalidade"><strong>${esc(r.processo||'—')}</strong><span class="subclass">${esc(r.modalidade||'')}</span></td><td data-label="Data">${fmtDate(r.data)}</td><td data-label="Valor" class="value-inline">${money(r.valor)}</td></tr>`).join(''):'<tr><td colspan="4" class="centered">Nenhum resultado para os filtros selecionados.</td></tr>'}</tbody></table></div>
 <div class="table-footer"><span>${filtrados.length?`${(orcState.page-1)*pageSize+1}–${Math.min(orcState.page*pageSize,filtrados.length)} de ${filtrados.length} registros`:'Nenhum registro'}</span>
 <div class="page-buttons"><button data-orc-page="prev" type="button" ${orcState.page===1?'disabled':''}>Anterior</button><span class="page-counter">${orcState.page} / ${paginas}</span><button data-orc-page="next" type="button" ${orcState.page===paginas?'disabled':''}>Próxima</button></div></div>`;
}
function exportOrcCSV(){
 if(!orcState.data)return;
 const safe=v=>{let x=String(v??'');if(/^[\s]*[=+\-@\t\r]/.test(x))x="'"+x;return '"'+x.replaceAll('"','""')+'"'};
 const rows=[['Empenho','Ano','Movimento','Data','Fornecedor','Modalidade','Processo','Licitação','Valor do movimento'],
 ...filteredOrc().map(r=>[r.empenho,r.ano,r.movimentoOriginal,r.data||'',r.fornecedor,r.modalidade,r.processo,r.licitacao,r.valor.toFixed(2).replace('.',',')])];
 const csv='\ufeff'+rows.map(row=>row.map(safe).join(';')).join('\r\n');
 const link=document.createElement('a');const obj=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 link.href=obj;link.download='despesas-orcamentarias-ultimos-seis-meses.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(obj),1000);
}
async function loadOrc(force=false){
 if(orcState.loading)return;
 if(orcState.data&&!force){renderOrcResults();return}
 orcState.loading=true;orcState.data=null;orcState.error=null;orcState.progresso=null;
 ROOT.innerHTML=orcShell();
 try{
  for(let tentativa=0;tentativa<120;tentativa++){
   const resposta=await fetch(urlFor('/api/despesas/orcamentarias'),{cache:'no-store'});
   if(resposta.status===202){
    orcState.progresso=await resposta.json();
    if(actualPath()==='/despesas/orcamentarias')ROOT.innerHTML=orcShell();
    await new Promise(r=>setTimeout(r,2200));
    if(actualPath()!=='/despesas/orcamentarias')break;
    continue;
   }
   if(!resposta.ok)throw new Error('Falha na consulta orçamentária (HTTP '+resposta.status+').');
   const body=await resposta.json();
   if(!body.metadados?.completo||!Array.isArray(body.dados)||!body.resumo)throw new Error('A resposta recebida não foi validada.');
   orcState.data=body;break;
  }
  if(actualPath()==='/despesas/orcamentarias'&&!orcState.data)throw new Error('A coleta está demorando mais que o previsto. Tente novamente em alguns instantes.');
 }catch(e){orcState.error=e?.message||'Falha inesperada.'}
 finally{orcState.loading=false;if(actualPath()==='/despesas/orcamentarias'){ROOT.innerHTML=orcShell();renderOrcResults()}}
}


const recState={data:null,loading:false,error:null,q:'',nivel:'DETALHE',sort:'name',page:1};
const recNiveis={RECEITA:'Categoria',SUBRECEITA:'Subcategoria',DESRUBRICARECEITA:'Rubrica',DESFONTERECEITA:'Fonte de recurso',DETALHE:'Receita detalhada'};
function recShell(){
 const data=recState.data,p=data?.metadados?.periodo;
 return `${heading('Finanças públicas · Arrecadação','Receitas orçamentárias','Receitas previstas e arrecadadas nos últimos seis meses, organizadas por classificação.',`<button id="rec-refresh" type="button" class="small-action">${icon('refresh-cw')} Atualizar</button>`)}
 <div class="meta-tags"><span class="tag">${icon('calendar-days')} ${p?fmtDate(p.inicio)+' até '+fmtDate(p.fim):'Período automático · seis meses'}</span><span class="tag">${icon('shield-check')} Consulta protegida</span></div>
 ${sectionHead('Receitas por classificação','<span class="section-note">Sem soma de níveis hierárquicos</span>')}
 ${recState.loading?'<div class="panel loading-block" role="status"><div class="spinner"></div>Consultando receitas…</div>':''}
 ${recState.error?`<div class="error-panel" role="alert">${icon('alert-circle')} ${esc(recState.error)}</div>`:''}
 ${data?`<div class="data-toolbar"><div class="input-with-icon">${icon('search')}<input id="rec-q" class="text-input" aria-label="Pesquisar receitas" value="${esc(recState.q)}" placeholder="Buscar receita, código ou fonte..."></div>
 <select id="rec-level" class="select-input" aria-label="Nível de classificação">
 <option value="DETALHE" ${recState.nivel==='DETALHE'?'selected':''}>Receitas detalhadas</option>
 <option value="TODOS" ${recState.nivel==='TODOS'?'selected':''}>Todas as classificações</option>
 ${Object.entries(recNiveis).filter(([v])=>v!=='DETALHE').map(([v,t])=>`<option value="${v}" ${recState.nivel===v?'selected':''}>${esc(t)}</option>`).join('')}</select>
 <select id="rec-sort" class="select-input" aria-label="Ordenar receitas"><option value="name">Receita (A–Z)</option>
 <option value="value" ${recState.sort==='value'?'selected':''}>Maior arrecadação</option><option value="code" ${recState.sort==='code'?'selected':''}>Código</option></select>
 <button id="rec-export" class="toolbar-button" type="button">${icon('download')} Exportar CSV</button></div>
 <section class="panel supplier-list"><div class="overview-title"><h2>Registros de receita</h2><span id="rec-count" class="chip green"></span></div><div id="rec-results"></div></section>`:''}
 <div class="notice-banner">${icon('info')}<div><strong>Interpretação dos dados</strong><p>O mesmo valor pode constar em categorias e detalhamentos diferentes; por isso, não os somamos. A arrecadação corresponde à consulta dos últimos seis meses. A previsão informada pode se referir ao exercício anual.</p></div></div>`;
}
function filteredRec(){
 if(!recState.data)return [];
 const q=recState.q.trim().toLocaleLowerCase('pt-BR');
 return recState.data.dados.filter(x=>(recState.nivel==='TODOS'||recState.nivel===x.nivel)&&
 (!q||[x.receita,x.codigo,x.fonte].some(t=>String(t??'').toLocaleLowerCase('pt-BR').includes(q))))
 .sort((a,b)=>recState.sort==='value'?(b.arrecadado??-Infinity)-(a.arrecadado??-Infinity):
 recState.sort==='code'?a.codigo.localeCompare(b.codigo,'pt-BR'):a.receita.localeCompare(b.receita,'pt-BR'));
}
function renderRec(){
 const el=document.getElementById('rec-results');if(!el||!recState.data)return;
 const rows=filteredRec(),pages=Math.max(1,Math.ceil(rows.length/pageSize));
 recState.page=Math.max(1,Math.min(recState.page,pages));
 const current=rows.slice((recState.page-1)*pageSize,recState.page*pageSize);
 const count=document.getElementById('rec-count');if(count)count.textContent=rows.length.toLocaleString('pt-BR')+' registros';
 el.innerHTML=`<div class="table-wrap"><table class="data-table responsive-table"><thead><tr><th>Receita</th><th>Código / nível</th><th>Fonte de recursos</th><th>Previsão informada</th><th>Arrecadado no período</th></tr></thead><tbody>
 ${current.length?current.map(x=>`<tr><td data-label="Receita"><strong class="supplier-name">${esc(x.receita)}</strong></td>
 <td data-label="Código / nível">${esc(x.codigo)}<span class="subclass">${esc(recNiveis[x.nivel])}</span></td>
 <td data-label="Fonte de recursos">${esc(x.fonte||'Não informada')}</td>
 <td data-label="Previsão">${x.previsao===null?'—':money(x.previsao)}</td>
 <td data-label="Arrecadado">${x.arrecadado===null?'—':money(x.arrecadado)}</td></tr>`).join(''):'<tr class="empty-row"><td colspan="5">Nenhum resultado.</td></tr>'}</tbody></table></div>
 <div class="table-footer"><span>${rows.length?((recState.page-1)*pageSize+1):0}–${Math.min(recState.page*pageSize,rows.length)} de ${rows.length}</span>
 <div class="page-buttons"><button data-rec-page="prev" type="button" ${recState.page===1?'disabled':''}>Anterior</button><span class="page-counter">${recState.page} / ${pages}</span><button data-rec-page="next" type="button" ${recState.page===pages?'disabled':''}>Próxima</button></div></div>`;
}
function exportRec(){
 if(!recState.data)return;
 const safe=v=>{let x=String(v??'');if(/^[\s]*[=+\-@\t\r]/.test(x))x="'"+x;return '"'+x.replaceAll('"','""')+'"'};
 const list=[['Receita','Código','Nível','Fonte','Previsão informada','Arrecadado no período'],
 ...filteredRec().map(x=>[x.receita,x.codigo,recNiveis[x.nivel],x.fonte,x.previsao??'',x.arrecadado??''])];
 const csv='\ufeff'+list.map(r=>r.map(safe).join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='receitas-orcamentarias-6-meses.csv';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function loadRec(force=false){
 if(recState.loading)return;
 if(recState.data&&!force){renderRec();return}
 recState.data=null;recState.error=null;recState.loading=true;ROOT.innerHTML=recShell();
 try{const resp=await fetch(urlFor('/api/receitas/orcamentarias'),{cache:'no-store'});
 if(!resp.ok)throw new Error('Falha HTTP '+resp.status);
 const data=await resp.json();if(!data?.metadados?.completo||!Array.isArray(data.dados))throw new Error('Resposta inesperada');
 recState.data=data;
 }catch(e){recState.error=e?.message||'Consulta indisponível'}
 finally{recState.loading=false;if(actualPath()==='/receitas'){ROOT.innerHTML=recShell();renderRec()}}
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
 if(route==='/receitas'){ROOT.innerHTML=recShell();if(recState.data)renderRec();else void loadRec();return}
 if(route==='/despesas/orcamentarias'){ROOT.innerHTML=orcShell();if(orcState.data)renderOrcResults();else void loadOrc();return}
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
 if(event.target.closest('#rec-refresh')){recState.page=1;void loadRec(true)}
 if(event.target.closest('#rec-export'))exportRec();
 const pg=event.target.closest('[data-rec-page]');if(pg){recState.page+=pg.dataset.recPage==='next'?1:-1;renderRec()}
 if(event.target.closest('#refresh-orc')){orcState.search='';orcState.tipo='Todos';orcState.page=1;void loadOrc(true)}
 if(event.target.closest('#orc-export'))exportOrcCSV();
 const orcPaging=event.target.closest('[data-orc-page]');
 if(orcPaging){orcState.page+=orcPaging.dataset.orcPage==='next'?1:-1;renderOrcResults()}
 if(event.target.closest('#expense-export'))exportCSV();
 const paging=event.target.closest('[data-expense-page]');if(paging){expenseState.page+=paging.dataset.expensePage==='next'?1:-1;renderExpenseResults();}
});
document.addEventListener('input',event=>{
 if(event.target.id==='search-input')renderSearch(event.target.value);
 if(event.target.id==='expense-search'){expenseState.search=event.target.value;expenseState.page=1;renderExpenseResults();}
 if(event.target.id==='rec-q'){recState.q=event.target.value;recState.page=1;renderRec()}
 if(event.target.id==='orc-search'){orcState.search=event.target.value;orcState.page=1;renderOrcResults();}
});
document.addEventListener('change',event=>{
 if(event.target.id==='expense-sort'){expenseState.sort=event.target.value;expenseState.page=1;renderExpenseResults()}
 if(event.target.id==='rec-level'){recState.nivel=event.target.value;recState.page=1;renderRec()}
 if(event.target.id==='rec-sort'){recState.sort=event.target.value;recState.page=1;renderRec()}
 if(event.target.id==='orc-sort'){orcState.sort=event.target.value;orcState.page=1;renderOrcResults()}
 if(event.target.id==='orc-tipo'){orcState.tipo=event.target.value;orcState.page=1;renderOrcResults()}
});
document.addEventListener('keydown',event=>{
 if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch()}
 if(event.key==='Escape'){closeSearch();hideMenu()}
 if(event.key==='Enter'&&document.activeElement?.id==='search-input'){const first=document.querySelector('.search-hit');if(first)first.click()}
});
window.addEventListener('popstate',()=>{hideMenu();showRoute()});
injectIcons();setClock();showRoute();
