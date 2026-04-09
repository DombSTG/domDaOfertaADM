# Refatoração de UI: Estilo "Linear / BJJ Protocol"
O objetivo é transformar a lista de ofertas em uma interface de alta densidade de informação, minimalista e profissional, baseada na referência image_4.png.

# Requisitos Visuais (Design System)
- **Cores:** Fundo claro, bordas muito sutis (Slate-800 ou Zinc-800). Se basear na (.docs/cores.png)
- **Tipografia:** Texto pequeno (text-sm ou text-xs), títulos em negrito suave.
- **Layout:** Linhas horizontais compactas, separadas por bordas finas no fundo.
- **Badges:** Pequenos e com cores sóbrias para indicar a Loja e o Status.

# Passo 1: Instalar Lucide React (Ícones)
Execute o comando se ainda não tiver:
- `npm install lucide-react`

# Passo 2: Refatorar OfferListItem (O Item da Lista)
Edite `src/components/OfferListItem.tsx` para seguir o layout da image_4.png:
- **Container:** Uma linha (`flex`) com altura fixa pequena, hover com background levemente mais claro, borda inferior de 1px.
- **Estrutura da Linha (da esquerda para a direita):**
  1. **Ícone/Thumbnail:** Uma imagem pequena (40x40px) com cantos levemente arredondados.
  2. **Identificador:** O nome da loja em um Badge cinza escuro (estilo `secondary` do Shadcn).
  3. **Título:** O título do produto em branco/cinza claro, com `truncate` para não quebrar linha.
  4. **Preço:** O valor em destaque (pode ser uma cor levemente diferente, como um ciano ou verde suave).
  5. **Data:** No final da linha, a data de criação com fonte bem pequena e cor muted (cinza).
- **Interação:** O cursor deve ser `pointer` e o efeito de hover deve ser imediato.

# Passo 3: Refatorar o List Container (Agrupamento)
Edite `src/components/OfferListContainer.tsx`:
- Remova qualquer espaçamento (gap) exagerado entre os itens.
- Agrupe a lista dentro de uma `div` com bordas arredondadas e borda lateral, criando esse aspecto de "bloco de tarefas" da imagem de referência.
- Adicione um cabeçalho simples acima da lista (ex: "Ofertas Ativas") com um contador ao lado (ex: "5"), exatamente como os grupos "Dash - ADM Acad" da imagem.

# Passo 4: Ajustar o Modal (Dialog)
Garanta que o `OfferDetailDialog.tsx` mantenha o tema escuro:
- O fundo do modal deve ser o mesmo Dark Deep.
- O botão de fechar (X) deve estar no canto superior direito.
- O card interno deve perder as bordas externas para se fundir ao modal.

# Passo 5: Refino de Tailwind (Global)
Certifique-se de que o `globals.css` ou as classes aplicadas usem a fonte Inter ou similar, e que o esquema de cores seja focado em tons de cinza (Zinc/Slate) para evitar um contraste "preto e branco" muito agressivo.