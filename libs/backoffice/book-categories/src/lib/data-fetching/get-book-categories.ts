import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { bookCategoriesSchema } from '@/shared/schema';

type BookCategoriesResponse = z.infer<
  typeof bookCategoriesSchema.read.response
>;
type BookCategoriesQuery = z.infer<typeof bookCategoriesSchema.read.query>;

export const getBookCategories = async (
  token: string,
  query?: BookCategoriesQuery,
): Promise<BookCategoriesResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${bookCategoriesSchema.read.path}?size=${query?.size}&page=${query?.page}`,
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
      `Failed to fetch book categories: ${errorResponse.reasons}`,
    );
  }
  return res.json();
};
