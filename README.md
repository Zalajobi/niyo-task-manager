# Niyo Task Manager

This Express application serves as the backend for a contact management system, designed to handle various endpoints for managing user contacts effectively.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

#### Node.js and npm

Ensure you have the following installed:

- Node.js (>= 16.x)
- npm (>= 7.x)

You can verify your Node and npm versions with:

```bash
node --version
npm --version
```

#### PostgresSQL

Ensure you have PostgresSQL installed on your local machine. You can download the installer from the [official website](https://www.postgresql.org/download/).
Create a database and user for the application.

### Websocat
To Read the stream data from the server, you need to install `websocat.` You can download the installer from the [GitHub Repo](https://github.com/vi/websocat)... 
once installed you can run the following command to read the stream data from the server
```bash websocat ws://localhost:${PORT_NUMBER}```

#### Redis

Ensure you have Redis installed on your local machine. You can download the installer from the [official website](https://redis.io/). Alternatively, you could use a remote redis provider at [RedisLabs](https://redislabs.com/).

#### Environment Variables

Create a `.env` file in the root directory of the project and copy the content of the `.env.example` into the `.env` file and replace with your own values or add the following environment variables:

```bash
DATABASE_NAME="database name"
DATABASE_PASSWORD="database password"
DATABASE_USERNAME="database username"
DATABASE_HOST="database host url"
DATABASE_PORT="database port"
TASK_MANAGER_BASE_URL='/api/v1/niyo' # Base URL for all request, this is a sample URL
PORT=3000
PASSWORD_HASH_SECRET="password hash secret"
JWT_ACCESS_TOKEN="access secret"
JWT_REFRESH_TOKEN="refresh secret"
REDIS_HOST="Redis HOST"
REDIS_PORT="Redis PORT"
REDIS_PASSWORD="Redis PASSWORD"
```

### Installing

- git clone https://github.com/Zalajobi/niyo-task-manager
- cd niyo-task-manager
- npm install
- npm run start:dev # To start the application in development mode
- npm run start # To start the application in production mode

## Running the tests

To run the tests, run the following command:

```bash
npm run test
```


# API Documentation
## Create User API
### Endpoint
POST `/user/create`
Registers a new user in the system.

### Description
This endpoint allows for the creation of a new user.
It validates the incoming request data against the 
`createUserRequestSchema`, hashes the user's password, 
and then creates a new user record in the database. 
The response includes a JSON object indicating the success 
or failure of the operation.


### Request
#### Header(s)
- "Content-Type": "application/json"


#### Body Parameters
The request body should contain the following parameters/fields:
- `email` (string): The email address of the user.
- `password` (string): The password of the user.
- `first_name` (string): The first name of the user.
- `last_name` (string): The last name of the user.

#### Example Request
```json
{
    "email": "johnDoe@gmail.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
}
```

#### Response(s)

##### Success Response
The response body for a successful request will contain the following parameters/fields:
- `status` (boolean): The status of the request. This will be `true`.
- `message` (string): A message indicating the success of the operation.
- `data` (object): The data returned by the request. This will be `null`.

```json
{
    "status": true,
    "message": "User created successfully",
    "data": null
}
```

##### Failure Response
The response body for a failed request will contain the following parameters/fields:
- `status` (boolean): The status of the request. This will be `false`.
- `message` (string): A message indicating the failure of the operation.
- `data` (object): The data returned by the request. This will be `null`.
- `error` (object): An object containing the error details.

```json
{
  "message": "Error",
  "success": false,
  "data": null,
  "error": {
    "type": "api_error",
    "message": "Email already exists",
    "name": "Error"
  }
}
```







## Login User API
### Endpoint
POST `/user/login`
Authenticate a user and provide JWT tokens for access and refresh.

### Description
This endpoint first validates incoming request data against the `userLoginRequestSchema`.
It then checks if the user exists in the database and if the password provided matches 
the hashed password in the database. If the user is authenticated successfully,
it generates an access token and a refresh token for the user. The response
includes a JSON object indicating the success or failure of the operation.

### Request
#### Header(s)
- "Content-Type": "application/json"

#### Body Parameters
The request body should contain the following parameters/fields:
- `email` (string): The email address of the user.
- `password` (string): The password of the user.

#### Example Request
```json
{
    "email": "johnDoe@gmail.com",
    "password": "password123"
}
```

#### Response(s)

##### Success Response
The response will include a JSON object with a message indicating the login was successful. The JWT access token will be set as an HTTP-only cookie.
- `status` (boolean): The status of the request. This will be `true`.
- `message` (string): A message indicating the success of the operation.
- `data` (object): The data returned by the request. This will be `null`.
```json
{
    "status": true,
    "message": "Success",
    "data": null
}
```
#### Headers
- ```Set-Cookie: jwt=<access_token>; HttpOnly; Secure```

##### Failure Response
The response body for a failed request will contain the following parameters/fields:
- `status` (boolean): The status of the request. This will be `false`.
- `message` (string): A message indicating the failure of the operation.
- `data` (object): The data returned by the request. This will be `null`.
- `error` (object): An object containing the error details.

```json
{
  "message": "Error",
  "success": false,
  "data": null,
  "error": {
    "type": "api_error",
    "message": "User not found",
    "name": "Error"
  }
}
```






## Create Task
### Endpoint
POST `/task/create`
Create a new task in the system.

### Description
This endpoint allows for the creation of a new task. It validates 
the incoming request data against the`createTaskRequestSchema`, 
verifies the JWT token from the cookie to identify the user, 
and then creates a new task record in the database. Additionally, 
it broadcasts a message about the new task creation.

### Request
#### Header(s)
- "Content-Type": "application/json"
- "Cookie": jwt=<access_token>

#### Body Parameters
The request body should be a JSON object containing the following fields:
- `title` (string): The title of the task.
- `description` (string): The description of the task.
- `due_date` (string): The due date of the task.
- `priority` (string): The priority of the task.
- `status` (string): The status of the task.
- `assigneeId` (string): The ID of the user to whom the task is assigned.

#### Example Request
```json
{
    "title": "Task 1",
    "description": "This is task 1",
    "due_date": "2022-12-31",
    "priority": "high",
    "status": "pending",
    "assigneeId": "uuid of the user being assigned the task"
}
```

#### Response(s)

##### Success Response
The response will include a JSON object with a message indicating the login was successful. The JWT access token will be set as an HTTP-only cookie.
- `status` (boolean): The status of the request. This will be `true`.
- `message` (string): A message indicating the success of the operation.
- `data` (object): The data returned by the request. This will be `null`.
```json
{
    "status": true,
    "message": "Task Created",
    "data": { }
}
```


#### Headers
This is set if the access token expiration is less than 5 minutes and the refresh token is still valid, the access token will be refreshed and set as an HTTP-only cookie.
- ```Set-Cookie: jwt=<access_token>; HttpOnly; Secure```

##### Failure Response
The response body for a failed request will contain the following parameters/fields:
- `status` (boolean): The status of the request. This will be `false`.
- `message` (string): A message indicating the failure of the operation.
- `data` (object): The data returned by the request. This will be `null`.
- `error` (object): An object containing the error details.

```json
{
  "message": "JWT Token Error",
  "success": false,
  "data": null,
  "error": {
    "type": "jwt_error",
    "message": "jwt expired",
    "name": "TokenExpiredError"
  }
}
```

