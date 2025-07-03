import Stripe from 'stripe';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if environment variables exist
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    const hasSupabaseUrl = !!process.env.VITE_SUPABASE_URL;
    
    if (!hasStripeKey) {
      return res.status(500).json({ 
        error: 'STRIPE_SECRET_KEY not configured',
        env_check: {
          STRIPE_SECRET_KEY: hasStripeKey,
          VITE_SUPABASE_URL: hasSupabaseUrl
        }
      });
    }

    // Try to initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Test if Stripe is working
    const testData = await stripe.balance.retrieve();
    
    res.status(200).json({ 
      message: 'Stripe connection successful',
      env_check: {
        STRIPE_SECRET_KEY: hasStripeKey,
        VITE_SUPABASE_URL: hasSupabaseUrl
      },
      stripe_status: 'connected'
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    res.status(500).json({ 
      error: 'Stripe connection failed',
      message: error.message,
      stack: error.stack
    });
  }
} 