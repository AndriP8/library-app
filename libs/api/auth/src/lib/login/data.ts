import { JWT } from '@fastify/jwt';
import * as argon2 from 'argon2';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { throwResponse } from '@/api/utils';
import { db } from '@/database';
import { authSchema } from '@/shared/schema';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: JWT;
  }
}

type LoginBody = z.infer<typeof authSchema.login.body>;
export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const { email, password } = req.body;
    const data = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    if (!data) {
      return res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid request',
          reasons: 'Invalid email or password',
        })
      );
    }
    const token = fastify.jwt.sign(
      { id: data.id, name: data.name },
      { expiresIn: '1d' }
    );
    const verifyPassword = await argon2.verify(data.password, password);
    if (!verifyPassword) {
      return res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid request',
          reasons: 'Invalid email or password',
        })
      );
    }
    return res
      .code(201)
      .send({ token, statusCode: 201, message: 'Success generate token' });
  } catch (error) {
    res.code(500).send(
      throwResponse({
        statusCode: 500,
        message: 'Internal Server Error',
        reasons: error.message,
      })
    );
  }
}
