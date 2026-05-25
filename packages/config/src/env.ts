import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  BOT_TOKEN: z.string().min(1),
  BOT_WEBHOOK_DOMAIN: z.string().optional(),
  BOT_WEBHOOK_PATH: z.string().default('/bot/webhook'),
  JWT_SECRET: z.string().min(32),
  MINIAPP_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  WEATHER_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, unknown>): Env {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data as Env;
}
