import { lucia } from "lucia";
import { express } from "lucia/middleware";
import { client } from "./db/index.js";
import { libsql } from "@lucia-auth/adapter-sqlite";

export const auth = lucia({
  adapter: libsql(client, {
    key: "user_key",
    session: "user_session",
    user: "user",
  }),
  env: "DEV",
  middleware: express(),
  getUserAttributes: (data) => {
    return {
      username: data.username,
      profile_pic: data.profile_pic,
      phone_number: data.phone_number,
    };
  },
});

export type Auth = typeof auth;
