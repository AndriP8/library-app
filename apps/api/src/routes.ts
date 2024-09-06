import { FastifyPluginAsync } from 'fastify';

import { loginRoutes, registerRoutes } from '@/api/auth';

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
];
