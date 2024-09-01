import { z } from 'zod';

// type AnyObj = Record<PropertyKey, unknown>;

// type ZodObj<T extends AnyObj> = {
//   [key in keyof T]: z.ZodType<T[key]>;
// };

// const zObject = <T extends AnyObj>(arg: ZodObj<T>) => z.object(arg);
// TODO: update to match with schema from DB
export const User = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
