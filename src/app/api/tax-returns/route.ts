import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fy = searchParams.get('fy') || '2023-2024';

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { expenses: true }
  });

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Simple mock calculation for tax returns based on expenses
  const expenses = user.expenses;
  const grossIncome = expenses.length > 0 ? 1500000 : 0; // Mock 15L income
  const totalDeductions = expenses
    .filter(e => e.category === 'Investment' || e.category === 'Medical')
    .reduce((sum, e) => sum + e.amount, 0);

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  const estimatedTax = taxableIncome * 0.15; // Mock 15% flat tax rate

  return NextResponse.json({
    grossIncome,
    totalDeductions,
    taxableIncome,
    estimatedTax,
    taxSavingOpportunities: [
      'Invest more in ELSS to save up to ₹46,800',
      'Increase Health Insurance premium to maximize 80D deduction'
    ]
  });
}
