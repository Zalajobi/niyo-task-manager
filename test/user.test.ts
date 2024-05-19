import request from 'supertest';
import {createSingleUser, getUserByEmail} from "@datastore/userStore";
import {
  generateJWTAccessToken,
  generateJWTRefreshToken,
  generatePasswordHash,
  setRedisKey,
  validatePassword
} from "@util/index";
import {createUserRequestSchema, userLoginRequestSchema} from "@schemas/usersSchemas";
import express, {NextFunction, Request, Response} from "express";
import {JsonApiResponse} from "@lib/response";
import {userRepo} from "@typeorm/repositories/userRepo";
import userRouter from "@routes/userRoutes";

jest.mock('@schemas/usersSchemas', () => ({
  createUserRequestSchema: {
    parse: jest.fn(),
  },
  userLoginRequestSchema: {
    parse: jest.fn(),
  },
}));

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneBy: jest.fn(),
  countBy: jest.fn(),
};

(userRepo as jest.Mock).mockReturnValue(mockRepository);

jest.mock('@util/index', () => ({
  generatePasswordHash: jest.fn(),
  validatePassword: jest.fn(),
  generateJWTAccessToken: jest.fn(),
  generateJWTRefreshToken: jest.fn(),
  setRedisKey: jest.fn(),
}));

jest.mock('@lib/response', () => ({
  JsonApiResponse: jest.fn(),
}));

jest.mock('@typeorm/repositories/userRepo', () => ({
  userRepo: jest.fn(),
}));

jest.mock('@datastore/userStore', () => ({
  createSingleUser: jest.fn(),

  getUserByEmail: jest.fn(),

  getUserCountById: jest.fn(),
}));

const app = express();
app.use('/user', userRouter)
app.use(express.json());

app.post('/api/users/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestBody = createUserRequestSchema.parse(req.body);
    requestBody.password = generatePasswordHash(requestBody.password);

    const newUser = await createSingleUser(requestBody);
    return JsonApiResponse(res, newUser.message, newUser.success, null, newUser.success ? 201 : 400);
  } catch (error) {
    next(error);
  }
});

describe('POST /login', () => {
  const mockUser = {
    email: 'johnDoe@gmail.com',
    password: 'password123',
  };

  const mockUserData = {
    id: '123',
    email: 'johnDoe@gmail.com',
    password: 'hashedpassword',
  };

  it('Should login user and return 200 status', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUserData);
    (validatePassword as jest.Mock).mockReturnValue(true);
    (generateJWTAccessToken as jest.Mock).mockReturnValue('accessToken');
    (generateJWTRefreshToken as jest.Mock).mockReturnValue('refreshToken');
    (userLoginRequestSchema.parse as jest.Mock).mockReturnValue(mockUser);
    (JsonApiResponse as jest.Mock).mockImplementation(
      (res, message, success, _, statusCode) =>
        res.status(statusCode).send({ message, success })
    );

    const response = await request(app).post('/user/login').send(mockUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Success',
      success: true,
    });
    expect(response.headers['set-cookie'][0]).toContain('jwt=accessToken');
    expect(setRedisKey).toHaveBeenCalledWith('123', 'refreshToken', 86400);
  });

  it('should return 400 for incorrect credentials', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUserData);
    (validatePassword as jest.Mock).mockReturnValue(false);
    (JsonApiResponse as jest.Mock).mockImplementation(
      (res, message, success, _, statusCode) =>
        res.status(statusCode).send({ message, success })
    );

    const response = await request(app).post('/user/login').send(mockUser);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'Incorrect Credentials',
      success: false,
      data: null,
    });
  });

  it('should handle user not found error', async () => {
    (getUserByEmail as jest.Mock).mockRejectedValue(new Error('User not found'));
    (JsonApiResponse as jest.Mock).mockImplementation(
      (res, message, success, _, statusCode) =>
        res.status(statusCode).send({ message, success })
    );

    const response = await request(app).post('/user/login').send(mockUser);
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/User not found/i);
  });

  it('should handle validation errors', async () => {
    const invalidUser = {
      email: 'invalid-email',
      password: 'short'
    };

    (userLoginRequestSchema.parse as jest.Mock).mockImplementation(() => {
      throw new Error('Validation failed');
    });

    const response = await request(app).post('/user/login').send(invalidUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Validation failed/i);
  });
});


// Create User
describe('POST /create', () => {
  const mockUser = {
    email: 'johnDoe@gmail.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe'
  };

  it('Should create a new user and return 201 status', async () => {
    (createUserRequestSchema.parse as jest.Mock).mockImplementation((data: any) => data);
    (generatePasswordHash as jest.Mock).mockImplementation((password: string) => password);

    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(mockUser);
    (JsonApiResponse as jest.Mock).mockImplementation(
      (res, message, success, _, statusCode) =>
        res.status(statusCode).send({ message, success })
    );

    const response = await request(app).post('/api/users/create').send(mockUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: 'User created successfully',
      success: true,
    });
    expect(createUserRequestSchema.parse).toHaveBeenCalledWith(mockUser);
    expect(generatePasswordHash).toHaveBeenCalledWith('password123');
  });

  it('Should fail to create user', async () => {
    (createUserRequestSchema.parse as jest.Mock).mockImplementation((data: any) => data);
    (generatePasswordHash as jest.Mock).mockImplementation((password: string) => password);
    (createSingleUser as jest.Mock).mockRejectedValue(new Error('Email already exists'));
    (JsonApiResponse as jest.Mock).mockImplementation(
      (res: Response, message: string, success: boolean, _: any, statusCode: number) =>
        res.status(statusCode).send({ message, success })
    );

    const response = await request(app).post('/api/users/create').send(mockUser);
    expect(response.statusCode).toBe(500);
    expect(JSON.stringify(response.error)).toMatch(/Email already exists/i);
  });

  it('should handle validation errors', async () => {
    (createUserRequestSchema.parse as jest.Mock).mockImplementation(() => {
      throw new Error('Validation failed');
    });

    const response = await request(app).post('/api/users/create').send({
      ...mockUser,
      email: 'invalid-email',
      password: 'short'
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.stringify(response.error)).toMatch(/Validation failed/i);
  });
});
