// components/checkout/ShippingOptions.jsx
import React from 'react';

const ShippingOptions = ({ 
  options, 
  selectedMethod, 
  onMethodChange 
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Delivery Options
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMethod === option.id
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                {option.icon}
                <div>
                  <div className="font-medium text-gray-900">
                    {option.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {option.duration}
                  </div>
                </div>
              </div>
              <div className="font-semibold text-gray-900">
                {option.price === 0 ? "Free" : `₹${option.price}`}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ShippingOptions;
