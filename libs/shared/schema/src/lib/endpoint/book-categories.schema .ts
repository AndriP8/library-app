import { z } from 'zod';

import { BookCategories } from '../database/book-categories';
import {
  defaultQuery,
  defaultResponse,
  pagination,
  SchemaType,
} from '../utils';

// List data
const listBookCategoriesResponse = defaultResponse.extend({
  data: z.array(BookCategories),
  pagination,
});

const listBookCategoriesQuery = defaultQuery;

// Detail data
const detailAuthorResponse = defaultResponse.extend({
  data: BookCategories,
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
    query: listBookCategoriesQuery,
    response: listBookCategoriesResponse,
  },
  readDetail: {
    path: path + '/:id',
    response: detailAuthorResponse,
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
