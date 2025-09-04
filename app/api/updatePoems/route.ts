import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

interface RequestData {
  data: GameData[];
}

export async function POST(request: Request) {
  try {
    const KV = getRequestContext().env.KV;
    const body: RequestData = await request.json();

    if (!body.data) {
      return NextResponse.json({ message: 'No data' }, { status: 400 });
    }

    await KV.put("POEMS", JSON.stringify(body.data));

    return NextResponse.json({ message: 'Data saved successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const KV = getRequestContext().env.KV;
    const dataString = await KV.get("POEMS");
    
    if (!dataString) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    const data = JSON.parse(dataString);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch data', error: (error as Error).message }, { status: 500 });
  }
}