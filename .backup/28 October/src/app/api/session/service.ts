// src/app/api/user/service.ts
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.mongooseURI!);
const db = client.db();
const sessionsCollection = db.collection('session');

export interface Session {
  _id?: string;
  token: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getAllSessions() {
  await client.connect();
  return sessionsCollection.find({}).toArray();
}

export async function getSessionById(id: string) {
  await client.connect();
  return sessionsCollection.findOne({ _id: new ObjectId(id) });
}

export async function getSessionByToken(token: string) {
  await client.connect();
  return sessionsCollection.findOne({ token });
}

export async function deleteSession(id: string) {
  await client.connect();
  const result = await sessionsCollection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function deleteExpiredSessions() {
  await client.connect();
  const now = new Date();
  const result = await sessionsCollection.deleteMany({ expiresAt: { $lte: now } });
  return result.deletedCount;
}
