import {z} from "zod";
import {getCookieDataByKey} from "@util/index";

export const bearerTokenSchema = z.object({
  cookie: z
    .string()
    .transform((data) => getCookieDataByKey(data, 'jwt')),
})