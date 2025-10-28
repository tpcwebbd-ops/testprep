// src/app/api/user/route.ts
import { handleGet, handleDelete } from './controller';

export const GET = handleGet;
export const DELETE = handleDelete;
