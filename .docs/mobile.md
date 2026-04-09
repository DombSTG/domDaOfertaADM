# Contexto da Refatoração (Mobile Responsiveness)
O painel atual ("Dom da Oferta Admin") está com excelente usabilidade no Desktop (estilo Linear), mas precisamos torná-lo 100% responsivo para uso em smartphones também. A aprovação de ofertas ocorrerá majoritariamente via Mobile.

# Objetivo
Utilizar os prefixos responsivos do Tailwind CSS (`sm:`, `md:`) para adaptar o `OfferListItem` e o `OfferDetailDialog` para telas pequenas, mantendo o design intacto no Desktop. O conceito é Mobile-First.

# Passo 1: Responsividade na Lista (OfferListItem.tsx)
Edite o arquivo `src/components/OfferListItem.tsx`:
- **Container principal:** Garanta que tenha um padding confortável para toque (`p-3` ou `p-4`). Altere o layout flex para que os itens se alinhem corretamente em telas estreitas, mas mantenha o container principal como `flex-row` para segurar a imagem na esquerda.
- **Estrutura interna:**
  - A `div` interna que contém as informações de texto (Loja, Título, Preço) deve se comportar como uma coluna (`flex-col`) no mobile, para que o preço fique abaixo do título.
  - No desktop (`md:flex-row`), eles voltam a ficar em linha.
- **Ocultar dados secundários:** A data da oferta deve ganhar a classe `hidden md:block` para sumir no celular e economizar espaço. O título do produto deve quebrar em 2 linhas no máximo no mobile (`line-clamp-2`).

# Passo 2: Responsividade no Modal (OfferDetailDialog.tsx)
Edite o arquivo `src/components/OfferDetailDialog.tsx`:
- **Largura do Modal:** O `<DialogContent>` (se estiver acessível) ou o container principal interno deve usar `w-[95vw] max-w-lg md:w-full` para ocupar quase toda a tela no celular, e ter paddings reduzidos (`p-4 md:p-6`). Cuidado com as classes padrão do `ui/dialog.tsx` para não gerar conflitos - como alternativa para melhor UX no celular, considere usar um `Drawer` (Sheet).
- **Imagem do Produto:** A `div` que envolve a imagem e que definimos com altura fixa deve se adaptar: use `h-48 sm:h-64` (menor no celular, padrão no PC).
- **Inputs e Textarea:** Garanta que os campos tenham fonte `text-base` (16px) no mobile. Tamanhos menores que 16px no iOS fazem o Safari dar zoom indesejado na tela ao digitar.
- **Botões de Ação (Aprovar/Reprovar):** A `div` que envolve os botões no rodapé deve ser alterada de `flex-row` para `flex-col sm:flex-row`. Isso fará com que no celular o botão "Aprovar" fique grande e largo em cima, e o "Reprovar" logo abaixo, facilitando o toque. No PC, voltam a ficar lado a lado.

# Passo 3: Navegação Principal e Layout (SidebarNav.tsx / layout.tsx)
- Paineis utilizando barra lateral (`Sidebar`) no desktop necessitam de adaptação no mobile onde o espaço é escasso. Considere introduzir um botão de Menu Hambúrguer (Sheet) ou uma barra de navegação inferior (Bottom Navigation).