import { expect, test } from 'vitest';
import got from 'got';

const client = got.extend({
  prefixUrl: 'http://localhost:3000',
  responseType: 'json',
  throwHttpErrors: false,
});

let token = '';

// Auth
test('POST /signup - créer utilisateur', async () => {
  const res = await client.post('signup', {
    json: { mail: `user${Date.now()}@test.com`, pwd: 'pass123' }
  });
  expect([200, 201]).toContain(res.statusCode);
});

test('POST /login - connexion', async () => {
  const res = await client.post('login', {
    json: { mail: 'test@example.com', pwd: 'password123' }
  });
  if (res.statusCode === 200) token = res.body.token;
});

// Home
test('GET / - hello world', async () => {
  const res = await client.get('');
  expect(res.statusCode).toBe(200);
  expect(res.body.hello).toBe('world');
});

// Posts
test('GET /posts - liste posts', async () => {
  const res = await client.get('posts');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /posts/:id - un post', async () => {
  const res = await client.get('posts/1');
  expect([200, 404]).toContain(res.statusCode);
});

test('POST /posts - créer post', async () => {
  const res = await client.post('posts', {
    json: { title: 'Test', content: 'Content', categoryId: 1 }
  });
  expect([200, 400]).toContain(res.statusCode);
});

test('PUT /posts/:id - modifier (401 sans auth)', async () => {
  const res = await client.put('posts/1', { json: { title: 'Modifié' } });
  expect(res.statusCode).toBe(401);
});

test('DELETE /posts/:id - supprimer (401 sans auth)', async () => {
  const res = await client.delete('posts/1');
  expect(res.statusCode).toBe(401);
});

// Categories
test('GET /categories - liste catégories', async () => {
  const res = await client.get('categories');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /categories/:id - une catégorie', async () => {
  const res = await client.get('categories/1');
  expect([200, 404]).toContain(res.statusCode);
});

test('POST /categories - créer (401 sans auth)', async () => {
  const res = await client.post('categories', {
    json: { name: 'Test', description: 'Desc' }
  });
  expect(res.statusCode).toBe(401);
});
