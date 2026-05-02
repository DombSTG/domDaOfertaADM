# Design Novo — Mapeamento de Implementação (Admin)

Stack existente, estado atual e o que o redesign precisa trazer.

---

## Stack do projeto (NÃO mudar)

- Next.js + TypeScript + Tailwind CSS
- Componentes feature em `src/components/`
- Componentes base (design system) em `components/ui/`
- Página principal do admin em `app/admin/`
- Estilos globais e tokens em `app/globals.css`
- DB: Drizzle ORM (`src/db/db.ts`, `src/db/schema.ts`)
- Server actions em `src/actions/`
- Auth: JWT em cookie httpOnly (7 dias)

---

## O que já existe vs. o que o redesign traz

| Feature | Atual | Redesign |
|---|---|---|
| Login page | ✅ Implementado | Ajustes visuais |
| Sidebar (desktop, 220px) | ✅ Implementado | Idêntico |
| BottomNav (mobile) | ✅ Implementado | Idêntico |
| MobileDrawer | ✅ Implementado | Idêntico |
| FAB mobile (adicionar oferta) | ✅ Implementado | Idêntico |
| Fila de aprovação (`/admin`) | ✅ Implementado | Ajustes visuais no item da lista |
| Views por status (aprovadas / rejeitadas / todas) | ✅ Implementado | Idêntico |
| OfferListItem (linha da lista) | ✅ Implementado | Ver seção OfferListItem |
| OfferDetailDialog (modal de detalhe) | ✅ Implementado | Ver seção OfferCard |
| OfferCard (conteúdo do modal) | ✅ Implementado | Ver seção OfferCard |
| AddOfferDialog (criar oferta) | ✅ Implementado | Idêntico |
| Gerenciamento de membros | ✅ Implementado | Idêntico |
| Busca por texto | ❌ Não existe | ✅ Novo: input de busca no header da lista |
| Histórico de preços | ❌ Não existe | ✅ Novo: accordion no OfferCard |
| Rating e reviews | ❌ Não existe (campos no DB) | ✅ Novo: exibir no OfferCard |
| Copy text com preview | ⚠️ Parcial (campo existe, sem preview) | ✅ Melhorar: preview formatado do texto do Telegram |
| Contagem por status | ❌ Não existe | ✅ Novo: badge de contagem nos links da nav |

---

## Tokens de cor — estado atual (globals.css)

O projeto usa `oklch` com dark mode via `@media (prefers-color-scheme: dark)`.

| Papel | Token | Light | Dark |
|---|---|---|---|
| Fundo | `--background` | `oklch(1 0 0)` branco | `oklch(0.145 0 0)` quase preto |
| Foreground | `--foreground` | `oklch(0.18 0 0)` | `oklch(0.985 0 0)` |
| Sidebar bg | `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| Accent / violet | `--sidebar-primary` | `oklch(0.488 0.243 264)` violet-600 | igual |
| Destructive | `--destructive` | `oklch(0.577 0.245 27)` vermelho | igual |
| Borda | `--border` | `oklch(0.92 0 0)` | `oklch(0.26 0 0)` |
| Input | `--input` | `oklch(0.92 0 0)` | `oklch(0.26 0 0)` |
| Ring focus | `--ring` | `oklch(0.75 0 0)` | `oklch(0.44 0 0)` |

**Decisão:** manter todos os tokens atuais. Nenhuma adição necessária para o redesign.

---

## Schema do DB — estado atual e ajustes

Campos da tabela `offers` já existentes:

```
id             uuid PK
store          varchar(100)     required
category       varchar(100)
title          varchar(500)     required
currentPrice   numeric(10,2)   required
oldPrice       numeric(10,2)
originalUrl    varchar(2048)   unique required
affiliateUrl   varchar(2048)
imageUrl       varchar(2048)
status         enum(pending|approved|rejected)  default: pending
copyText       text
rating         numeric(3,1)     — campo existe, não exibido na UI
reviews        integer          — campo existe, não exibido na UI
createdAt      timestamp        auto
approvedAt     timestamp
```

Tabela `price_history` já existe (offerId, currentPrice, oldPrice, createdAt) mas **não é exibida na UI**.

**Ajustes necessários:** nenhuma migration nova. Usar campos existentes que ainda não têm UI.

---

## Features a implementar (ordem sugerida)

### 1. Exibir rating e reviews no OfferCard

- Nos campos do OfferCard, se `rating` ou `reviews` existir, exibir abaixo do título
- Formato: `★ 4.7  (28.451 avaliações)`
- Estrela com `text-yellow-400`, número em foreground, reviews em muted
- Não bloquear aprovação se vazio — campos opcionais

### 2. Histórico de preços no OfferCard

- Accordion ou seção colapsável "Histórico de preços" no rodapé do OfferCard
- Buscar `price_history` pelo `offerId` via server action
- Exibir tabela simples: data · preço atual · preço antigo
- Ordenar mais recente primeiro

### 3. Preview do copy do Telegram no OfferCard

- O campo `copyText` existe e é editável, mas o resultado final não é visualizável
- Adicionar toggle "Preview" ao lado do textarea do copyText
- Preview mostra o HTML que o Telegram vai renderizar (bold, strikethrough, link)
- Usar `dangerouslySetInnerHTML` com sanitização mínima (apenas tags do Telegram: `<b>`, `<s>`, `<a>`)

### 4. Busca por texto na lista

- Input no header de cada `OfferListPage` (`placeholder="Buscar por título ou loja…"`)
- Filtro client-side no array de ofertas — não precisar de server round-trip
- Limpar busca com botão X no input
- Estado em `useState` no `OfferListPage`

### 5. Badge de contagem nos links da nav

- `SidebarNav` e `BottomNav` recebem `counts: Record<string, number>`
- Contar `pending`, `approved`, `rejected`, `total` no `app/admin/layout.tsx`
- Exibir badge `<span>` pequeno ao lado do label (só se count > 0)
- Fila (`pending`): badge vermelho — indica urgência de aprovação
- Demais: badge cinza

---

## Componentes — estrutura atual (referência)

### `OfferListItem` (linha da lista)
```
div (onClick → abre modal)
  span.status-dot (cor por status: amarelo/verde/vermelho)
  img 28x28px (thumbnail, object-cover)
  span.store-badge (texto da loja)
  span.title (line-clamp-2 mobile, line-clamp-1 desktop)
  span.price (currentPrice formatado)
  span.date (hidden mobile, createdAt)
```

### `OfferCard` (conteúdo do modal)
```
div.offer-card
  img (h-40 / sm:h-52, object-contain)
  div.fields
    textarea title (auto-resize)
    textarea copyText + [NOVO: toggle preview]
    input currentPrice + botão atualizar
    input oldPrice + botão atualizar
    input affiliateUrl + botão atualizar
    [NOVO] rating + reviews (readonly, se existir)
    [NOVO] accordion price_history
  div.actions
    button Aprovar (violet)
    button Rejeitar (destructive)
```

### `OfferDetailDialog` (wrapper)
```
Dialog (bottomSheet no mobile, sm:max-w-sm desktop)
  OfferCard
```

### `SidebarNav`
```
nav
  links (5 itens) [NOVO: + badge contagem]
  button "Adicionar Oferta" (violet)
  form logout
```

---

## Arquivos que serão tocados por feature

| Feature | Arquivos |
|---|---|
| Rating/reviews | `src/components/OfferCard.tsx` |
| Histórico de preços | `src/components/OfferCard.tsx`, `src/actions/offer-actions.ts` (nova action) |
| Preview copy Telegram | `src/components/OfferCard.tsx` |
| Busca por texto | `src/components/OfferListPage.tsx` |
| Badge contagem nav | `app/admin/layout.tsx`, `src/components/SidebarNav.tsx`, `src/components/BottomNav.tsx`, `src/lib/nav-links.tsx` |
