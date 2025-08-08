import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  console.log("OAuth Callback Test:", {
    code: code ? "Present" : "Missing",
    state: state ? "Present" : "Missing", 
    error,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  });

  return NextResponse.json({
    success: true,
    data: {
      code: code ? "Present" : "Missing",
      state: state ? "Present" : "Missing",
      error,
      timestamp: new Date().toISOString()
    }
  });
}
