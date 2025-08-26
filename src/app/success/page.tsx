'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Clock, DollarSign } from 'lucide-react';

interface Booking {
  _id: string;
  name: string;
  dates: string[];
  notes: string;
  deposit: {
    amount: number;
    total: number;
    status: string;
    paidAt: string;
  };
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find your booking details.</p>
          <Link 
            href="/" 
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Your deposit has been received and your booking is confirmed.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-500" />
            Booking Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Client Name:</span>
              <span className="font-medium text-gray-800">{booking.name}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Booking Dates:</span>
              <span className="font-medium text-gray-800">
                {booking.dates.length} day{booking.dates.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {booking.notes && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-gray-600">Notes:</span>
                <span className="font-medium text-gray-800 text-right max-w-xs">{booking.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Payment Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Deposit Amount:</span>
              <span className="font-medium text-gray-800">${booking.deposit.amount}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-gray-800">${booking.deposit.total}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Payment Status:</span>
              <span className="font-medium text-green-600 capitalize">{booking.deposit.status}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Paid On:</span>
              <span className="font-medium text-gray-800">
                {new Date(booking.deposit.paidAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            What Happens Next?
          </h2>
          
          <div className="space-y-3 text-blue-700">
            <p>✅ Your booking is now confirmed and secured</p>
            <p>📧 You&apos;ll receive a confirmation email shortly</p>
            <p>🐱 We&apos;ll contact you before your scheduled dates</p>
            <p>💳 The remaining balance will be collected when service starts</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/" 
            className="flex-1 bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors text-center font-medium"
          >
            Return Home
          </Link>
          
          <Link 
            href="/book" 
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors text-center font-medium"
          >
            Book Another Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

