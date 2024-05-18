import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME} from "@lib/config";
import {User} from "@typeorm/entity/user";
import {Task} from "@typeorm/entity/task";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Task
  ],
  migrations: [
    User,
    Task
  ],
  subscribers: [],
});
