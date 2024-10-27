import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { bookCategoriesSchema } from '@/shared/schema';

type AddBookCategoryResponse = z.infer<
  typeof bookCategoriesSchema.delete.response
>;

export const deleteBookCategoryMutation = async (
  token: string,
  id: string,
): Promise<AddBookCategoryResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/book-categories/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.json();
};
