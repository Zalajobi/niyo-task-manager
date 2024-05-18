import { Response } from 'express';

export const JsonApiResponse = (
  res: Response,
  message: string,
  success: boolean,
  data: Record<string, any> | Record<string, any>[] | null,
  statusCode: number
) => {
  res.status(statusCode).json({
    message,
    success,
    data,
  });
};

export const DefaultJsonResponse = (
  message: string,
  data: any,
  success: boolean
) => {
  return {
    message,
    data,
    success,
  };
};
