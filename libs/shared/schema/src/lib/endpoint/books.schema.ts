import { z } from 'zod';

import { Book } from '../database/books';
import { defaultResponse, SchemaType } from '../utils';

// List data
const listBookResponse = defaultResponse.extend({ data: z.array(Book) });

// Create data
const createBookResponse = defaultResponse.extend({ data: Book });
const createBookBody = Book.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  authorId: z.string(),
});

// Delete data
const deleteBookResponse = defaultResponse.extend({ data: z.literal('Ok') });

const path = '/books';

export const booksSchema = {
  read: {
    path,
    response: listBookResponse,
  },
  create: {
    path,
    body: createBookBody,
    response: createBookResponse,
  },
  delete: {
    path,
    response: deleteBookResponse,
  },
} satisfies Partial<SchemaType>;
