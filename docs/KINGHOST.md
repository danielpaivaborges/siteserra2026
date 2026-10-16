# Implantação e HTTPS na KingHost

## Informações da tela enviada
- Runtime selecionado: **Node.js 22 (22.1.0)**.
- Nome da aplicação atual: `transparencia`.
- Caminho da aplicação atual: `/transparencia`.
- Script da aplicação atual: `transparencia/index.js`.
- Há controles de **Acesso Web**, **Acesso direto à porta**, **Auto Reload** e **Habilitar SSL**.
- Na captura, **Habilitar SSL** parece indisponível/cinza; isso não comprova que HTTPS esteja ativo.

**IMPORTANTE: A aplicação atual está em produção. Não substitua seus arquivos nem salve alterações nesse cadastro antes de homologar o novo portal.**

## Procedimento seguro sugerido
1. Crie uma **nova aplicação de homologação** no painel (por exemplo, `transparencia2026`), com caminho e script próprios. Não compartilhe o script da aplicação `transparencia` existente.
2. No novo aplicativo use a versão Node.js 22. Na hospedagem, a aplicação funciona através da porta interna definida pelo próprio provedor.
3. Ajuste, se aplicável, as opções **Acesso Web: Sim** e **Acesso direto à porta: Não**, para expor a aplicação pelo proxy web, sem URL pública com porta alta. A KingHost pode exigir confirmação do domínio e roteamento antes disso.
4. Defina **Auto Reload** de acordo com o processo de implantação do provedor. Recomenda-se desligar na versão de produção estável, se reinícios ao editar arquivos não forem necessários.
5. Configure **SSL/HTTPS** para o domínio ou subdomínio utilizado. Se `Habilitar SSL` permanecer indisponível, verifique certificado, vínculo com o domínio e suporte KingHost. **Nunca considere HTTPS configurado só porque o Node inicia**.
6. Consulte a porta gerada automaticamente pelo painel. Configure a variável `PORT` (ou equivalente `PORT_INDEX`, conforme o ambiente; ver documentação oficial) se a KingHost já não a injetar.
7. Copie o repositório para a pasta da **nova aplicação**; o ponto de entrada é `index.js` na raiz do projeto. Ex.: uma pasta chamada `transparencia2026` com script `transparencia2026/index.js`.
8. Na KingHost defina `BASE_PATH=/transparencia2026` caso o proxy publique o app sob `/transparencia2026`. Para subdomínio/raiz exclusiva, use `BASE_PATH=` (vazio).
9. Valide rotas e assets (ex.: `/transparencia2026/licitacoes`, `/transparencia2026/assets/styles.css`) e endpoint `/api/health` sob o prefixo correto.
10. Quando o **HTTPS válido** estiver confirmado na URL pública, ajuste `NODE_ENV=production` e `HTTPS_READY=1` para emitir HSTS; configure redirecionamento HTTP→HTTPS **na camada web/proxy**. Este código não força redirecionamento porque desconhece como o provedor envia cabeçalhos proxy; fazê-lo cegamente pode gerar loops.
11. Teste segurança, performance, disponibilidade e permissões. Só depois planeje a troca de domínio da produção com backup e rollback.

## Configuração local
```powershell
# PowerShell, a partir da pasta do projeto:
$env:PORT="3000"
$env:BASE_PATH=""
node index.js
```

## HTTPS local?
O endereço `http://localhost:3000` é o modo de desenvolvimento. HTTPS local pode ser configurado posteriormente com proxy e certificado de desenvolvimento, mas **não é necessário para criar e testar o esqueleto**. Para o público, a operação deve exigir HTTPS legítimo.

## Fontes de configuração
- https://king.host/wiki/artigo/nodejs-na-kinghost/
- https://king.host/wiki/artigo/como-criar-uma-aplicacao-nodejs/
- https://king.host/node-js

O plano contratado e a instalação efetiva do certificado devem ser confirmados no painel KingHost; documentação genérica não garante que a opção esteja habilitada em uma conta específica.
