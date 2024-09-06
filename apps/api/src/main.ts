import FastifyPostgres from '@fastify/postgres';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { routes } from './routes';

const fastify = Fastify({
  logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);
fastify.register(FastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
});
routes.forEach((route) => {
  fastify.register(route.plugin, { prefix: route.prefix });
});
// Declare a route

// Run the server!
fastify.listen({ port: 3001 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
