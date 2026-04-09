'use server'

import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function approveOffer(id: string, newTitle: string, copyText: string) {
  await db
    .update(offers)
    .set({ status: 'approved', title: newTitle, copyText })
    .where(eq(offers.id, id))

  revalidatePath('/')
}

export async function updateOfferPrice(id: string, newPrice: number | string) {
  const normalized = String(newPrice).replace(',', '.')
  await db
    .update(offers)
    .set({ oldPrice: normalized })
    .where(eq(offers.id, id))

  revalidatePath('/')
}

export async function updateOfferCurrentPrice(id: string, newPrice: number | string) {
  const normalized = String(newPrice).replace(',', '.')
  await db
    .update(offers)
    .set({ currentPrice: normalized })
    .where(eq(offers.id, id))

  revalidatePath('/')
}

export async function rejectOffer(id: string) {
  await db
    .update(offers)
    .set({ status: 'rejected' })
    .where(eq(offers.id, id))

  revalidatePath('/')
}
