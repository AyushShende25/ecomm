import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.log("Invalid environment variables");
  console.log(envVars.error.format());
  process.exit(1);
}

export const env = envVars.data;
