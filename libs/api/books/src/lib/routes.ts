import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { throwResponse, verifyToken } from '@/api/utils';
import { booksSchema } from '@/shared/schema';

import {
  deleteBook,
  insertBook,
  selectBookDetail,
  selectBooks,
  updateBook,
} from './data';

export async function routes(fastify: FastifyInstance) {
  fastify.register(verifyToken);
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: booksSchema.read.path,
    schema: {
      response: {
        200: booksSchema.read.response,
      },
    },
    handler: selectBooks,
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
    url: booksSchema.readDetail.path,
    schema: {
      response: {
        200: booksSchema.readDetail.response,
      },
    },
    handler: selectBookDetail,
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
    url: booksSchema.create.path,
    schema: {
      body: booksSchema.create.body,
      response: {
        201: booksSchema.create.response,
      },
    },
    handler: insertBook,
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
    url: booksSchema.update.path,
    schema: {
      params: booksSchema.delete.params,
      body: booksSchema.update.body,
      response: {
        201: booksSchema.update.response,
      },
    },
    handler: updateBook,
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
    url: booksSchema.delete.path,
    schema: {
      params: booksSchema.delete.params,
      response: {
        200: booksSchema.delete.response,
      },
    },
    handler: deleteBook,
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
