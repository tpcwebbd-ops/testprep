import mongoose, { Schema } from 'mongoose';

const verificationSchema = new Schema(
  {
    identifier: { type: String },
    value: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Verification || mongoose.model('Verification', verificationSchema, 'verification');
