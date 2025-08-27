'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';

function CancelPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Cancel Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600">
            Your payment was not completed. Don&apos;t worry, your booking is still pending.
          </p>
        </div>

        {/* Warning Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <h2 className="text-lg font-semibold text-yellow-800">Important Notice</h2>
          </div>
          <p className="text-yellow-700">
            You have <strong>23 hours</strong> from when your booking was approved to complete your deposit payment. 
            After this time, your booking will be automatically cancelled.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          {bookingId && (
            <Link 
              href={`/api/payments/deposit`}
              className="inline-flex items-center bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Payment Again
            </Link>
          )}
          
          <div className="block">
            <Link 
              href="/" 
              className="inline-block bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you&apos;re experiencing issues with payment or have questions about your booking, 
            please don&apos;t hesitate to contact us.
          </p>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>📧 Email: <a href="mailto:support@catsitting.com" className="text-pink-500 hover:underline">support@catsitting.com</a></p>
            <p>📱 Phone: <a href="tel:+16138596723" className="text-pink-500 hover:underline">(613) 859-6723</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CancelPageContent />
    </Suspense>
  );
}
