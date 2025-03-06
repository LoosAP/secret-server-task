import { NextFunction, Request, Response } from 'express';
import { SecretService } from '../services/secretService';
import { ResponseHandler } from '../utils/responseHandler';

export class SecretController {
  private secretService: SecretService;

  constructor() {
    this.secretService = new SecretService();
  }

  async createSecret(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { secret, expireAfterViews, expireAfter } = req.body;
      if (!secret || !expireAfterViews || expireAfter === undefined) {
        ResponseHandler.sendResponse(res, { message: 'Invalid input' }, 405);
        return;
      }

      const newSecret = await this.secretService.createSecret(
        secret,
        parseInt(expireAfterViews),
        parseInt(expireAfter)
      );

      ResponseHandler.sendResponse(res, {
        hash: newSecret.hash,
        secretText: newSecret.secretText,
        createdAt: newSecret.createdAt,
        expiresAt: newSecret.expiresAt,
        remainingViews: newSecret.remainingViews
      });
    } catch (error) {
      ResponseHandler.sendResponse(res, { message: 'Invalid input' }, 405);
    }
  }

  async getSecret(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { hash } = req.params;
      const secret = await this.secretService.getSecretByHash(hash);

      if (!secret) {
        ResponseHandler.sendResponse(res, { message: 'Secret not found' }, 404);
        return;
      }

      ResponseHandler.sendResponse(res, {
        hash: secret.hash,
        secretText: secret.secretText,
        createdAt: secret.createdAt,
        expiresAt: secret.expiresAt,
        remainingViews: secret.remainingViews
      });
    } catch (error) {
      ResponseHandler.sendResponse(res, { message: 'Secret not found' }, 404);
    }
  }
}