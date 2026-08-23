import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

function predictNextMonth(monthlyTotals: any[]) {
  if (monthlyTotals.length < 2) return 0
  const recent = monthlyTotals[0].total
  const previous = monthlyTotals[1].total
  const trend = recent - previous
  return Math.max(0, recent + trend)
}

function generateInsights(expenses: any[], categoryTotals: any[], monthlyTotals: any[]) {
  const insights = {
    predictions: { nextMonth: predictNextMonth(monthlyTotals) },
    recommendations: [] as string[],
    anomalies: [] as any[]
  }

  if (categoryTotals.length > 0) {
    const total = categoryTotals.reduce((sum, cat) => sum + cat.total, 0)
    const highest = categoryTotals[0]
    const percentage = (highest.total / total) * 100
    
    if (percentage > 50) {
      insights.recommendations.push(
        `Consider reducing ${highest.category} spending (${percentage.toFixed(1)}% of total)`
      )
    }
  }

  if (expenses.length > 0) {
    const amounts = expenses.map(exp => exp.amount)
    const avg = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
    const threshold = avg * 2
    
    const anomalies = expenses.filter(exp => exp.amount > threshold)
    insights.anomalies = anomalies.map(exp => ({
      date: exp.date,
      amount: exp.amount,
      description: exp.description
    }))
  }

  return insights
}

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { expenses: true }
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '30'
  const category = searchParams.get('category') || 'all'

  let expenses = user.expenses
  const now = new Date()
  
  // Date filtering
  if (range !== 'all') {
    let startDate = new Date(now)
    if (range === '30') startDate.setDate(now.getDate() - 30)
    else if (range === '90') startDate.setDate(now.getDate() - 90)
    else if (range === 'ytd') startDate = new Date(now.getFullYear(), 0, 1)
    
    expenses = expenses.filter(exp => new Date(exp.date) >= startDate)
  }

  // Category filtering
  if (category && category !== 'all') {
    expenses = expenses.filter(exp => exp.category === category)
  }

  const categoryTotalsMap: Record<string, number> = {}
  expenses.forEach(exp => {
    categoryTotalsMap[exp.category] = (categoryTotalsMap[exp.category] || 0) + exp.amount
  })
  
  const categoryTotals = Object.entries(categoryTotalsMap)
    .map(([cat, total]) => ({ category: cat, total }))
    .sort((a, b) => b.total - a.total)

  const monthlyTotalsMap: Record<string, number> = {}
  expenses.forEach(exp => {
    const d = new Date(exp.date)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyTotalsMap[monthKey] = (monthlyTotalsMap[monthKey] || 0) + exp.amount
  })
  
  const monthlyTotals = Object.entries(monthlyTotalsMap)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)

  const insights = generateInsights(expenses, categoryTotals, monthlyTotals)
  
  return NextResponse.json({
    insights: {
      ...insights,
      trendData: monthlyTotals.map(m => ({ label: m.month, total: m.total }))
    }
  })
}
