import Session from '@/lib/models/Session';
import { connectDB } from '@/lib/db';

export const SessionService = {
  async getAllSessions() {
    await connectDB();
    return Session.find({});
  },

  async getSessionById(id: string) {
    await connectDB();
    return Session.findById(id);
  },

  async createSession(data: any) {
    await connectDB();
    return Session.create(data);
  },

  async deleteSession(id: string) {
    await connectDB();
    return Session.findByIdAndDelete(id);
  },
};
