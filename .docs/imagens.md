# Contexto da Refatoração de UI (Correção de Layout)
As imagens dos produtos no `OfferCard.tsx` não possuem restrição de altura. Imagens muito grandes ou verticais estão empurrando o conteúdo para baixo, quebrando o layout do modal e escondendo os botões de ação.

# Objetivo
Padronizar o tamanho da área da imagem no componente `OfferCard.tsx` para garantir consistência visual e integridade do layout, independentemente das dimensões da foto original.

# Passo Único: Estilização no OfferCard.tsx
Abra o arquivo `src/components/OfferCard.tsx` (que é renderizado dentro do modal):

1.  Locate a tag `<img>` (ou componente `<Image>` do Next.js) que exibe o produto.
2.  **Envolva esta imagem em uma `div` de contêiner** dedicada para controle de layout.
3.  Aplique as seguintes classes Tailwind nesta nova `div` contêiner:
    * `w-full` (largura total do card).
    * `h-64` (altura fixa padrão - 256px. Ajuste para `h-80` se preferir um pouco maior, mas mantenha fixo).
    * `flex items-center justify-center` (centraliza a imagem horizontalmente e verticalmente).
    * `overflow-hidden` (garante que nada escape).
    * `bg-white` ou `bg-zinc-50` (adiciona um fundo neutro sutil caso a imagem não preencha todo o espaço).
4.  Aplique as seguintes classes diretamente na tag da **Imagem**:
    * `max-h-full` (não deixa a imagem passar da altura do contêiner).
    * `max-w-full` (não deixa passar da largura).
    * `object-contain` (**CRÍTICO:** Garante que a imagem inteira seja visível, redimensionando proporcionalmente sem cortar e sem distorcer, mantendo o aspect ratio).