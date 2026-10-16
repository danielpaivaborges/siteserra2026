# Plano incremental — Portal da Transparência

## Ciclo 1 — Fundação (nesta versão)
- Node 22, roteamento SPA sob BASE_PATH variável, layout moderno.
- Navegação lateral e pesquisa entre páginas.
- Consulta integral de despesas extraorçamentárias, seis meses móveis.
- Testes de segurança de rotas, API e conector, execução local.
- Layout adaptável para celular e desktop.

## Ciclo 2 — Módulo de despesas orçamentárias (conector criado, homologação pendente)
- Capturar endpoint real em Rede/Fetch/XHR.
- Estudar esquema dos registros, chaves únicas e paginação.
- Definir visões orçamentárias: empenho, liquidação, pagamento.
- Tabelas, filtros dentro dos seis meses, rankings e exportação.
- Comparar amostras com o relatório de origem.

## Ciclo 3 — Receitas
- Identificar fontes do site atual e API pública.
- Normalizar receitas por classificação, fonte, mês e unidade.
- Evolução por competência com dados reais e completos.
- Exportação e indicadores conferidos.

## Ciclo 4 — PNCP
- CNPJ do órgão e contratos conferidos com API pública.
- Integração com paginação, datas e modalidades contempladas.
- Páginas de detalhes de contratações, contratos e atas.
- Documentos e arquivos apenas quando disponíveis.
- Cache e sinalização de atualizações; preservação de histórico.

## Ciclo 5 — Documentos e atendimento
- Inventário dos arquivos históricos, links e metadados.
- Biblioteca documental pesquisável e controle de integridade.
- Área SIC/ouvidoria com canais reais e observância LGPD.
- Painel editorial protegido só onde não houver integração automática.

## Ciclo 6 — Preparação de lançamento
- Acessibilidade eMAG/WCAG, performance, testes de carga.
- Revisão legal, arquivística, de LGPD e requisitos de transparência.
- TLS certificado e redirecionamento validado na KingHost.
- Homologação paralela ao site antigo; backup e rollback.

**Não publicar valores inventados nem confundir despesas extraorçamentárias com orçamentárias.**
