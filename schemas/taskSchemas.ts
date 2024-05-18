import {z} from "zod";

export const createTaskRequestSchema = z.object({
  title: z.string(),
  description: z.string().min(10, 'Description too short'),
  due_date: z.preprocess((val) => {
    if (typeof val === 'string') {
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date.toISOString();
    }
  }, z.string()),
  priority: z.preprocess((val) => {
    if (typeof val === 'string')
      return val.toUpperCase();

    return val
  }, z.enum(['LOW', 'MEDIUM', 'HIGH'])),
  status: z.preprocess((val) => {
    if (typeof val === 'string')
      return val.toUpperCase();

    return val
  }, z.enum(['OPEN', 'IN_PROGRESS', 'DONE'])),
  assigneeId: z.string().optional(),
  creatorId: z.string().optional(),
})