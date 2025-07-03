import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Package, MapPin, Phone, Mail } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Get URL parameters for Stripe session
  const urlParams = new URLSearchParams(location.search);
  const sessionId = urlParams.get('session_id');
  const isStripePayment = !!sessionId;

  useEffect(() => {
    const handleStripePayment = async () => {
      if (!sessionId) return;

      setIsLoading(true);
      try {
        // Get session details from Stripe
        const response = await fetch(`/api/get-checkout-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to retrieve payment session');
        }

        const sessionData = await response.json();
        
        if (sessionData.paymentStatus === 'paid') {
          // Get order details from database using the order ID in metadata
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', sessionData.metadata.orderId)
            .single();

          if (orderError) {
            throw orderError;
          }

          // Update order status to paid
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              order_status: 'paid',
              payment_status: 'completed',
              stripe_session_id: sessionId
            })
            .eq('id', sessionData.metadata.orderId);

          if (updateError) {
            throw updateError;
          }

          setOrderDetails({
            ...orderData,
            stripe_session: sessionData.session,
            customer_email: sessionData.customerDetails?.email
          });

          toast.success('Payment successful! Order confirmed.');
        } else {
          throw new Error('Payment was not completed');
        }
      } catch (error) {
        console.error('Error processing Stripe payment:', error);
        toast.error('Failed to confirm payment. Please contact support.');
        navigate('/checkout');
      } finally {
        setIsLoading(false);
      }
    };

    const handleTraditionalPayment = () => {
      // For traditional payments, get order details from location state
      if (location.state?.orderDetails) {
        setOrderDetails(location.state.orderDetails);
      } else {
        // If no order details, redirect to home
        navigate('/', { replace: true });
      }
    };

    if (isStripePayment) {
      handleStripePayment();
    } else {
      handleTraditionalPayment();
    }
  }, [sessionId, location.state, navigate, isStripePayment]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No order details found.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodDisplay = () => {
    switch (orderDetails.payment_method) {
      case 'credit_card':
        return 'Credit Card (Stripe)';
      case 'bkash':
        return 'bKash';
      case 'nagad':
        return 'Nagad';
      default:
        return orderDetails.payment_method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            {orderDetails?.total_amount === 0 || (orderDetails?.discount_amount && orderDetails?.discount_amount >= (orderDetails?.original_amount || orderDetails?.amount)) 
              ? "Thank you for your order! Your items are free with the applied coupon and we'll start processing your order."
              : "Thank you for your order. We've received your payment and will start processing your order."
            }
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <span className="text-sm text-gray-500">
                {formatDate(orderDetails.created_at)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Order Information</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-medium">#{orderDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tracking Number:</span>
                    <span className="font-medium">{orderDetails.tracking_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium capitalize">{orderDetails.order_status}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">{getPaymentMethodDisplay()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-medium capitalize text-green-600">{orderDetails.payment_status || 'Completed'}</span>
                  </div>
                  {/* Order Summary with Discount */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">৳{orderDetails.original_amount ? orderDetails.original_amount.toFixed(2) : orderDetails.amount.toFixed(2)}</span>
                    </div>
                    {orderDetails.shipping_price && orderDetails.shipping_price > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="font-medium">৳{orderDetails.shipping_price.toFixed(2)}</span>
                      </div>
                    )}
                    {orderDetails.discount_amount && orderDetails.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount {orderDetails.coupon_code ? `(${orderDetails.coupon_code})` : ''}:</span>
                        <span className="font-medium">-৳{orderDetails.discount_amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-100 pt-1 font-semibold">
                      <span>Total Amount:</span>
                      <span className={`${orderDetails.total_amount === 0 || (orderDetails.discount_amount && orderDetails.discount_amount >= (orderDetails.original_amount || orderDetails.amount)) ? 'text-green-600' : ''}`}>
                        ৳{orderDetails.total_amount ? orderDetails.total_amount.toFixed(2) : orderDetails.amount.toFixed(2)}
                        {(orderDetails.total_amount === 0 || (orderDetails.discount_amount && orderDetails.discount_amount >= (orderDetails.original_amount || orderDetails.amount))) && (
                          <span className="ml-2 text-xs">🎉 FREE</span>
                        )}
                      </span>
                    </div>
                  </div>
                  {orderDetails.transaction_id && (
                    <div className="flex justify-between pt-2">
                      <span>Transaction ID:</span>
                      <span className="font-medium">{orderDetails.transaction_id}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-medium">{orderDetails.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{orderDetails.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">{orderDetails.quantity}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{orderDetails.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{orderDetails.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{orderDetails.phone_number}</span>
                </div>
                {orderDetails.customer_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{orderDetails.customer_email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/track-order', { state: { trackingNumber: orderDetails.tracking_number } })}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Track Your Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            You will receive an email confirmation shortly with your order details and tracking information.
          </p>
          <p>
            For any questions about your order, please contact our customer support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 