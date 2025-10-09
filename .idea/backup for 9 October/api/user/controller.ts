import { NextRequest, NextResponse } from 'next/server';
import { UserService } from './service';

export const UserController = {
  async get(req: NextRequest) {
    const users = await UserService.getAllUsers();
    return NextResponse.json(users);
  },

  async post(req: NextRequest) {
    const data = await req.json();
    const newUser = await UserService.createUser(data);
    return NextResponse.json(newUser, { status: 201 });
  },
};
