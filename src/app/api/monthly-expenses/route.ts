import { NextRequest, NextResponse } from 'next/server';

// In a real application, this would be stored in a database
let monthlyExpenses: { [key: string]: { [category: string]: number } } = {};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const month = searchParams.get('month') || getCurrentMonth();

  return NextResponse.json({
    success: true,
    data: monthlyExpenses[month] || {}
  });
}

export async function POST(req: NextRequest) {
  try {
    const { month = getCurrentMonth(), category, amount } = await req.json();

    if (!monthlyExpenses[month]) {
      monthlyExpenses[month] = {};
    }

    if (!monthlyExpenses[month][category]) {
      monthlyExpenses[month][category] = 0;
    }

    monthlyExpenses[month][category] += amount;

    return NextResponse.json({
      success: true,
      data: monthlyExpenses[month]
    });
  } catch (error) {
    console.error('Error updating monthly expenses:', error);
    return NextResponse.json(
      { error: 'Failed to update monthly expenses' },
      { status: 500 }
    );
  }
}

function getCurrentMonth(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
} 