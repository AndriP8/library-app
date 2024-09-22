import { z } from 'zod';

export const Book = z.object({
  id: z.string(),
  title: z.string(),
  coverImage: z.string(),
  description: z.string(),
  publisher: z.string(),
  datePublished: z.string(),
  language: z.string(),
  isbn: z.number(),
  totalPage: z.number(),
  weight: z.number(),
  price: z.number(),
  discount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
