import {NextFunction, Request, Response, Router} from 'express';
import {createTaskRequestSchema, editTaskRequestSchema} from "@schemas/taskSchemas";
import {getCookieDataByKey, verifyJSONToken} from "@util/index";
import {JsonApiResponse} from "@lib/response";
import {createTask, deleteTaskById, getTaskById, updateTaskById} from "@datastore/taskStore";
import {getDataByIdRequestSchema} from "@schemas/commonSchema";

const taskRouter = Router();

taskRouter.post('/create', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const requestBody = createTaskRequestSchema.parse(req.body);

    requestBody.creatorId = verifyJSONToken(getCookieDataByKey(req?.headers?.cookie ?? '', 'jwt') as string, true).id

    const newTask = await createTask(requestBody);
    return JsonApiResponse(res, newTask.message, newTask.success, newTask.data, newTask.success ? 201 : 400)
  } catch (err) {
    next(err)
  }
});

taskRouter.put('/update/:id', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const {id, ...updateBody} = editTaskRequestSchema.parse({
      ...req.body,
      ...req.params
    });

    const updatedTask = await updateTaskById(id, updateBody);

    return JsonApiResponse(res, updatedTask.message, updatedTask.success, updatedTask.data, updatedTask.success ? 200 : 400)
  } catch (err) {
    next(err)
  }
});

taskRouter.get('/:id', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const {id} = getDataByIdRequestSchema.parse(req.params)

    const task = await getTaskById(id);

    return JsonApiResponse(res, task.message, task.success, task.data, task.success ? 200 : 400)
  } catch (err) {
    next(err)
  }
});

taskRouter.delete('/delete/:id', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const {id} = getDataByIdRequestSchema.parse(req.params)

    const task = await deleteTaskById(id);

    return JsonApiResponse(res, task.message, task.success, task.data, task.success ? 200 : 400)
  } catch (err) {
    next(err)
  }
});

export default taskRouter;