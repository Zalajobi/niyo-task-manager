import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  QueryFailedError,
  QueryRunnerAlreadyReleasedError,
  TransactionAlreadyStartedError,
  TransactionNotStartedError,
  UpdateValuesMissingError,
} from 'typeorm';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JsonApiResponse } from '@lib/response';

export const errorMiddleware = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Schema Validation Error
  if (err instanceof ZodError) {
    return JsonApiResponse(res, 'Schema Validation Error', false, null, 400, {
      type: 'validation_error',
      message: 'Validation error',
      errors: err.format(),
      name: err.name,
    });
  }

  // Query Failed Error
  if (err instanceof QueryFailedError) {
    return JsonApiResponse(res, 'Query Failed Error', false, null, 500, {
      type: 'database_error',
      message: err.message,
      errors: err.stack,
      name: err.name,
    });
  }

  // Entity Not Found
  if (err instanceof EntityNotFoundError) {
    return JsonApiResponse(res, 'Entity Not Found', false, null, 404, {
      type: 'database_error',
      message: err.message,
      name: err.name,
    });
  }

  // Query Runner Already Released Error
  if (err instanceof QueryRunnerAlreadyReleasedError) {
    return JsonApiResponse(res, 'Query Runner Already Released', false, null, 500, {
      type: 'database_error',
      message: err.message,
      name: err.name,
    });
  }

  // Transaction Already Started Error
  if (err instanceof TransactionAlreadyStartedError) {
    JsonApiResponse(res, 'Transaction Already Started', false, null, 500, {
      type: 'database_error',
      message: 'Transaction already started',
      name: err.name,
    });
  }

  // Transaction Not Started Error
  if (err instanceof TransactionNotStartedError) {
    return JsonApiResponse(res, 'Transaction Not Started', false, null, 500, {
      type: 'database_error',
      message: 'Transaction not started',
      name: err.name,
    });
  }

  // JWT Error
  if (err instanceof JsonWebTokenError) {
    return JsonApiResponse(res, 'JWT Token Error', false, null, 401, {
      type: 'jwt_error',
      message: err.message,
      name: err.name,
    });
  }

  // Error Updating Data - Missing Columns to update
  if (err instanceof UpdateValuesMissingError) {
    JsonApiResponse(res, 'Missing Update Body', false, null, 500, {
      type: 'postgres_error',
      message: err.message,
      name: err.name,
    });
    return;
  }

  // Entity Not Found Error - TypeORM Error
  if (err instanceof EntityPropertyNotFoundError) {
    JsonApiResponse(res, 'Entity Property Not Found', false, null, 500, {
      type: 'postgres_error',
      message: err.message,
      name: err.name,
    });
    return;
  }

  // Badly Formed JSON Error From Post request
  if (err instanceof SyntaxError && 'body' in err) {
    JsonApiResponse(res, 'Bad JSON', false, null, 400, {
      type: 'bad_json',
      message: err.message,
      name: err.name,
    });
    return;
  }

  // JWT TOKEN Expired Error
  if (err instanceof TokenExpiredError) {
    return JsonApiResponse(res, 'Token Expired', false, null, 401, {
      type: 'jwt_error',
      message: 'Token Expired',
      name: err.name,
    });
  }

  // Generic Error
  if (err instanceof Error) {
    JsonApiResponse(res, 'Error', false, null, 500, {
      type: 'api_error',
      message: err.message,
      name: err.name,
    });
    return;
  }
};
