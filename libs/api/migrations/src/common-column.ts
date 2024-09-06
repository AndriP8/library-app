import { CreateTableBuilder, sql } from 'kysely';

export const defaultTimestamp = sql`timezone('Asia/Jakarta'::text, now())`;

export const PRIMARY_KEY_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>
) =>
  builder.addColumn('id', 'uuid', (col) =>
    col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
  );

export const TIMESTAMPS_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>
) => {
  return builder
    .addColumn('createdAt', 'text', (col) =>
      col.defaultTo(defaultTimestamp).notNull()
    )
    .addColumn('updatedAt', 'text', (col) =>
      col.defaultTo(defaultTimestamp).notNull()
    );
};
