I will provide model.ts and service.ts, I will use those in defferent folder and api in NextJs. service.ts is working but I can not fetch user from model.ts You just explain why I can't fetch the data. it show empty.

/api/user/v1/model.ts 
```
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

```


/api/user/v1/controller.ts 
```
import mongoose, { FilterQuery } from 'mongoose';
import User from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
}

// ✅ Centralized response helper
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
});

// ✅ Connect to MongoDB once and reuse
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.mongooseURI!);
  }
}

// ✅ CREATE User
export async function createUser(req: Request): Promise<IResponse> {
  try {
    await connectDB();
    const userData = await req.json();
    const newUser = await User.create(userData);
    return formatResponse(newUser, 'User created successfully', 201);
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      const err = error as { keyValue?: Record<string, unknown> };
      return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
    }
    throw error; // Re-throw other errors to be handled by `withDB`
  }
}

// ✅ GET single User by ID
export async function getUserById(req: Request): Promise<IResponse> {
  await connectDB();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return formatResponse(null, 'User ID is required', 400);

  const user = await User.findById(id);
  if (!user) return formatResponse(null, 'User not found', 404);

  return formatResponse(user, 'User fetched successfully', 200);
}

// ✅ GET all Users
export async function getUsers(req: Request): Promise<IResponse> {
  await connectDB();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const searchQuery = url.searchParams.get('q');

  let filter: FilterQuery<unknown> = {};

  if (searchQuery) {
    filter = {
      $or: [{ name: { $regex: searchQuery, $options: 'i' } }, { email: { $regex: searchQuery, $options: 'i' } }],
    };
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await User.countDocuments(filter);

  return formatResponse({ users, total, page, limit }, 'Users fetched successfully', 200);
}

// ✅ UPDATE User
export async function updateUser(req: Request): Promise<IResponse> {
  await connectDB();
  const { id, ...updateData } = await req.json();

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!updatedUser) return formatResponse(null, 'User not found', 404);

  return formatResponse(updatedUser, 'User updated successfully', 200);
}

// ✅ DELETE User
export async function deleteUser(req: Request): Promise<IResponse> {
  await connectDB();
  const { id } = await req.json();

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return formatResponse(null, 'User not found', 404);

  return formatResponse({ deletedCount: 1 }, 'User deleted successfully', 200);
}

```

/api/user/v1/route.ts 
```
import { NextResponse } from 'next/server';
import { getUsers, createUser, updateUser, deleteUser, getUserById } from './controller';
import { handleRateLimit } from '../../utils/rate-limit';

// ✅ Unified response handler
const formatResponse = (data: unknown, message: string, status: number) => {
  return NextResponse.json({ data, message }, { status });
};

// ✅ GET
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getUserById(req) : await getUsers(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ POST
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await createUser(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ PUT
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await updateUser(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await deleteUser(req);
  return formatResponse(result.data, result.message, result.status);
}

```

and here is 
/api/verify/route.ts 
```
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { formatResponse } from '../utils/utils';

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    const response = formatResponse(null, 'Missing token', 400);
    return NextResponse.json(response, { status: response.status });
  }

  try {
    const payload = jwt.verify(token, EMAIL_TOKEN_SECRET) as { email: string };
    const email = payload.email;

    // ✅ In production: mark verified in DB here

    // Option 1: Redirect to a pretty page
    // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // return NextResponse.redirect(`${BASE_URL}/verify-success?email=${encodeURIComponent(email)}`);

    // Option 2: Return JSON response
    const response = formatResponse({ email }, 'Email verified successfully', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error verifying token:', error);

    let response;

    // Check if it's a JWT error
    if (error instanceof jwt.JsonWebTokenError) {
      response = formatResponse(null, 'Invalid token', 400);
    } else if (error instanceof jwt.TokenExpiredError) {
      response = formatResponse(null, 'Token has expired', 400);
    } else {
      // Handle other potential errors
      const err = error as { code?: string | number; keyValue?: Record<string, unknown> };

      if (err.keyValue) {
        response = formatResponse(null, `Database error: ${JSON.stringify(err.keyValue)}`, 500);
      } else {
        // Generic fallback for unexpected errors
        response = formatResponse(null, 'An unexpected error occurred during verification', 500);
      }
    }

    return NextResponse.json(response, { status: response.status });
  }
}

```

Now your task it inside verify/route.ts after confirm emailVerified you have to update in db (I will provide user data).
Pelase udpate "emailVerified": true, 