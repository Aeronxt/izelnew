import Stripe from 'stripe';

export async function handleTestStripe(request, env) {
  try {
    if (!env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({
        success: false,
        message: 'STRIPE_SECRET_KEY is not configured',
        env: env.NODE_ENV || 'production',
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    
    // Try to retrieve account to test the connection
    const account = await stripe.accounts.retrieve();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Stripe connection successful',
      accountId: account.id,
      accountCountry: account.country,
      keyPrefix: env.STRIPE_SECRET_KEY.substring(0, 7),
      env: env.NODE_ENV || 'production',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Stripe test error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Stripe connection failed',
      error: error.message,
      keyExists: !!env.STRIPE_SECRET_KEY,
      keyPrefix: env.STRIPE_SECRET_KEY ? env.STRIPE_SECRET_KEY.substring(0, 7) : 'No key',
      env: env.NODE_ENV || 'production',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 