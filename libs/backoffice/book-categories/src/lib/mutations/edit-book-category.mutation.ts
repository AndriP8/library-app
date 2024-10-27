import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { bookCategoriesSchema } from '@/shared/schema';

export type EditBookCategoryBody = z.infer<
  typeof bookCategoriesSchema.update.body
>;
type AddBookCategoryResponse = z.infer<
  typeof bookCategoriesSchema.update.response
>;

export const editBookCategoryMutation = async (
  token: string,
  payload: EditBookCategoryBody,
): Promise<AddBookCategoryResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/book-categories/${payload.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );
  return res.json();
};
