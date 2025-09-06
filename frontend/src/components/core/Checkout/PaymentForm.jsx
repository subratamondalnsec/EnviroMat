// components/checkout/PaymentForm.jsx
import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import CoinPaymentOption from './CoinPaymentOption';

const PaymentForm = ({
  paymentInfo,
  handlePaymentInfoChange,
  payWithCoins,
  setPayWithCoins,
  userCoins,
  total,
  useCoinsWithCover,
  finalAmountToPay,
  isProcessing,
  onSubmit,
  onPrev
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Payment Information
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Coin Payment Option */}
        <CoinPaymentOption
          payWithCoins={payWithCoins}
          setPayWithCoins={setPayWithCoins}
          userCoins={userCoins}
          total={total}
        />

        {/* Card Information */}
        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Card Number *
          </label>
          <input
            id="cardNumber"
            type="text"
            required={!useCoinsWithCover}
            value={paymentInfo.cardNumber}
            onChange={(e) =>
              handlePaymentInfoChange("cardNumber", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 border-gray-300 ${
              useCoinsWithCover ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder="1234 5678 9012 3456"
            disabled={useCoinsWithCover}
          />
        </div>

        <div>
          <label
            htmlFor="nameOnCard"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name on Card *
          </label>
          <input
            id="nameOnCard"
            type="text"
            required={!useCoinsWithCover}
            value={paymentInfo.nameOnCard}
            onChange={(e) =>
              handlePaymentInfoChange("nameOnCard", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 border-gray-300 ${
              useCoinsWithCover ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder="John Doe"
            disabled={useCoinsWithCover}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Expiry Date *
            </label>
            <input
              id="expiryDate"
              type="text"
              required={!useCoinsWithCover}
              value={paymentInfo.expiryDate}
              onChange={(e) =>
                handlePaymentInfoChange("expiryDate", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 border-gray-300 ${
                useCoinsWithCover ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="MM/YY"
              disabled={useCoinsWithCover}
            />
          </div>
          <div>
            <label
              htmlFor="cvv"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              CVV *
            </label>
            <input
              id="cvv"
              type="text"
              required={!useCoinsWithCover}
              value={paymentInfo.cvv}
              onChange={(e) =>
                handlePaymentInfoChange("cvv", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 border-gray-300 ${
                useCoinsWithCover ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="123"
              disabled={useCoinsWithCover}
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <div className="font-medium text-blue-900">Secure Payment</div>
            <div className="text-sm text-blue-700">
              Your payment information is encrypted and secure
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-[#0ae979] border border-gray-300 hover:border-[#08DF73] hover:bg-[#eff8d8] text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Place Order - ₹${finalAmountToPay.toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PaymentForm;
