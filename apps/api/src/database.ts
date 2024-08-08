import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: Number(process.env.DATABASE_PORT),
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
