import { NextResponse } from "next/server";

export function withCORS(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers
  return response;
}