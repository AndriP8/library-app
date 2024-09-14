import { z } from 'zod';

import { User as UserDb } from '../database/users';
import { defaultResponse, SchemaType } from '../utils';

const User = UserDb.omit({ password: true });

// List data
const listUserResponse = defaultResponse.extend({ data: z.array(User) });

// Create data
const createUserResponse = defaultResponse.extend({ data: User });
const createUserBody = User.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6),
});

// Delete data
const deleteUSerBody = User.pick({ id: true });
const deleteUSerResponse = defaultResponse.extend({ data: z.literal('Ok') });

export const usersSchema = {
  read: {
    path: '/users',
    response: listUserResponse,
  },
  create: {
    path: '/users',
    body: createUserBody,
    response: createUserResponse,
  },
  delete: {
    path: '/users',
    body: deleteUSerBody,
    response: deleteUSerResponse,
  },
} satisfies Partial<SchemaType>;
