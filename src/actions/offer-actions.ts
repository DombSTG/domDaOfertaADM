'use server'

import { db } from '@/src/db/db'
import { offers, priceHistory } from '@/src/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { sendTelegramMessage } from '@/lib/telegram'

export async function approveOffer(id: string, newTitle: string, copyText: string) {
  const [updatedOffer] = await db
    .update(offers)
    .set({ status: 'approved', title: newTitle, copyText })
    .where(eq(offers.id, id))
    .returning()

  if (updatedOffer) {
    try {
      await sendTelegramMessage({
        title: updatedOffer.title,
        oldPrice: updatedOffer.oldPrice,
        currentPrice: updatedOffer.currentPrice,
        copyText: updatedOffer.copyText ?? '',
        url: updatedOffer.originalUrl,
        imageUrl: updatedOffer.imageUrl,
      })
    } catch (err) {
      console.error("Falha ao enviar mensagem para o Telegram:", err)
    }
  }

  revalidatePath('/')
}

export async function updateOfferPrice(id: string, newPrice: number | string) {
  const normalized = String(newPrice).replace(',', '.')
  await db
    .update(offers)
    .set({ oldPrice: normalized })
    .where(eq(offers.id, id))

  const [lastHistory] = await db
    .select()
    .from(priceHistory)
    .where(eq(priceHistory.offerId, id))
    .orderBy(desc(priceHistory.createdAt))
    .limit(1)

  if (lastHistory) {
    await db
      .update(priceHistory)
      .set({ oldPrice: normalized })
      .where(eq(priceHistory.id, lastHistory.id))
  }

  revalidatePath('/')
}

export async function updateOfferCurrentPrice(id: string, newPrice: number | string) {
  const normalized = String(newPrice).replace(',', '.')
  await db
    .update(offers)
    .set({ currentPrice: normalized })
    .where(eq(offers.id, id))

  const [lastHistory] = await db
    .select()
    .from(priceHistory)
    .where(eq(priceHistory.offerId, id))
    .orderBy(desc(priceHistory.createdAt))
    .limit(1)

  if (lastHistory) {
    await db
      .update(priceHistory)
      .set({ currentPrice: normalized })
      .where(eq(priceHistory.id, lastHistory.id))
  }

  revalidatePath('/')
}

export async function rejectOffer(id: string) {
  await db
    .update(offers)
    .set({ status: 'rejected' })
    .where(eq(offers.id, id))

  revalidatePath('/')
}
