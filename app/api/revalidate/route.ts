import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    revalidatePath('/'); // Revalidate the home page
    return NextResponse.json({ success: true, message: 'Revalidated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
