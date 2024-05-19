import request from "supertest";
import express from "express";
import taskRoute from "@routes/taskRoute";
import {createTaskRequestSchema, editTaskRequestSchema} from "@schemas/taskSchemas";
import {generateJWTAccessToken, getCookieDataByKey, verifyJSONToken} from "@util/index";
import {createTask, deleteTaskById, updateTaskById} from "@datastore/taskStore";
import {DefaultJsonResponse, JsonApiResponse} from "@lib/response";
import {getDataByIdRequestSchema} from "@schemas/commonSchema";
import {createSingleUser} from "@datastore/userStore";


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
  updateTaskById: jest.fn(),
  deleteTaskById: jest.fn()
}));

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

  it('should return 400 if request data is invalid', async () => {
    (createTaskRequestSchema.parse as jest.Mock).mockImplementation(() => {
      throw new Error('Validation failed');
    });
    const invalidTaskData = {
      title: 'Test Task',
      description: 'Short',
      due_date: '2024-05-30',
      priority: 'High',
      status: 'Pending',
    };

    const response = await request(app)
      .post('/task/create')
      .send(invalidTaskData);

    expect(response.statusCode).toBe(500);
    expect(JSON.stringify(response.error)).toMatch(/Validation failed/i);
  });
});

describe('PUT /update', () => {
  const updateTask = {
    title: 'Update Task',
    description: 'This is a test task',
    due_date: '2024-05-30',
    priority: 'High',
    status: 'Pending',
  };

  beforeEach(() => {
    (editTaskRequestSchema.parse as jest.Mock).mockImplementation((data: any) => data);
    (verifyJSONToken as jest.Mock).mockImplementation((data: any) => data);
    (getCookieDataByKey as jest.Mock).mockImplementation((data: any) => data);
    (generateJWTAccessToken as jest.Mock).mockImplementation((data: any) => data);
    (createTask as jest.Mock).mockImplementation((data: any) => data);
    (updateTaskById as jest.Mock).mockImplementation((data: any) => data);
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

  it('should update a new task', async () => {
    const response = await request(app)
      .put(`/task/update/123456789`)
      .send(updateTask);

    expect(response.body.success).toBe(true);
    expect(response.statusCode).toBe(200);
  });

  it('should return 400 if request data is invalid', async () => {
    (editTaskRequestSchema.parse as jest.Mock).mockImplementation(() => {
      throw new Error('Validation failed');
    });
    const invalidTaskData = {
      title: 'Test Task',
      description: 'Short',
      due_date: '2024-05-30',
      priority: 'High',
      status: 'Pending',
    };

    const response = await request(app)
      .put('/task/update/123456789')
      .send(invalidTaskData);

    expect(response.statusCode).toBe(500);
    expect(JSON.stringify(response.error)).toMatch(/Validation failed/i);
  });
});

describe('DELETE /delete', () => {
  const updateTask = {
    title: 'Update Task',
    description: 'This is a test task',
    due_date: '2024-05-30',
    priority: 'High',
    status: 'Pending',
  };

  beforeEach(() => {
    (getDataByIdRequestSchema.parse as jest.Mock).mockImplementation((data: any) => data);
    (verifyJSONToken as jest.Mock).mockImplementation((data: any) => data);
    (getCookieDataByKey as jest.Mock).mockImplementation((data: any) => data);
    (generateJWTAccessToken as jest.Mock).mockImplementation((data: any) => data);
    (deleteTaskById as jest.Mock).mockImplementation((data: any) => data);
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

  it('should delete a new task', async () => {
    const response = await request(app)
      .delete(`/task/delete/123456789`)

    expect(response.body.success).toBe(true);
    expect(response.statusCode).toBe(200);
  });

  it('should return 500 fir invalid task id', async () => {
    (deleteTaskById as jest.Mock).mockRejectedValue(new Error(`No task with such Id`));
    (JsonApiResponse as jest.Mock).mockImplementation(
      (res: any, message: string, success: boolean, _: any, statusCode: number) =>
        res.status(statusCode).send({ message, success })
    );
    const response = await request(app)
      .delete('/task/delete/123456789')

    expect(response.statusCode).toBe(500);
    expect(JSON.stringify(response.error)).toMatch(/No task with such Id/i);
  });
});


