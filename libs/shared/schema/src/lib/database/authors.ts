import { z } from 'zod';

export const Author = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string().optional().nullable(),
  bio: z.string(),
  avatarUrl: z.string(),
  totalPublishedBook: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
