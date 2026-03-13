// src/app/api/user/service.ts
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.mongooseURI!);
const db = client.db();
const usersCollection = db.collection('user');

export interface User {
  _id?: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getAllUsers() {
  await client.connect();
  const users = await usersCollection.find({}).toArray();
  return users;
}

export async function getUserById(id: string) {
  await client.connect();
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  return user;
}

export async function createUser(userData: Omit<User, '_id'>) {
  await client.connect();
  const now = new Date();
  const newUser = { ...userData, createdAt: now, updatedAt: now };
  const result = await usersCollection.insertOne(newUser);
  return result.insertedId;
}

export async function updateUser(id: string, updateData: Partial<User>) {
  await client.connect();
  const now = new Date();
  const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...updateData, updatedAt: now } });
  return result.modifiedCount > 0;
}

export async function deleteUser(id: string) {
  await client.connect();
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
