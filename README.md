# Portal da Transparência - Pref.Mun.de Serra da Saudade MG

Primeira entrega estrutural do novo portal oficial da Prefeitura Municipal de Serra da Saudade/MG.

**Status**: versão de desenvolvimento/homologação. Não substitui a aplicação de produção.

## Requisitos
- Node.js **22 ou superior** (compatível com a versão exibida no painel KingHost).
- Nenhum `npm install` necessário nesta versão (zero dependências NPM).

## Executar localmente
```bash
git clone https://github.com/danielpaivaborges/siteserra2026.git
cd siteserra2026
npm start
```
Abra **http://localhost:3000/**. No Windows, também é possível executar `INICIAR-WINDOWS.bat`.

### Testar
```bash
npm test
```

### Desenvolvimento
```bash
npm run dev
```
Os arquivos são carregados pelo próprio servidor Node; recarregue a página ao editar a interface.

## Rotas
| Página | Status |
|---|---|
| `/` | Layout e navegação funcionais |
| `/receitas` | Preparada para integração |
| `/despesas/orcamentarias` | Preparada para integração |
| `/despesas/extraorcamentarias` | Consulta real de fonte pública, recupera todas as páginas |
| `/demonstrativos` | Preparada |
| `/licitacoes` | Preparada para integração PNCP |
| `/contratos` | Preparada para integração PNCP |
| `/atas` | Preparada para integração PNCP |
| `/pessoal` | Preparada |
| `/legislacao` | Preparada |
| `/documentos` | Preparada |
| `/acesso-informacao` | Preparada |

Endpoints internos:
- `/api/health`: funcionamento
- `/api/periodo`: janela móvel dos últimos seis meses, fuso de Brasília
- `/api/despesas/extraorcamentarias`: consulta automática, **sem filtros arbitrários**; apenas JSON validado e completo, ou erro, sem totais parciais.

## Implantação KingHost
Leia [docs/KINGHOST.md](docs/KINGHOST.md). Não altere a aplicação atual antes de criar e testar uma aplicação separada.

## Regras de qualidade e segurança
- Nome institucional **Portal da Transparência - Pref.Mun.de Serra da Saudade MG**.
- Nunca inserir no frontend URL, iframe ou redirecionamento para sistemas intermediários de dados financeiros.
- Rastreabilidade técnica das fontes permanece no conector do servidor.
- Não enviar cookies, tokens e credenciais para os serviços públicos de leitura.
- Nenhum CPF/CNPJ bruto do conector extraorçamentário vai para o navegador.
- Em caso de falha na consulta, não mostrar totais parciais.
- Layout acessível e sem bibliotecas externas de fontes/scripts.
- O PNCP será a fonte planejada para licitações, contratos e atas; **a integração ainda não está implementada**.
- Histórico obrigatório de documentos, contratos e outras categorias públicas deverá ser preservado conforme regras legais; a janela móvel de seis meses aplica-se aos relatórios financeiros dinâmicos.
- `.env`, certificados e chaves privadas estão no `.gitignore`; **não comitar segredos**.
- HTTPS é responsabilidade da camada web/SSL da hospedagem na implantação; executar via HTTP em `localhost` é normal em desenvolvimento.

## Estrutura
```text
index.js                        HTTP server e API interna
public/index.html               Layout institucional
public/assets/styles.css        Design responsivo
public/assets/app.js            Navegação, busca, painel de despesas
public/favicon.svg              Ícone vetorial próprio
integracoes/despesa-extra.mjs   Conector financeiro reutilizado e testado
testes/                         Testes automáticos
docs/KINGHOST.md                Implantação e HTTPS
docs/ETAPAS.md                  Roteiro dos próximos módulos
```

## Evolução
1. Revisão visual/UX e ajustes de identidade institucional.
2. Integrar despesas orçamentárias, mantendo período móvel.
3. Integrar receitas e conferir conciliação dos indicadores.
4. Integrar consultas do PNCP por CNPJ, dados e documentos, com paginação/cache.
5. Migrar e catalogar documentos antigos, implantar painel administrativo quando necessário.
6. Revisão de segurança, acessibilidade, auditoria e homologação pública.

Este projeto é novo. O site atual **permanece no ar e não foi alterado**.
