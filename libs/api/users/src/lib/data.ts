import * as argon2 from 'argon2';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { responseData, throwResponse } from '@/api/utils';
import { db } from '@/database';
import { usersSchema } from '@/shared/schema';

export async function selectUsers(req: FastifyRequest, res: FastifyReply) {
  try {
    const data = await db.selectFrom('users').selectAll().execute();
    return res
      .code(200)
      .send(
        responseData({ data, statusCode: 200, message: 'Success get users' })
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

type CreateUserBody = z.infer<typeof usersSchema.create.body>;
export async function insertUser(
  req: FastifyRequest<{ Body: CreateUserBody }>,
  res: FastifyReply
) {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await argon2.hash(password);

    const data = await db
      .insertInto('users')
      .values({ ...userData, password: hashedPassword })
      .returning(['id', 'email', 'name', 'createdAt', 'updatedAt'])
      .executeTakeFirst();
    return res
      .code(201)
      .send(
        responseData({ data, statusCode: 201, message: 'Success create user' })
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

export async function deleteUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  try {
    const data = await db
      .deleteFrom('users')
      .where('id', '=', req.params.id)
      .executeTakeFirst();
    if (Number(data.numDeletedRows.toString())) {
      return res.code(200).send(
        responseData({
          data: 'Ok',
          statusCode: 200,
          message: 'Success delete user',
        })
      );
    }
    res.code(400).send(
      throwResponse({
        statusCode: 400,
        message: 'Failed delete user',
        reasons: 'User id is invalid or does not exist.',
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
