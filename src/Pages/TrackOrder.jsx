import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

const TrackOrder = () => {
  const [email, setEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOrderStatus = (status) => {
    const statusMap = {
      'pending': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };
    return statusMap[status] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrderDetails(null);

    try {
      // Trim whitespace from inputs
      const trimmedEmail = email.trim();
      const trimmedTracking = trackingNumber.trim();

      // Validate inputs
      if (!trimmedEmail || !trimmedTracking) {
        toast.error('Please enter both email and tracking number');
        setLoading(false);
        return;
      }

      // Using textSearch for exact match while handling trailing spaces
      const { data, error } = await supabase
        .from('orders')
        .select()
        .eq('tracking_number', trimmedTracking)
        .textSearch('customer_email', `"${trimmedEmail}"`, {
          config: 'english'
        })
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        toast.error('An error occurred while fetching your order. Please try again.');
        setLoading(false);
        return;
      }

      if (!data) {
        toast.error('No order found with the provided details. Please check and try again.');
        setLoading(false);
        return;
      }

      setOrderDetails(data);
      toast.success('Order found!');
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { 
      step: 1, 
      title: 'Order Placed', 
      description: 'Your order has been confirmed',
      icon: '📋'
    },
    { 
      step: 2, 
      title: 'Processing', 
      description: 'Preparing your order',
      icon: '📦'
    },
    { 
      step: 3, 
      title: 'Shipped', 
      description: 'Package is on the way',
      icon: '🚚'
    },
    { 
      step: 4, 
      title: 'Delivered', 
      description: 'Order delivered successfully',
      icon: '✅'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <span className="text-2xl">📍</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Delivery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                         Stay updated on your order&apos;s journey from our warehouse to your doorstep
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">📧</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tracking" className="block text-sm font-semibold text-gray-700">
                  Tracking Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter 6-digit tracking code"
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Tracking...</span>
                  </div>
                ) : (
                  'Track Delivery'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{orderDetails.tracking_number}</h2>
                    <p className="text-blue-100">Placed on {formatDate(orderDetails.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100">Total Amount</p>
                    <p className="text-2xl font-bold">৳{orderDetails.amount}</p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Delivery Progress</h3>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                  <div 
                    className="absolute top-8 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((getOrderStatus(orderDetails.order_status) - 1) / 3) * 100}%` }}
                  ></div>
                  
                  {/* Status Points */}
                  <div className="relative flex justify-between">
                    {statusSteps.map((status) => {
                      const isActive = getOrderStatus(orderDetails.order_status) >= status.step;
                      const isCurrent = getOrderStatus(orderDetails.order_status) === status.step;
                      
                      return (
                        <div key={status.step} className="flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 transition-all duration-500 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-110' 
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-blue-200 animate-pulse' : ''}`}>
                            {status.icon}
                          </div>
                          <h4 className={`font-semibold text-sm mb-1 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                            {status.title}
                          </h4>
                          <p className={`text-xs max-w-24 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                            {status.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">📦</span>
                      Product Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Name</span>
                        <span className="font-semibold text-gray-900">{orderDetails.product_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-semibold text-gray-900">{orderDetails.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold text-gray-900 capitalize">{orderDetails.payment_method.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🏠</span>
                      Shipping Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 block">Customer Name</span>
                        <span className="font-semibold text-gray-900">{orderDetails.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Delivery Address</span>
                        <span className="font-semibold text-gray-900">{orderDetails.address}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Phone Number</span>
                        <span className="font-semibold text-gray-900">{orderDetails.phone_number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-8 pb-8">
                <div className="flex justify-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold ${
                    orderDetails.order_status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : orderDetails.order_status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : orderDetails.order_status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <span className="mr-2">
                      {orderDetails.order_status === 'delivered' ? '✅' : 
                       orderDetails.order_status === 'shipped' ? '🚚' :
                       orderDetails.order_status === 'processing' ? '📦' : '📋'}
                    </span>
                    Current Status: {orderDetails.order_status.charAt(0).toUpperCase() + orderDetails.order_status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder; 