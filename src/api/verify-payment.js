import Stripe from 'stripe';

export async function handleVerifyPayment(request, env) {
  // Initialize Stripe
  let stripe;
  try {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
  } catch (error) {
    console.error('Stripe initialization error:', error);
    return new Response(JSON.stringify({ 
      message: 'Stripe initialization error',
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return new Response(JSON.stringify({ message: 'Session ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items'],
    });

    // Verify payment status
    const paymentVerified = session.payment_status === 'paid';

    return new Response(JSON.stringify({
      verified: paymentVerified,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        payment_status: session.payment_status,
        metadata: session.metadata,
      },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({ 
      message: 'Error verifying payment',
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 