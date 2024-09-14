import fastifyPlugin = require('fastify-plugin');
import { db } from '@/database';

import { throwResponse } from './response';

type Payload = { id: string; name: string };
type User = Payload & { iat: number; exp: number };

export const verifyToken = fastifyPlugin((fastify, opts, done) => {
  fastify.addHook('onRequest', async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.code(401).send(
          throwResponse({
            statusCode: 401,
            message: 'Missing token',
            reasons: 'Mising token, Please provide your authentication token!',
          })
        );
      }
      const payload = await req.jwtVerify<User>();
      const isUserExist = db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', payload.id)
        .executeTakeFirst();
      if (!isUserExist) {
        return res.code(401).send(
          throwResponse({
            statusCode: 401,
            message: 'Failed verify token',
            reasons: 'Failed to verify your authentication token!',
          })
        );
      }
    } catch (error) {
      return res.code(401).send(
        throwResponse({
          statusCode: 401,
          message: 'Failed verify token',
          reasons: error.message,
        })
      );
    }
  });
  done();
});
