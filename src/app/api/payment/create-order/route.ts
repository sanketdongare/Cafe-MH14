import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total amount securely on server
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Razorpay expects amount in paise (1 Rupee = 100 Paise)
    const amountInPaise = Math.round(total) * 100;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if we should run in mock mode
    const isMock = !keyId || !keySecret || 
                   keyId.trim() === '' || 
                   keyId.includes('placeholder') || 
                   keyId.includes('your_');

    if (isMock) {
      // Return a simulated mock order response
      const mockOrderId = `mock_order_${Math.random().toString(36).substring(2, 10)}`;
      return NextResponse.json({
        id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        key: 'rzp_test_mockkeyid12345',
        isMock: true
      });
    }

    // Initialize Razorpay client with user credentials
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
      isMock: false
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create payment order' }, { status: 500 });
  }
}
