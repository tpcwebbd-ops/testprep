import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    delete_url: {
      type: String,
      trim: true,
    },
    display_url: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'trash'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.models.Media || mongoose.model('Media', mediaSchema);
