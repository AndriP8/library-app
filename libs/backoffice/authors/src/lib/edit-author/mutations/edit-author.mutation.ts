import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { authorsSchema } from '@/shared/schema';

export type EditAuthorBody = z.infer<typeof authorsSchema.update.body>;
type AddAuthorResponse = z.infer<typeof authorsSchema.update.response>;

export const editAuthorMutation = async (
  token: string,
  payload: EditAuthorBody,
): Promise<AddAuthorResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/authors/${payload.id}`,
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
