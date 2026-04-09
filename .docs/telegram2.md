# Enviar Imagem e Botão no Telegram

Para enviar a imagem da oferta junto com a mensagem formatada e o botão clicável, precisamos alterar a API do Telegram utilizada de `sendMessage` para `sendPhoto`. O texto da mensagem passará a ser enviado como a \`caption\` da foto.

## Passo 1: Atualizar o arquivo \`lib/telegram.ts\`

1. Na interface/tipo \`TelegramMessageData\`, adicione a propriedade \`imageUrl: string | null\`.
2. Mude a lógica do \`fetch\` para decidir dinamicamente entre o endpoint \`sendPhoto\` ou \`sendMessage\`.
3. Caso a imagem exista, envie a imagem na propriedade \`photo\` e o texto na propriedade \`caption\`.

**Código final em \`lib/telegram.ts\`:**

\`\`\`typescript
export type TelegramMessageData = {
  title: string;
  oldPrice: string | null;
  currentPrice: string | null;
  copyText: string;
  url: string;
  imageUrl: string | null;
}

export async function sendTelegramMessage(data: TelegramMessageData) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error("Faltam variáveis de ambiente do Telegram.");
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // 1. Montar a mensagem em HTML
  let message = \`<b>\${data.title}</b>\n\n\`;
  
  if (data.oldPrice && data.oldPrice !== data.currentPrice) {
    message += \`De R$ \${data.oldPrice} POR R$ \${data.currentPrice}\n\n\`;
  } else {
    message += \`POR R$ \${data.currentPrice}\n\n\`;
  }
  
  if (data.copyText) {
    message += \`\${data.copyText}\n\n\`;
  }

  // 2. Criar o botão Inline (Ver oferta)
  const replyMarkup = {
    inline_keyboard: [[{ text: "🛒 Ver oferta", url: data.url }]]
  };

  // 3. Definir endpoint e payload baseado na existência da imagem
  const endpoint = data.imageUrl ? 'sendPhoto' : 'sendMessage';
  
  const payload: any = {
    chat_id: chatId,
    parse_mode: 'HTML',
    reply_markup: replyMarkup
  };

  if (data.imageUrl) {
    payload.photo = data.imageUrl; // URL ou ID da foto
    payload.caption = message;     // Texto vira a legenda da foto
  } else {
    payload.text = message;        // Mensagem normal se não tiver foto
  }

  // 4. Efetuar disparo da requisição
  const res = await fetch(\`https://api.telegram.org/bot\${token}/\${endpoint}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao enviar mensagem para o Telegram:", error);
  }
}
\`\`\`

---

## Passo 2: Atualizar o arquivo \`src/actions/offer-actions.ts\`

Na função \`approveOffer\`, onde efetuamos o disparo da função acima, é preciso incluir o campo \`imageUrl\` (recebido da busca via \`.returning()\`) ao chamar \`sendTelegramMessage\`.

**Alteração em \`src/actions/offer-actions.ts\`:**

\`\`\`typescript
  if (updatedOffer) {
    try {
      await sendTelegramMessage({
        title: updatedOffer.title,
        oldPrice: updatedOffer.oldPrice,
        currentPrice: updatedOffer.currentPrice,
        copyText: updatedOffer.copyText ?? '',
        url: updatedOffer.originalUrl,
        imageUrl: updatedOffer.imageUrl, // <--- NOVA LINHA ADICIONADA
      });
    } catch (err) {
      console.error("Falha ao enviar mensagem para o Telegram:", err);
    }
  }
\`\`\`
"@