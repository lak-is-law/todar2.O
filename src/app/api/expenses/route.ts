import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const expenses = await prisma.expense.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' }
  })

  return NextResponse.json(expenses)
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    const data = await request.json()
    const { date, category, amount, description } = data

    if (!date || !category || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const expense = await prisma.expense.create({
      data: {
        date: new Date(date),
        category,
        amount: parseFloat(amount),
        description: description || '',
        userId: user.id
      }
    })

    return NextResponse.json({ message: 'Expense added', expense }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to add expense', details: error.message }, { status: 500 })
  }
}
