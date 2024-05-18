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
import { JsonWebTokenError } from 'jsonwebtoken';
import {JsonApiResponse} from "@lib/response";

export const errorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Handle Middleware Error');

  // Schema Validation Error
  if (err instanceof ZodError) {
    console.log('Schema Validation Error');
    JsonApiResponse(res, 'Schema Validation Error', false, {
      error: {
        type: 'validation_error',
        message: 'Validation error',
        errors: err.format(),
        name: err.name
      },
    }, 400);
    return;
  }

  // Query Failed Error
  if (err instanceof QueryFailedError) {
    console.log('Database Query Failed');
    JsonApiResponse(res, 'Query Failed Error', false, {
      error: {
        type: 'database_error',
        message: err.message,
        errors: err.stack,
        name: err.name,
      },
    }, 500);
    return;
  }

  // Entity Not Found
  if (err instanceof EntityNotFoundError) {
    console.log('Entity Not Found');
    JsonApiResponse(res, 'Entity Not Found', false, {
      error: {
        type: 'database_error',
        message: err.message,
        name: err.name,
      },
    }, 404);
    return;
  }

  // Query Runner Already Released Error
  if (err instanceof QueryRunnerAlreadyReleasedError) {
    console.log('Query Runner Already Released');
    JsonApiResponse(res, 'Query Runner Already Released', false, {
      error: {
        type: 'database_error',
        message: err.message,
        name: err.name,
      },
    }, 500);
    return
  }

  // Transaction Already Started Error
  if (err instanceof TransactionAlreadyStartedError) {
    console.log('Transaction Already Started');
    JsonApiResponse(res, 'Transaction Already Started', false, {
      error: {
        type: 'database_error',
        message: 'Transaction already started',
        name: err.name,
      },
    }, 500);
    return;
  }

  // Transaction Not Started Error
  if (err instanceof TransactionNotStartedError) {
    console.log('Transaction Not Started');
    JsonApiResponse(res, 'Transaction Not Started', false, {
      error: {
        type: 'database_error',
        message: 'Transaction not started',
        name: err.name,
      },
    }, 500);
    return;
  }

  // JWT Error
  if (err instanceof JsonWebTokenError) {
    console.log('JWT Error');
    if (err instanceof UpdateValuesMissingError) {
      console.log('Missing Update Body');
      JsonApiResponse(res, 'Missing Update Body', false, {
        error: {
          type: 'jwt_error',
          message: err.message,
          name: err.name,
        },
      }, 401);
    }
    return;
  }

  // Error Updating Data - Missing Columns to update
  if (err instanceof UpdateValuesMissingError) {
    console.log('Missing Update Body');
    JsonApiResponse(res, 'Missing Update Body', false, {
      error: {
        type: 'postgres_error',
        message: err.message,
        name: err.name,
      },
    }, 500);
    return;
  }

  // Entity Not Found Error - TypeORM Error
  if (err instanceof EntityPropertyNotFoundError) {
    console.log('Entity Property Not Found');
    JsonApiResponse(res, 'Entity Property Not Found', false, {
      error: {
        type: 'postgres_error',
        message: err.message,
        name: err.name,
      },
    }, 500);
    return;
  }

  // Badly Formed JSON Error From Post request
  if (err instanceof SyntaxError && 'body' in err) {
    console.log('Bad JSON');
    JsonApiResponse(res, 'Bad JSON', false, {
      error: {
        type: 'bad_json',
        message: err.message,
        name: err.name,
      }
    }, 400);
    return;
  }

  // JWT TOKEN Expired Error
  if (err.name === 'TokenExpiredError') {
    console.log('JWT Token Expired');
    JsonApiResponse(res, 'Token Expired', false, {
      error: {
        type: 'jwt_error',
        message: 'Token Expired',
        name: err.name,
      }
    }, 401);
    return;
  }

  // Generic Error
  if (err instanceof Error) {
    console.log('General Error');
    JsonApiResponse(res, 'Token Expired', false, {
      error: {
        type: 'api_error',
        message: err.message,
        name: err.name,
      }
    }, 500);
    return;
  }
};
