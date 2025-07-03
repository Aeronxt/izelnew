import Stripe from 'stripe';

export async function handleGetCheckoutSession(request, env) {
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
    // Get sessionId from query parameters
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return new Response(JSON.stringify({ message: 'Session ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return new Response(JSON.stringify({ session }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return new Response(JSON.stringify({ 
      message: 'Error retrieving checkout session',
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