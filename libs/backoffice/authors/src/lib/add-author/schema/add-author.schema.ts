import { z } from 'zod';

export const addAuthorSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().optional(),
  bio: z.string().min(1, { message: 'Bio is required' }),
  avatarUrl: z.string().url('Invalid avatar URL'),
  totalPublishedBook: z
    .number()
    .min(0, { message: 'Total published book is required' }),
});

export type AddAuthorSchema = z.infer<typeof addAuthorSchema>;
