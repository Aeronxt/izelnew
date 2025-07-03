import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import PropTypes from 'prop-types';

const CheckoutShipping = ({ onNext, onBack, formData, updateFormData }) => {
  const [selectedShipping, setSelectedShipping] = useState(formData.shippingMethod || 'standard');

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard (2-6 Business Days)',
      price: 80
    },
    {
      id: 'express',
      name: 'Express (1-3 Business Days)',
      price: 150
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({ 
      shippingMethod: selectedShipping,
      shippingPrice: shippingOptions.find(opt => opt.id === selectedShipping).price
    });
    window.scrollTo(0, 0);
    onNext();
  };

  return (
    <div>
      {/* Contact and Ship to summary */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-4">
            <span className="text-gray-600">Contact</span>
            <span>{formData.email}</span>
          </div>
          <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
            Change
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <span className="text-gray-600">Ship to</span>
            <span>{formData.address}, {formData.city}, {formData.state} {formData.postcode}</span>
          </div>
          <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
            Change
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-medium mb-6">Shipping method</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mb-6">
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                selectedShipping === option.id ? 'border-black bg-gray-50' : 'border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={selectedShipping === option.id}
                  onChange={(e) => setSelectedShipping(e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option.name}</span>
              </div>
              <span className="font-medium">৳{option.price.toFixed(2)}</span>
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ChevronLeft className="w-4 h-4" />
            Return to information
          </button>
          
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Continue to payment
          </button>
        </div>
      </form>
    </div>
  );
};

CheckoutShipping.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired
};

export default CheckoutShipping; 