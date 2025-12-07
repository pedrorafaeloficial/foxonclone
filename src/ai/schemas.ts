import { z } from 'zod';

export const SourceFileSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  content: z.string(),
});

export const SourceCodeSchema = z.object({
  html: z.string(),
  css: z.array(SourceFileSchema),
  js: z.array(SourceFileSchema),
});
