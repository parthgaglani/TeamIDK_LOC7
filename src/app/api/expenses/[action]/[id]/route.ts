import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Verify manager session
async function verifyManagerSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    
    // Check if user is a manager/finance role
    if (payload.role !== 'finance') {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { action: string; id: string } }
) {
  try {
    // Verify manager session
    const session = await verifyManagerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Only managers can approve/reject expenses.' },
        { status: 401 }
      );
    }

    const { action, id } = params;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be either approve or reject.' },
        { status: 400 }
      );
    }

    // TODO: Update expense status in your database
    // For now, we'll just return a success message
    const actionPastTense = action === 'approve' ? 'approved' : 'rejected';
    
    return NextResponse.json({
      message: `Expense ${id} has been ${actionPastTense} successfully.`,
      status: actionPastTense,
      expenseId: id,
      updatedAt: new Date().toISOString(),
      updatedBy: session.email
    });

  } catch (error) {
    console.error(`Error ${params.action}ing expense:`, error);
    return NextResponse.json(
      { error: `Failed to ${params.action} expense` },
      { status: 500 }
    );
  }
} 