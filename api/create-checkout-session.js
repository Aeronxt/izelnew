import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe with error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error('Stripe initialization error:', error);
}

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      throw new Error('Stripe is not properly initialized');
    }

    // Log the request for debugging
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('Headers:', req.headers);

    const { 
      cartItems, 
      customerInfo, 
      shippingAmount, 
      discountAmount = 0,
      couponCode = '',
      orderId 
    } = req.body || {};

    // Validate required fields with detailed error messages
    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Cart items must be an array' });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart items array is empty' });
    }

    if (!customerInfo) {
      return res.status(400).json({ message: 'Customer information is required' });
    }

    if (!customerInfo.email) {
      return res.status(400).json({ message: 'Customer email is required' });
    }

    if (!customerInfo.firstName || !customerInfo.lastName) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Log the validated data
    console.log('Validated data:', {
      cartItemsCount: cartItems.length,
      customerInfo,
      shippingAmount,
      discountAmount,
      couponCode,
      orderId
    });

    // Create line items for Stripe with validation
    const lineItems = cartItems.map((item, index) => {
      if (!item.price || typeof item.price !== 'number') {
        throw new Error(`Invalid price for item at index ${index}`);
      }
      if (!item.quantity || typeof item.quantity !== 'number') {
        throw new Error(`Invalid quantity for item at index ${index}`);
      }
      
      return {
        price_data: {
          currency: 'bdt',
          product_data: {
            name: item.title || item.name || `Product ${index + 1}`,
            description: item.description || `Size: ${item.size || 'N/A'}`,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to paisa (BDT cents)
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item if applicable
    if (shippingAmount && shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'bdt',
          product_data: {
            name: 'Shipping',
            description: 'Delivery charges',
          },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      });
    }

    // Add discount as a negative line item if applicable
    if (discountAmount && discountAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'bdt',
          product_data: {
            name: `Discount${couponCode ? ` (${couponCode})` : ''}`,
            description: couponCode ? `Coupon: ${couponCode}` : 'Applied discount',
          },
          unit_amount: -Math.round(discountAmount * 100), // Negative amount for discount
        },
        quantity: 1,
      });
    }

    // Log the line items
    console.log('Line items:', JSON.stringify(lineItems, null, 2));

    // Calculate total to ensure it's not negative
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal + (shippingAmount || 0) - (discountAmount || 0));
    
    console.log('Payment calculation:', {
      subtotal,
      shipping: shippingAmount || 0,
      discount: discountAmount || 0,
      total
    });

    // Create Stripe checkout session with error handling
    let session;
    try {
      const sessionConfig = {
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        currency: 'bdt',
        customer_email: customerInfo.email,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['BD', 'US', 'AU', 'GB'],
        },
        metadata: {
          orderId: orderId,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          phone: customerInfo.phone || 'Not provided',
          couponCode: couponCode || 'none',
          discountAmount: discountAmount.toString(),
        },
        success_url: `${req.headers.origin || 'http://localhost:5173'}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin || 'http://localhost:5173'}/checkout`,
      };

      // Handle zero-amount payments (100% discount)
      if (total === 0) {
        // For zero amount, we can't use Stripe payment, so we need to handle this case
        // We'll create a special session or handle it differently
        console.log('Zero amount order detected, handling as free order');
        
        // Return a special response for free orders
        return res.status(200).json({ 
          sessionId: 'free_order',
          url: `${req.headers.origin || 'http://localhost:5173'}/order-confirmation?free_order=true&order_id=${orderId}`,
          isFreeOrder: true
        });
      }

      session = await stripe.checkout.sessions.create(sessionConfig);
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      throw new Error(`Stripe error: ${stripeError.message}`);
    }

    // Log the successful session creation
    console.log('Session created successfully:', {
      sessionId: session.id,
      url: session.url
    });

    return res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Error creating checkout session',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 