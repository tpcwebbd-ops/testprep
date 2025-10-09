import Verification from '@/lib/models/Verification';
import { connectDB } from '@/lib/db';

export const VerificationService = {
  async getAllVerifications() {
    await connectDB();
    return Verification.find({});
  },

  async getVerificationById(id: string) {
    await connectDB();
    return Verification.findById(id);
  },

  async createVerification(data: any) {
    await connectDB();
    return Verification.create(data);
  },

  async deleteVerification(id: string) {
    await connectDB();
    return Verification.findByIdAndDelete(id);
  },
};
