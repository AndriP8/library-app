import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
