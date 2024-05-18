import { AppDataSource } from '../../data-source';
import {User} from "@typeorm/entity/user";

export const userRepo = () => {
  return AppDataSource.getRepository(User);
};
