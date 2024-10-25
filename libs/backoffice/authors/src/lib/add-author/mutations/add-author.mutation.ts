import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { authorsSchema } from '@/shared/schema';

export type AddAuthorBody = z.infer<typeof authorsSchema.create.body>;
type AddAuthorResponse = z.infer<typeof authorsSchema.create.response>;

export const addAuthorMutation = async (
  token: string,
  payload: AddAuthorBody,
): Promise<AddAuthorResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${authorsSchema.create.path}`,
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
