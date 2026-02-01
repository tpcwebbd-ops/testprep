import { NextResponse } from 'next/server';
import * as footerController from './controller';

export async function GET() {
  try {
    const footers = await footerController.getFooters();
    return NextResponse.json(footers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch footers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newFooter = await footerController.createFooter(body);
    return NextResponse.json(newFooter, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create footer' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updatedFooter = await footerController.updateFooter(_id, updateData);
    return NextResponse.json(updatedFooter);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update footer' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await footerController.deleteFooter(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete footer' }, { status: 500 });
  }
}
