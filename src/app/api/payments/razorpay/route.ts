import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Ensure you have RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
})

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR' } = await request.json()

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: 'receipt_order_' + Math.random().toString(36).substring(7),
    }

    const order = await razorpay.orders.create(options)
    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create Razorpay order', details: error.message },
      { status: 500 }
    )
  }
}
