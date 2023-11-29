import { sql, InferSelectModel } from "drizzle-orm";
import { integer, text, sqliteTable, primaryKey, blob } from "drizzle-orm/sqlite-core";

export const likes = sqliteTable(
  "likes",
  {
    account_id: text("account_id")
      .notNull()
      .references(() => user.id),
    listing_id: integer("listing_id")
      .notNull()
      .references(() => listings.id),
    listing_owner_id: text("listing_owner_id")
      .notNull()
      .references(() => user.id),
    like: integer("like", { mode: "boolean" }).notNull(),
  },
  (table) => ({ pk: primaryKey(table.account_id, table.listing_id) }),
);

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  // other user attributes
  profile_pic: text("profile_pic").notNull(), // Optional: url to imgur link with profile pic
  phone_number: text("phone_number").notNull(),
  class_year: integer("class_year").notNull().default(2024),
  bio: text("bio"),
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
  owner_id: text("owner_id").notNull(),
  description: text("description").notNull(),
  size: text("size", { enum: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"] }),
  waist: integer("waist"),
  inseam: integer("inseam"),
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
