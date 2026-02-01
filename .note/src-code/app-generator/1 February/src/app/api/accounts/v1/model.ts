import mongoose, { Schema } from 'mongoose';

const accountSchema = new Schema(
  {
    accountId: { type: String },
    providerId: { type: String },
    userId: { type: String },
    accessToken: { type: String },
    idToken: { type: String },
    accessTokenExpiresAt: { type: Date, default: Date.now },
    scope: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Account || mongoose.model('Account', accountSchema, 'account');
