# Contexto da Feature (Alterar Senha)
O sistema de autenticação via JWT está funcionando, mas o usuário logado precisa de uma forma de alterar sua própria senha por dentro do painel.

# Passo 1: Server Action (src/actions/auth-actions.ts)
Abra o arquivo de actions de autenticação e adicione a função `changePassword(formData: FormData)`:
1. Obtenha o usuário logado lendo o cookie JWT (você precisará decodificar o token para pegar o ID do usuário).
2. O formulário receberá `currentPassword` e `newPassword`.
3. Busque o usuário no banco, valide a `currentPassword` usando `bcryptjs.compare`.
4. Se bater, faça o hash da `newPassword` usando `bcryptjs.hash(newPassword, 12)`.
5. Faça um `UPDATE` no Drizzle alterando o `passwordHash` do usuário.
6. Retorne um objeto de sucesso ou jogue um erro para ser capturado pela UI.

# Passo 2: UI (src/components/ChangePasswordModal.tsx)
Crie um Client Component que renderiza um `<Dialog>` do Shadcn:
1. O modal deve conter um formulário simples com "Senha Atual", "Nova Senha" e "Confirmar Nova Senha".
2. Valide no frontend se "Nova Senha" e "Confirmar Nova Senha" são iguais.
3. Ao submeter, chame a Server Action `changePassword`.
4. Use o `sonner` para disparar um Toast de Sucesso ("Senha alterada!") ou Erro ("Senha atual incorreta").
5. Ao dar sucesso, feche o modal.

# Passo 3: Integração na pagina Membros
1. Adicione um botão de alterar senha no card dos membros utilizando shadcn, com um ícone de chave/cadeado do `lucide-react`
2. Esse botão deve abrir o `ChangePasswordModal` que criamos no Passo 2.
