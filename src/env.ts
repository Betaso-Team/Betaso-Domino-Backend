import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().positive().default(2569),
  NODE_APP_INSTANCE: z.coerce.number().nonnegative().optional(),
  SERVER_NAME: z.string().optional(),

  // Redis
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URI: z.url().optional(),

  // Graylog
  GRAYLOG_HOST: z.string().optional(),
  GRAYLOG_PORT: z.coerce.number().positive().default(12201),
})

// eslint-disable-next-line node/no-process-env
const envValidation = envSchema.safeParse(process.env)
if (!envValidation.success) {
  console.error('Invalid environment variables:')
  console.error(z.prettifyError(envValidation.error))
  process.exit(1)
}

export default envValidation.data
