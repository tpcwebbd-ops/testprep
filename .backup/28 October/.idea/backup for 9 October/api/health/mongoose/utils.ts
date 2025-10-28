import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export interface IResponse {
  ok: boolean;
  data: unknown;
  message: string;
  status: number;
}

export const formatResponse = (ok: boolean, data: unknown, message: string, status: number) => NextResponse.json({ ok, data, message, status }, { status });

const MONGODB_URI = process.env.mongooseURI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });
export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, { bufferCommands: false }).then(mongoose => {
      cached.conn = mongoose.connection;
      return cached.conn;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function withDB(handler: () => Promise<IResponse>): Promise<IResponse> {
  try {
    await dbConnect();
    return await handler();
  } catch (error) {
    console.error(error);
    return { ok: false, data: null, message: (error as Error).message, status: 400 };
  }
}
