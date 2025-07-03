// Import static assets manifest (will be generated during build)
// import ASSET_MANIFEST from '__STATIC_CONTENT_MANIFEST';

// API handlers
import { handleCreateCheckoutSession } from './api/create-checkout-session.js';
import { handleCreatePaymentSession } from './api/create-payment-session.js';
import { handleVerifyPayment } from './api/verify-payment.js';
import { handleGetCheckoutSession } from './api/get-checkout-session.js';
import { handleTestStripe } from './api/test-stripe.js';
import { handleStripeWebhook } from './api/stripe-webhook.js';

// Worker entry point
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return handleCORS();
      }

      // API Routes
      if (path.startsWith('/api/')) {
        return await handleAPIRequest(request, env, path);
      }

      // For non-API routes, return a simple response directing to use Cloudflare Pages
      // This worker is designed to handle API endpoints only
      // Static assets should be served via Cloudflare Pages or CDN
      return new Response('This worker handles API routes only. For the full application, deploy to Cloudflare Pages with this worker as a service binding.', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
        },
      });
    }
  },
};

// Handle API requests
async function handleAPIRequest(request, env, path) {
  const method = request.method;
  
  try {
    switch (path) {
      case '/api/create-checkout-session':
        if (method === 'POST') {
          return await handleCreateCheckoutSession(request, env);
        }
        break;
        
      case '/api/create-payment-session':
        if (method === 'POST') {
          return await handleCreatePaymentSession(request, env);
        }
        break;
        
      case '/api/verify-payment':
        if (method === 'POST') {
          return await handleVerifyPayment(request, env);
        }
        break;
        
      case '/api/get-checkout-session':
        if (method === 'GET') {
          return await handleGetCheckoutSession(request, env);
        }
        break;
        
      case '/api/test-stripe':
        if (method === 'GET') {
          return await handleTestStripe(request, env);
        }
        break;
        
      case '/api/stripe-webhook':
        if (method === 'POST') {
          return await handleStripeWebhook(request, env);
        }
        break;
        
      default:
        return new Response('Not Found', { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain',
          },
        });
    }
    
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ 
      message: 'API Error',
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

// Handle CORS preflight requests
function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripe-signature',
      'Access-Control-Max-Age': '86400',
    },
  });
}

 