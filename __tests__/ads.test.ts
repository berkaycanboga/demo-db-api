import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Ad API Tests', () => {
  let existingAdId: number;
  let existingProductId: number;

  beforeAll(async () => {
    const existingProduct = await prisma.product.create({
      data: {
        name: 'Existing Product',
        price: 29.99,
        description: 'This is an existing product.',
      },
    });

    if (!existingProduct) {
      throw new Error('No existing product found for testing.');
    }

    existingProductId = existingProduct.id;

    const newAdResponse = await request(app).post('/api/v1/ads').send({
      product_id: existingProductId,
      title: 'Test Ad',
      content: 'This is a test ad.',
      image_url: 'test-image.jpg',
    });

    existingAdId = newAdResponse.body.id;
  });

  test('POST /api/v1/ads - Create Ad (Success)', async () => {
    const response = await request(app).post('/api/v1/ads').send({
      product_id: existingProductId,
      title: 'New Test Ad',
      content: 'This is a new test ad.',
      image_url: 'new-test-image.jpg',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'New Test Ad');
  });

  test('POST /api/v1/ads - Invalid Ad Creation (Missing Fields)', async () => {
    const response = await request(app).post('/api/v1/ads').send({});

    expect(response.status).toBe(500);
  });

  test('GET /api/v1/ads - Get All Ads (Success)', async () => {
    const response = await request(app).get('/api/v1/ads');

    expect(response.status).toBe(200);
  });

  test('GET /api/v1/ads/:adId - Get Ad by ID (Success)', async () => {
    const newAdResponse = await request(app).post('/api/v1/ads').send({
      product_id: existingProductId,
      title: 'Test Ad',
      content: 'This is a test ad.',
      image_url: 'test-image.jpg',
    });

    const adIdToGet = newAdResponse.body.id;

    const response = await request(app).get(`/api/v1/ads/${adIdToGet}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Test Ad');

    await request(app).delete(`/api/v1/ads/${adIdToGet}`);
  });

  test('GET /api/v1/ads/:adId - Invalid Ad ID (Non-Numeric)', async () => {
    const invalidAdId = 'invalidId';

    const response = await request(app).get(`/api/v1/ads/${invalidAdId}`);

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/ads/:adId - Update Ad by ID (Success)', async () => {
    const newAdResponse = await request(app).post('/api/v1/ads').send({
      product_id: existingProductId,
      title: 'Test Ad',
      content: 'This is a test ad.',
      image_url: 'test-image.jpg',
    });

    const adToUpdateById = newAdResponse.body.id;

    const response = await request(app)
      .put(`/api/v1/ads/${adToUpdateById}`)
      .send({
        product_id: existingProductId,
        title: 'Updated Test Ad',
        content: 'This is an updated test ad.',
        image_url: 'updated-test-image.jpg',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Test Ad');

    await request(app).delete(`/api/v1/ads/${adToUpdateById}`);
  });

  test('PUT /api/v1/ads/:adId - Invalid Ad Update (Missing Fields)', async () => {
    const response = await request(app)
      .put(`/api/v1/ads/${existingAdId}`)
      .send({});

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/ads/:adId - Update Non-Existent Ad', async () => {
    const nonExistentAdId = 999;

    const response = await request(app)
      .put(`/api/v1/ads/${nonExistentAdId}`)
      .send({
        title: 'Updated Test Ad',
        content: 'This is an updated test ad.',
        image_url: 'updated-test-image.jpg',
      });

    expect(response.status).toBe(500);
  });

  test('DELETE /api/v1/ads/:adId - Delete Ad by ID (Success)', async () => {
    const newAdResponse = await request(app).post('/api/v1/ads').send({
      product_id: existingProductId,
      title: 'Test Ad to Delete',
      content: 'This is a test ad to delete.',
      image_url: 'test-ad-to-delete.jpg',
    });

    const adIdToDelete = newAdResponse.body.id;

    const deleteResponse = await request(app).delete(
      `/api/v1/ads/${adIdToDelete}`,
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: 'Ad deleted successfully',
    });
  });

  test('DELETE /api/v1/ads/:adId - Delete Non-Existent Ad', async () => {
    const nonExistentAdId = 999;

    const response = await request(app).delete(
      `/api/v1/ads/${nonExistentAdId}`,
    );

    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    await prisma.ad.deleteMany({
      where: {
        product_id: existingProductId,
      },
    });

    await prisma.product.deleteMany({
      where: {
        id: existingProductId,
      },
    });

    await prisma.$disconnect();
  });
});
