import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Set Item API Tests', () => {
  let existingSetItemId: number;
  let existingProductId: number;
  let existingSetId: number;

  beforeAll(async () => {
    const newProductResponse = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Test Product',
        price: 19.99,
        description: 'This is a test product.',
      });

    existingProductId = newProductResponse.body.id;

    const newSetResponse = await request(app).post('/api/v1/sets').send({
      name: 'Test Set',
      description: 'This is a test set.',
    });

    existingSetId = newSetResponse.body.id;

    const newSetItemResponse = await request(app)
      .post('/api/v1/set_items')
      .send({
        set_id: existingSetId,
        item_type: 'product',
        item_id: existingProductId,
      });

    existingSetItemId = newSetItemResponse.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.setItem.deleteMany({});
  });

  test('POST /api/v1/set_items - Create Set Item (Success)', async () => {
    const response = await request(app).post('/api/v1/set_items').send({
      set_id: existingSetId,
      item_type: 'product',
      item_id: existingProductId,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('item_type', 'product');
  });

  test('POST /api/v1/set_items - Invalid Set Item Creation (Missing Fields)', async () => {
    const response = await request(app).post('/api/v1/set_items').send({});

    expect(response.status).toBe(500);
  });

  test('GET /api/v1/set_items - Get All Set Items (Success)', async () => {
    const response = await request(app).get('/api/v1/set_items');

    expect(response.status).toBe(200);
  });

  test('GET /api/v1/set_items/:setItemId - Get Set Item by ID (Success)', async () => {
    const newSetItemResponse = await request(app)
      .post('/api/v1/set_items')
      .send({
        set_id: existingSetId,
        item_type: 'product',
        item_id: existingProductId,
      });

    const setItemToGetById = newSetItemResponse.body.id;
    const response = await request(app).get(
      `/api/v1/set_items/${setItemToGetById}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('item_type', 'product');
    await request(app).delete(`/api/v1/set_items/${setItemToGetById}`);
  });

  test('GET /api/v1/set_items/:setItemId - Invalid Set Item ID (Non-Numeric)', async () => {
    const invalidSetItemId = 'invalidId';

    const response = await request(app).get(
      `/api/v1/set_items/${invalidSetItemId}`,
    );

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/set_items/:setItemId - Update Set Item by ID (Success)', async () => {
    const newSetItemResponse = await request(app)
      .post('/api/v1/set_items')
      .send({
        set_id: existingSetId,
        item_type: 'product',
        item_id: existingProductId,
      });
    const setItemToUpdateById = newSetItemResponse.body.id;
    const response = await request(app)
      .put(`/api/v1/set_items/${setItemToUpdateById}`)
      .send({
        set_id: existingSetId,
        item_type: 'updatedType',
        item_id: existingProductId,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('item_type', 'updatedType');
    await request(app).delete(`/api/v1/set_items/${setItemToUpdateById}`);
  });

  test('PUT /api/v1/set_items/:setItemId - Invalid Set Item Update (Missing Fields)', async () => {
    const response = await request(app)
      .put(`/api/v1/set_items/${existingSetItemId}`)
      .send({});

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/set_items/:setItemId - Update Non-Existent Set Item', async () => {
    const nonExistentSetItemId = 999;

    const response = await request(app)
      .put(`/api/v1/set_items/${nonExistentSetItemId}`)
      .send({
        set_id: existingSetId,
        item_type: 'updatedType',
        item_id: 3,
      });

    expect(response.status).toBe(500);
  });

  test('DELETE /api/v1/set_items/:setItemId - Delete Set Item by ID (Success)', async () => {
    const newSetItemResponse = await request(app)
      .post('/api/v1/set_items')
      .send({
        set_id: existingSetId,
        item_type: 'itemToDelete',
        item_id: 4,
      });

    const setItemIdToDelete = newSetItemResponse.body.id;

    const deleteResponse = await request(app).delete(
      `/api/v1/set_items/${setItemIdToDelete}`,
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: 'Set item deleted successfully',
    });
  });

  test('DELETE /api/v1/set_items/:setItemId - Delete Non-Existent Set Item', async () => {
    const nonExistentSetItemId = 999;

    const response = await request(app).delete(
      `/api/v1/set_items/${nonExistentSetItemId}`,
    );

    expect(response.status).toBe(500);
  });
});
