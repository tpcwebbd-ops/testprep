import { NextRequest, NextResponse } from 'next/server';
import { AccountService } from './service';

export const AccountController = {
  async get(req: NextRequest) {
    const account = await AccountService.getAllAccounts();
    return NextResponse.json(account);
  },

  async post(req: NextRequest) {
    const data = await req.json();
    const newAccount = await AccountService.createAccount(data);
    return NextResponse.json(newAccount, { status: 201 });
  },
};
