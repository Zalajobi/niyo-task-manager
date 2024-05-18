import {createTaskRequestSchema} from "@schemas/taskSchemas";
import {z} from "zod";
import {taskRepo} from "@typeorm/repositories/taskRepo";
import {Task} from "@typeorm/entity/task";
import {DefaultJsonResponse} from "@lib/response";

export const createTask = async (taskData: z.infer<typeof createTaskRequestSchema>) => {
  const taskRepository = taskRepo();

  const newTask = await taskRepository.save(new Task(taskData));

  return DefaultJsonResponse(newTask ? 'Task Created' : 'Failed to create task', {}, !!newTask)
}