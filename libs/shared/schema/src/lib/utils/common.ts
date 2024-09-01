import { z, ZodSchema } from 'zod';

type ReadData = {
  path: string;
  response: ZodSchema;
};
type ManipulationData = {
  path: string;
  response: ZodSchema;
  body: ZodSchema;
};
export type SchemaType = {
  read: ReadData;
  readDetail: ReadData;
  create: ManipulationData;
  update: ManipulationData;
  delete: ManipulationData;
} & Record<string, ReadData | ManipulationData>;

export const defaultResponse = z
  .object({
    statusCode: z.number(),
    message: z.string(),
  })
  .strict();
