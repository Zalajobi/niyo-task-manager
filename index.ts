import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';
import express from 'express'
import cors from 'cors'
import rootRouter from "@routes/index";
import {AppDataSource} from "./data-source";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use('/', rootRouter);

AppDataSource.initialize()
  .then(async () => {
    console.log('Initialised TypeORM...');
  })
  .catch((error) => console.log(error));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});