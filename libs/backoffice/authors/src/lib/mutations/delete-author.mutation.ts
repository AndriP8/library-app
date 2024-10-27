import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { authorsSchema } from '@/shared/schema';

type AddAuthorResponse = z.infer<typeof authorsSchema.update.response>;

export const deleteAuthorMutation = async (
  token: string,
  id: string,
): Promise<AddAuthorResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/authors/${id}`,
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
