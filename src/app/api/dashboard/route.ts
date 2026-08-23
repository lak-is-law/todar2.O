import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { expenses: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const expenses = user.expenses
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  
  // Calculate category totals
  const categoryTotalsMap: Record<string, number> = {}
  expenses.forEach(exp => {
    categoryTotalsMap[exp.category] = (categoryTotalsMap[exp.category] || 0) + exp.amount
  })
  
  const categoryTotals = Object.entries(categoryTotalsMap)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  // Calculate monthly totals
  const monthlyTotalsMap: Record<string, number> = {}
  expenses.forEach(exp => {
    const date = new Date(exp.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyTotalsMap[monthKey] = (monthlyTotalsMap[monthKey] || 0) + exp.amount
  })
  
  const monthlyTotals = Object.entries(monthlyTotalsMap)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Last 6 months

  return NextResponse.json({
    expenses,
    categoryTotals,
    monthlyTotals,
    totalSpending: Math.round(totalSpending * 100) / 100,
    budgetLimit: user.budget,
    isOverBudget: totalSpending > user.budget
  })
}
