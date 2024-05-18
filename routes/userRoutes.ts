import {createUserRequestSchema, userLoginRequestSchema} from "@schemas/usersSchemas";
import {
  generateJWTAccessToken,
  generateJWTRefreshToken,
  generatePasswordHash,
  setRedisKey,
  validatePassword
} from "@util/index";
import {createSingleUser, getUserByEmail} from "@datastore/userStore";
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

userRouter.post('/login', async  (req:Request, res:Response, next:NextFunction) => {
  try {
    const requestBody = userLoginRequestSchema.parse(req.body);

    const user = await getUserByEmail(requestBody.email);

    if (validatePassword(requestBody.password, user.password)) {
      const jwtPayload = {
        id: user.id,
        email: user?.email,
      };

      const accessToken = generateJWTAccessToken(
        jwtPayload,
      );
      const refreshToken = generateJWTRefreshToken(
        jwtPayload,
      );

      setRedisKey(
        user.id,
        refreshToken,
        24 * 60 * 60
      );

      // Set the cookie
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: true,
      });
      return JsonApiResponse(res, 'Success', true, null, 200);
    }

    return JsonApiResponse(res, 'Incorrect Credentials', false, null, 400);
  } catch (error) {
    next(error);
  }
})

userRouter.get('/', async (req:Request, res:Response, next:NextFunction) => {
  console.log("HELLO WORLD")
  try {
    return JsonApiResponse(res, 'Success', true, null, 200);
  } catch (error) {
    next(error);
  }
})

export default userRouter;