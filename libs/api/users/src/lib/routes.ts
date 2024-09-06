import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { throwResponse } from '@/api/utils';
import { usersSchema } from '@/shared/schema';

import { insertUser, selectUsers } from './data';

export async function routes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: usersSchema.read.path,
    schema: {
      querystring: {},
      response: {
        200: usersSchema.read.response,
      },
    },
    handler: selectUsers,
    errorHandler: (error, _req, res) => {
      res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid Request',
          reasons: error.message,
        })
      );
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: usersSchema.create.path,
    schema: {
      body: usersSchema['create']['body'],
      response: {
        201: usersSchema.create.response,
      },
    },
    handler: insertUser,
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
