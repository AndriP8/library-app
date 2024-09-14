import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { throwResponse } from '@/api/utils';
import { authSchema } from '@/shared/schema';

import { createUser } from './data';

export async function registerRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: authSchema.register.path,
    schema: {
      body: authSchema.register.body,
      response: {
        201: authSchema.register.response,
      },
    },
    handler: createUser,
    errorHandler: (error, _req, res) => {
      if (error instanceof ZodError) {
        return res.code(400).send(
          throwResponse({
            statusCode: 400,
            message: 'Invalid Request',
            reasons: error.flatten().fieldErrors,
          })
        );
      }
    },
  });
}
