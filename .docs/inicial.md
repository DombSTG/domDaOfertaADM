# Contexto do Projeto
Atue como um Engenheiro de Software Sênior (Especialista em Front-end e Next.js).
Estamos construindo o "Dom da Oferta Admin", um painel de retaguarda (backoffice) em Next.js (App Router) para gerenciar um grupo de descontos.

O banco de dados PostgreSQL (Neon) já está configurado na pasta `src/db` utilizando Drizzle ORM. A tabela `offers` já possui os campos: `id`, `title`, `price`, `original_url`, `image_url` e `status` (pending, approved, rejected).

# Objetivo da Tarefa
Criar a interface da "Fila de Aprovação". O painel deve listar todas as ofertas com `status = 'pending'`, permitindo que o administrador (usuário) edite o título, adicione um texto promocional (copy) e aprove a oferta.

# Tech Stack e UX
- Framework: Next.js (App Router)
- Estilização: Tailwind CSS
- Componentes: Shadcn/ui
- Mutações (Banco de Dados): Next.js Server Actions

# Passo 1: Inicialização do Shadcn
Antes de escrever o código da página, execute os comandos no terminal para inicializar o Shadcn e instalar os componentes necessários:
1. `npx shadcn@latest init` (use o estilo 'New York' e a cor 'Zinc' se perguntado).
2. Adicione os seguintes componentes: `card`, `button`, `input`, `textarea`, `badge` e `sonner` (para toast notifications).

# Passo 2: Server Actions (Backend)
Crie um arquivo `src/actions/offer-actions.ts` contendo:
1. Uma Server Action assíncrona chamada `approveOffer(id: string, newTitle: string, copyText: string)`.
2. Essa função deve usar o Drizzle para fazer um `UPDATE` na tabela `offers` onde o ID seja correspondente.
3. O update deve alterar o `status` para `'approved'` e atualizar o `title` e salvando o `copyText`
4. Crie também uma Server Action assíncrona chamada `rejectOffer(id: string)`. Ela deve fazer um `UPDATE` alterando o `status` para `'rejected'` (Isso limpa a oferta da fila de pendentes).
5. Retorne `revalidatePath('/')` no final da action para atualizar a tela automaticamente.

# Passo 3: Componente de UI (Client Component)
Crie o componente `src/components/OfferCard.tsx` (marcado com `"use client"`):
- Ele deve receber a oferta como `prop`.
- Deve renderizar um `Card` do Shadcn contendo a imagem do produto, título original e preço.
- Deve conter um `Input` para editar o título e um `Textarea` para escrever o texto (copy) do grupo de ofertas.
- No rodapé do Card, adicione dois botões alinhados:
  1. "Aprovar" (variante default): Chama a action `approveOffer` e dispara um Toast de sucesso usando o `sonner`.
  2. "Reprovar" (variante 'destructive'): Chama a action `rejectOffer` e dispara um Toast informando que a oferta foi descartada.

# Passo 4: A Página Principal (Server Component)
Edite o arquivo `app/page.tsx`:
- Faça a busca no banco de dados direto no servidor usando Drizzle: `select().from(offers).where(eq(offers.status, 'pending'))`.
- Renderize um layout em Grid.
- Mapeie o array de resultados renderizando o componente `<OfferCard />` para cada item.
- Adicione um cabeçalho simples usando tipografia do Tailwind (ex: "Fila de Aprovação").