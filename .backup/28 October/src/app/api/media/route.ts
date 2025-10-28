import connectDB from '@/app/api/utils/mongoose';
import { NextResponse } from 'next/server';
import Media from './mediaModel'; 

// GET all media
export async function GET() {
  try { 
    await connectDB();
    const mediaItems = await Media.find({}).sort({ updatedAt: -1, createdAt: -1 });
    return NextResponse.json({ data: mediaItems, message: 'Media loaded successfully' });
  } catch {
    // Removed unused 'error' variable
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

// CREATE media
export async function POST(req: Request) {
  try { 
    await connectDB();
    const mediaData = await req.json();
    const newMedia = await Media.create(mediaData);
    return NextResponse.json({ data: newMedia, message: 'Media created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}

// UPDATE media
export async function PUT(req: Request) {
  try { 
    await connectDB();
    const { id, ...updateData } = await req.json();
    const updatedMedia = await Media.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMedia) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updatedMedia, message: 'Media updated successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}

// DELETE media
export async function DELETE(req: Request) {
  try { 
    await connectDB();
    const { id } = await req.json();
    const deletedMedia = await Media.findByIdAndDelete(id);

    if (!deletedMedia) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}
