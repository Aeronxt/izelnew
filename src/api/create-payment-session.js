import Stripe from 'stripe';

export async function handleCreatePaymentSession(request, env) {
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
    const { amount, currency = 'usd' } = body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
    });

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error creating payment session:', error);
    return new Response(JSON.stringify({ 
      message: 'Error creating payment session',
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