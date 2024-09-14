import { FastifyInstance, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z, ZodError } from 'zod';

import { throwResponse } from '@/api/utils';
import { authSchema } from '@/shared/schema';

import { login } from './data';
type LoginBody = z.infer<typeof authSchema.login.body>;
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
    handler: (req: FastifyRequest<{ Body: LoginBody }>, res) =>
      login(req, res, fastify),
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
