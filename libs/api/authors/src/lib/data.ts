import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { responseData, throwResponse } from '@/api/utils';
import { defaultTimestamp } from '@/api/utils';
import { db, getPaginationInfo, paginate } from '@/database';
import { authorsSchema } from '@/shared/schema';

// GET /api/authors
type AuthorsQuery = z.infer<typeof authorsSchema.read.query>;
export async function selectAuthors(
  req: FastifyRequest<{ Querystring: AuthorsQuery }>,
  res: FastifyReply,
) {
  try {
    const { page, size, search } = req.query;
    const baseQuery = db
      .selectFrom('authors')
      .$if(Boolean(search), (qb) =>
        qb.where((wqb) =>
          wqb.or([
            wqb('authors.firstName', 'ilike', `%${search}%`),
            wqb('authors.lastName', 'ilike', `%${search}%`),
          ]),
        ),
      );
    const authors = await baseQuery
      .selectAll()
      .$call((qb) => paginate(qb, { page, size }))
      .execute();
    const pagination = await getPaginationInfo(
      baseQuery,
      { page, size },
      authors.length,
    );
    return res.code(200).send(
      responseData({
        data: authors,
        pagination,
        statusCode: 200,
        message: 'Success get authors',
      }),
    );
  } catch (error) {
    return res.code(400).send(
      throwResponse({
        statusCode: 400,
        message: 'Internal Server Error',
        reasons: error.message,
      }),
    );
  }
}

// GET /api/authors/:id
export async function selectAuthorDetail(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply,
) {
  try {
    const authors = await db
      .selectFrom('authors')
      .where('id', '=', req.params.id)
      .selectAll()
      .executeTakeFirstOrThrow();

    return res.code(200).send(
      responseData({
        data: authors,
        statusCode: 200,
        message: 'Success get authors',
      }),
    );
  } catch (error) {
    return res.code(400).send(
      throwResponse({
        statusCode: 400,
        message: 'Internal Server Error',
        reasons: error.message,
      }),
    );
  }
}

// POST /api/authors
type CreateAuthorBody = z.infer<typeof authorsSchema.create.body>;
export async function insertAuthor(
  req: FastifyRequest<{ Body: CreateAuthorBody }>,
  res: FastifyReply,
) {
  try {
    const data = await db
      .insertInto('authors')
      .values({ ...req.body })
      .returningAll()
      .executeTakeFirst();
    return res.code(201).send(
      responseData({
        data,
        statusCode: 201,
        message: 'Success create author',
      }),
    );
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      }),
    );
  }
}

// PUT /api/authors/:id
type UpdateAuthorBody = z.infer<typeof authorsSchema.update.body>;
export async function updateAuthor(
  req: FastifyRequest<{ Body: UpdateAuthorBody; Params: { id: string } }>,
  res: FastifyReply,
) {
  try {
    if (req.body.id !== req.params.id) {
      return res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid Request',
          reasons: 'Author id is not match with params.',
        }),
      );
    }
    const data = await db
      .updateTable('authors')
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
        message: 'Success update author',
      }),
    );
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      }),
    );
  }
}

// DELETE /api/authors/:id
export async function deleteAuthor(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply,
) {
  try {
    const data = await db
      .deleteFrom('authors')
      .where('id', '=', req.params.id)
      .executeTakeFirst();
    if (Number(data.numDeletedRows.toString())) {
      return res.code(200).send(
        responseData({
          data: 'Ok',
          statusCode: 200,
          message: 'Success delete author',
        }),
      );
    }
    res.code(400).send(
      throwResponse({
        statusCode: 400,
        message: 'Failed delete author',
        reasons: 'Author id is invalid or does not exist.',
      }),
    );
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      }),
    );
  }
}
