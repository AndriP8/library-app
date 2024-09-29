import { z } from 'zod';

import { TimeStamp } from './timestamp';

export const BookCategories = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .extend(TimeStamp);
