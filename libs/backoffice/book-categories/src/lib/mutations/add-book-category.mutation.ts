import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { bookCategoriesSchema } from '@/shared/schema';

export type AddBookCategoryBody = z.infer<
  typeof bookCategoriesSchema.create.body
>;
type AddBookCategoryResponse = z.infer<
  typeof bookCategoriesSchema.create.response
>;

export const addBookCategoryMutation = async (
  token: string,
  payload: AddBookCategoryBody,
): Promise<AddBookCategoryResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${bookCategoriesSchema.create.path}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );
  return res.json();
};
