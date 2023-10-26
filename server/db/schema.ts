import { sql, InferSelectModel } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey(),
  listing_name: text("listing_name").notNull(),
  price: integer("price"),
  category: text("category").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export type Listing = InferSelectModel<typeof listings>;
