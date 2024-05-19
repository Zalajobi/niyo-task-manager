import express, { NextFunction, Request, Response, Router } from 'express';
import { createTaskRequestSchema, editTaskRequestSchema } from '@schemas/taskSchemas';
import { getCookieDataByKey, verifyJSONToken } from '@util/index';
import { JsonApiResponse } from '@lib/response';
import { createTask, deleteTaskById, getTaskById, updateTaskById } from '@datastore/taskStore';
import { getDataByIdRequestSchema } from '@schemas/commonSchema';
import { broadcastMessage } from '@lib/webSocket';

const taskRouter = Router();
taskRouter.use(express.json());

taskRouter.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestBody = createTaskRequestSchema.parse(req.body);
    const user = verifyJSONToken(
      getCookieDataByKey(req?.headers?.cookie ?? '', 'jwt') as string,
      true,
    );
    requestBody.creatorId = user?.id ?? '';

    const newTask = await createTask(requestBody);
    broadcastMessage(
      JSON.stringify({
        message: 'New Task Created By User',
        title: requestBody.title,
        dueDate: requestBody.due_date,
        priority: requestBody.priority,
        creator: user.email,
      }),
    );
    return JsonApiResponse(res, newTask.message, !!newTask, newTask.data, newTask ? 201 : 400);
  } catch (err) {
    next(err);
  }
});

taskRouter.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, ...updateBody } = editTaskRequestSchema.parse({
      ...req.body,
      ...req.params,
    });

    const updatedTask = await updateTaskById(id, updateBody);
    return JsonApiResponse(
      res,
      updatedTask.message,
      !!updatedTask,
      updatedTask.data,
      updatedTask ? 200 : 400,
    );
  } catch (err) {
    next(err);
  }
});

taskRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = getDataByIdRequestSchema.parse(req.params);

    const task = await getTaskById(id);

    return JsonApiResponse(res, task.message, !!task, task.data, task ? 200 : 400);
  } catch (err) {
    next(err);
  }
});

taskRouter.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = getDataByIdRequestSchema.parse(req.params);

    const task = await deleteTaskById(id);

    return JsonApiResponse(res, task.message, !!task, task.data, task ? 200 : 400);
  } catch (err) {
    next(err);
  }
});

export default taskRouter;
