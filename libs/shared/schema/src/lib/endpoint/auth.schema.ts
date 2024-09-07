import { z } from 'zod';

import { User as UserDb } from '../database/users';
import { defaultResponse, SchemaType } from '../utils';

const User = UserDb.omit({ password: true });

// Create data / Register
const createUserResponse = defaultResponse.extend({ data: User });
const createUserBody = User.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6),
});

// Login
const loginBody = UserDb.pick({ email: true, password: true });
const loginResponse = defaultResponse.extend({
  token: z.string(),
});

export const authSchema = {
  register: {
    path: '/register',
    body: createUserBody,
    response: createUserResponse,
  },
  login: {
    path: '/login',
    body: loginBody,
    response: loginResponse,
  },
} satisfies Partial<SchemaType>;
