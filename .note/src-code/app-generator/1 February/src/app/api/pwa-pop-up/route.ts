import connectDB from '@/app/api/utils/mongoose';
import { NextResponse } from 'next/server';
import { getPWAConfig, updatePWAConfig } from './controller';

export async function GET() {
  try {
    await connectDB();
    const config = await getPWAConfig();
    return NextResponse.json(config);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const config = await updatePWAConfig(body);
    return NextResponse.json(config);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
