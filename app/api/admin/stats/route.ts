import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalUsers: 0,
    totalPolls: 0,
    totalVotes: 0,
    activePolls: 0
  });
}