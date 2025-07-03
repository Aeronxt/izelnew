import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import PropTypes from 'prop-types';

const OrderSummary = ({ shipping = 0, discountState, updateDiscountState }) => {
  const { cartItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  // Use discount state from props if provided, otherwise use local state for backward compatibility
  const currentDiscountState = discountState || {
    promoApplied: false,
    discount: 0,
    appliedPromoCode: ''
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal + shipping - currentDiscountState.discount); // Ensure total doesn't go below 0

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    setPromoError('');
    
    const code = promoCode.toUpperCase().trim();
    
    if (!code) {
      setPromoError('Please enter a coupon code');
      return;
    }

    // Define available coupons
    const coupons = {
      'SAVE10': {
        type: 'percentage',
        value: 0.1,
        description: '10% off'
      },
      'TRISHITA105': {
        type: 'percentage', 
        value: 1.0,
        description: '100% off'
      }
    };

    if (coupons[code]) {
      const coupon = coupons[code];
      let discountAmount = 0;
      
      if (coupon.type === 'percentage') {
        discountAmount = subtotal * coupon.value;
      }
      
      const newDiscountState = {
        promoApplied: true,
        discount: discountAmount,
        appliedPromoCode: code
      };

      // Update shared discount state if available, otherwise use local state
      if (updateDiscountState) {
        updateDiscountState(newDiscountState);
      }
      
      setPromoCode(''); // Clear input field
    } else {
      setPromoError('Invalid coupon code');
      
      const resetDiscountState = {
        promoApplied: false,
        discount: 0,
        appliedPromoCode: ''
      };

      if (updateDiscountState) {
        updateDiscountState(resetDiscountState);
      }
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoError('');
    
    const resetDiscountState = {
      promoApplied: false,
      discount: 0,
      appliedPromoCode: ''
    };

    if (updateDiscountState) {
      updateDiscountState(resetDiscountState);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex gap-4">
            <div className="relative">
              <img 
                src={item.imageSrc || item.image_url} 
                alt={item.title || item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{item.title || item.name}</h3>
              <p className="text-xs text-gray-600">Size: {item.size}</p>
            </div>
            <div className="text-sm font-medium">
              ৳{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        {!currentDiscountState.promoApplied ? (
          <form onSubmit={handlePromoSubmit}>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Discount code or gift card"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-red-600 text-sm mt-1">{promoError}</p>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
            <div className="text-sm">
              <span className="font-medium text-green-700">{currentDiscountState.appliedPromoCode}</span>
              <span className="text-green-600 ml-2">
                {currentDiscountState.appliedPromoCode === 'TRISHITA105' ? '100% off applied!' : 'Discount applied!'}
              </span>
            </div>
            <button 
              onClick={removePromo}
              className="text-red-600 hover:text-red-700 text-sm underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping > 0 ? `৳${shipping.toFixed(2)}` : 'Calculated at next step'}</span>
        </div>
        {currentDiscountState.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({currentDiscountState.appliedPromoCode})</span>
            <span>-৳{currentDiscountState.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between font-medium">
          <span>Total</span>
          <div className="text-right">
            <div className="text-lg">
              <span className="text-sm text-gray-600 mr-1">BDT</span>
              <span className={`${total === 0 ? 'text-green-600 font-bold' : ''}`}>
                ৳{total.toFixed(2)}
              </span>
            </div>
            {total === 0 && (
              <div className="text-xs text-green-600 mt-1">
                🎉 Free with TRISHITA105!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  shipping: PropTypes.number,
  discountState: PropTypes.object,
  updateDiscountState: PropTypes.func
};

export default OrderSummary; 