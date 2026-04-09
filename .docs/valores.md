# Contexto da Atualização de UI/UX
O web scraper ocasionalmente captura o preço errado do DOM. Precisamos adicionar no modal de detalhes (`OfferDetailDialog.tsx`) uma forma do administrador visualizar o produto original na loja e corrigir o preço no banco de dados antes da aprovação.

# Passo 1: Nova Server Action (Backend)
Abra `src/actions/offer-actions.ts`:
- Crie e exporte uma nova função assíncrona: `updateOfferPrice(id: string, newPrice: number | string)`.
- Use o Drizzle para fazer um `UPDATE` na tabela `offers`, alterando apenas o campo `price` para o `id` correspondente.
- Finalize com `revalidatePath('/')` para garantir que o cache da página seja atualizado.

# Passo 2: Atualizar o Modal (Frontend)
Abra `src/components/OfferDetailDialog.tsx`.

**A. Adicionar Link do Produto Original:**
- Logo abaixo do título original do produto (ou ao lado do nome da loja), adicione um link âncora `<a>` ou `<Link>` do Next.js apontando para `offer.original_url`.
- Use o atributo `target="_blank"` e `rel="noopener noreferrer"`.
- Use o ícone `<ExternalLink />` do `lucide-react` com o texto "Abrir na Loja" (estilo texto pequeno e sublinhado no hover).

**B. Adicionar Campo de Correção de Preço:**
- Crie um estado local para controlar o valor do input: `const [editedPrice, setEditedPrice] = useState(offer.price)`.
- Acima do campo "Título do Grupo", adicione um novo bloco de formulário contendo:
  - Uma `Label` (ex: "Corrigir Preço da Oferta").
  - Uma `div` com `className="flex gap-2"`.
  - Dentro dessa div, um `<Input>` do Shadcn que leia o valor de `editedPrice` e permita edição (`onChange`).
  - Ao lado do Input, um `<Button type="button" variant="secondary">` escrito "Atualizar BD".
- **Interação:** Ao clicar no botão "Atualizar BD", a função deve chamar a server action `updateOfferPrice(offer.id, editedPrice)`. Exiba um Toast de sucesso (`sonner`) dizendo "Preço atualizado com sucesso!".