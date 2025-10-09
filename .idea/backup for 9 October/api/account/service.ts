import Account from '@/lib/models/Account';
import { connectDB } from '@/lib/db';

export const AccountService = {
  async getAllAccounts() {
    await connectDB();
    return Account.find({});
  },

  async getAccountById(id: string) {
    await connectDB();
    return Account.findById(id);
  },

  async createAccount(data: any) {
    await connectDB();
    return Account.create(data);
  },

  async deleteAccount(id: string) {
    await connectDB();
    return Account.findByIdAndDelete(id);
  },
};
