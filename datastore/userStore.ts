import {userRepo} from "@typeorm/repositories/userRepo";
import {createUserRequestSchema} from "@schemas/usersSchemas";
import {z} from "zod";
import {DefaultJsonResponse} from "@lib/response";

export const createSingleUser = async (data: z.infer<typeof createUserRequestSchema>) => {
  const userRepository = userRepo();

  const isUnique = await userRepository.countBy({
    email: data.email,
  });

  if (isUnique > 0) {
    throw new Error('Email already exists');
  }

  const user = await userRepository.save(data);

  return DefaultJsonResponse(user ? 'User created successfully' : 'Failed to create user', null, !!user)
}