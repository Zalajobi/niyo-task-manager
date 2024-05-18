import {createUserRequestSchema} from "@schemas/usersSchemas";
import {generatePasswordHash} from "@util/index";
import {createSingleUser} from "@datastore/userStore";
import {JsonApiResponse} from "@lib/response";
import {NextFunction, Router, Response, Request} from "express";

const userRouter = Router();

userRouter.post('/create', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const requestBody = createUserRequestSchema.parse(req.body);
    requestBody.password = generatePasswordHash(requestBody.password);


    const newUser = await createSingleUser(requestBody);

    return JsonApiResponse(res, newUser.message, newUser?.success, null, newUser.success ? 201 : 400)
  } catch (error) {
    next(error);
  }
})

export default userRouter;