import mongoose, { Schema, Document, models } from 'mongoose';

export interface IVerification extends Document {
  email: string;
  code: string;
  verified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const verificationSchema = new Schema<IVerification>(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// Auto-delete expired codes
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.Verification || mongoose.model<IVerification>('Verification', verificationSchema);
