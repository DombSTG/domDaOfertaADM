export type TelegramMessageData = {
  title: string;
  oldPrice: string | null;
  currentPrice: string | null;
  copyText: string;
  url: string;
}

export async function sendTelegramMessage(data: TelegramMessageData) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error("Faltam variáveis de ambiente do Telegram.");
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  let message = `<b>${data.title}</b>\n\n`;

  if (data.oldPrice) {
    message += `De R$ ${data.oldPrice} POR R$ ${data.currentPrice}\n\n`;
  } else {
    message += `POR R$ ${data.currentPrice}\n\n`;
  }

  if (data.copyText) {
    message += `${data.copyText}\n\n`;
  }

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "🛒 Ver oferta",
          url: data.url
        }
      ]
    ]
  };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao enviar mensagem para o Telegram:", error);
  }
}
