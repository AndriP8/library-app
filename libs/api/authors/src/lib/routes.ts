import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { throwResponse, verifyToken } from '@/api/utils';
import { authorsSchema } from '@/shared/schema';

import {
  deleteAuthor,
  insertAuthor,
  selectAuthorDetail,
  selectAuthors,
  updateAuthor,
} from './data';

export async function routes(fastify: FastifyInstance) {
  fastify.register(verifyToken);
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: authorsSchema.read.path,
    schema: {
      response: {
        200: authorsSchema.read.response,
      },
    },
    handler: selectAuthors,
    errorHandler: (error, _req, res) => {
      res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid Request',
          reasons: error.message,
        }),
      );
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: authorsSchema.readDetail.path,
    schema: {
      response: {
        // 200: authorsSchema.readDetail.response,
      },
    },
    handler: selectAuthorDetail,
    errorHandler: (error, _req, res) => {
      res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid Request',
          reasons: error.message,
        }),
      );
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: authorsSchema.create.path,
    schema: {
      body: authorsSchema.create.body,
      response: {
        201: authorsSchema.create.response,
      },
    },
    handler: insertAuthor,
    errorHandler: (error, _req, res) => {
      if (error instanceof ZodError) {
        return res.code(400).send(
          throwResponse({
            statusCode: 400,
            message: 'Invalid Request',
            reasons: JSON.stringify(error.flatten().fieldErrors),
          }),
        );
      }
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: authorsSchema.update.path,
    schema: {
      body: authorsSchema.update.body,
      response: {
        201: authorsSchema.update.response,
      },
    },
    handler: updateAuthor,
    errorHandler: (error, _req, res) => {
      if (error instanceof ZodError) {
        return res.code(400).send(
          throwResponse({
            statusCode: 400,
            message: 'Invalid Request',
            reasons: JSON.stringify(error.flatten().fieldErrors),
          }),
        );
      }
    },
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: authorsSchema.delete.path,
    schema: {
      params: authorsSchema.delete.params,
      response: {
        200: authorsSchema.delete.response,
      },
    },
    handler: deleteAuthor,
    errorHandler: (error, _req, res) => {
      if (error instanceof ZodError) {
        return res.code(400).send(
          throwResponse({
            statusCode: 400,
            message: 'Invalid Request',
            reasons: JSON.stringify(error.flatten().fieldErrors),
          }),
        );
      }
    },
  });
}
