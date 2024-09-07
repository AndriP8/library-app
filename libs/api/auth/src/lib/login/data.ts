import * as argon2 from 'argon2';
import { createSecretKey } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as jose from 'jose';
import { z } from 'zod';

import { throwResponse } from '@/api/utils';
import { db } from '@/database';
import { authSchema } from '@/shared/schema';

type LoginBody = z.infer<typeof authSchema.login.body>;
export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) {
  try {
    const { email, password } = req.body;
    const secretKey = createSecretKey(process.env.JWT_SECRET || '', 'utf-8');
    const data = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    const token = await new jose.SignJWT({ name: data?.name })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('2h')
      .sign(secretKey);
    if (!data) {
      return res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid Email',
          reasons: undefined,
        })
      );
    }
    const verifyPassword = await argon2.verify(data.password, password);
    if (!verifyPassword) {
      return res.code(400).send(
        throwResponse({
          statusCode: 400,
          message: 'Invalid password',
          reasons: undefined,
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
