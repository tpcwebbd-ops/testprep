import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * ✅ Validates all paths and revalidates /about if valid.
 * Method: POST
 * Body: { paths: string[] }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !Array.isArray(body.paths)) {
      return NextResponse.json({ success: false, message: 'Invalid request body. Expected { paths: string[] }.' }, { status: 400 });
    }

    const invalidPaths = body.paths.filter((p: string) => typeof p !== 'string' || !p.startsWith('/about'));

    if (invalidPaths.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid paths found. All paths must start with "/about".',
          invalidPaths,
        },
        { status: 400 },
      );
    }

    // ✅ All paths valid — now revalidate each one
    for (const path of body.paths) {
      revalidatePath(path); // Revalidate cached ISR data for that route
      console.log(`✅ Revalidated: ${path}`);
    }

    return NextResponse.json({
      success: true,
      message: 'All paths validated and revalidated successfully.',
      revalidated: body.paths,
    });
  } catch (error) {
    console.error('Path Validation Error:', error);
    return NextResponse.json({ success: false, message: 'Server error occurred while validating/revalidating paths.' }, { status: 500 });
  }
}
