import { z } from 'zod'

const environmentSchema = z.object({
  VITE_API_URL: z.url({
    error: 'VITE_API_URL is required and must be a valid URL',
  }),
})

export const env = environmentSchema.parse(import.meta.env)
