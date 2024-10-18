import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { responseData, throwResponse } from '@/api/utils';
import { defaultTimestamp } from '@/api/utils';
import { db } from '@/database';
import { bookCategoriesSchema } from '@/shared/schema';

// GET /api/book-categories
export async function selectBookCategories(
  req: FastifyRequest<{
    Querystring: {
      size: number;
      page: number;
    };
  }>,
  res: FastifyReply
) {
  try {
    const page = Number(req.query.page);
    const size = Number(req.query.size);
    const data = await db
      .selectFrom('categories')
      .offset((page === 0 ? page : page - 1) * size)
      .limit(size)
      .selectAll()
      .execute();
    return res.code(200).send({
      data,
      pagination: {
        page,
        size,
        total: data.length,
        // Harcoded
        totalPages: 3,
      },
      statusCode: 200,
      message: 'Success get book categories',
    });
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      })
    );
  }
}

// POST /api/book-categories
type CreateBookCategoryBody = z.infer<typeof bookCategoriesSchema.create.body>;
export async function insertBookCategory(
  req: FastifyRequest<{ Body: CreateBookCategoryBody }>,
  res: FastifyReply
) {
  try {
    const data = await db
      .insertInto('categories')
      .values(req.body)
      .returningAll()
      .executeTakeFirst();
    return res.code(201).send(
      responseData({
        data,
        statusCode: 201,
        message: 'Success create book category',
      })
    );
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      })
    );
  }
}

// PUT /api/book-categories/:id
type UpdateBookCategoryBody = z.infer<typeof bookCategoriesSchema.update.body>;
type UpdateBookCategoryParams = z.infer<
  typeof bookCategoriesSchema.update.params
>;
export async function updateBookCategory(
  req: FastifyRequest<{
    Body: UpdateBookCategoryBody;
    Params: UpdateBookCategoryParams;
  }>,
  res: FastifyReply
) {
  try {
    if (req.body.id !== req.params.id) {
      return res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid Request',
          reasons: 'Book category id is not match with params.',
        })
      );
    }
    const data = await db
      .updateTable('categories')
      .set({
        ...req.body,
        id: req.params.id,
        updatedAt: defaultTimestamp,
      })
      .where('id', '=', req.params.id)
      .returningAll()
      .executeTakeFirst();
    return res.code(201).send(
      responseData({
        data,
        statusCode: 201,
        message: 'Success update bookCategory',
      })
    );
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      })
    );
  }
}

// DELETE /api/book-categories/:id
type DeleteBookCategoryParams = z.infer<
  typeof bookCategoriesSchema.delete.params
>;
export async function deleteBookCategory(
  req: FastifyRequest<{ Params: DeleteBookCategoryParams }>,
  res: FastifyReply
) {
  try {
    const data = await db
      .deleteFrom('categories')
      .where('id', '=', req.params.id)
      .executeTakeFirst();
    if (Number(data.numDeletedRows.toString())) {
      return res.code(200).send(
        responseData({
          data: 'Ok',
          statusCode: 200,
          message: 'Success delete book category',
        })
      );
    }
    res.code(400).send(
      throwResponse({
        statusCode: 400,
        message: 'Failed delete book category',
        reasons: 'Book category id is invalid or does not exist.',
      })
    );
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      })
    );
  }
}
