import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { bookCategoriesSchema } from '@/shared/schema';

export type BookCategoryResponse = z.infer<
  typeof bookCategoriesSchema.readDetail.response
>;

export const getBookCategoryDetail = async (
  token: string,
  id: string,
): Promise<BookCategoryResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/book-categories/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const errorResponse = (await res.json()) as ThrowResponse;
    throw new Error(
      `Failed to fetch book category detail: ${errorResponse.reasons}`,
    );
  }
  return res.json();
};
