import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./server/db/migrations",
  schema: "./server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL as string,
  },
});
