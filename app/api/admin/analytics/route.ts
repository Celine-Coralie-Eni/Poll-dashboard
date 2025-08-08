import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    overview: {
      totalUsers: 0,
      totalPolls: 0,
      totalVotes: 0,
      activePolls: 0,
      recentActivity: 0
    },
    topPolls: [],
    growth: {
      newUsersLast30Days: 0
    }
  });
}