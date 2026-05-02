import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
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
  category: varchar("category", { length: 100 }),
  title: varchar("title", { length: 500 }).notNull(),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  originalUrl: varchar("original_url", { length: 2048 }).notNull().unique(),
  affiliateUrl: varchar("affiliate_url", { length: 2048 }),
  imageUrl: varchar("image_url", { length: 2048 }),
  status: offerStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  copyText: text("copy_text"),
  rating: numeric("rating", { precision: 3, scale: 1 }),
  reviews: integer("reviews"),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: 'set null' }),
  rejectedBy: uuid("rejected_by").references(() => users.id, { onDelete: 'set null' }),
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

export const offerImpressions = pgTable("offer_impressions", {
  id: uuid("id").primaryKey().defaultRandom(),
  offerId: uuid("offer_id").references(() => offers.id, { onDelete: "set null" }),
  sessionId: varchar("session_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clickEvents = pgTable("click_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  offerId: uuid("offer_id").references(() => offers.id, { onDelete: "set null" }),
  sessionId: varchar("session_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const offersRelations = relations(offers, ({ many }) => ({
  history: many(priceHistory),
  impressions: many(offerImpressions),
  clicks: many(clickEvents),
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  offer: one(offers, {
    fields: [priceHistory.offerId],
    references: [offers.id],
  }),
}));

export const offerImpressionsRelations = relations(offerImpressions, ({ one }) => ({
  offer: one(offers, { fields: [offerImpressions.offerId], references: [offers.id] }),
}));

export const clickEventsRelations = relations(clickEvents, ({ one }) => ({
  offer: one(offers, { fields: [clickEvents.offerId], references: [offers.id] }),
}));

export type PriceHistory = typeof priceHistory.$inferSelect;
export type OfferImpression = typeof offerImpressions.$inferSelect;
export type ClickEvent = typeof clickEvents.$inferSelect;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;