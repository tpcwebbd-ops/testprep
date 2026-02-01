import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrandSettings extends Document {
  brandName: string;
  logoUrl: string | null;
  textColor: string;
  fontSize: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  createdAt: Date;
  updatedAt: Date;
}

const BrandSettingsSchema: Schema = new Schema(
  {
    brandName: {
      type: String,
      required: [true, 'Brand name is required'],
      default: 'App Name',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    textColor: {
      type: String,
      default: '#38bdf8',
    },
    fontSize: {
      type: String,
      enum: ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'],
      default: 'text-2xl',
    },
    fontFamily: {
      type: String,
      enum: ['font-sans', 'font-serif', 'font-mono'],
      default: 'font-sans',
    },
  },
  {
    timestamps: true,
  },
);

// Check if model exists to prevent "OverwriteModelError" in Next.js hot reloading
const BrandSettings: Model<IBrandSettings> = mongoose.models.BrandSettings || mongoose.model<IBrandSettings>('BrandSettings', BrandSettingsSchema);

export default BrandSettings;
