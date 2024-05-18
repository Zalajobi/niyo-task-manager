import {z} from "zod";
import {dateSchema, prioritySchema, statusSchema} from "@schemas/commonSchema";

export const createTaskRequestSchema = z.object({
  title: z.string(),
  description: z.string().min(10, 'Description too short'),
  due_date: dateSchema,
  priority: prioritySchema,
  status: statusSchema,
  assigneeId: z.string().optional(),
  creatorId: z.string().optional(),
})

export const editTaskRequestSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().min(10, 'Description too short'),
  due_date: dateSchema.optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  assigneeId: z.string().optional(),
})
