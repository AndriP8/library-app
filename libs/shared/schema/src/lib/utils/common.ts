import { z, ZodSchema } from 'zod';

export type PickPartial<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>;

type ReadData = {
  path: string;
  response: ZodSchema;
  query?: ZodSchema;
};
type ManipulationData = {
  path: string;
  response: ZodSchema;
  body: ZodSchema;
  params?: ZodSchema;
};
export type SchemaType = {
  read: ReadData;
  readDetail: ReadData;
  create: ManipulationData;
  update: ManipulationData;
  delete: Omit<ManipulationData, 'body'>;
} & Record<string, ReadData | ManipulationData>;

export const defaultResponse = z
  .object({
    statusCode: z.number(),
    message: z.string(),
  })
  .strict();

export const defaultQuery = z.object({
  page: z.number().default(1),
  size: z.number().default(10),
  search: z.string().optional(),
});

export const pagination = z.object({
  page: z.number(),
  size: z.number(),
  totalSize: z.number(),
  totalPages: z.number(),
});
