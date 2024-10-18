import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { authSchema } from '@/shared/schema';

export type RegisterBody = Omit<
  z.infer<typeof authSchema.register.body>,
  'name'
>;
type RegisterResponse = z.infer<typeof authSchema.register.response>;

export const registerMutation = async (
  payload: RegisterBody,
): Promise<RegisterResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${authSchema.register.path}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
  return res.json();
};
