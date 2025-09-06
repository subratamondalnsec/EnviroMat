// components/checkout/CheckoutHeader.jsx
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import ProgressSteps from './ProgressSteps';

const CheckoutHeader = ({ 
  onClose, 
  isModal, 
  currentStep, 
  steps 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Shop</span>
        </button>

        {isModal && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>

      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        <span className="text-green-400">Sustainable</span> Checkout
      </h1>

      <ProgressSteps 
        steps={steps} 
        currentStep={currentStep} 
      />
    </div>
  );
};

export default CheckoutHeader;
