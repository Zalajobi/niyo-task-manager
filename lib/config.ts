import 'dotenv/config';
import * as process from "node:process";

export const DATABASE_NAME = process.env.DATABASE_NAME!;

export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;

export const DATABASE_USERNAME = process.env.DATABASE_USERNAME!;

export const DATABASE_HOST = process.env.DATABASE_HOST!;

export const DATABASE_PORT = process.env.DATABASE_PORT!;

export const BASE_URL = process.env.TASK_MANAGER_BASE_URL!;

export const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET!;

export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;

export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN!;