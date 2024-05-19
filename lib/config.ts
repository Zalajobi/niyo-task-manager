import 'dotenv/config';
import * as process from 'node:process';

export const DATABASE_NAME = process.env.DATABASE_NAME!;

export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;

export const DATABASE_USERNAME = process.env.DATABASE_USERNAME!;

export const DATABASE_HOST = process.env.DATABASE_HOST!;

export const DATABASE_PORT = process.env.DATABASE_PORT!;

export const BASE_URL = process.env.TASK_MANAGER_BASE_URL!;

export const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET!;

export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;

export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN!;

export const REDIS_HOST = process.env.REDIS_HOST!;

export const REDIS_PORT = process.env.REDIS_PORT!;

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD!;

export const TWENTY_FOUR_HOURS_SECONDS = 24 * 60 * 60; // 24 hours in seconds

export const FIVE_MINUTE = 5 * 60 * 1000; // 5 minutes in milliseconds
