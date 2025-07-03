import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get session_id from URL params
        const urlParams = new URLSearchParams(location.search);
        const sessionId = urlParams.get('session_id');
        const orderId = urlParams.get('order_id');

        if (!sessionId) {
          throw new Error('No session ID found');
        }

        console.log('Verifying payment for session:', sessionId);

        // Verify payment with our API
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        console.log('Payment verification response:', data);

        if (!data.success) {
          throw new Error('Payment verification failed');
        }

        if (!data.confirmed) {
          throw new Error('Payment not confirmed');
        }

        // Update order in database if payment is confirmed
        if (data.confirmed && data.orderId) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              order_status: 'paid',
              payment_status: 'completed',
              stripe_session_id: sessionId
            })
            .eq('id', data.orderId);

          if (updateError) {
            console.error('Error updating order:', updateError);
            // Don't throw error here as payment is confirmed
          }
        }

        setPaymentData(data);
        toast.success('Payment confirmed successfully!');

      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error.message);
        toast.error('Payment verification failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Back to Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No payment data found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Your payment has been confirmed and your order is being processed.
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Session ID</p>
              <p className="font-medium">{paymentData.sessionId}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium">{paymentData.orderId || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="font-medium">
                {paymentData.currency?.toUpperCase()} {(paymentData.amountTotal / 100).toFixed(2)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className="font-medium text-green-600 capitalize">{paymentData.paymentStatus}</p>
            </div>
            
            {paymentData.customerEmail && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{paymentData.customerEmail}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/order-confirmation', { 
              state: { 
                orderDetails: { 
                  id: paymentData.orderId,
                  stripe_session_id: paymentData.sessionId,
                  payment_status: 'completed',
                  order_status: 'paid'
                } 
              } 
            })}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View Order Details
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            You will receive an email confirmation shortly with your order details.
          </p>
          <p>
            For any questions about your order, please contact our customer support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 