import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';

import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from '@/api/utils';
export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('categories')
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .$call(TIMESTAMPS_COLUMN)
    .execute();
  await db.schema
    .createTable('bookCategories')
    .addColumn('bookId', 'uuid', (col) =>
      col.references('books.id').onDelete('cascade').onUpdate('cascade')
    )
    .addColumn('categoryId', 'uuid', (col) =>
      col.references('categories.id').onDelete('cascade').onUpdate('cascade')
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('bookCategories').execute();
  await db.schema.dropTable('categories').execute();
}
