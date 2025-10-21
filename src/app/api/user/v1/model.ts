import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ✅ Explicitly set collection name to match your MongoDB data
export default mongoose.models.User || mongoose.model('User', userSchema, 'user');
