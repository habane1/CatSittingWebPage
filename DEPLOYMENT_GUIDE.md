# 🚀 Deployment Guide for Cat Sitting Website

## Overview
This guide will help you deploy your cat sitting website to production. The application is built with Next.js 15 and includes Stripe payments, MongoDB database, and email notifications.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
Create a `.env.local` file in your project root with the following variables:

```env
# ========================================
# DATABASE CONFIGURATION
# ========================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_DB=catsitting

# ========================================
# STRIPE PAYMENT CONFIGURATION
# ========================================
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# ========================================
# EMAIL CONFIGURATION
# ========================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password_here

# Legacy email variables (for backward compatibility)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# ========================================
# ADMIN CONFIGURATION
# ========================================
ADMIN_PASSWORD=your_secure_admin_password_here

# ========================================
# NEXT.JS CONFIGURATION
# ========================================
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 2. Database Setup
- **MongoDB Atlas**: Create a MongoDB Atlas cluster
- **Database**: Create a database named `catsitting` (or your preferred name)
- **Collections**: The app will automatically create these collections:
  - `bookings` - Stores booking information
  - `messages` - Stores contact form messages
- **Network Access**: Allow connections from your deployment platform

### 3. Stripe Configuration
- **Account**: Set up a Stripe account at https://stripe.com
- **Keys**: Switch to live mode and get your live keys
- **Webhooks**: Configure webhook endpoint to `https://yourdomain.com/api/webhooks/stripe`
- **Events**: Listen for these events:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`

### 4. Email Setup (Gmail)
- **2FA**: Enable 2-factor authentication on your Gmail account
- **App Password**: Generate an app password for the application
- **SMTP**: Use Gmail's SMTP server with the app password

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically deploy on push to main branch
4. **Domain**: Configure your custom domain in Vercel settings

### Option 2: Netlify
1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment Variables**: Add all environment variables in Netlify dashboard
4. **Deploy**: Netlify will build and deploy automatically

### Option 3: Railway
1. **Connect Repository**: Connect your GitHub repository to Railway
2. **Environment Variables**: Add all environment variables in Railway dashboard
3. **Deploy**: Railway will automatically deploy your application

## 🔧 Post-Deployment Setup

### 1. Test All Features
- ✅ **Homepage**: Verify all pages load correctly
- ✅ **Booking Form**: Test the booking submission process
- ✅ **Stripe Payments**: Test with Stripe test cards
- ✅ **Admin Panel**: Test login and all admin features
- ✅ **Email Notifications**: Verify emails are being sent
- ✅ **Contact Form**: Test message submission

### 2. Security Verification
- ✅ **HTTPS**: Ensure your site uses HTTPS
- ✅ **Environment Variables**: Verify no sensitive data is exposed
- ✅ **Admin Access**: Test admin panel security
- ✅ **Database**: Verify database connection is secure

### 3. Performance Optimization
- ✅ **Build Size**: Check that build size is reasonable
- ✅ **Load Times**: Test page load speeds
- ✅ **Images**: Optimize any images used
- ✅ **Caching**: Configure appropriate caching headers

## 🛠️ Maintenance

### Regular Tasks
- **Monitor Logs**: Check application logs for errors
- **Database Backups**: Set up regular MongoDB backups
- **Security Updates**: Keep dependencies updated
- **Stripe Monitoring**: Monitor payment success rates
- **Email Deliverability**: Check email delivery rates

### Troubleshooting
- **Build Failures**: Check environment variables and dependencies
- **Database Issues**: Verify MongoDB connection and permissions
- **Payment Issues**: Check Stripe webhook configuration
- **Email Issues**: Verify SMTP settings and credentials

## 📞 Support

If you encounter issues during deployment:
1. Check the application logs
2. Verify all environment variables are set correctly
3. Test each component individually
4. Review the error messages for specific guidance

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use different keys for development and production
- Regularly rotate your API keys and passwords
- Monitor your application for suspicious activity
- Keep all dependencies updated
- Use HTTPS in production
- Implement proper rate limiting (future enhancement)

## 📈 Performance Monitoring

Consider implementing:
- **Error Tracking**: Services like Sentry
- **Analytics**: Google Analytics or similar
- **Uptime Monitoring**: Services like UptimeRobot
- **Performance Monitoring**: Vercel Analytics or similar

---

**Ready to deploy?** Make sure you've completed all the checklist items above, then proceed with your chosen deployment platform!
