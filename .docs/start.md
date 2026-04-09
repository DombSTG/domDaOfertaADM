# Contexto da Refatoração (Correção de Bugs)
Tivemos um problema de timeout no último comando. Vamos resolver os dois bugs passo a passo.

# Bug 1: Cache Agressivo no Next.js (SSG vs SSR)
Em produção (`npm run start`), a fila de aprovação não está refletindo as mudanças do banco de dados porque a página está sendo cacheada estaticamente.
**Ação:**
- Abra a página onde a lista de ofertas pendentes é buscada (provavelmente `app/page.tsx`).
- Adicione a seguinte diretiva no topo do arquivo para forçar a renderização dinâmica (Server-Side Rendering):
  `export const dynamic = 'force-dynamic';`
- Certifique-se de que a Server Action (`src/actions/offer-actions.ts`) está chamando `revalidatePath('/')` corretamente no final da função.

# Bug 2: UI Dinâmica Baseada em Status
Esqueça os caminhos absolutos do DOM. Preciso que você aplique estilos dinâmicos baseados no campo `status` da oferta.
**Ação:**
- Localize o componente que exibe o Status da oferta (provavelmente um `<Badge>` no `OfferListItem.tsx` ou `OfferDetailDialog.tsx`).
- Mude o Tailwind para renderizar condicionalmente as cores:
  - Se `status === 'pending'`: bg-yellow-500/20 e text-yellow-500 (ou similar em amarelo).
  - Se `status === 'approved'`: verde.
  - Se `status === 'rejected'`: vermelho.