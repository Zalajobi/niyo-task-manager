import {z} from "zod";
import {getCookieDataByKey} from "@util/index";

export const bearerTokenSchema = z.object({
  cookie: z
    .string()
    .transform((data) => getCookieDataByKey(data, 'jwt')),
})

export const dateSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }
}, z.string())

export const statusSchema = z.preprocess((val) => {
  if (typeof val === 'string')
    return val.toUpperCase();

  return val
}, z.enum(['OPEN', 'IN_PROGRESS', 'DONE']))

export const prioritySchema = z.preprocess((val) => {
  if (typeof val === 'string')
    return val.toUpperCase();

  return val
}, z.enum(['LOW', 'MEDIUM', 'HIGH']))
