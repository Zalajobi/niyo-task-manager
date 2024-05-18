import {NextFunction, Request, Response, Router} from 'express';
import {createTaskRequestSchema} from "@schemas/taskSchemas";
import {getCookieDataByKey, verifyJSONToken} from "@util/index";
import {JsonApiResponse} from "@lib/response";
import {createTask} from "@datastore/taskStore";

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
})

export default taskRouter;