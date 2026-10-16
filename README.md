# Portal da Transparência - Pref.Mun.de Serra da Saudade MG

Versão 1.1 do novo portal oficial da Prefeitura Municipal de Serra da Saudade/MG.

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
Abra **http://localhost:3000/**. No Windows, o PowerShell pode exigir `npm.cmd start`. Caso a porta 3000 esteja bloqueada, execute:
```powershell
$env:HOST = "127.0.0.1"
$env:PORT = "4173"
npm.cmd start
```
Nesse caso, abra **http://localhost:4173/**. Também é possível executar `INICIAR-WINDOWS.bat`.

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
| `/despesas/orcamentarias` | Consulta automática real com coleta em segundo plano e paginação integral |
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
- `/api/despesas/orcamentarias`: consulta automática com coleta em segundo plano. Responde **HTTP 202** durante a execução e **HTTP 200** somente após validação de todas as páginas. Em caso de falha responde **502**, nunca um total parcial.

## Implantação KingHost
Leia [docs/KINGHOST.md](docs/KINGHOST.md). Não altere a aplicação atual antes de criar e testar uma aplicação separada.

## Regras de qualidade e segurança
- Nome institucional **Portal da Transparência - Pref.Mun.de Serra da Saudade MG**.
- Nunca inserir no frontend URL, iframe ou redirecionamento para sistemas intermediários de dados financeiros.
- Rastreabilidade técnica das fontes permanece no conector do servidor.
- Não enviar cookies, tokens e credenciais para os serviços públicos de leitura.
- Nenhum CPF/CNPJ bruto dos conectores financeiros vai para o navegador; identificações anexadas ao nome também são filtradas.
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
public/assets/app.js            Navegação, busca, dois painéis de despesas
public/favicon.svg              Ícone vetorial próprio
integracoes/despesa-extra.mjs   Conector extraorçamentário validado
integracoes/despesa-orcamentaria.mjs  Conector orçamentário com coleta concorrente
testes/                         Testes automáticos
docs/KINGHOST.md                Implantação e HTTPS
docs/ETAPAS.md                  Roteiro dos próximos módulos
```

## Evolução
1. Homologar o novo conector orçamentário com dados reais, verificando estabilidade e valores por natureza do movimento.
2. Revisão visual/UX e ajustes de identidade institucional.
3. Integrar receitas e conferir conciliação dos indicadores.
4. Integrar consultas do PNCP por CNPJ, dados e documentos, com paginação/cache.
5. Migrar e catalogar documentos antigos, implantar painel administrativo quando necessário.
6. Revisão de segurança, acessibilidade, auditoria e homologação pública.

Este projeto é novo. O site atual **permanece no ar e não foi alterado**.

## Despesas orçamentárias — observações sobre os dados

A consulta identificada utiliza `GET /publico/despesaDetalhada` com `indAgrupamento=FOR`, `codAdministracao=2`, filtros vazios e período calculado diariamente pelo servidor. A API devolve páginas Spring Data (`content`, `totalPages`, `totalElements`, `number`, `size`).

Uma amostra de 16/10/2026 (01/01 a 16/10) apresentou **6.468 registros / 324 páginas**, sendo 20 por página. O sistema solicita até 100 por página; se a origem limitar o tamanho, adapta automaticamente. A coleta é concorrente e o navegador acompanha o progresso via HTTP 202; os resultados só são servidos após conclusão e checagem de contagem.

**Importante:** as três categorias exibidas são somatórios do campo `vlrMovimento`, classificados pelo campo `desMovimento`. Não devem ser confundidas com saldos consolidados de valores empenhados, liquidados ou pagos. Campos como `vlrEmpenhado` e `vlrLiquidado` podem se repetir no mesmo movimento e, por isso, não são somados indiscriminadamente. A amostra contém datas nulas: o painel indica “—” em vez de inventar datas e utiliza o recorte temporal aplicado pela consulta de origem.

**Privacidade:** os números de documentos pessoais e os campos de identificação bruta são descartados; o texto do fornecedor é derivado somente da denominação, higienizado. Não armazenar o JSON bruto em arquivos públicos.

A consulta do novo módulo precisa ser homologada contra o servidor real em ambiente de desenvolvimento. Os testes automatizados validam contratos, paginação e o JSON de exemplo, mas não substituem essa homologação.

## Atualização v1.1.1 — Problema de cache no navegador

Se a página de despesas orçamentárias ainda mostrar «Próxima etapa»,
o navegador está exibindo o JavaScript antigo ou há um processo Node.js antigo
em execução. Esta atualização adiciona `?v=1.1.1` aos assets e desativa
o cache dos arquivos `.js` e `.css`, sem alterar os conectores.

No Windows, encerre o servidor anterior com Ctrl+C e execute:

```powershell
cd I:\siteserra2026
git pull origin main
$env:HOST = "127.0.0.1"
$env:PORT = "4173"
npm.cmd start
```

Abra `http://localhost:4173/api/health` para confirmar `version: 1.1.1`.
Depois abra `http://localhost:4173/despesas/orcamentarias` e pressione
`Ctrl + Shift + R` uma vez, caso necessário.

A atualização não habilita HTTPS local; HTTPS público depende do certificado e proxy KingHost.

## Versão 1.2.0 — listagens e celulares
- Sem rankings de fornecedores, cartões somatórios ou gráficos comparativos nas despesas orçamentárias e extraorçamentárias.
- Listagens de movimentos com fornecedor em primeira coluna, filtros, busca, paginação e exportação CSV.
- No celular, as tabelas financeiras viram cartões com todas as informações identificadas, sem cortar colunas.
- Janela móvel de seis meses preservada integralmente nas APIs; conectores não foram alterados.
- Para atualizar localmente: `git pull origin main`, reinicie `npm.cmd start`, confira `/api/health` versão 1.2.0.
