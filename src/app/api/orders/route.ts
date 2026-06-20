import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const order = db.getOrder(id);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    const orders = db.getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing customer details or items' }, { status: 400 });
    }

    const {
      customerName,
      items,
      notes,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = body;

    let paymentStatus: 'Pending' | 'Paid' | 'Failed' = 'Pending';

    // Verify payment if payment details are sent
    if (razorpayPaymentId && razorpayOrderId) {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      const isMock = !keyId || !keySecret || 
                     keyId.trim() === '' || 
                     keyId.includes('placeholder') || 
                     keyId.includes('your_') ||
                     razorpayPaymentId.startsWith('mock_pay_');

      if (isMock) {
        paymentStatus = 'Paid';
      } else {
        if (!razorpaySignature) {
          return NextResponse.json({ error: 'Missing payment verification signature' }, { status: 400 });
        }
        
        // Real signature verification
        const text = razorpayOrderId + '|' + razorpayPaymentId;
        const generatedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(text)
          .digest('hex');

        if (generatedSignature === razorpaySignature) {
          paymentStatus = 'Paid';
        } else {
          return NextResponse.json({ error: 'Payment verification failed: Invalid signature' }, { status: 400 });
        }
      }
    }

    const order = db.createOrder({
      customerName,
      items,
      notes,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error in creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Missing order ID or status' }, { status: 400 });
    }
    const updated = db.updateOrderStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
