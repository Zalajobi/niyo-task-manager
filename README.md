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
create a database and user for the application.

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
