import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Set API Tests', () => {
  let existingSetId: number;

  beforeAll(async () => {
    const newSetResponse = await request(app).post('/api/v1/sets').send({
      name: 'Test Set',
      description: 'This is a test set.',
    });

    existingSetId = newSetResponse.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.set.deleteMany({});
  });

  test('POST /api/v1/sets - Create Set (Success)', async () => {
    const response = await request(app).post('/api/v1/sets').send({
      name: 'New Test Set',
      description: 'This is a new test set.',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'New Test Set');
  });

  test('POST /api/v1/sets - Invalid Set Creation (Missing Fields)', async () => {
    const response = await request(app).post('/api/v1/sets').send({});

    expect(response.status).toBe(500);
  });

  test('GET /api/v1/sets - Get All Sets (Success)', async () => {
    const response = await request(app).get('/api/v1/sets');

    expect(response.status).toBe(200);
  });

  test('GET /api/v1/sets/:setId - Get Set by ID (Success)', async () => {
    const newSetResponse = await request(app).post('/api/v1/sets').send({
      name: 'Test Set',
      description: 'This is a test set.',
    });

    const setToGetById = newSetResponse.body.id;

    const response = await request(app).get(`/api/v1/sets/${setToGetById}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Set');

    await request(app).delete(`/api/v1/sets/${setToGetById}`);
  });

  test('GET /api/v1/sets/:setId - Invalid Set ID (Non-Numeric)', async () => {
    const invalidSetId = 'invalidId';

    const response = await request(app).get(`/api/v1/sets/${invalidSetId}`);

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/sets/:setId - Update Set by ID (Success)', async () => {
    const newSetResponse = await request(app).post('/api/v1/sets').send({
      name: 'Test Set',
      description: 'This is a test set.',
    });
    const setToUpdateById = newSetResponse.body.id;

    const response = await request(app)
      .put(`/api/v1/sets/${setToUpdateById}`)
      .send({
        name: 'Updated Test Set',
        description: 'This is an updated test set.',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Test Set');

    await request(app).delete(`/api/v1/sets/${setToUpdateById}`);
  });

  test('PUT /api/v1/sets/:setId - Invalid Set Update (Missing Fields)', async () => {
    const response = await request(app)
      .put(`/api/v1/sets/${existingSetId}`)
      .send({});

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/sets/:setId - Update Non-Existent Set', async () => {
    const nonExistentSetId = 999;

    const response = await request(app)
      .put(`/api/v1/sets/${nonExistentSetId}`)
      .send({
        name: 'Updated Test Set',
        description: 'This is an updated test set.',
      });

    expect(response.status).toBe(500);
  });

  test('DELETE /api/v1/sets/:setId - Delete Set by ID (Success)', async () => {
    const newSetResponse = await request(app).post('/api/v1/sets').send({
      name: 'Test Set to Delete',
      description: 'This is a test set to delete.',
    });

    const setIdToDelete = newSetResponse.body.id;

    const deleteResponse = await request(app).delete(
      `/api/v1/sets/${setIdToDelete}`,
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: 'Set deleted successfully',
    });
  });

  test('DELETE /api/v1/sets/:setId - Delete Non-Existent Set', async () => {
    const nonExistentSetId = 999;

    const response = await request(app).delete(
      `/api/v1/sets/${nonExistentSetId}`,
    );

    expect(response.status).toBe(500);
  });
});
