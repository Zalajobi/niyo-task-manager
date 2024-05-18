import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, PASSWORD_HASH_SECRET} from "@lib/config";
import {JWTDataProps} from "@type/index.types";
import redisClient from "@lib/redis";

export const generatePasswordHash = (password: string) => {
  return crypto
    .pbkdf2Sync(password, PASSWORD_HASH_SECRET, 1000, 64, 'sha512')
    .toString('hex');
};

export const validatePassword = (
  reqPassword: string,
  comparePassword: string
) => {
  const generatedPasswordHash = crypto
    .pbkdf2Sync(reqPassword, PASSWORD_HASH_SECRET, 1000, 64, 'sha512')
    .toString('hex');

  return generatedPasswordHash === comparePassword;
};

export const generateJWTAccessToken = (
  data: JWTDataProps,
) => {
  return jwt.sign(data, JWT_ACCESS_TOKEN, {
    expiresIn: '15m',
  });
};

export const generateJWTRefreshToken = (
  data: JWTDataProps,
) => {
  return jwt.sign(data, JWT_REFRESH_TOKEN, {
    expiresIn:  '1d',
  });
};

export const setRedisKey = async (key: string, value: string, expiry: number) => {
  const client = redisClient.getClient();
  await client.set(key, value, {
    EX: expiry,
    NX: true,
  });
};

export const getRedisKey = async (key: string) => {
  const client = redisClient.getClient();

  return await client.get(key);
};

export const getCookieDataByKey = (cookie: string, key: string) => {
  const cookies = cookie.split(';').map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === key) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

export const verifyJSONToken = (bearerToken: string): JWTDataProps | null => {
  let jwtData: JWTDataProps | null = null;

  jwt.verify(bearerToken, JWT_ACCESS_TOKEN, (err: any, user: any) => {
    if (err) throw err;

    if (user) jwtData = user;
  });

  return jwtData;
};
