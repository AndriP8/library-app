import Fastify from 'fastify';
import FastifyPostgres from '@fastify/postgres';
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

// Declare a route
fastify.register(routes, []);

// Run the server!
fastify.listen({ port: 3001 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
