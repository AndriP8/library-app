import { z } from 'zod';

import { Book } from '../database/books';
import { defaultQuery, defaultResponse, SchemaType } from '../utils';

const getBookExtendableColumns = {
  authors: z.array(z.object({ id: z.string(), name: z.string() })),
  categories: z.array(z.object({ id: z.string(), name: z.string() })),
};

const manipulationBookExtendableColumns = {
  authorIds: z.array(z.string()),
  categoryIds: z.array(z.string()),
};

// List data
const listBookResponse = defaultResponse.extend({
  data: z.array(
    Book.pick({
      id: true,
      title: true,
      description: true,
      publisher: true,
      datePublished: true,
      createdAt: true,
      updatedAt: true,
    }).extend(getBookExtendableColumns),
  ),
});
const listBookQuery = defaultQuery;

// Detail data
const detailBookResponse = defaultResponse.extend({
  data: Book.extend(getBookExtendableColumns),
});

// Create data
const createBookResponse = defaultResponse.extend({
  data: Book.extend(manipulationBookExtendableColumns),
});
const createBookBody = Book.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend(manipulationBookExtendableColumns);

// Update data
const updateBookResponse = defaultResponse.extend({
  data: Book.extend(manipulationBookExtendableColumns),
});
const updateBookBody = Book.omit({
  createdAt: true,
  updatedAt: true,
}).extend(manipulationBookExtendableColumns);

// Delete data
const deleteBookResponse = defaultResponse.extend({ data: z.literal('Ok') });

const idParams = z.object({ id: z.string() });

const path = '/books';

export const booksSchema = {
  read: {
    path,
    query: listBookQuery,
    response: listBookResponse,
  },
  readDetail: {
    path: path + '/:id',
    response: detailBookResponse,
  },
  create: {
    path,
    body: createBookBody,
    response: createBookResponse,
  },
  update: {
    path: path + '/:id',
    params: idParams,
    body: updateBookBody,
    response: updateBookResponse,
  },
  delete: {
    path: path + '/:id',
    params: idParams,
    response: deleteBookResponse,
  },
} satisfies Partial<SchemaType>;
