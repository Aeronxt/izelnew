import { useState } from 'react';
import CheckoutLayout from '../components/Checkout/CheckoutLayout';
import CheckoutInformation from '../components/Checkout/CheckoutInformation';
import CheckoutShipping from '../components/Checkout/CheckoutShipping';
import CheckoutPayment from '../components/Checkout/CheckoutPayment';
import OrderSummary from '../components/Checkout/OrderSummary';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [discountState, setDiscountState] = useState({
    promoCode: '',
    promoApplied: false,
    discount: 0,
    appliedPromoCode: ''
  });
  
  const [formData, setFormData] = useState({
    // Contact
    email: '',
    emailOffers: false,
    
    // Shipping address
    country: 'Australia',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    smsAlerts: false,
    
    // Shipping method
    shippingMethod: 'standard',
    shippingPrice: 4.95,
    
    // Payment
    paymentMethod: 'card',
    billingAddress: 'same'
  });

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateDiscountState = (discountData) => {
    setDiscountState(prev => ({ ...prev, ...discountData }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = (step) => {
    if (typeof step === 'number') {
      setCurrentStep(step);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CheckoutInformation
            onNext={handleNext}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <CheckoutShipping
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <CheckoutPayment
            onBack={handleBack}
            formData={formData}
            discountState={discountState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CheckoutLayout
      currentStep={currentStep}
      orderSummary={
        <OrderSummary 
          shipping={currentStep >= 1 ? formData.shippingPrice : 0}
          discountState={discountState}
          updateDiscountState={updateDiscountState}
        />
      }
    >
      {renderStep()}
    </CheckoutLayout>
  );
};

export default Checkout;
