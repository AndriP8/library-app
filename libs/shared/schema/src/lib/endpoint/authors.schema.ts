import { z } from 'zod';

import { Author } from '../database/authors';
import { defaultResponse, SchemaType } from '../utils';

// List data
const listAuthorResponse = defaultResponse.extend({ data: z.array(Author) });

// Create data
const createAuthorResponse = defaultResponse.extend({ data: Author });
const createAuthorBody = Author.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update data
const updateAuthorResponse = defaultResponse.extend({ data: Author });
const updateAuthorBody = Author.omit({
  createdAt: true,
  updatedAt: true,
});

// Delete data
const deleteAuthorResponse = defaultResponse.extend({ data: z.literal('Ok') });

const path = '/authors';

export const authorsSchema = {
  read: {
    path,
    response: listAuthorResponse,
  },
  create: {
    path,
    body: createAuthorBody,
    response: createAuthorResponse,
  },
  update: {
    path: path + '/:id',
    body: updateAuthorBody,
    response: updateAuthorResponse,
  },
  delete: {
    path: path + '/:id',
    response: deleteAuthorResponse,
  },
} satisfies Partial<SchemaType>;
