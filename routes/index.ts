import { Router } from 'express';
import {BASE_URL} from "@lib/config";
import userRouter from "@routes/userRoutes";

const rootRouter = Router();

rootRouter.use(`${BASE_URL}/user`, userRouter);

export default rootRouter;
