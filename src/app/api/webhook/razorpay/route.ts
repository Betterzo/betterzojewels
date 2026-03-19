import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook handler for Razorpay payment events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Razorpay webhook event:', event);

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      
      default:
        console.log('Unhandled event type:', event.event);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handle successful payment capture
async function handlePaymentCaptured(payment: any) {
  try {
    console.log('Payment captured:', payment.id);
    
    // Update your database with payment details
    // This is where you would update the order status
    const orderId = payment.notes?.order_id;
    
    if (orderId) {
      // Call your backend API to update order status
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_SECRET_KEY || ''}`
        },
        body: JSON.stringify({
          payment_id: payment.id,
          order_id: orderId,
          amount: payment.amount,
          status: 'captured',
          payment_method: payment.method,
          captured_at: payment.captured_at
        })
      });

      if (!response.ok) {
        console.error('Failed to update order status:', await response.text());
      }
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(payment: any) {
  try {
    console.log('Payment failed:', payment.id);
    
    const orderId = payment.notes?.order_id;
    
    if (orderId) {
      // Update order status to failed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_SECRET_KEY || ''}`
        },
        body: JSON.stringify({
          payment_id: payment.id,
          order_id: orderId,
          status: 'failed',
          error_code: payment.error_code,
          error_description: payment.error_description
        })
      });

      if (!response.ok) {
        console.error('Failed to update order status:', await response.text());
      }
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle order paid event
async function handleOrderPaid(order: any) {
  try {
    console.log('Order paid:', order.id);
    
    // Update order status to paid
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_SECRET_KEY || ''}`
      },
      body: JSON.stringify({
        order_id: order.id,
        status: 'paid',
        amount: order.amount,
        paid_at: order.paid_at
      })
    });

    if (!response.ok) {
      console.error('Failed to update order status:', await response.text());
    }
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
} 