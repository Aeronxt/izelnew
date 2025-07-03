import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    res.status(200).json({
      session,
      paymentStatus: session.payment_status,
      customerDetails: session.customer_details,
      metadata: session.metadata
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ 
      message: 'Error retrieving session',
      error: error.message 
    });
  }
} 