import { z } from 'zod';

import { BookCategories } from '../database/book-categories';
import { defaultResponse, SchemaType } from '../utils';

// List data
const listBookCategoriesResponse = defaultResponse.extend({
  data: z.array(BookCategories),
});

// Create data
const createBookCategoriesResponse = defaultResponse.extend({
  data: BookCategories,
});
const createBookCategoriesBody = BookCategories.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update data
const updateBookCategoriesResponse = defaultResponse.extend({
  data: BookCategories,
});
const updateBookCategoriesBody = BookCategories.omit({
  createdAt: true,
  updatedAt: true,
});

// Delete data
const deleteBookCategoriesResponse = defaultResponse.extend({
  data: z.literal('Ok'),
});

const idParams = z.object({ id: z.string() });

const path = '/book-categories';

export const bookCategoriesSchema = {
  read: {
    path,
    response: listBookCategoriesResponse,
  },
  create: {
    path,
    body: createBookCategoriesBody,
    response: createBookCategoriesResponse,
  },
  update: {
    path: path + '/:id',
    params: idParams,
    body: updateBookCategoriesBody,
    response: updateBookCategoriesResponse,
  },
  delete: {
    path: path + '/:id',
    response: deleteBookCategoriesResponse,
    params: idParams,
  },
} satisfies Partial<SchemaType>;
