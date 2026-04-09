# Contexto da Feature (Autenticação JWT)
O dashboard atualmente é público. Precisamos implementar um sistema de autenticação focado em segurança e simplicidade (Custom JWT + Cookies HttpOnly) para proteger a operação.

# Nova Arquitetura de Rotas
Vamos separar a área pública da área administrativa:
- `/login`: Página pública contendo o formulário de acesso.
- `/admin`: Novo endereço do dashboard principal (mova o conteúdo atual de `app/page.tsx` para `app/admin/page.tsx`).
- `/`: Pode redirecionar automaticamente para `/admin` (que, se deslogado, vai mandar para `/login`).

# Passo 1: Atualização do Banco (src/db/schema.ts)
- Adicione uma tabela `users` com as colunas: `id` (uuid), `email` (text/varchar, unique), `password_hash` (text) e `created_at` (timestamp).
- Gere e aplique a alteração no banco executando `npx drizzle-kit push`.

# Passo 2: Server Actions de Segurança (src/actions/auth-actions.ts)
Crie um novo arquivo para concentrar a lógica de autenticação:
- Crie `login(email, password)`: Busca o usuário no banco pelo e-mail, valida a senha usando `bcryptjs.compare`. Se for válido, assina um token JWT usando a biblioteca `jose` e salva em um cookie seguro (HttpOnly, Secure, SameSite=Strict) com duração de 7 dias usando a API `cookies()` do `next/headers`.
- Crie `logout()`: Simplesmente destrói o cookie e redireciona para `/login`.

# Passo 3: O Guardião da Fronteira (middleware.ts)
Crie o arquivo `middleware.ts` na raiz do projeto (fora da pasta app/src):
- Configure o `matcher` para rodar apenas nas rotas `/admin/:path*`.
- Leia o cookie de autenticação. Se não existir, faça um `NextResponse.redirect` para a página `/login`.
- (Opcional, mas recomendado) Tente verificar a validade do JWT com o `jose` usando a sua secret.

# Passo 4: A Interface de Acesso (app/login/page.tsx)
- Crie uma tela limpa, centralizada (flex center, min-h-screen).
- Renderize um `<Card>` do Shadcn contendo inputs de E-mail e Senha, e um botão de "Entrar".
- Ao submeter, chame a Server Action `login`.
- Trate o estado de erro exibindo um toast com o componente `sonner` ("Credenciais inválidas"). Em caso de sucesso, redirecione para `/admin`.

# Passo 5: Criação do Usuário Inicial (Script Manual)
- Como não teremos tela de registro pública, crie um script temporário ou me dê o snippet de código exato que eu devo rodar (ou colocar em uma rota temporária) para cadastrar o primeiro usuário administrador com uma senha "123456" hasheada no banco.
- Adicione mais uma aba em `src/components/SidebarNav` de "Membros". Nela liste os membros da tabela users e permita o registro de novos usuários somente por ali pelo adm.


● Sem erros. Implementação completa. Aqui está o resumo do que foi feito:

  ---
  Implementação concluída

  Banco de dados:
  - Tabela users adicionada ao schema e migrada com drizzle-kit push

  Arquivos criados:
  - src/actions/auth-actions.ts — login, logout, registerUser, getSession
  - middleware.ts — protege /admin/:path*, verifica JWT, redireciona para /login
  - app/admin/layout.tsx — layout com sidebar + bottom nav
  - app/login/page.tsx — tela de login centralizada
  - app/admin/page.tsx, aprovadas/, rejeitadas/, todos/ — páginas movidas
  - app/admin/membros/page.tsx + MembrosClient.tsx — gestão de usuários

  Arquivos modificados:
  - app/layout.tsx — simplificado (sem sidebar)
  - app/page.tsx — redirect para /admin
  - src/lib/nav-links.tsx — hrefs atualizados para /admin/..., Membros adicionado
  - src/components/SidebarNav.tsx — botão "Sair" adicionado
  - src/components/BottomNav.tsx — filtra links mobile (Membros oculto no mobile)

  ---
  Criar o primeiro usuário admin

  Execute este SQL no Neon ou rode via psql:

  INSERT INTO users (id, email, password_hash)
  VALUES (
    gen_random_uuid(),
    'admin@domDaOferta.com',
    '$2b$12$t3S2DQuFR.juCUSlC50.XeKVq229Mt6hArLEqwY29fpoEvje0vSwu'
  );

  Senha: 123456 — troque pela página de Membros após o primeiro login.