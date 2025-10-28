import User from '@/lib/models/User';
import { connectDB } from '@/lib/db';

export const UserService = {
  async getAllUsers() {
    await connectDB();
    return User.find({});
  },

  async getUserById(id: string) {
    await connectDB();
    return User.findById(id);
  },

  async createUser(data: any) {
    await connectDB();
    return User.create(data);
  },

  async deleteUser(id: string) {
    await connectDB();
    return User.findByIdAndDelete(id);
  },
};
