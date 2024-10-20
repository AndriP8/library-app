import { z } from 'zod';

import { ThrowResponse } from '@/api/utils';
import { authSchema } from '@/shared/schema';

export type LoginBody = Omit<z.infer<typeof authSchema.login.body>, 'name'>;
type LoginResponse = z.infer<typeof authSchema.login.response>;

export const loginMutation = async (
  payload: LoginBody,
): Promise<LoginResponse | ThrowResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${authSchema.login.path}`,
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
