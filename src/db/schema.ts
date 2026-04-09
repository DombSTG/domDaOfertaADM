import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const offerStatusEnum = pgEnum("offer_status", [
  "pending",
  "approved",
  "rejected",
]);

export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  store: varchar("store", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  originalUrl: varchar("original_url", { length: 2048 }).notNull().unique(),
  imageUrl: varchar("image_url", { length: 2048 }),
  status: offerStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  copyText: text("copy_text"),
});

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;

export const priceHistory = pgTable("price_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  offerId: uuid("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const offersRelations = relations(offers, ({ many }) => ({
  history: many(priceHistory),
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  offer: one(offers, {
    fields: [priceHistory.offerId],
    references: [offers.id],
  }),
}));

export type PriceHistory = typeof priceHistory.$inferSelect;