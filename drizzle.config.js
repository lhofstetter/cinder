"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    schema: "./server/db/schema.ts",
    driver: "turso",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_TOKEN,
    },
    verbose: true,
    strict: true,
};
