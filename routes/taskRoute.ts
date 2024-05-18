import {NextFunction, Request, Response, Router} from 'express';
import {createTaskRequestSchema} from "@schemas/taskSchemas";
import {getCookieDataByKey, verifyJSONToken} from "@util/index";
import {JsonApiResponse} from "@lib/response";

const taskRouter = Router();

taskRouter.post('/create', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const requestBody = createTaskRequestSchema.parse(req.body);

    requestBody.creatorId = verifyJSONToken(getCookieDataByKey(req?.headers?.cookie ?? '', 'jwt') as string, true).id

    return JsonApiResponse(res, 'Task Created', true, { ...requestBody }, 201);

  } catch (err) {
    next(err)
  }
})

export default taskRouter;