import {createClient} from "@libsql/client";
import dotenv from "dotenv";
import {drizzle} from "drizzle-orm/libsql";
import * as path from "path";
import {fileURLToPath} from "url";

import * as schema from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFilePath = path.resolve(__dirname, "../.env");
dotenv.config({path : envFilePath});

if (!process.env.DATABASE_URL) {
  console.error("NO ENV");
}

export const client = createClient({
  url : process.env.DATABASE_URL!,
  authToken : process.env.DATABASE_TOKEN,
});

export const db = drizzle(client, {schema, logger : true});
