import { type NextRequest, NextResponse } from "next/server";

const API_KEY = "f1def80d";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query?.trim()) {
    return NextResponse.json({ error: "Query requerida" }, { status: 400 });
  }

  const page = searchParams.get("page") ?? "1";

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}&page=${page}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}
