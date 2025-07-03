import Stripe from 'stripe';

export async function handleStripeWebhook(request, env) {
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
      },
    });
  }

  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return new Response(JSON.stringify({ 
      message: 'Webhook endpoint secret not configured' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const sig = request.headers.get('stripe-signature');
  
  if (!sig) {
    return new Response(JSON.stringify({ 
      message: 'No stripe signature found' 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  let event;
  
  try {
    // Get the raw body as a string for signature verification
    const body = await request.text();
    
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(JSON.stringify({ 
      message: `Webhook Error: ${err.message}` 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        // Handle successful checkout
        // You can add custom logic here like updating order status in database
        break;
      }
        
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Handle successful payment
        break;
      }
        
      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment
        break;
      }
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      message: 'Error processing webhook',
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 