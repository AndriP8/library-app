import { FastifyPluginAsync } from 'fastify';

import { loginRoutes, registerRoutes } from '@/api/auth';
import { routes as authorsRoute } from '@/api/authors';
import { routes as bookCategoriesSchema } from '@/api/book-categories';
import { routes as booksRoute } from '@/api/books';
import { routes as usersRoute } from '@/api/users';

type Route = {
  plugin: FastifyPluginAsync;
};

export const routes: Route[] = [
  {
    plugin: registerRoutes,
  },
  {
    plugin: loginRoutes,
  },
  {
    plugin: usersRoute,
  },
  {
    plugin: authorsRoute,
  },
  {
    plugin: bookCategoriesSchema,
  },
  {
    plugin: booksRoute,
  },
];
