# 🐱 Cat Sitting Website

A professional cat sitting service website built with Next.js 15, featuring online booking, Stripe payments, admin panel, and email notifications.

## ✨ Features

- **📅 Online Booking System** - Easy-to-use booking form with date selection
- **💳 Stripe Payment Integration** - Secure payment processing with deposits
- **👨‍💼 Admin Panel** - Complete booking and message management
- **📧 Email Notifications** - Automated emails for bookings and updates
- **📱 Responsive Design** - Works perfectly on all devices
- **🔒 Secure Authentication** - Protected admin routes with session management
- **📊 Dashboard Analytics** - Booking statistics and recent activity
- **🎨 Modern UI/UX** - Beautiful, professional design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Stripe account
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cat-sitting-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=catsitting

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password

# Admin
ADMIN_PASSWORD=your_secure_password

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── book/              # Booking page
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── lib/                   # Utility libraries
└── types/                 # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

### Quick Deploy Options:

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm run build
# Upload .next folder to Netlify
```

## 🔒 Security Features

- ✅ Server-side authentication
- ✅ HTTP-only cookies
- ✅ Environment variable protection
- ✅ Input validation
- ✅ Secure payment processing
- ✅ Protected admin routes

## 📊 Admin Panel

Access the admin panel at `/admin` with your configured password:

- **Dashboard** - Overview of bookings, messages, and revenue
- **Calendar View** - Visual booking calendar with hover details
- **Booking Management** - Approve, decline, or modify bookings
- **Message Center** - View and manage customer inquiries
- **Recent Activity** - Track all system activity

## 🛠️ Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Payments**: Stripe
- **Email**: Nodemailer
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📈 Performance

- **Build Size**: Optimized for production
- **Loading Speed**: Fast page loads with Next.js optimizations
- **SEO**: Built-in SEO features
- **Mobile**: Fully responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Review the [STRIPE_SETUP.md](./STRIPE_SETUP.md)
- Open an issue on GitHub

---

**Built with ❤️ for cat lovers everywhere**
