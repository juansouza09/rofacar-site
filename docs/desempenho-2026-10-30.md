# Desempenho — Rofacar — 30/10/2026

URL avaliada: https://rofacar-site.vercel.app/
Versão publicada: dpl_3bkeoR5boULNddiTGp8aFmKbEZGx.
Avaliação somente leitura, sem alteração no site.

## Resultado

O carregamento inicial é leve, mesmo após incluir vídeos e fotos. Os vídeos não são baixados antes da reprodução. No cenário móvel de rede lenta, a imagem principal ainda ultrapassa ligeiramente a meta de bom LCP; não se pode classificar todos os cenários como excelentes.

| Medição | Resultado | Interpretação |
| --- | --- | --- |
| LCP desktop, 1440×900, CPU 1×, sem limitação de rede, cache ignorado | 169 ms | Bom na execução observada |
| LCP móvel, 390×844 DPR 3, toque, Slow 4G e CPU 4×, cache ignorado | 2868 ms de mediana; execuções 2868 / 2867 / 2875 ms | Precisa melhorar frente à meta de até 2500 ms |
| Primeiro conteúdo visível móvel (FCP), primeira execução | 1620 ms | Conteúdo começa a aparecer antes do LCP |
| Deslocamento de layout (CLS), traces de carga e interação | 0,00 na precisão da ferramenta | Estável nos testes |
| INP observado em laboratório, menu, link Serviços e FAQ, CPU 4× | 52 ms | Resposta boa nas interações amostradas |
| Transferência inicial móvel | 298653 bytes, 15 requisições | Aproximadamente 299 KB; nenhum MP4 ou domínio externo solicitado |
| Transferência acumulada após carregar a galeria | 534693 bytes, 19 requisições | Aproximadamente 535 KB; três fotos carregadas, ainda nenhum MP4 |
| Vídeos publicados | 9472567 bytes no total | 9,47 MB disponíveis sob demanda; não fazem parte do carregamento inicial |

KB/MB acima são decimais. Os tamanhos de rede incluem a estimativa de cabeçalhos fornecida pela Resource Timing API. Requisições de navegação interna podem acrescentar revalidação de favicon.

## O que foi verificado

- Chrome DevTools Performance MCP, contexto de navegador isolado e cache HTTP ignorado nas cargas.
- Três traces de carregamento móvel com as mesmas condições, um trace desktop e um trace de interação móvel.
- Resource Timing e painel de rede: zero requisições .mp4 antes de assistir, zero recursos de terceiros, preload=none nos três vídeos.
- Três fotos carregadas ao alcançar sua seção, em WebP; total dos arquivos 234840 bytes.
- JavaScript entregue comprimido: 1046 bytes de corpo; CSS 5742 bytes de corpo. Brotli confirmado no CSS e resposta da CDN Vercel HIT.
- Site estático, sem dependências de produção, framework ou scripts analíticos.
- Documento com 305 elementos; sem motivo observado para trocar arquitetura ou framework.
- Cabeçalho de cache dos assets observado: public, max-age=0, must-revalidate. Existe revalidação; não afirmar cache imutável de longa duração.

## Pontos de atenção e recomendações

1. A imagem hero.webp foi o elemento LCP móvel. Na primeira execução: TTFB 6 ms, atraso até descoberta/início do recurso 585 ms, duração da carga 2221 ms e atraso de apresentação 55 ms, segundo a divisão do trace. A maior parcela foi a transferência da imagem. Vale avaliar uma variante menor para celular e medir novamente antes de adotar.
2. As três capas dos vídeos somam 109318 bytes e são baixadas já na abertura, embora os players estejam abaixo da primeira tela. Adiar essas capas até a proximidade da seção pode retirar aproximadamente 109 KB do corpo inicial (cerca de 37% do volume observado). Isso é uma oportunidade confirmada de reduzir bytes; a melhora em milissegundos não foi medida, portanto não está prometida.
3. O vídeo de manutenção tem 5870671 bytes, aproximadamente 62% de todo o volume de vídeo. Seu impacto ocorre quando o visitante assiste. Uma versão adicional mais compacta pode ajudar conexões lentas; não se deve atribuir esse volume à abertura do site.
4. O trace sinalizou CSS bloqueante e otimizações de imagem com economia estimada de 0 ms para LCP/FCP. Não são motivo para refatoração imediata.
5. Cache prolongado pode ser considerado junto com nomes versionados de assets; acrescentar immutable a nomes fixos sem versionamento pode deixar conteúdo antigo preso no navegador.

## Limites

São testes de laboratório, não estatística de visitantes reais. A ferramenta informou ausência de dados CrUX para a página. Não foi gerada nota Lighthouse Performance de 0 a 100; não se infere essa nota a partir destes traces. INP refere-se às interações amostradas, não ao percentil 75 de usuários reais. Não houve teste em celular físico nem medição prolongada de reprodução em rede móvel real. Emulação e página temporária foram encerradas ao final.

Referências de critérios: https://web.dev/articles/vitals e https://developer.chrome.com/docs/lighthouse/performance/performance-scoring.
