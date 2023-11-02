import { sql, InferSelectModel } from "drizzle-orm";
import {
  integer,
  text,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  listing_name: text("listing_name").notNull(),
  description: text("description").notNull(),
  price: integer("price"),
  category: text("category").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const images = sqliteTable("images", {
  image_id: integer("id").primaryKey({ autoIncrement: true }),
  listing_id: integer("listing_id")
    .references(() => listings.id)
    .notNull(),
  source: text("source").notNull(),
});

export const tags = sqliteTable(
  "tags",
  {
    tag_name: text("tag_name").notNull(),
    listing_id: integer("listing_id")
      .references(() => listings.id)
      .notNull(),
  },
  (table) => ({ pk: primaryKey(table.tag_name, table.listing_id) }),
);

export type Listing = InferSelectModel<typeof listings>;
export type Image = InferSelectModel<typeof images>;
export type Tag = InferSelectModel<typeof tags>;
