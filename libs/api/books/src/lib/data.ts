import { FastifyReply, FastifyRequest } from 'fastify';
import { sql } from 'kysely';
import { z } from 'zod';

import { responseData, throwResponse } from '@/api/utils';
import { defaultTimestamp } from '@/api/utils';
import { db } from '@/database';
import { booksSchema } from '@/shared/schema';

// GET /api/books
type BooksQuery = z.infer<typeof booksSchema.read.query>;
export async function selectBooks(
  req: FastifyRequest<{ Querystring: BooksQuery }>,
  res: FastifyReply,
) {
  try {
    const booksData = await db
      .selectFrom('books')
      .$if(Boolean(req.query.search), (qb) =>
        qb.where('books.title', 'ilike', `%${req.query.search}%` || ''),
      )
      .select([
        'books.id',
        'books.title',
        'books.description',
        'books.publisher',
        'books.datePublished',
        'books.createdAt',
        'books.updatedAt',
      ])
      .execute();

    const booksWithRelations = await Promise.all(
      booksData.map(async (book) => {
        const authors = await db
          .selectFrom('authors')
          .innerJoin('bookAuthors', 'authors.id', 'bookAuthors.authorId')
          .select([
            'authors.id',
            (eb) => {
              const firstName = eb.ref('authors.firstName');
              const lastName = eb.ref('authors.lastName');
              const name = sql<string>`concat(${firstName},' ',${lastName})`;
              return name.as('name');
            },
          ])
          .where('bookAuthors.bookId', '=', book.id)
          .execute();

        const categories = await db
          .selectFrom('categories')
          .innerJoin(
            'bookCategories',
            'categories.id',
            'bookCategories.categoryId',
          )
          .select(['categories.id', 'categories.name'])
          .where('bookCategories.bookId', '=', book.id)
          .execute();

        return {
          ...book,
          authors,
          categories,
        };
      }),
    );

    return res.code(200).send(
      responseData({
        data: booksWithRelations,
        statusCode: 200,
        message: 'Success get books',
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

// GET /api/books/:id
export async function selectBookDetail(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply,
) {
  try {
    const bookData = await db
      .selectFrom('books')
      .where('books.id', '=', req.params.id)
      .selectAll()
      .executeTakeFirstOrThrow();

    const authors = await db
      .selectFrom('authors')
      .innerJoin('bookAuthors', 'authors.id', 'bookAuthors.authorId')
      .select([
        'authors.id',
        (eb) => {
          const firstName = eb.ref('authors.firstName');
          const lastName = eb.ref('authors.lastName');
          const name = sql<string>`concat(${firstName},' ',${lastName})`;
          return name.as('name');
        },
      ])
      .where('bookAuthors.bookId', '=', bookData.id)
      .execute();
    const categories = await db
      .selectFrom('categories')
      .innerJoin('bookCategories', 'categories.id', 'bookCategories.categoryId')
      .select(['categories.id', 'categories.name'])
      .where('bookCategories.bookId', '=', bookData.id)
      .execute();

    const bookDetailData = {
      ...bookData,
      authors,
      categories,
    };

    return res.code(200).send(
      responseData({
        data: bookDetailData,
        statusCode: 200,
        message: 'Success get detail book',
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

// POST /api/books
export type CreateBookBody = z.infer<typeof booksSchema.create.body>;
export async function insertBook(
  req: FastifyRequest<{ Body: CreateBookBody }>,
  res: FastifyReply,
) {
  try {
    const { authorIds, categoryIds, ...body } = req.body;
    const data = await db.transaction().execute(async (trx) => {
      const book = await trx
        .insertInto('books')
        .values(body)
        .returningAll()
        .executeTakeFirst();
      if (book) {
        await Promise.all(
          categoryIds.map((categoryId) =>
            trx
              .insertInto('bookCategories')
              .values({ bookId: book.id, categoryId })
              .executeTakeFirst(),
          ),
        );
        await Promise.all(
          authorIds.map((authorId) =>
            trx
              .insertInto('bookAuthors')
              .values({ bookId: book.id, authorId })
              .executeTakeFirst(),
          ),
        );
        return {
          ...book,
          categoryIds,
          authorIds,
        };
      }
    });
    return res.code(201).send(
      responseData({
        data,
        statusCode: 201,
        message: 'Success create book',
      }),
    );
  } catch (error) {
    return res.code(400).send(
      throwResponse({
        statusCode: 400,
        message: 'Invalid request',
        reasons: error.message,
      }),
    );
  }
}

// PUT /api/books/:id
type UpdateBookBody = z.infer<typeof booksSchema.update.body>;
export async function updateBook(
  req: FastifyRequest<{ Body: UpdateBookBody; Params: { id: string } }>,
  res: FastifyReply,
) {
  try {
    const { authorIds, categoryIds, ...body } = req.body;
    if (body.id !== req.params.id) {
      return res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid Request',
          reasons: 'Book id is not match with params.',
        }),
      );
    }
    const data = await db.transaction().execute(async (trx) => {
      const book = await trx
        .updateTable('books')
        .set({
          ...body,
          id: req.params.id,
          updatedAt: defaultTimestamp,
        })
        .where('id', '=', req.params.id)
        .returningAll()
        .executeTakeFirstOrThrow();
      if (book) {
        // Delete book categories
        await trx
          .deleteFrom('bookCategories')
          .where('bookId', '=', book.id)
          .executeTakeFirst();

        const reInsertBookCategories = categoryIds.map(
          async (categoryId) =>
            await trx
              .insertInto('bookCategories')
              .values({ bookId: book.id, categoryId })
              .executeTakeFirst(),
        );
        await Promise.all(reInsertBookCategories);

        // Delete book authors
        await trx
          .deleteFrom('bookAuthors')
          .where('bookId', '=', book.id)
          .executeTakeFirst();

        const reInsertBookAuthors = authorIds.map(
          async (authorId) =>
            await trx
              .insertInto('bookAuthors')
              .values({ bookId: book.id, authorId })
              .executeTakeFirst(),
        );
        await Promise.all(reInsertBookAuthors);

        return {
          ...book,
          categoryIds,
          authorIds,
        };
      }
    });
    return res.code(201).send(
      responseData({
        data,
        statusCode: 201,
        message: 'Success update book',
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

// DELETE /api/books/:id
export async function deleteBook(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply,
) {
  try {
    const data = await db.transaction().execute(async (trx) => {
      const book = await trx
        .deleteFrom('books')
        .where('id', '=', req.params.id)
        .executeTakeFirst();

      await trx
        .deleteFrom('bookCategories')
        .where('bookId', '=', req.params.id)
        .executeTakeFirst();
      await trx
        .deleteFrom('bookAuthors')
        .where('bookId', '=', req.params.id)
        .executeTakeFirst();
      return book;
    });

    if (Number(data.numDeletedRows.toString())) {
      return res.code(200).send(
        responseData({
          data: 'Ok',
          statusCode: 200,
          message: 'Success delete book',
        }),
      );
    }
    res.code(400).send(
      throwResponse({
        statusCode: 400,
        message: 'Failed delete book',
        reasons: 'Book id is invalid or does not exist.',
      }),
    );
  } catch (error) {
    return res.code(500).send(
      throwResponse({
        statusCode: 400,
        message: 'Internal Server Error',
        reasons: error.message,
      }),
    );
  }
}
