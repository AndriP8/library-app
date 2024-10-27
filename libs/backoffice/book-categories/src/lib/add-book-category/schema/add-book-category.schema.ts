import { z } from 'zod';

export const addBookCategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

export type AddBookCategorySchema = z.infer<typeof addBookCategorySchema>;
