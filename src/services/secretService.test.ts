import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Secret } from '../models/secret';
import { SecretService } from './secretService';

dotenv.config();

describe('SecretService', () => {
  let secretService: SecretService;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env');
    }
    await mongoose.connect(mongoUri);
    secretService = new SecretService();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Secret.deleteMany({});
  });

  describe('createSecret', () => {
    it('should create a secret with valid input', async () => {
      const secretText = 'test-secret';
      const expireAfterViews = 2;
      const expireAfter = 60;

      const result = await secretService.createSecret(secretText, expireAfterViews, expireAfter);

      expect(result).toHaveProperty('hash');
      expect(result.secretText).toBe(secretText);
      expect(result.remainingViews).toBe(expireAfterViews);
      expect(result.expiresAt).toBeDefined();
    });

    it('should throw error for invalid expireAfterViews', async () => {
      await expect(secretService.createSecret('test', 0, 60)).rejects.toThrow(
        'expireAfterViews must be greater than 0'
      );
    });
  });

  describe('getSecretByHash', () => {
    it('should retrieve and decrement views for a secret', async () => {
      const secret = await secretService.createSecret('test', 2, 60);
      const hash = secret.hash;

      const result = await secretService.getSecretByHash(hash);

      expect(result).toBeDefined();
      expect(result!.hash).toBe(hash);
      expect(result!.remainingViews).toBe(1);
    });

    it('should return null for non-existent secret', async () => {
      const result = await secretService.getSecretByHash('non-existent-hash');
      expect(result).toBeNull();
    });
  });
});