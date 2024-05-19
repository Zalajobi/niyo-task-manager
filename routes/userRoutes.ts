import { createUserRequestSchema, userLoginRequestSchema } from '@schemas/usersSchemas';
import {
  generateJWTAccessToken,
  generateJWTRefreshToken,
  generatePasswordHash,
  setRedisKey,
  validatePassword,
} from '@util/index';
import { createSingleUser, getUserByEmail } from '@datastore/userStore';
import { JsonApiResponse } from '@lib/response';
import express, { NextFunction, Router, Response, Request } from 'express';
import { TWENTY_FOUR_HOURS_SECONDS } from '@lib/config';
import {broadcastMessage} from "@lib/webSocket";

const userRouter = Router();
userRouter.use(express.json());

userRouter.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestBody = createUserRequestSchema.parse(req.body);
    requestBody.password = generatePasswordHash(requestBody.password);

    const newUser = await createSingleUser(requestBody);
    broadcastMessage(JSON.stringify({
      message: 'New User',
      email: requestBody.email,
      firstName: requestBody.first_name,
      lastName: requestBody.last_name
    }));
    return JsonApiResponse(res, newUser.message, !!newUser, null, newUser ? 201 : 400);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = userLoginRequestSchema.parse(req.body);
    const user = await getUserByEmail(email);

    if (validatePassword(password, user.password)) {
      const jwtPayload = {
        id: user.id,
        email: user?.email,
      };

      const accessToken = generateJWTAccessToken(jwtPayload);
      const refreshToken = generateJWTRefreshToken(jwtPayload);
      setRedisKey(user.id, refreshToken, TWENTY_FOUR_HOURS_SECONDS);

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
});

export default userRouter;
