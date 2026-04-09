# Contexto da Integração (Telegram)
Precisamos integrar o envio de mensagens para o Telegram diretamente na Server Action de aprovação de ofertas do nosso dashboard Next.js.

# Passo 1: Variáveis de Ambiente
Adicione (ou assuma que existem) as seguintes variáveis no `.env`:
- `TELEGRAM_BOT_TOKEN="seu_token_aqui"`
- `TELEGRAM_CHAT_ID="id_do_seu_grupo_aqui"`

Validação de Variáveis de Ambiente:
No arquivo telegram.ts, adicione uma pequena verificação logo no início da função para garantir que as variáveis existam. Isso ajuda no debug se você esquecer as variáveis em produção:

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
  console.error("Faltam variáveis de ambiente do Telegram.");
  return;
}


# Passo 2: Criar o Serviço do Telegram
edite o arquivo `lib/telegram.ts`:
- Crie uma função assíncrona `sendTelegramMessage(message: string)`.
- A função deve fazer um simples `fetch` (método POST) para a API oficial do Telegram: `https://api.telegram.org/bot${token}/sendMessage`.
- O payload (JSON) deve conter `chat_id` e `text`.
- **Não adicione nenhum** `parse_mode`. O envio como texto puro é a melhor abordagem para mensagens digitadas no celular, garantindo que emojis, quebras de linha e símbolos não quebrem a API. O Telegram já transforma qualquer URL inclusa no final do texto em um link clicável automaticamente.

# Passo 3: Integrar na Server Action
Abra o arquivo `src/actions/offer-actions.ts`:
- Na função `approveOffer(id, newTitle, copyText)`, logo **após** fazer o `UPDATE` no banco de dados com o Drizzle (mudando o status para 'approved').
- Chame a função `await sendTelegramMessage(copyText)`.
- Adicione um bloco try/catch ao redor do envio do Telegram para garantir que, se a API do Telegram falhar, o servidor não quebre (mas faça um console.error para log).