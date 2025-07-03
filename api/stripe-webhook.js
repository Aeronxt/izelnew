import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;
      }
      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object;
        await handleFailedPayment(failedPayment);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleSuccessfulPayment(session) {
  try {
    // Update order status to 'paid' in the database
    const { error } = await supabase
      .from('orders')
      .update({ 
        order_status: 'paid',
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        payment_status: 'completed'
      })
      .eq('id', session.metadata.orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    console.log(`Order ${session.metadata.orderId} marked as paid`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    // Update order status to 'payment_failed'
    const { error } = await supabase
      .from('orders')
      .update({ 
        order_status: 'payment_failed',
        payment_status: 'failed'
      })
      .eq('stripe_payment_intent', paymentIntent.id);

    if (error) {
      console.error('Error updating failed payment:', error);
      throw error;
    }

    console.log(`Payment failed for payment intent ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}; 