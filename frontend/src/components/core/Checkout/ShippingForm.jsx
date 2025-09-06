// components/checkout/ShippingForm.jsx
import React from 'react';
import { motion } from 'motion/react';
import ShippingOptions from './ShippingOption';
import EcoOptions from './EcoOption';

const ShippingForm = ({
  shippingAddress,
  handleShippingAddressChange,
  shippingMethod,
  setShippingMethod,
  shippingOptions,
  carbonOffset,
  setCarbonOffset,
  ecoPackaging,
  setEcoPackaging,
  carbonOffsetFee,
  ecoPackagingFee,
  onNext,
  onClose
}) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Shipping Information
      </h2>
      <form onSubmit={onNext} className="space-y-6">
        {/* Full Name and Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={shippingAddress.fullName}
              onChange={(e) =>
                handleShippingAddressChange("fullName", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mobile Number *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={shippingAddress.phone}
              onChange={(e) =>
                handleShippingAddressChange("phone", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Street Address *
          </label>
          <input
            id="address"
            type="text"
            required
            value={shippingAddress.address}
            onChange={(e) =>
              handleShippingAddressChange("address", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              City *
            </label>
            <input
              id="city"
              type="text"
              required
              value={shippingAddress.city}
              onChange={(e) =>
                handleShippingAddressChange("city", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Kolkata"
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              State *
            </label>
            <input
              id="state"
              type="text"
              required
              value={shippingAddress.state}
              onChange={(e) =>
                handleShippingAddressChange("state", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="West Bengal"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              PIN Code *
            </label>
            <input
              id="zipCode"
              type="text"
              required
              value={shippingAddress.zipCode}
              onChange={(e) =>
                handleShippingAddressChange("zipCode", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="700001"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country *
            </label>
            <input
              id="country"
              type="text"
              value={shippingAddress.country}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Shipping Options */}
        <ShippingOptions
          options={shippingOptions}
          selectedMethod={shippingMethod}
          onMethodChange={setShippingMethod}
        />

        {/* Eco Options */}
        <EcoOptions
          carbonOffset={carbonOffset}
          setCarbonOffset={setCarbonOffset}
          ecoPackaging={ecoPackaging}
          setEcoPackaging={setEcoPackaging}
          carbonOffsetFee={carbonOffsetFee}
          ecoPackagingFee={ecoPackagingFee}
        />

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#0ae979] border border-gray-300 hover:border-[#08DF73] hover:bg-[#eff8d8] text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ShippingForm;
