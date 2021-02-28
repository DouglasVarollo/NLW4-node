import 'express-async-errors';
import 'reflect-metadata';
import express from 'express';

import createConnection from './database';
import { AppError } from './errors/AppError';
import router from './routes';

createConnection();

const app = express();

app.use(express.json());
app.use(router);
app.use(function (error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  return response.status(500).json({
    message: `Internal Server Error ${error.message}`
  });
});

export default app;
