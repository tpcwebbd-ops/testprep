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

// // --- Example Usage (and initial connection) ---
// (async () => {
//   await connectRedis();

//   if (client.isOpen) {
//     console.log('\n--- Initial Test ---');
//     await client.set('foo', 'bar_direct_set');
//     const result = await client.get('foo');
//     console.log('Direct get for "foo":', result); // >>> bar_direct_set
//     await client.del('foo'); // Clean up
//     console.log('--- End Initial Test ---\n');
//   }

//   if (client.isOpen) {
//     console.log('--- Testing getRedisData and setRedisData ---');
//     const testKey = 'myTestData';
//     const testData = { name: 'John Doe', age: 30, active: true };

//     // Set data
//     const setResult = await setRedisData(testKey, testData, 60);
//     console.log('Set operation successful:', setResult);

//     // Get data
//     if (setResult) {
//       const retrievedData = await getRedisData(testKey);
//       console.log('Retrieved data:', retrievedData);
//       if (retrievedData && typeof retrievedData === 'object' && 'name' in retrievedData) {
//         console.log('Retrieved name:', (retrievedData as { name: string }).name);
//       }
//     }

//     const nonExistentData = await getRedisData('someNonExistentKey');
//     console.log('Retrieved non-existent data:', nonExistentData);

//     const plainStringKey = 'plainString';
//     await client.set(plainStringKey, 'This is a plain string');
//     const retrievedPlainString = await getRedisData(plainStringKey);
//     console.log('Retrieved plain string via getRedisData:', retrievedPlainString);

//     await client.del(testKey);
//     await client.del(plainStringKey);
//     console.log('--- End Testing Functions ---\n');

//   } else {
//     console.error('Failed to connect to Redis. Skipping example usage.');
//   }
// })();
