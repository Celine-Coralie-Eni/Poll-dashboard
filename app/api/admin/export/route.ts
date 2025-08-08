import { NextResponse } from 'next/server';

export async function GET() {
  const csvContent = 'Poll ID,Poll Title,Poll Description,Created At,Is Active,Total Votes,Option Text,Option Votes\n';
  
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="poll-results.csv"',
    },
  });
}