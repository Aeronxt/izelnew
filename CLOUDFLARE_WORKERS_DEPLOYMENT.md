# Cloudflare Workers Deployment Guide

This guide explains how to deploy the E-Commerce Website's API layer as a Cloudflare Worker.

## Project Structure

```
/
├── src/
│   ├── worker.js              # Main worker entry point
│   ├── api/                   # API handlers
│   │   ├── create-checkout-session.js
│   │   ├── create-payment-session.js
│   │   ├── get-checkout-session.js
│   │   ├── stripe-webhook.js
│   │   ├── test-stripe.js
│   │   └── verify-payment.js
│   └── ...                    # React app source files
├── wrangler.toml             # Cloudflare Workers configuration
└── package.json
```

## Deployment Architecture

This setup creates a **Cloudflare Worker** that handles **API endpoints only**. For the complete application:

1. **Worker**: Handles `/api/*` routes (payment processing, webhooks)
2. **Static Assets**: Deploy React build to Cloudflare Pages, Netlify, or any CDN
3. **Integration**: Configure the frontend to call the Worker's API endpoints

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 3. Login to Cloudflare

```bash
wrangler login
```

### 4. Configure Environment Variables

#### For Local Development (.dev.vars)

Create a `.dev.vars` file in the root directory:

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=development
```

#### For Production (Cloudflare Dashboard)

In your Cloudflare Workers dashboard, add these environment variables:

- `STRIPE_SECRET_KEY`: Your Stripe secret key (live or test)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook endpoint secret
- `NODE_ENV`: Set to "production"

### 5. Development

```bash
# Start worker development server
npm run worker:dev

# This will start the worker on http://localhost:8787
# API endpoints will be available at http://localhost:8787/api/*
```

### 6. Deployment

```bash
# Deploy the worker
npm run worker:deploy

# Or build and deploy in one step
npm run worker:build
```

### 7. Monitor Logs

```bash
# View real-time logs
npm run worker:tail
```

## API Endpoints

Once deployed, your worker will handle these endpoints:

- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/create-payment-session` - Create Stripe payment intent
- `GET /api/get-checkout-session?sessionId=xxx` - Retrieve checkout session
- `POST /api/verify-payment` - Verify payment status
- `POST /api/stripe-webhook` - Handle Stripe webhooks
- `GET /api/test-stripe` - Test Stripe connection

## Frontend Integration

### Update API Base URL

In your React app, update the API calls to point to your deployed worker:

```javascript
// In your API configuration
const API_BASE_URL = 'https://your-worker-name.your-subdomain.workers.dev';

// Example API call
const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(checkoutData),
});
```

### CORS Configuration

The worker includes CORS headers for all domains (`*`). For production, you may want to restrict this to your specific domain by modifying the worker code.

## Static Asset Deployment Options

### Option 1: Cloudflare Pages

1. Build your React app: `npm run build`
2. Deploy to Cloudflare Pages (manual upload or Git integration)
3. Configure environment variables in Pages dashboard

### Option 2: Netlify

1. Build your React app: `npm run build`
2. Deploy to Netlify
3. Update API calls to point to your Worker

### Option 3: Vercel

1. Build your React app: `npm run build`
2. Deploy to Vercel
3. Update API calls to point to your Worker

## Environment Variables Reference

### Required Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_xxx              # Production: sk_live_xxx, Development: sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx            # From Stripe webhook configuration

# Environment
NODE_ENV=production                        # production or development
```

### Frontend Environment Variables (.env)

```env
# For the React app (not the worker)
VITE_API_BASE_URL=https://your-worker.workers.dev
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

## Webhook Configuration

After deploying your worker:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-worker-name.your-subdomain.workers.dev/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret
5. Add it to your worker's environment variables as `STRIPE_WEBHOOK_SECRET`

## Custom Domain

To use a custom domain with your worker:

1. In Cloudflare Workers dashboard, go to your worker
2. Navigate to "Triggers" tab
3. Add a custom domain or route
4. Update your frontend to use the custom domain

## Monitoring and Debugging

### View Logs

```bash
# Real-time logs
wrangler tail

# Or view in Cloudflare dashboard under "Logs" tab
```

### Test API Endpoints

```bash
# Test Stripe connection
curl https://your-worker.workers.dev/api/test-stripe

# Test CORS
curl -X OPTIONS https://your-worker.workers.dev/api/create-checkout-session
```

## Security Considerations

1. **Environment Variables**: Never commit secrets to git
2. **CORS**: Restrict origins in production if needed
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Webhook Verification**: Always verify Stripe webhook signatures

## Troubleshooting

### Worker not deploying

- Check `wrangler.toml` syntax
- Ensure you're logged in: `wrangler whoami`
- Verify account permissions

### API calls failing

- Check CORS headers
- Verify environment variables are set
- Check worker logs: `wrangler tail`

### Stripe errors

- Verify API keys are correct (test vs live)
- Check webhook secret matches Stripe configuration
- Ensure webhook URL is accessible

## Cost

Cloudflare Workers pricing:
- **Free tier**: 100,000 requests/day
- **Paid plan**: $5/month for 10 million requests
- **Additional**: $0.50 per million requests

## Next Steps

1. Deploy the worker: `npm run worker:deploy`
2. Note your worker URL
3. Deploy your React app to your preferred platform
4. Update API calls in your frontend to use the worker URL
5. Configure Stripe webhooks
6. Test the complete application

For more information, visit [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/). 