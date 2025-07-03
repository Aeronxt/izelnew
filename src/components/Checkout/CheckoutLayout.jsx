import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const CheckoutLayout = ({ children, currentStep, orderSummary }) => {
  const steps = ['Information', 'Shipping', 'Payment'];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold">Checkout</h1>
          </Link>
          
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link to="/cart" className="text-gray-600 hover:text-black">Cart</Link>
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className={index < currentStep ? 'text-black' : 'text-gray-400'}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left side - Form */}
          <div className="order-2 lg:order-1">
            {children}
          </div>

          {/* Right side - Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg p-6 lg:sticky lg:top-8">
              {orderSummary}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CheckoutLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentStep: PropTypes.number.isRequired,
  orderSummary: PropTypes.node.isRequired
};

export default CheckoutLayout; 