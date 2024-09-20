import { FastifyPluginAsync } from 'fastify';

import { loginRoutes, registerRoutes } from '@/api/auth';
import { routes as usersRoute } from '@/api/users';

type Route = {
  plugin: FastifyPluginAsync;
  prefix: string;
};

export const routes: Route[] = [
  {
    plugin: registerRoutes,
    prefix: '/api',
  },
  {
    plugin: loginRoutes,
    prefix: '/api',
  },
  {
    plugin: usersRoute,
  },
  {
    plugin: authorsRoute,
  },
];
