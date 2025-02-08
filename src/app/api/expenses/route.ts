import { NextResponse } from 'next/server';
import { processReceipt } from '@/lib/ocr';
import { generatePDFReport, ExpenseReport } from '@/lib/pdf';
import { auth } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

async function verifySession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    return payload;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // TODO: Implement actual database query
    // For now, return mock data
    const mockExpenses: ExpenseReport[] = [
      {
        id: '1',
        userId: session.uid as string,
        userName: session.email as string,
        department: 'Engineering',
        receipts: [],
        totalAmount: 150.00,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        receiptUrls: [],
      }
    ];

    return NextResponse.json(mockExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: 'Please sign in to submit expenses' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract and validate required fields
    const vendor = formData.get('vendor') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const file = formData.get('receipt') as File | null;

    // Validate required fields
    if (!vendor || !amount || !date || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process receipt if provided
    let extractedData = null;
    if (file) {
      try {
        extractedData = await processReceipt(file);
      } catch (error) {
        console.error('Receipt processing error:', error);
        // Continue without receipt data
      }
    }

    // Create expense report
    const expenseData: ExpenseReport = {
      id: crypto.randomUUID(),
      userId: session.uid as string,
      userName: session.email as string,
      department: session.department as string || 'Unknown',
      receipts: [{
        vendor,
        amount,
        date,
        category,
        description,
        fullText: extractedData?.fullText || '',
        projectCode: formData.get('projectCode') as string || undefined,
      }],
      totalAmount: amount,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      receiptUrls: [],
    };

    // Generate PDF report
    const pdfBlob = generatePDFReport(expenseData);

    // TODO: Upload PDF to storage and save to database
    const pdfUrl = 'temp-url';

    return NextResponse.json({
      success: true,
      expense: {
        ...expenseData,
        pdfUrl,
      },
    });
  } catch (error) {
    console.error('Error submitting expense:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit expense' },
      { status: 500 }
    );
  }
} 