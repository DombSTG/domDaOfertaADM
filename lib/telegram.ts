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

  let message = `<b>${data.title}</b>\n\n`;

  if (data.oldPrice && data.oldPrice !== data.currentPrice) {
    message += `De <s>R$ ${data.oldPrice}</s> POR <b>R$ ${data.currentPrice}</b>\n\n`;
  } else {
    message += `POR <b>R$ ${data.currentPrice}</b>\n\n`;
  }

  if (data.copyText) {
    message += `${data.copyText}\n\n`;
  }

  const replyMarkup = {
    inline_keyboard: [[{ text: "🛒 Ver oferta", url: data.url }]]
  };

  const endpoint = data.imageUrl ? 'sendPhoto' : 'sendMessage';

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    parse_mode: 'HTML',
    reply_markup: replyMarkup
  };

  if (data.imageUrl) {
    payload.photo = data.imageUrl;
    payload.caption = message;
  } else {
    payload.text = message;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao enviar mensagem para o Telegram:", error);
  }
}
