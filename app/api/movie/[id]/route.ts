import { type NextRequest, NextResponse } from "next/server";

const API_KEY = "f1def80d";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
