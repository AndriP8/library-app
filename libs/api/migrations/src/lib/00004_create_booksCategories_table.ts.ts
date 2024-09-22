import { Kysely, sql } from 'kysely';
import { DB } from 'kysely-codegen';

import { bookCategories } from '@/shared/enums';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.createType('categories').asEnum(bookCategories).execute();
  await db.schema
    .createTable('bookCategories')
    .addColumn('categories', sql`"categories"`)
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('bookCategories').execute();
  await db.schema.dropType('categories').execute();
}
