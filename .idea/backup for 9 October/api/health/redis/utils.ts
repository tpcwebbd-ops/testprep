import { NextResponse } from 'next/server';
import { createClient, RedisClientType } from 'redis';

const client: RedisClientType = createClient({
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

// --- Event Listener ---
client.on('error', err => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Redis client connected'));
client.on('ready', () => console.log('Redis client ready to use'));
client.on('end', () => console.log('Redis client disconnected'));

export const getRedisData = async (key: string): Promise<object | string | null> => {
  if (!client.isOpen) {
    console.warn('Redis client is not connected. Cannot get data.');
    return null;
  }
  try {
    const value = await client.get(key);
    if (value === null) {
      console.log(`Cache miss for key: ${key}`);
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.log('error from redis', e);
      console.warn(`Value for key "${key}" is not valid JSON. Returning as string. Value: ${value}`);
      return value;
    }
  } catch (error) {
    console.error(`Error getting data from Redis for key "${key}":`, error);
    return null;
  }
};

export const setRedisData = async (key: string, value: object, ttlSeconds?: number): Promise<boolean> => {
  if (!client.isOpen) {
    console.warn('Redis client is not connected. Cannot set data.');
    return false;
  }
  try {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      await client.set(key, stringValue, {
        EX: ttlSeconds,
      });
    } else {
      await client.set(key, stringValue);
    }
    console.log(`Cache set for key: ${key}${ttlSeconds ? ` with TTL: ${ttlSeconds}s` : ''}`);
    return true;
  } catch (error) {
    console.error(`Error setting data to Redis for key "${key}":`, error);
    return false;
  }
};
export const connectRedis = async () => {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (err) {
      console.error('Failed to connect to Redis on startup:', err);
    }
  }
};

export const disconnectRedis = async () => {
  if (client.isOpen) {
    try {
      await client.quit();
    } catch (err) {
      console.error('Error disconnecting from Redis:', err);
    }
  }
};

export interface IResponse {
  ok: boolean;
  data: unknown;
  message: string;
  status: number;
}

export const formatResponse = (ok: boolean, data: unknown, message: string, status: number) => NextResponse.json({ ok, data, message, status }, { status });
