# Plan: Atualizar Histórico de Preços
O objetivo é garantir que, quando você clique em "Atualizar BD" para corrigir o preço original ou atual no frontend, a correção seja aplicada somente à oferta e ao seu registro mais recente na tabela de histórico, mantendo eventuais preços anteriores intocados.

## Steps

1. **Atualizar as importações:** Incluir `priceHistory` de `src/db/schema` e a função de ordenação `desc` do Drizzle ORM no arquivo das actions.
2. **Modificar a função `updateOfferPrice`** (que atualiza o preço original - `oldPrice`):
   - Consultar apenas o último registro da tabela `price_history` relacionado a esse id de oferta, ordenando por data de criação (`createdAt`) em ordem decrescente (com limit=1).
   - Caso um registro seja encontrado, rodar um `update` na tabela `price_history` para atualizar o `oldPrice` no ID desse último histórico encontrado.
3. **Modificar a função `updateOfferCurrentPrice`** (que atualiza o preço de oferta - `currentPrice`):
   - Seguir a exata mesma lógica (encontrar o último histórico), entretanto atualizando a coluna `currentPrice`.

## Relevant files

- `offer-actions.ts` — Modificar as funções `updateOfferPrice` e `updateOfferCurrentPrice` para incluir as operações extras no banco (busca e atualização do histórico); Adicionar imports necessários (`priceHistory`, `desc`).

## Verification

1. Abrir a tela onde está o componente de oferta (`OfferCard`).
2. Digitar o preço correto e clicar no respectivo botão "**Atualizar BD**".
3. Verificar no banco de dados se a tabela `offers` foi atualizada com sucesso.
4. Conferir a tabela `price_history`: o registro mais recente referente a esta oferta deve exibir a alteração de preço salva, enquanto antigos registros dessa mesma oferta não podem ser afetados pelas alterações.

## Decisions

- Foi optado pela abordagem de busca simplificada no Drizzle ("Find-then-Update"): primeiro pegamos o ID do último item adicionado no histórico e, sucessivamente, atualizamos apenas ele no banco. Isso evita manipulações verbosas de SQL puro e foca em legibilidade do código.