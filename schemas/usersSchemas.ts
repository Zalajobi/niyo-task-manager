import { z } from 'zod';

export const createUserRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  first_name: z.string().min(4, 'First name must be at least 4 characters long'),
  last_name: z.string().min(4, 'Last name must be at least 4 characters long'),
});

export const userLoginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});
