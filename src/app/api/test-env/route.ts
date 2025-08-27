import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI?.length || 0,
    mongoUriStart: process.env.MONGODB_URI?.substring(0, 20) || 'not set',
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    nodeEnv: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(key => 
      key.includes('MONGODB') || 
      key.includes('EMAIL') || 
      key.includes('STRIPE') || 
      key.includes('NEXT_PUBLIC')
    )
  };

  return NextResponse.json(envCheck);
}
