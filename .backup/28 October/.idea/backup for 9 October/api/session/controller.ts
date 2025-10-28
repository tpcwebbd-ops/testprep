import { NextRequest, NextResponse } from 'next/server';
import { SessionService } from './service';

export const SessionController = {
  async get(req: NextRequest) {
    const sessions = await SessionService.getAllSessions();
    return NextResponse.json(sessions);
  },

  async post(req: NextRequest) {
    const data = await req.json();
    const newSession = await SessionService.createSession(data);
    return NextResponse.json(newSession, { status: 201 });
  },
};
