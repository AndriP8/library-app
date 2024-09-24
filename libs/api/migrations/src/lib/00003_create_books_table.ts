import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';

import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from '@/api/utils';

export async function up(db: Kysely<DB>): Promise<void> {
  // Create books table
  await db.schema
    .createTable('books')
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .addColumn('title', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('coverImage', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('publisher', 'varchar(255)', (col) => col.notNull())
    .addColumn('datePublished', 'text', (col) => col.notNull())
    .addColumn('language', 'varchar(255)', (col) => col.notNull())
    .addColumn('isbn', 'integer', (col) => col.notNull())
    .addColumn('totalPage', 'integer', (col) => col.notNull())
    .addColumn('weight', 'integer', (col) => col.notNull())
    .addColumn('price', 'integer', (col) => col.notNull())
    .addColumn('discount', 'integer')
    .execute();

  // Create authors table
  await db.schema
    .createTable('authors')
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('firstName', 'varchar(255)', (col) => col.notNull())
    .addColumn('lastName', 'varchar(255)', (col) => col.defaultTo(''))
    .addColumn('bio', 'text', (col) => col.notNull())
    .addColumn('avatarUrl', 'text', (col) => col.notNull())
    .addColumn('totalPublishedBook', 'integer', (col) =>
      col.defaultTo(0).notNull()
    )
    .$call(TIMESTAMPS_COLUMN)
    .addUniqueConstraint('unique_author', ['firstName', 'lastName'])
    .execute();

  // Create bookAuthors table
  await db.schema
    .createTable('bookAuthors')
    .addColumn('bookId', 'uuid', (col) =>
      col.references('books.id').onDelete('cascade').onUpdate('cascade')
    )
    .addColumn('authorId', 'uuid', (col) =>
      col.references('authors.id').onDelete('cascade').onUpdate('cascade')
    )
    .addPrimaryKeyConstraint('bookAuthors_pk', ['bookId', 'authorId'])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('bookAuthors').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('authors').execute();
}
