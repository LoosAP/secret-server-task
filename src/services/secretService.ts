import { Secret, ISecret } from '../models/secret';
import { v4 as uuidv4 } from 'uuid';

export class SecretService {
  async createSecret(secretText: string, expireAfterViews: number, expireAfter: number): Promise<ISecret> {
    if (expireAfterViews <= 0) {
      throw new Error('expireAfterViews must be greater than 0');
    }

    const hash = uuidv4();
    const createdAt = new Date();
    const expiresAt = expireAfter > 0 
      ? new Date(createdAt.getTime() + expireAfter * 60000)
      : undefined;

    const secret = new Secret({
      hash,
      secretText,
      createdAt,
      expiresAt,
      remainingViews: expireAfterViews
    });

    return await secret.save();
  }

  async getSecretByHash(hash: string): Promise<ISecret | null> {
    const secret = await Secret.findOne({ hash });

    if (!secret) return null;

    const now = new Date();
    if (secret.expiresAt && now > secret.expiresAt) {
      await Secret.deleteOne({ hash });
      return null;
    }

    if (secret.remainingViews <= 0) {
      await Secret.deleteOne({ hash });
      return null;
    }

    secret.remainingViews -= 1;
    await secret.save();

    if (secret.remainingViews <= 0) {
      await Secret.deleteOne({ hash });
    }

    return secret;
  }
}