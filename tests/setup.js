const db = require('../config/db');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await db.connect();
});

afterAll(async () => {
  await db.close();
});
