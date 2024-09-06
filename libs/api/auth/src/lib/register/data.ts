import * as argon2 from 'argon2';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { responseData, throwResponse } from '@/api/utils';
import { db } from '@/database';
import { usersSchema } from '@/shared/schema';

type CreateUserBody = z.infer<typeof usersSchema.create.body>;
export async function createUser(
  req: FastifyRequest<{ Body: CreateUserBody }>,
  res: FastifyReply
) {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await argon2.hash(password, {});

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
    res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: undefined,
        reasons: error.message,
      })
    );
  }
}
