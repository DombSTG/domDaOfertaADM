import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // Caminho para o seu arquivo de schema
  out: "./drizzle", // Pasta onde as migrations serão salvas (opcional)
  dialect: "postgresql", // Tipo do banco de dados
  dbCredentials: {
    url: process.env.DATABASE_URL!, // URL do banco de dados vindo do seu .env
  },
});