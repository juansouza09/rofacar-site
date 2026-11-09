# Rofacar Serviços Automotivos

Site institucional estático em português para Peugeot, Citroën, DS e utilitários Jumpy, Expert e Fiat Scudo. Inclui versão móvel, navegação por teclado, FAQ, WhatsApp **(11) 95029-5595**, telefone, e-mail, rota e link para **@rofacarservice**.

Publicado: https://rofacar-site.vercel.app/ — projeto `rofacar-site`, conta `juuanpablo2004-8553s-projects`.

## Executar

Requisitos: Node.js 20.19+ e Python 3 para o servidor local.

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:4173. O site funciona sem instalar dependências de produção. Os pacotes de desenvolvimento são usados para testes e fontes.

```sh
npm run check
npm audit --audit-level=moderate
```

## Publicar na Vercel

1. Confirme os dados comerciais registrados em `docs/pesquisa.md`.
2. Verifique a conta com `vercel whoami`; use `vercel login` se a sessão tiver expirado.
3. Execute `vercel --project rofacar-site --scope juuanpablo2004-8553s-projects` nesta pasta para criar um preview. Confira a conta selecionada. Não selecione serviços pagos.
4. Inspecione o preview no celular e no desktop. Confira menu, FAQ, links externos, telefone, e-mail e página de privacidade.
5. Para publicar a versão aprovada, execute `vercel --prod --project rofacar-site --scope juuanpablo2004-8553s-projects`.

Configuração existente: framework **Other**, sem build, diretório de saída **public**. Documentação e testes não são publicados. Nenhum domínio foi comprado ou alterado. Não adicione o site a um projeto antigo de outra empresa.

URL canônica, imagem absoluta Open Graph, JSON-LD, robots e sitemap utilizam `https://rofacar-site.vercel.app`. Atualize todos ao conectar um domínio personalizado autorizado.

## Conteúdo e manutenção

- `public/index.html`: conteúdo, contatos, metadados e dados estruturados. Ao alterar telefone/endereço, atualizar todos os locais e o teste correspondente.
- `public/styles.css`: identidade visual, layout móvel e acessibilidade.
- `public/main.js`: menu móvel, pausa do carrossel e entrada das seções; sem coleta de dados.
- `public/privacidade.html`: descrição dos recursos reais de privacidade.
- `public/404.html`: página de erro na Vercel.
- `public/assets/`: imagem gerada, fontes e ícones Simple Icons com suas licenças.
- `vercel.json`: diretório público e cabeçalhos de segurança.
- `tests/site.test.js`: verificações de interação no DOM e integridade.
- `docs/pesquisa.md`: fontes, divergências e informações a confirmar.
- `docs/superpowers/specs/2026-10-30-rofacar-design.md`: decisões de design e responsabilidades.
- `docs/superpowers/plans/2026-10-30-rofacar.md`: plano e estado de execução.

## Estado verificado

Nove testes passaram, incluindo carrossel, movimento reduzido, entrada de seções e WhatsApp flutuante; análise sintática do JavaScript passou. Revisão independente sem achados acionáveis. Navegador disponível na revisão visual: conferidos layouts de 390px e 1440px, ausência de overflow também em 320px, imagens carregadas, menu móvel e pausa/retomada do carrossel. Console sem erros ou avisos na sessão local. Movimento reduzido coberto por testes DOM e CSS, sem emulação no navegador. Core Web Vitals e envio de mensagens não foram medidos/testados.

O acesso direto ao Instagram retornou HTTP 429. Capturas posteriormente fornecidas pelo cliente permitiram ler a bio e confirmar WhatsApp, endereço e utilitários; posts e destaques não foram inspecionados. A conta Vercel foi reconectada pelo cliente e a publicação concluída em 30/10/2026. Nove recursos públicos responderam HTTP 200; rota inexistente retornou a página 404 própria; documentação, package.json e testes retornaram 404. Cabeçalhos de segurança conferidos na resposta pública.
