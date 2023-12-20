import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Product API Tests', () => {
  let existingProductId: number;

  beforeAll(async () => {
    await prisma.product.createMany({
      data: {
        name: 'Existing Product 1',
        price: 29.99,
        description: 'This is an existing product.',
      },
    });

    const existingProduct = await prisma.product.findFirst();

    if (!existingProduct) {
      throw new Error('No existing product found for testing.');
    }

    existingProductId = existingProduct.id;
  });

  test('POST /api/v1/products - Create Product (Success)', async () => {
    const response = await request(app).post('/api/v1/products').send({
      name: 'Test Product',
      price: 19.99,
      description: 'This is a test product.',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Product');

    const deleteAfterTest = response.body.id;

    await request(app).delete(`/api/v1/products/${deleteAfterTest}`);
  });

  test('POST /api/v1/products - Invalid Product Creation (Missing Fields)', async () => {
    const response = await request(app).post('/api/v1/products').send({});

    expect(response.status).toBe(500);
  });

  test('GET /api/v1/products - Get All Products (Success)', async () => {
    const response = await request(app).get('/api/v1/products');

    expect(response.status).toBe(200);
  });

  test('GET /api/v1/products/:productId - Get Product by ID (Success)', async () => {
    const newProductResponse = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Test Product to Get',
        price: 29.99,
        description: 'This is a test product to get.',
      });
    const productIdToGet = newProductResponse.body.id;

    const response = await request(app).get(
      `/api/v1/products/${productIdToGet}`,
    );

    expect(response.status).toBe(200);

    await request(app).delete(`/api/v1/products/${productIdToGet}`);
  });

  test('GET /api/v1/products/:productId - Invalid Product ID (Non-Numeric)', async () => {
    const invalidProductId = 'invalidId';

    const response = await request(app).get(
      `/api/v1/products/${invalidProductId}`,
    );

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/products/:productId - Update Product by ID (Success)', async () => {
    const newProductResponse = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Test Product to Update',
        price: 29.99,
        description: 'This is a test product to update.',
      });

    const productIdToUpdate = newProductResponse.body.id;

    const response = await request(app)
      .put(`/api/v1/products/${productIdToUpdate}`)
      .send({
        name: 'Updated Test Product',
        price: 39.99,
        description: 'This is an updated test product.',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Test Product');

    await request(app).delete(`/api/v1/products/${productIdToUpdate}`);
  });

  test('PUT /api/v1/products/:productId - Invalid Product Update (Missing Fields)', async () => {
    expect(existingProductId).toBeDefined();

    const response = await request(app)
      .put(`/api/v1/products/${existingProductId}`)
      .send({});

    expect(response.status).toBe(500);
  });

  test('PUT /api/v1/products/:productId - Update Non-Existent Product', async () => {
    const nonExistentProductId = 999;

    const response = await request(app)
      .put(`/api/v1/products/${nonExistentProductId}`)
      .send({
        name: 'Updated Test Product',
        price: 29.99,
        description: 'This is an updated test product.',
      });

    expect(response.status).toBe(500);
  });

  test('DELETE /api/v1/products/:productId - Delete Product by ID (Success)', async () => {
    const newProductResponse = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Test Product to Delete',
        price: 29.99,
        description: 'This is a test product to delete.',
      });

    expect(newProductResponse.status).toBe(200);
    expect(newProductResponse.body).toHaveProperty('id');

    const productIdToDelete = newProductResponse.body.id;

    const deleteResponse = await request(app).delete(
      `/api/v1/products/${productIdToDelete}`,
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: 'Product deleted successfully',
    });
  });

  test('DELETE /api/v1/products/:productId - Delete Non-Existent Product', async () => {
    const nonExistentProductId = 999;

    const response = await request(app).delete(
      `/api/v1/products/${nonExistentProductId}`,
    );

    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    await prisma.product.delete({
      where: {
        id: existingProductId,
      },
    });

    await prisma.$disconnect();
  });
});
