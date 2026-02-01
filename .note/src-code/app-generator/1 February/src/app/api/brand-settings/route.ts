import connectDB from '@/app/api/utils/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getBrandSettings, updateBrandSettings } from './controller';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectDB();
    const settings = await getBrandSettings();
    return NextResponse.json(settings, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
    }

    const updatedSettings = await updateBrandSettings(body);
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
