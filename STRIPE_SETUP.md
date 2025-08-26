# Stripe Setup Guide for Cat Sitting Website

This guide will help you set up Stripe payments for your cat sitting website.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Node.js and npm installed
- MongoDB database set up

## Step 1: Get Your Stripe Keys

1. Log into your Stripe Dashboard
2. Go to Developers → API keys
3. Copy your **Publishable key** and **Secret key**

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Email Configuration (for notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password

# Admin Configuration
ADMIN_PASSWORD=your-admin-password # Admin panel password

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Step 3: Configure Stripe Webhooks

1. In your Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your `.env.local` file

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Go to your booking page and try to make a test booking
3. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Step 5: Deploy to Production

1. Update your environment variables with production Stripe keys
2. Update the webhook endpoint URL to your production domain
3. Test the payment flow in production

## Security Notes

- Never commit your `.env.local` file to version control
- Use different Stripe keys for development and production
- Regularly rotate your API keys
- Monitor your Stripe dashboard for any suspicious activity

## Troubleshooting

### Common Issues:

1. **Webhook errors**: Make sure your webhook endpoint is publicly accessible
2. **Payment failures**: Check that your Stripe keys are correct
3. **Email not sending**: Verify your email server configuration

### Testing:

- Use Stripe's test mode for development
- Test with various card scenarios (success, decline, insufficient funds)
- Verify webhook events are being received

## Support

If you encounter issues:
1. Check the Stripe documentation: https://stripe.com/docs
2. Review your server logs for error messages
3. Verify all environment variables are set correctly
