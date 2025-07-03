import { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../supabaseClient';
// Stripe is handled via API routes, no client-side initialization needed

const CheckoutPayment = ({ onBack, formData, discountState = { discount: 0, appliedPromoCode: '' } }) => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [billingAddress, setBillingAddress] = useState('same');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionError, setTransactionError] = useState('');

  // Calculate totals with discount applied
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = formData.shippingPrice || 0;
  const discountAmount = discountState.discount || 0;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  // Function to generate a random 6-digit number
  const generateTrackingNumber = async () => {
    const generateNumber = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    let trackingNumber = generateNumber();
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Keep generating until we find a unique number or hit max attempts
    while (!isUnique && attempts < maxAttempts) {
      // Check if the number exists in the database
      const { error } = await supabase
        .from('orders')
        .select('tracking_number')
        .eq('tracking_number', trackingNumber)
        .single();

      if (error && error.code === 'PGRST116') {
        // Error code PGRST116 means no rows returned, so the number is unique
        isUnique = true;
      } else {
        // Number exists, generate a new one
        trackingNumber = generateNumber();
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Could not generate unique tracking number');
    }

    return trackingNumber;
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'bkash') {
      setIsDrawerOpen(true);
    }
  };

  // Handle Stripe payment for credit card
  const handleStripePayment = async () => {
    try {
      // Generate tracking number first
      const trackingNumber = await generateTrackingNumber();

      // Create order record first (with pending status)
      const orderData = {
        product_name: cartItems.map(item => item.title || item.name).join(', '),
        category: cartItems.map(item => item.type || item.category || 'Uncategorized').join(', '),
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.postcode}`,
        phone_number: formData.phone,
        quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        payment_method: 'credit_card',
        amount: total, // Use discounted total
        product_sku: cartItems.map(item => item.sku || item.id).join(', '),
        order_status: 'pending_payment',
        payment_status: 'pending',
        tracking_number: trackingNumber,
        // Add discount information to order
        discount_amount: discountAmount,
        coupon_code: discountState.appliedPromoCode || null,
        original_amount: subtotal + shippingCost
      };

      const { data: orderRecord, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .single();

      if (orderError) {
        throw orderError;
      }

      console.log('Creating payment session for order:', orderRecord.id);

      // Create payment session with Stripe using discounted total
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            ...item,
            price: item.price,
            quantity: item.quantity
          })),
          customerInfo: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          },
          shippingAmount: shippingCost,
          discountAmount: discountAmount, // Pass discount to Stripe
          couponCode: discountState.appliedPromoCode,
          orderId: orderRecord.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const sessionData = await response.json();
      
      if (!sessionData.url) {
        throw new Error(sessionData.error || 'Failed to create payment session');
      }

      console.log('Payment session created:', sessionData);

      // Handle free orders (100% discount)
      if (sessionData.isFreeOrder) {
        // For free orders, mark as completed and redirect to confirmation
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            order_status: 'completed',
            payment_status: 'completed'
          })
          .eq('id', orderRecord.id);

        if (updateError) {
          console.error('Error updating free order status:', updateError);
        }

        // Clear cart and redirect to confirmation
        clearCart();
        toast.success('Free order placed successfully!');
        navigate('/order-confirmation', { 
          state: { 
            orderDetails: {
              ...orderRecord,
              shipping_price: formData.shippingPrice,
              total_amount: total,
              discount_amount: discountAmount,
              coupon_code: discountState.appliedPromoCode,
              payment_status: 'completed',
              order_status: 'completed'
            }
          },
          replace: true 
        });
        return;
      }

      // Redirect to Stripe Checkout for paid orders
      window.location.href = sessionData.url;

    } catch (error) {
      console.error('Stripe payment error:', error);
      toast.error(error.message || 'Failed to process Stripe payment');
    }
  };

  // Handle traditional payment methods (bKash, Nagad)
  const handleTraditionalPayment = async () => {
    if (paymentMethod === 'bkash' && !transactionId.trim()) {
      setTransactionError('Please enter the bKash transaction ID');
      return;
    }

    try {
      // Generate tracking number before starting transaction
      const trackingNumber = await generateTrackingNumber();
      console.log('Generated tracking number:', trackingNumber);

      // Start a transaction
      const { data: beginResult, error: beginError } = await supabase
        .rpc('handle_transaction', { operation: 'begin' });
      
      if (beginError || beginResult?.status === 'error') {
        throw new Error(beginError?.message || beginResult?.message || 'Failed to start transaction');
      }

      try {
        let firstOrderId = null;
        let orderTrackingNumber = trackingNumber;

        // Process each item in the cart
        for (const item of cartItems) {
          // Add order to orders table with discount information
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
              product_name: item.title || item.name,
              category: item.type || item.category || 'Uncategorized',
              customer_name: `${formData.firstName} ${formData.lastName}`,
              customer_email: formData.email,
              address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.postcode}`,
              phone_number: formData.phone,
              quantity: item.quantity,
              payment_method: paymentMethod,
              amount: (item.price * item.quantity), // Individual item amount
              product_sku: item.sku || item.id,
              order_status: 'pending',
              transaction_id: paymentMethod === 'bkash' ? transactionId : null,
              tracking_number: orderTrackingNumber,
              // Add discount information
              discount_amount: cartItems.length === 1 ? discountAmount : (discountAmount * (item.price * item.quantity) / subtotal), // Proportional discount for multiple items
              coupon_code: discountState.appliedPromoCode || null,
              original_amount: item.price * item.quantity
            })
            .select('*')
            .single();

          if (orderError) {
            console.error('Order error:', orderError);
            throw orderError;
          }

          // Store the first order ID and tracking number
          if (!firstOrderId) {
            firstOrderId = orderData.id;
            console.log('Order created with tracking number:', orderTrackingNumber);
          }

          // Update stock in clothes table
          const { data: stockData, error: stockError } = await supabase
            .from('clothes')
            .select('id, stock_by_size')
            .eq('id', item.id)
            .limit(1);

          if (stockError) {
            console.error('Stock fetch error:', stockError);
            throw stockError;
          }

          if (!stockData || stockData.length === 0) {
            throw new Error(`Product not found: ${item.title || item.name}`);
          }

          const currentStock = stockData[0];
          if (!currentStock.stock_by_size || !currentStock.stock_by_size[item.size]) {
            throw new Error(`No stock information found for ${item.title || item.name} in size ${item.size}`);
          }

          const updatedStock = { ...currentStock.stock_by_size };
          const currentQuantity = updatedStock[item.size] || 0;
          
          if (currentQuantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.title || item.name} in size ${item.size}`);
          }

          updatedStock[item.size] = currentQuantity - item.quantity;

          const { error: updateError } = await supabase
            .from('clothes')
            .update({ stock_by_size: updatedStock })
            .eq('id', item.id);

          if (updateError) {
            console.error('Stock update error:', updateError);
            throw updateError;
          }
        }

        // Commit transaction
        const { data: commitResult, error: commitError } = await supabase
          .rpc('handle_transaction', { operation: 'commit' });

        if (commitError || commitResult?.status === 'error') {
          throw new Error(commitError?.message || commitResult?.message || 'Failed to commit transaction');
        }

        // Clear cart and show success message
        clearCart();
        toast.success('Order placed successfully!');
        
        // Get the complete order details
        const { data: orderDetails, error: orderDetailsError } = await supabase
          .from('orders')
          .select('*')
          .eq('tracking_number', orderTrackingNumber)
          .single();

        if (orderDetailsError || !orderDetails) {
          console.error('Error fetching order details:', orderDetailsError);
          throw new Error('Failed to fetch order details');
        }

        // Navigate to confirmation page with order details including discount
        window.scrollTo(0, 0);
        navigate('/order-confirmation', { 
          state: { 
            orderDetails: {
              ...orderDetails,
              shipping_price: formData.shippingPrice,
              total_amount: total, // Use discounted total
              discount_amount: discountAmount,
              coupon_code: discountState.appliedPromoCode
            }
          },
          replace: true 
        });

      } catch (error) {
        // Rollback transaction on any error
        const { error: rollbackError } = await supabase
          .rpc('handle_transaction', { operation: 'rollback' });

        if (rollbackError) {
          console.error('Rollback error:', rollbackError);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(error.message || 'Failed to process order. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (paymentMethod === 'credit_card') {
        await handleStripePayment();
      } else {
        await handleTraditionalPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {/* Summary boxes */}
      <div className="space-y-3 mb-6">
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-4">
              <span className="text-gray-600">Contact</span>
              <span>{formData.email}</span>
            </div>
            <button onClick={() => onBack(0)} className="text-sm text-blue-600 hover:underline">
              Change
            </button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-gray-600">Ship to</span>
              <span>{formData.address}, {formData.city}, {formData.state} {formData.postcode}</span>
            </div>
            <button onClick={() => onBack(0)} className="text-sm text-blue-600 hover:underline">
              Change
            </button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-gray-600">Shipping method</span>
              <span>{formData.shippingMethod === 'express' ? 'Express' : 'Standard'} · ৳{formData.shippingPrice?.toFixed(2)}</span>
            </div>
            <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
              Change
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-medium mb-2">Payment</h2>
      <p className="text-sm text-gray-600 mb-6">All transactions are secure and encrypted.</p>

      <form onSubmit={handleSubmit}>
        {/* Payment method selection */}
        <div className="border border-gray-300 rounded-lg mb-6">
          <label className={`flex items-center justify-between p-4 cursor-pointer ${paymentMethod === 'credit_card' ? 'bg-blue-50' : ''}`}>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              />
              <span>Credit card</span>
            </div>
            <div className="flex gap-2">
              <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//visaCard.svg" alt="Visa" className="h-8" />
              <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//masterCard.svg" alt="Mastercard" className="h-8" />
              <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//amexCard.svg" alt="Amex" className="h-8" />
            </div>
          </label>

          <label className={`flex items-center gap-3 p-4 border-t cursor-pointer ${paymentMethod === 'bkash' ? 'bg-blue-50' : ''}`}>
            <input
              type="radio"
              name="payment"
              value="bkash"
              checked={paymentMethod === 'bkash'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
            />
            <span>bKash</span>
            <div className="h-8 ml-auto flex items-center">
              <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//bkash.svg" alt="bKash" className="h-full" />
            </div>
          </label>

          <label className={`flex items-center gap-3 p-4 border-t cursor-pointer ${paymentMethod === 'nagad' ? 'bg-blue-50' : ''}`}>
            <input
              type="radio"
              name="payment"
              value="nagad"
              checked={paymentMethod === 'nagad'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
            />
            <span>Nagad</span>
            <div className="h-8 ml-auto flex items-center">
              <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//nagad.svg" alt="Nagad" className="h-full" />
            </div>
          </label>
        </div>

        {/* Billing address */}
        <h3 className="text-xl font-medium mb-4">Billing address</h3>
        <p className="text-sm text-gray-600 mb-4">Select the address that matches your card or payment method.</p>

        <div className="space-y-3 mb-6">
          <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${billingAddress === 'same' ? 'border-black bg-gray-50' : 'border-gray-300'}`}>
            <input
              type="radio"
              name="billing"
              value="same"
              checked={billingAddress === 'same'}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="mr-3"
            />
            <span>Same as shipping address</span>
          </label>

          <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${billingAddress === 'different' ? 'border-black bg-gray-50' : 'border-gray-300'}`}>
            <input
              type="radio"
              name="billing"
              value="different"
              checked={billingAddress === 'different'}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="mr-3"
            />
            <span>Use a different billing address</span>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ChevronLeft className="w-4 h-4" />
            Return to shipping
          </button>
          
          <button
            type="submit"
            disabled={isProcessing}
            className={`bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'Processing...' : 'Complete order'}
          </button>
        </div>
      </form>

      {/* bKash Payment Instructions Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">bKash Payment Instructions</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Total Amount to Pay:</h4>
                <p className="text-2xl font-bold">৳{total.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Open bKash App</h4>
                    <p className="text-sm text-gray-600">Launch your bKash mobile app</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Send Money</h4>
                    <p className="text-sm text-gray-600">Select "Send Money" option from the menu</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Enter bKash Number</h4>
                    <p className="text-sm text-gray-600">Enter this number:</p>
                    <p className="font-medium text-pink-600">+8801842521774</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-medium">4</div>
                  <div>
                    <h4 className="font-medium">Enter Amount</h4>
                    <p className="text-sm text-gray-600">Enter the total amount: ৳{total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-medium">5</div>
                  <div>
                    <h4 className="font-medium">Enter Transaction ID</h4>
                    <p className="text-sm text-gray-600 mb-2">After successful payment, enter the Transaction ID below:</p>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => {
                        setTransactionId(e.target.value);
                        setTransactionError('');
                      }}
                      placeholder="Enter Transaction ID"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                    />
                    {transactionError && (
                      <p className="text-red-500 text-sm mt-1">{transactionError}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition-colors"
              >
                Confirm Transaction ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CheckoutPayment.propTypes = {
  onBack: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  discountState: PropTypes.object
};

export default CheckoutPayment; 