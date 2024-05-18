import {Request, Response, Router} from 'express';
import {BASE_URL} from "@lib/config";
import userRouter from "@routes/userRoutes";
import taskRouter from "@routes/taskRoute";
import {JsonApiResponse} from "@lib/response";

const rootRouter = Router();

rootRouter.get('/', (_req:Request, res:Response) => {
  return JsonApiResponse(res, 'Welcome to the Task Manager API', true, null, 200)
})

rootRouter.use(`${BASE_URL}/user`, userRouter);
rootRouter.use(`${BASE_URL}/task`, taskRouter);

export default rootRouter;
