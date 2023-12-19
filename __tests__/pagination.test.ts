import request from 'supertest';
import app from '../app';
import prisma from '../lib/db';
import { Product, Ad, Set, SetItem } from '@prisma/client';

const createdProducts: Product[] = [];
const createdAds: Ad[] = [];
const createdSets: Set[] = [];
const createdSetItems: SetItem[] = [];

beforeEach(async () => {
  for (let i = 1; i <= 15; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        price: 19.99 + i,
        description: `Description for Product ${i}`,
      },
    });
    createdProducts.push(product);

    const ad = await prisma.ad.create({
      data: {
        product_id: product.id,
        title: `Ad ${i}`,
        content: `Content for Ad ${i}`,
        image_url: `url_for_image.png`,
      },
    });
    createdAds.push(ad);

    const set = await prisma.set.create({
      data: {
        name: `Set ${i}`,
        description: `Description for Set ${i}`,
      },
    });
    createdSets.push(set);

    const setItem = await prisma.setItem.create({
      data: {
        set_id: set.id,
        item_type: 'ad',
        item_id: ad.id,
      },
    });
    createdSetItems.push(setItem);
  }
});

describe('Create and Paginate Products', () => {
  it('should paginate products with default order (by ID)', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .query({ limit: 12 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(12);

    const productIds = response.body.map((product: Product) => product.id);
    expect(productIds).toEqual(
      productIds.slice().sort((a: number, b: number) => a - b),
    );
  });

  it('should paginate products ordered by name in ascending order', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .query({ limit: 12, orderByField: 'name', orderByDirection: 'asc' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(12);

    const productNames = response.body.map((product: Product) => product.name);
    expect(productNames).toEqual(
      productNames.slice().sort((a: string, b: string) => a.localeCompare(b)),
    );
  });

  it('should paginate products ordered by price in descending order', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .query({ limit: 12, orderByField: 'price', orderByDirection: 'desc' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(12);

    const productPrices = response.body.map(
      (product: Product) => product.price,
    );
    expect(productPrices).toEqual(
      productPrices.slice().sort((a: number, b: number) => b - a),
    );
  });
});

describe('Create and Paginate Ads', () => {
  it('should paginate ads with default order (by ID)', async () => {
    const response = await request(app).get('/api/v1/ads').query({ limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);

    const adIds = response.body.map((ad: Ad) => ad.id);
    expect(adIds).toEqual(adIds.slice().sort((a: number, b: number) => a - b));
  });

  it('should paginate ads ordered by title in ascending order', async () => {
    const response = await request(app)
      .get('/api/v1/ads')
      .query({ limit: 5, orderByField: 'title', orderByDirection: 'asc' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);

    const adTitles = response.body.map((ad: Ad) => ad.title);
    expect(adTitles).toEqual(
      adTitles.slice().sort((a: string, b: string) => a.localeCompare(b)),
    );
  });
});

describe('Create and Paginate Sets', () => {
  it('should paginate sets with default order (by ID)', async () => {
    const response = await request(app).get('/api/v1/sets').query({ limit: 8 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(8);

    const setIds = response.body.map((set: Set) => set.id);
    expect(setIds).toEqual(
      setIds.slice().sort((a: number, b: number) => a - b),
    );
  });

  it('should paginate sets ordered by name in ascending order', async () => {
    const response = await request(app)
      .get('/api/v1/sets')
      .query({ limit: 8, orderByField: 'name', orderByDirection: 'asc' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(8);

    const setNames = response.body.map((set: Set) => set.name);
    expect(setNames).toEqual(
      setNames.slice().sort((a: string, b: string) => a.localeCompare(b)),
    );
  });
});

describe('Create and Paginate SetItems', () => {
  it('should paginate set items with default order (by ID)', async () => {
    const response = await request(app)
      .get('/api/v1/set_items')
      .query({ limit: 15 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(15);

    const setItemIds = response.body.map((setItem: SetItem) => setItem.id);
    expect(setItemIds).toEqual(
      setItemIds.slice().sort((a: number, b: number) => a - b),
    );
  });

  it('should paginate set items ordered by item_id in ascending order', async () => {
    const response = await request(app)
      .get('/api/v1/set_items')
      .query({ limit: 15, orderByField: 'item_id', orderByDirection: 'asc' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(15);

    const setItemIds = response.body.map((setItem: SetItem) => setItem.item_id);
    expect(setItemIds).toEqual(
      setItemIds.slice().sort((a: number, b: number) => a - b),
    );
  });
});

afterEach(async () => {
  await prisma.setItem.deleteMany({
    where: { id: { in: createdSetItems.map((item) => item.id) } },
  });
  await prisma.set.deleteMany({
    where: { id: { in: createdSets.map((set) => set.id) } },
  });
  await prisma.ad.deleteMany({
    where: { id: { in: createdAds.map((ad) => ad.id) } },
  });
  await prisma.product.deleteMany({
    where: { id: { in: createdProducts.map((product) => product.id) } },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
