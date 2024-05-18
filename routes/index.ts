import { Router } from 'express';
import {BASE_URL} from "@lib/config";
import userRouter from "@routes/userRoutes";
import taskRouter from "@routes/taskRoute";

const rootRouter = Router();

rootRouter.use(`${BASE_URL}/user`, userRouter);
rootRouter.use(`${BASE_URL}/task`, taskRouter);

export default rootRouter;
