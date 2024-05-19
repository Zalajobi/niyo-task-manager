import taskRouter from "@routes/taskRoute";
import request from "supertest";
import express from "express";
import taskRoute from "@routes/taskRoute";
import {createTaskRequestSchema} from "@schemas/taskSchemas";
import {generateJWTAccessToken, getCookieDataByKey, verifyJSONToken} from "@util/index";
import {createTask} from "@datastore/taskStore";
import {DefaultJsonResponse, JsonApiResponse} from "@lib/response";


const app = express();
app.use('/task', taskRoute)
app.use(express.json());

jest.mock('@util/index', () => ({
  // generatePasswordHash: jest.fn(),
  // validatePassword: jest.fn(),
  generateJWTAccessToken: jest.fn(),
  // generateJWTRefreshToken: jest.fn(),
  // setRedisKey: jest.fn(),
  verifyJSONToken: jest.fn(),
  getCookieDataByKey: jest.fn(),
}));

jest.mock('@lib/response', () => ({
  JsonApiResponse: jest.fn(),
  DefaultJsonResponse: jest.fn(),
}));

jest.mock('@datastore/taskStore', () => ({
  createTask: jest.fn(),
}));

// const mockRepository = {
//   findOne: jest.fn(),
//   save: jest.fn(),
//   create: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
// };
//
// (taskRepo as jest.Mock).mockReturnValue(mockRepository);

jest.mock('@schemas/taskSchemas', () => ({
  createTaskRequestSchema: {
    parse: jest.fn(),
  },
  editTaskRequestSchema: {
    parse: jest.fn(),
  },
}));

jest.mock('@schemas/commonSchema', () => ({
  getDataByIdRequestSchema: {
    parse: jest.fn(),
  },
}));

describe('POST /create', () => {
  const newTaskData = {
    title: 'Test Task',
    description: 'This is a test task',
    due_date: '2024-05-30',
    priority: 'High',
    status: 'Pending',
    // creatorId: '123456789'
  };

  beforeEach(() => {
    (createTaskRequestSchema.parse as jest.Mock).mockImplementation((data: any) => data);
    (verifyJSONToken as jest.Mock).mockImplementation((data: any) => data);
    (getCookieDataByKey as jest.Mock).mockImplementation((data: any) => data);
    (generateJWTAccessToken as jest.Mock).mockImplementation((data: any) => data);
    (createTask as jest.Mock).mockImplementation((data: any) => data);
    (JsonApiResponse as jest.Mock).mockImplementation(
      (res, message, success, _, statusCode) =>
        res.status(statusCode).send({ message, success })
    );
    (DefaultJsonResponse as jest.Mock).mockImplementation((message:string, data:any, success:boolean) => ({
      message,
      data,
      success,
    }));
  })

  it('should create a new task', async () => {
    const response = await request(app)
      .post('/task/create')
      .send(newTaskData);

    expect(response.body.success).toBe(true);
    expect(response.statusCode).toBe(201);
  });
});