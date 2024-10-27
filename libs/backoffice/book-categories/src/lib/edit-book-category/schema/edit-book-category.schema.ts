import { z } from 'zod';

export const editBookCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
});

export type EditBookCategorySchema = z.infer<typeof editBookCategorySchema>;
