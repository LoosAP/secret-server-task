import { Schema, model, Document } from 'mongoose';

export interface ISecret extends Document {
  hash: string;
  secretText: string;
  createdAt: Date;
  expiresAt?: Date;
  remainingViews: number;
}

const secretSchema = new Schema<ISecret>({
  hash: { type: String, required: true, unique: true },
  secretText: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date },
  remainingViews: { type: Number, required: true }
});

export const Secret = model<ISecret>('Secret', secretSchema);