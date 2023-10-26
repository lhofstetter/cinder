import dotenv from "dotenv";
import path from "path";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const envFilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envFilePath });

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });
