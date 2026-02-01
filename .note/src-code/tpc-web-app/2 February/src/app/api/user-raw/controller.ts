// src/app/api/user/controller.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './service';

export async function handleGet(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const user = await getUserById(id);
      if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
      return NextResponse.json(user, { status: 200 });
    }

    const users = await getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, emailVerified } = body;

    if (!name || !email) return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });

    const id = await createUser({ name, email, emailVerified });
    return NextResponse.json({ message: 'User created', id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function handlePut(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

    const updateData = await req.json();
    const success = await updateUser(id, updateData);

    if (!success) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User updated' }, { status: 200 });
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

    const success = await deleteUser(id);
    if (!success) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
