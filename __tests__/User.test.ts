import request from 'supertest';
import { getConnection } from 'typeorm';

import app from '../src/app';
import createConnection from '../src/database';

describe('Users', function () {
  afterAll(async function () {
    const connection = getConnection();

    await connection.dropDatabase();
    await connection.close();
  });

  beforeAll(async function () {
    const connection = await createConnection();

    await connection.runMigrations();
  });

  it('should be able to create a new user', async function () {
    const response = await request(app).post('/users').send({
      email: 'user@example.com',
      name: 'User Example'
    });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a user with exists email', async function () {
    const response = await request(app).post('/users').send({
      email: 'user@example.com',
      name: 'User Example'
    });

    expect(response.status).toBe(400);
  });
});
