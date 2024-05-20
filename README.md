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
```json
"Content-Type": "application/json"
```
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

##### Success
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
