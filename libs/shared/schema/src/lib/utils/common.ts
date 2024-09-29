import { z, ZodSchema } from 'zod';

export type PickPartial<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>;

type ReadData = {
  path: string;
  response: ZodSchema;
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
