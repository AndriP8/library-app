import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { throwResponse } from '@/api/utils';
import { authSchema } from '@/shared/schema';

import { login } from './data';

export async function loginRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: authSchema.login.path,
    schema: {
      body: authSchema.login.body,
      response: {
        201: authSchema.login.response,
      },
    },
    handler: login,
    errorHandler: (error, _req, res) => {
      if (error instanceof ZodError) {
        res.code(400).send(
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
