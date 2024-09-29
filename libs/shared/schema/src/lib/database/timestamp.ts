import { z } from 'zod';

export const TimeStamp = {
  createdAt: z.string(),
  updatedAt: z.string(),
};
