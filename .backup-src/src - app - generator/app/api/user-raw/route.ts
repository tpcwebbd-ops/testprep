// src/app/api/user/route.ts
import { handleGet, handlePost, handlePut, handleDelete } from './controller';

export const GET = handleGet;
export const POST = handlePost;
export const PUT = handlePut;
export const DELETE = handleDelete;
