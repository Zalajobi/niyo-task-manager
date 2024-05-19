import {NextFunction, Response, Request} from "express";
import {bearerTokenSchema} from "@schemas/commonSchema";
import {generateJWTAccessToken, getRedisKey, verifyJSONToken} from "@util/index";
import {JsonApiResponse} from "@lib/response";
import {getUserCountById} from "@datastore/userStore";
import {FIVE_MINUTE} from "@lib/config";

export const authorizeRequest = async (req: Request, res: Response, next: NextFunction) => {
  const whitelistedEndpoints = [
    '/user/login',
    '/user/create',
  ];

  if (whitelistedEndpoints.some((whitelist) => req.url.includes(whitelist))) {
    next();
  } else {
    const { cookie: accessToken } = bearerTokenSchema.parse(req.headers);

    // If Access token is not retrieved from cookies
    if (!accessToken)
      return JsonApiResponse(res, 'Not Authorized', false, null, 401);

    try {
      const tokenUser = verifyJSONToken(accessToken, true);
      if (tokenUser) {
        const remainingTime = Number(tokenUser?.exp) * 1000 - Date.now();

        // If the remaining time is above 5 minutes, verify if the user exists
        // else, reset the accessToken and also check if the user exists
        if (remainingTime < FIVE_MINUTE) {
          const refreshToken = await getRedisKey(tokenUser?.id);
          const verifiedRefreshToken = verifyJSONToken(refreshToken as string, false);

          // If the refresh token is verified, verify the user and generate a new access token
          if (verifiedRefreshToken) {
            const { exp, iat, ...tokenPayload } = verifiedRefreshToken;
            const userExists = await getUserCountById(tokenPayload.id);
            if (userExists > 0) {
              const accessToken = generateJWTAccessToken(tokenPayload);
              res.cookie('jwt', accessToken, {
                httpOnly: true,
                secure: true,
              });
            } else {
              return JsonApiResponse(res, 'Not Authorized', false, null, 401);
            }
          }
        } else {
          // Check if user exists
          const userExists = await getUserCountById(tokenUser.id);
          if (userExists === 0) {
            return JsonApiResponse(res, 'Not Authorized', false, null, 401);
          }
        }
      }
    } catch (err) {
      next(err);
    }

    next();
  }
};