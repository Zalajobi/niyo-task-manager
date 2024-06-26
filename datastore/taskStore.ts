import { createTaskRequestSchema } from '@schemas/taskSchemas';
import { z } from 'zod';
import { taskRepo } from '@typeorm/repositories/taskRepo';
import { Task } from '@typeorm/entity/task';
import { DefaultJsonResponse } from '@lib/response';

export const createTask = async (taskData: z.infer<typeof createTaskRequestSchema>) => {
  const taskRepository = taskRepo();

  const newTask = await taskRepository.save(new Task(taskData));

  return DefaultJsonResponse(newTask ? 'Task Created' : 'Failed to create task', {}, !!newTask);
};

export const updateTaskById = async (id: string, data: Object) => {
  const taskRepository = taskRepo();

  const updatedData = await taskRepository.update(
    {
      id,
    },
    data,
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1 ? 'Task Successfully Updated' : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1,
  );
};

export const getTaskById = async (id: string) => {
  const taskRepository = taskRepo();

  const task = await taskRepository.findOne({
    where: {
      id,
    },
    select: {
      title: true,
      description: true,
      due_date: true,
      priority: true,
      status: true,
      assigneeId: true,
      created_at: true,
    },
  });

  return DefaultJsonResponse(task ? 'Task Found' : 'Task not found', task, !!task);
};

export const deleteTaskById = async (id: string) => {
  const taskRepository = taskRepo();

  const deletedTask = await taskRepository.delete({
    id,
  });

  return DefaultJsonResponse(
    Number(deletedTask?.affected) >= 1 ? 'Task Successfully Deleted' : 'Something Went Wrong',
    null,
    Number(deletedTask?.affected) >= 1,
  );
};
