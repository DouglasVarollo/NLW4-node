import request from 'supertest';
import { getConnection } from 'typeorm';

import app from '../src/app';
import createConnection from '../src/database';

describe('Surveys', function () {
  afterAll(async function () {
    const connection = getConnection();

    await connection.dropDatabase();
    await connection.close();
  });

  beforeAll(async function () {
    const connection = await createConnection();

    await connection.runMigrations();
  });

  it('should be able to create a new survey', async function () {
    const response = await request(app).post('/surveys').send({
      title: 'Title Example',
      description: 'Description Example'
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to get all surveys', async function () {
    await request(app).post('/surveys').send({
      title: 'Title Example 2',
      description: 'Description Example 2'
    });

    const response = await request(app).get('/surveys');

    expect(response.body.length).toBe(2);
  });
});
