import Stripe from 'stripe';

// Initialize Stripe with error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error('Stripe initialization error:', error);
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured properly' });
  }

  try {
    const { amount, currency = 'bdt', customerEmail, orderId, items } = req.body;

    // Validate required fields
    if (!amount || !customerEmail || !orderId) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, customerEmail, orderId' 
      });
    }

    // Create payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Order Payment',
              description: `Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents/paisa
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        orderId: orderId,
      },
      success_url: `${req.headers.origin || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5173'}/checkout?cancelled=true`,
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      orderId: orderId
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    return res.status(500).json({
      error: 'Failed to create payment session',
      message: error.message
    });
  }
} 