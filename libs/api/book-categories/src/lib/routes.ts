import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { throwResponse, verifyToken } from '@/api/utils';
import { bookCategoriesSchema } from '@/shared/schema';

import {
  deleteBookCategory,
  insertBookCategory,
  selectBookCategories,
  updateBookCategory,
} from './data';

export async function routes(fastify: FastifyInstance) {
  fastify.register(verifyToken);
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: bookCategoriesSchema.read.path,
    schema: {
      response: {
        200: bookCategoriesSchema.read.response,
      },
    },
    handler: selectBookCategories,
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
    url: bookCategoriesSchema.create.path,
    schema: {
      body: bookCategoriesSchema.create.body,
      response: {
        201: bookCategoriesSchema.create.response,
      },
    },
    handler: insertBookCategory,
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
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: bookCategoriesSchema.update.path,
    schema: {
      body: bookCategoriesSchema.update.body,
      params: bookCategoriesSchema.update.params,
      response: {
        201: bookCategoriesSchema.update.response,
      },
    },
    handler: updateBookCategory,
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
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: bookCategoriesSchema.delete.path,
    schema: {
      params: bookCategoriesSchema.delete.params,
      response: {
        200: bookCategoriesSchema.delete.response,
      },
    },
    handler: deleteBookCategory,
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
