import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { authorsSchema } from '@/shared/schema';

export type AuthorResponse = z.infer<typeof authorsSchema.readDetail.response>;

export const getAuthorDetail = async (
  token: string,
  id: string,
): Promise<AuthorResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/authors/${id}`,
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
    throw new Error(`Failed to fetch author: ${errorResponse.reasons}`);
  }
  return res.json();
};
