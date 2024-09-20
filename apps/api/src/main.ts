import fastifyJwt from '@fastify/jwt';
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

// Validation
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Database
fastify.register(FastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
});

// Utils
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || '',
});

// Declare a route
routes.forEach((route) => {
  fastify.register(route.plugin, { prefix: '/api' });
});

// Run the server!
fastify.listen({ port: 3001 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
