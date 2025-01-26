import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

interface RequestData {
  data: unknown;
}

export async function POST(request: Request) {
  try {
    const myR2 = getRequestContext().env.R2;
    const body: RequestData = await request.json();

    if (!body.data) {
      return NextResponse.json({ message: 'No data' }, { status: 400 });
    }

    await myR2.put('poems.json', JSON.stringify(body.data), {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    return NextResponse.json({ message: 'Data saved successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save data' }, { status: 500 });
  }
}