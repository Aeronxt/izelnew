# Stripe Payment Integration Setup

This document explains how to set up Stripe payment integration for the e-commerce website.

## Prerequisites

1. A Stripe account (create one at [stripe.com](https://stripe.com))
2. Supabase project set up
3. Node.js and npm installed

## Installation

The required packages have already been installed:
- `@stripe/stripe-js` - Stripe JavaScript SDK for the frontend
- `@stripe/react-stripe-js` - React components for Stripe
- `stripe` - Stripe Node.js SDK for the backend

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Getting Stripe Keys

1. **Login to Stripe Dashboard**: Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Get API Keys**: 
   - Go to "Developers" → "API keys"
   - Copy your "Publishable key" for `VITE_STRIPE_PUBLISHABLE_KEY`
   - Copy your "Secret key" for `STRIPE_SECRET_KEY`
3. **Create Webhook**:
   - Go to "Developers" → "Webhooks"
   - Click "Add endpoint"
   - Use URL: `https://yourdomain.com/api/stripe-webhook`
   - Select events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy the webhook signing secret for `STRIPE_WEBHOOK_SECRET`

## Database Migration

Run the migration to add Stripe-related fields to your database:

```sql
-- Run the migration in your Supabase SQL editor
-- File: supabase/migration_add_stripe_fields.sql
```

This adds the following fields to the `orders` table:
- `tracking_number` - Unique order tracking number
- `payment_status` - Payment status (pending, completed, failed, refunded)
- `stripe_session_id` - Stripe checkout session ID
- `stripe_payment_intent` - Stripe payment intent ID

## How It Works

### 1. Credit Card Payment Flow

1. **Customer selects credit card** payment method
2. **Order is created** in database with `pending_payment` status
3. **Stripe Checkout session** is created with order details
4. **Customer is redirected** to Stripe's secure payment page
5. **Payment is processed** by Stripe
6. **Webhook confirms payment** and updates order status to `paid`
7. **Customer is redirected** back to order confirmation page

### 2. Traditional Payment Flow (bKash/Nagad)

1. **Customer selects** bKash or Nagad
2. **Payment instructions** are shown
3. **Customer completes payment** externally
4. **Transaction ID is entered**
5. **Order is processed** and saved to database
6. **Customer sees** order confirmation

## API Endpoints

### `/api/create-checkout-session`
Creates a Stripe checkout session for credit card payments.

**Method**: POST
**Body**:
```json
{
  "cartItems": [...],
  "customerInfo": {...},
  "shippingAmount": 0,
  "orderId": "uuid"
}
```

### `/api/stripe-webhook`
Handles Stripe webhook events for payment confirmations.

**Method**: POST
**Headers**: `stripe-signature`
**Events**: `checkout.session.completed`, `payment_intent.payment_failed`

### `/api/get-checkout-session`
Retrieves Stripe checkout session information.

**Method**: GET
**Query**: `session_id`

## Currency

All payments are processed in **BDT (Bangladeshi Taka)**. Stripe automatically handles the currency conversion and displays amounts in paisa (BDT cents).

## Testing

### Test Card Numbers

Use these test card numbers in Stripe's test mode:

- **Visa**: 4242 4242 4242 4242
- **Visa (debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005

**Test Details**:
- **Expiry**: Any future date
- **CVC**: Any 3-digit number
- **ZIP**: Any valid postal code

## Security Features

1. **PCI Compliance**: Stripe handles all card data securely
2. **Webhook Verification**: All webhooks are verified using Stripe signatures
3. **Environment Variables**: Sensitive keys are stored in environment variables
4. **Database Security**: Order details are validated before processing

## Error Handling

The system handles various error scenarios:

1. **Payment Failures**: Orders are marked as `payment_failed`
2. **Network Issues**: User-friendly error messages are shown
3. **Invalid Sessions**: Users are redirected to checkout page
4. **Database Errors**: Transactions are rolled back

## Order Status Flow

```
pending_payment → paid → processing → shipped → delivered
     ↓
payment_failed
```

## Production Deployment

### Vercel Deployment (Recommended)

1. **Deploy to Vercel**:
   ```bash
   npm run build
   vercel --prod
   ```

2. **Add Environment Variables** in Vercel Dashboard:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add all the required variables:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
     STRIPE_SECRET_KEY=sk_live_your_live_key
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

3. **Configure Stripe Webhook**:
   - Webhook URL: `https://yourdomain.vercel.app/api/stripe-webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `payment_intent.payment_failed`

4. **Database Migration**:
   - Run the migration in your Supabase SQL editor:
   ```sql
   -- Execute the contents of supabase/migration_add_stripe_fields.sql
   ```

### Alternative Deployment

For other hosting platforms:
1. Build the project: `npm run build`
2. Deploy the `dist` folder as static files
3. Set up serverless functions for the API routes in the `api` folder
4. Configure environment variables on your hosting platform

### Post-Deployment Checklist

✅ Environment variables configured  
✅ Database migration executed  
✅ Stripe webhook endpoint configured  
✅ Test payments working  
✅ Order confirmation emails (if configured)  

### Webhook Configuration

After deployment, update your Stripe webhook endpoint URL to point to your production domain.

## Troubleshooting

### Common Issues

1. **"Stripe failed to initialize"**
   - Check if `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
   - Ensure the key starts with `pk_test_` or `pk_live_`

2. **"Failed to create checkout session"**
   - Verify `STRIPE_SECRET_KEY` is correct
   - Check server logs for detailed error messages

3. **"Webhook signature verification failed"**
   - Ensure `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint
   - Check that the webhook URL is accessible

4. **Orders not updating after payment**
   - Verify webhook is receiving events
   - Check database permissions
   - Ensure order ID in metadata is correct

## Support

For additional help:
1. Check Stripe documentation: [stripe.com/docs](https://stripe.com/docs)
2. Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Check the browser console and server logs for error messages 