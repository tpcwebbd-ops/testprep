// src/app/api/user/controller.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllSessions, getSessionById, deleteSession } from './service';

export async function handleGet(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const user = await getSessionById(id);
      if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
      return NextResponse.json(user, { status: 200 });
    }

    const users = await getAllSessions();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function handleDelete(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

    const success = await deleteSession(id);
    if (!success) return NextResponse.json({ message: 'Session not found' }, { status: 404 });

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
