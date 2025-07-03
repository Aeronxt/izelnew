import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PropTypes from 'prop-types';

const CheckoutInformation = ({ onNext, formData, updateFormData }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postcode) newErrors.postcode = 'Postcode is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      window.scrollTo(0, 0);
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-medium mb-6">Contact</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full px-4 py-3 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-black`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.emailOffers}
              onChange={(e) => updateFormData({ emailOffers: e.target.checked })}
            />
            <span className="text-sm">Email me with news and offers</span>
          </label>
        </div>

        <h2 className="text-2xl font-medium mb-6">Shipping address</h2>

        {/* Country */}
        <div className="mb-4">
          <select
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
          >
            <option value="Australia">Australia</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              className={`w-full px-4 py-3 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-black`}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              className={`w-full px-4 py-3 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-black`}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Company */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Company (optional)"
            value={formData.company}
            onChange={(e) => updateFormData({ company: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className={`w-full px-4 py-3 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-black`}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* Apartment */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.apartment}
            onChange={(e) => updateFormData({ apartment: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>

        {/* City and State/Postcode */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              className={`w-full px-4 py-3 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-black`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          <div>
            <select
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
            >
              <option value="">State/territory</option>
              <option value="Victoria">Victoria</option>
              <option value="New South Wales">New South Wales</option>
              <option value="Queensland">Queensland</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Postcode"
              value={formData.postcode}
              onChange={(e) => updateFormData({ postcode: e.target.value })}
              className={`w-full px-4 py-3 border rounded ${errors.postcode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-black`}
            />
            {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
          </div>
        </div>

        {/* Phone */}
        <div className="mb-6">
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className={`w-full px-4 py-3 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-black`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.smsAlerts}
              onChange={(e) => updateFormData({ smsAlerts: e.target.checked })}
            />
            <span className="text-sm">Sign up for mobile messaging offers (SMS & WhatsApp)</span>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ChevronLeft className="w-4 h-4" />
            Return to cart
          </button>
          
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Continue to shipping
          </button>
        </div>
      </form>
    </div>
  );
};

CheckoutInformation.propTypes = {
  onNext: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired
};

export default CheckoutInformation; 