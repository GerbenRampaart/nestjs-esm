import { z } from 'zod';
import { pinoLevels } from '../logger/levels';

export const UtilitiesSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
    "repl",
  ]),
  LOG_LEVEL: z.enum(pinoLevels).optional().default("info"),
});

export type UtilitiesSchemaType = z.infer<typeof UtilitiesSchema>;