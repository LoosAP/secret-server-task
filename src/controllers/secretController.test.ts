import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '../app';

dotenv.config();

describe('SecretController', () => {
  let app: App;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env');
    }
    await mongoose.connect(mongoUri);
    app = new App();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('POST /v1/secret creates a secret', async () => {
    const response = await request(app.express)
      .post('/v1/secret')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('secret=test&expireAfterViews=2&expireAfter=60');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('hash');
    expect(response.body.secretText).toBe('test');
    expect(response.body.remainingViews).toBe(2);
  });

  it('GET /v1/secret/:hash retrieves a secret', async () => {
    const createResponse = await request(app.express)
      .post('/v1/secret')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('secret=test&expireAfterViews=2&expireAfter=60');

    const hash = createResponse.body.hash;

    const getResponse = await request(app.express)
      .get(`/v1/secret/${hash}`)
      .set('Accept', 'application/json');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.secretText).toBe('test');
    expect(getResponse.body.remainingViews).toBe(1);
  });
});