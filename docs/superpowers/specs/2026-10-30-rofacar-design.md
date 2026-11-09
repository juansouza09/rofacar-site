# Rofacar — direção e responsabilidades

Leitura: site institucional para proprietários de veículos franceses, com linguagem automotiva sóbria, técnica e acolhedora.

Escolha: página estática editorial, conteúdo relevante no HTML e JavaScript somente no menu móvel. Alternativas descartadas: aplicação Next.js sem necessidade dinâmica; CMS sem rotina de edição definida. Pedido do usuário autoriza planejar e executar; não há aprovação intermediária adicional.

Design atualizado a pedido do usuário: preservar grafite #111315 e vermelho #cf302c, incorporar azul #32358d e branco #f5f6f8 a partir da identidade vista na captura do Facebook. Faixa tricolor fina, detalhe na assinatura, painel azul de manutenção e títulos pontuais em azul; sem substituir a atmosfera original. Logotipo tipográfico provisório, sem afirmar reprodução da marca oficial.

Responsividade: conteúdo de uma coluna no celular; navegação móvel recolhível; alvos de pelo menos 44px; contatos com quebra de texto; imagem com dimensões e pontos de corte adequados.

Acessibilidade: HTML semântico, um H1, foco visível, link de salto, menu com aria-expanded, fechamento com Escape, formulário desnecessário, FAQ com details/summary. Sem animações essenciais; respeitar prefers-reduced-motion.

Movimento: título revelado por linhas, entrada suave das seções ao cruzar o viewport, sem interceptar o scroll. Conteúdo sempre presente e visível sem JavaScript ou sem suporte a IntersectionObserver. Marcas Peugeot, Citroën e DS em carrossel contínuo com botão Pausar/Retomar, pausa por hover/foco e apresentação estática em movimento reduzido. Duplicata visual oculta de leitores de tela. Referência visual: Text Reveal e guia de marquee do 21st.dev; implementação própria em CSS/JS, sem instalar React ou copiar componente restrito a conta.

WhatsApp: botão textual com ícone na área de contato, substituindo o telefone grande, e ícone flutuante acessível. Legenda visível da imagem removida por pedido explícito do usuário; origem gerada preservada em docs/pesquisa.md. A imagem não é apresentada como registro da oficina.

Responsabilidades: conteúdo e confirmação comercial pelo proprietário; implementação, testes e configuração pelo projeto; hospedagem/TLS pela Vercel após autenticação; DNS apenas quando domínio e autorização forem fornecidos. Contato ocorre no telefone ou aplicativo de e-mail do visitante. Sem envio de mensagens automático.

SEO: título e descrição local, Open Graph com imagem local, JSON-LD AutoRepair com dados pesquisados. Não inventar URL canônica antes do domínio real. Página de privacidade descreve o funcionamento real, sem alegar conformidade jurídica auditada.

Critérios e pendências: PRODUCT.md e docs/pesquisa.md.
