import { z } from 'zod';

import { Author } from '../database/authors';
import {
  defaultQuery,
  defaultResponse,
  pagination,
  SchemaType,
} from '../utils';

// List data
const listAuthorResponse = defaultResponse.extend({
  data: z.array(Author),
  pagination,
});
const listAuthorsQuery = defaultQuery;

// Detail data
const detailAuthorResponse = defaultResponse.extend({
  data: Author,
});

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

const idParams = z.object({ id: z.string() });

const path = '/authors';

export const authorsSchema = {
  read: {
    path,
    query: listAuthorsQuery,
    response: listAuthorResponse,
  },
  readDetail: {
    path: path + '/:id',
    response: detailAuthorResponse,
  },
  create: {
    path,
    body: createAuthorBody,
    response: createAuthorResponse,
  },
  update: {
    path: path + '/:id',
    params: idParams,
    body: updateAuthorBody,
    response: updateAuthorResponse,
  },
  delete: {
    path: path + '/:id',
    params: idParams,
    response: deleteAuthorResponse,
  },
} satisfies Partial<SchemaType>;
