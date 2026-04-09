# Contexto do Bug de Performance (Lentidão no Modal)
O clique no `<OfferListItem>` para abrir o `<OfferDetailDialog>` está muito lento. O problema arquitetural provável é a renderização de múltiplos modais na DOM (um para cada item da lista).

# Objetivo da Refatoração: "Single Dialog Pattern"
Precisamos refatorar o gerenciamento de estado para garantir que exista **apenas um único `<Dialog>` renderizado na página**, que recebe dinamicamente os dados do item clicado.

# Passo 1: Criar um Client Component Container
Como `app/page.tsx` geralmente é um Server Component (pois faz o fetch no banco), crie um novo componente `src/components/OfferListContainer.tsx` (marcado com `"use client"`).
- Ele deve receber a lista de ofertas pendentes (buscadas no banco) como `prop`.
- Ele deve gerenciar o estado do modal: `const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)`.

# Passo 2: Refatorar o OfferListItem
Abra o `src/components/OfferListItem.tsx`:
- Remova qualquer importação ou uso do `<Dialog>` ou `<OfferDetailDialog>` de dentro dele.
- Ele deve ser apenas um componente visual burro (Dumb Component).
- Receba uma prop `onClick: () => void`. Ao clicar na linha da lista, dispare essa função.

# Passo 3: Montar o Container
No `OfferListContainer.tsx`:
- Renderize a lista (map) de `<OfferListItem />`, passando `onClick={() => setSelectedOffer(offer)}`.
- Fora do map (no final do container), renderize **apenas um** `<OfferDetailDialog />`.
- Passe o `selectedOffer` para este modal e controle a abertura/fechamento dele (ex: `isOpen={!!selectedOffer}` e `onClose={() => setSelectedOffer(null)}`).

# Passo 4: Limpar a Página Principal
No `app/page.tsx`:
- Mantenha apenas a busca no banco de dados via Drizzle.
- Passe o array de resultados para o novo `<OfferListContainer initialOffers={pendentes} />`.