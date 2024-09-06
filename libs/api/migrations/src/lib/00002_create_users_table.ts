import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';

import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from '../common-column';

export async function up(db: Kysely<DB>): Promise<void> {
  // Create users table
  await db.schema
    .createTable('users')
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addUniqueConstraint('unique_email', ['email'])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
