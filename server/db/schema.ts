import { sql, InferSelectModel } from "drizzle-orm";
import { integer, text, sqliteTable, primaryKey, blob } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  // other user attributes
  profile_pic: text("profile_pic").notNull(), // Optional: url to imgur link with profile pic
  phone_number: text("phone_number").notNull(),
});

export const session = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
  active_expires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idle_expires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
  hashed_password: text("hashed_password"),
});

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  listing_name: text("listing_name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
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
