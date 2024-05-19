import { AppDataSource } from '../../data-source';
import { Task } from '@typeorm/entity/task';

export const taskRepo = () => {
  return AppDataSource.getRepository(Task);
};
