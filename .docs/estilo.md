# Contexto da Refatoração de UI
Atualmente, a interface da "Fila de Aprovação" (app/page.tsx) exibe uma grade de cards complexos (image_2.png), onde todos os detalhes e formulários já estão visíveis.

# Objetivo
Refatorar a UI para um padrão "Lista-Detalhe", onde a página exibe uma lista limpa e vertical das ofertas pendentes (inspirada na interface image_3.png). Ao clicar em um item da lista, os detalhes completos e o formulário de aprovação (o card original da image_2.png) devem ser abertos em um modal (Dialog).

# Reference Visual
Use o estilo de lista do BJJ Protocol (.docs/image_3.png) como inspiração para os itens da lista, mas muito mais simples:
- Uma linha vertical limpa para cada item.
- Um contêiner de caixa clean.
- Foto/ícone pequeno na esquerda.
- Informações principais (Nome da loja, Título curto, Preço) centralizadas.
- Detalhes (Data, Badge de status) na direita.

# Passo 1: Instalar componente de Dialog do Shadcn
Execute o comando terminal:
- `npx shadcn@latest add dialog`

# Passo 2: Criar o Novo Componente de Item da Lista
Crie o arquivo `src/components/OfferListItem.tsx` (marcado com `"use client"`):
- Ele deve receber a oferta como `prop`.
- **UI do Item:** Renderize uma linha de lista limpa e horizontal (usando Shadcn layout):
  - **Esquerda:** Thumbnail pequena da imagem do produto.
  - **Centro:** Conteúdo da oferta: Badge do nome da loja, Título do produto (curto e truncado), Preço principal.
  - **Direita:** Detalhes: Badge de status 'pending' (pode ser cinza), Data de criação (formata de image_2.png).
- **Interação:** Todo o item da lista deve ser clicável e, ao ser clicado, deve disparar a abertura do modal de detalhes.

# Passo 3: Refatorar a Página Principal (app/page.tsx)
Edite o arquivo `app/page.tsx`:
- Remova a renderização direta do `<OfferCard />` (image_2.png).
- Substitua por uma lista vertical de `<OfferListItem />`.
- Gerencie o estado para saber qual oferta está selecionada para exibição detalhada.

# Passo 4: Criar o Componente de Modal de Detalhes
Crie um novo componente `src/components/OfferDetailDialog.tsx` (marcado com `"use client"`):
- Use o componente Shadcn `Dialog`.
- Ele deve receber a oferta como `prop` e um booleano `isOpen` para controlar a exibição.
- Dentro do conteúdo do `Dialog`, renderize o componente `<OfferCard />` original (image_2.png). Não é necessário refatorar o `<OfferCard />` internamente, apenas sua colocação.

# Passo 5: Integração no App Page
No arquivo `app/page.tsx`, integre o modal:
- Quando um `<OfferListItem />` for clicado, atualize o estado para abrir o `<OfferDetailDialog />` com os dados da oferta clicada.
- Certifique-se de que os Server Actions de aprovação e reprovação (definidos anteriormente) ainda funcionem corretamente de dentro do card no modal.