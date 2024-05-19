import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import rootRouter from '@routes/index';
import { AppDataSource } from './data-source';
import { errorMiddleware } from '@middleware/error';
import { authorizeRequest } from '@middleware/jwt';
import { createServer } from 'http';
import { initializeWebSocket } from '@lib/webSocket';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use(authorizeRequest);
app.use('/', rootRouter);
app.use(errorMiddleware);

AppDataSource.initialize()
  .then(async () => {
    console.log('Initialised TypeORM...');
  })
  .catch((error) => console.log(error));

const server = createServer(app);

server.listen(process.env.PORT ?? 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT ?? 3000}`);
});

initializeWebSocket(server);
