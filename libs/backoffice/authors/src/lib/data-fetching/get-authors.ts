import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { authorsSchema } from '@/shared/schema';

type AuthorResponse = z.infer<typeof authorsSchema.read.response>;
type AuthorQuery = z.infer<typeof authorsSchema.read.query>;

export const getAuthors = async (
  token: string,
  query?: AuthorQuery,
): Promise<AuthorResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${authorsSchema.read.path}?size=${query?.size}&page=${query?.page}`,
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
    throw new Error(`Failed to fetch authors: ${errorResponse.reasons}`);
  }
  return res.json();
};
