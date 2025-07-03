import Stripe from 'stripe';

export async function handleCreateCheckoutSession(request, env) {
  // Initialize Stripe with error handling
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
    // Parse request body
    const body = await request.json();
    
    // Log the request for debugging
    console.log('Request body:', JSON.stringify(body, null, 2));
    console.log('Stripe key exists:', !!env.STRIPE_SECRET_KEY);
    console.log('Headers:', Object.fromEntries(request.headers));

    const { 
      cartItems, 
      customerInfo, 
      shippingAmount, 
      discountAmount = 0,
      couponCode = '',
      orderId 
    } = body;

    // Validate required fields with detailed error messages
    if (!cartItems || !Array.isArray(cartItems)) {
      return new Response(JSON.stringify({ message: 'Cart items must be an array' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (cartItems.length === 0) {
      return new Response(JSON.stringify({ message: 'Cart items array is empty' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!customerInfo) {
      return new Response(JSON.stringify({ message: 'Customer information is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!customerInfo.email) {
      return new Response(JSON.stringify({ message: 'Customer email is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!customerInfo.firstName || !customerInfo.lastName) {
      return new Response(JSON.stringify({ message: 'Customer name is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!orderId) {
      return new Response(JSON.stringify({ message: 'Order ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
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

    // Get origin from request headers
    const origin = request.headers.get('origin') || 'http://localhost:5173';

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
        success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout`,
      };

      // Handle zero-amount payments (100% discount)
      if (total === 0) {
        // For zero amount, we can't use Stripe payment, so we need to handle this case
        // We'll create a special session or handle it differently
        console.log('Zero amount order detected, handling as free order');
        
        // Return a special response for free orders
        return new Response(JSON.stringify({ 
          sessionId: 'free_order',
          url: `${origin}/order-confirmation?free_order=true&order_id=${orderId}`,
          isFreeOrder: true
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
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

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      message: 'Error creating checkout session',
      error: error.message,
      stack: env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 