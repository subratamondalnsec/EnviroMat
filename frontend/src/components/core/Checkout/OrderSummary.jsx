// components/checkout/OrderSummary.jsx
import React from 'react';
import { ShoppingCart, Leaf } from 'lucide-react';

const OrderSummary = ({
  cartItems,
  subtotal,
  shippingFee,
  carbonOffset,
  carbonOffsetFee,
  ecoPackaging,
  ecoPackagingFee,
  payWithCoins,
  userCoins,
  total,
  finalAmountToPay,
  refSetter
}) => {
  return (
    <div
      ref={refSetter}
      className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg sticky top-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Order Summary
      </h3>

      {/* Order Totals */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>
            Subtotal (
            {cartItems.reduce(
              (sum, item) => sum + (item?.quantity || 0),
              0
            )}{" "}
            items)
          </span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>
            {shippingFee === 0 ? "Free" : `₹${shippingFee}`}
          </span>
        </div>
        {carbonOffset && (
          <div className="flex justify-between text-green-600">
            <span>Carbon Offset</span>
            <span>₹{carbonOffsetFee.toFixed(2)}</span>
          </div>
        )}
        {ecoPackaging && (
          <div className="flex justify-between text-green-600">
            <span>Eco Packaging</span>
            <span>₹{ecoPackagingFee}</span>
          </div>
        )}
        {payWithCoins && (
          <div className="flex justify-between text-yellow-600">
            <span>Coins Used</span>
            <span>-₹{Math.min(userCoins, total).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t border-gray-200">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        {payWithCoins && (
          <div className="flex justify-between font-bold text-2xl text-green-700">
            <span>Amount to Pay</span>
            <span>₹{finalAmountToPay.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Sustainability Impact */}
      {(carbonOffset || ecoPackaging) && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Leaf className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-medium text-green-900">
              Environmental Impact
            </span>
          </div>
          <div className="text-sm text-green-800 space-y-1">
            {carbonOffset && <div>• Carbon footprint offset</div>}
            {ecoPackaging && <div>• Biodegradable packaging</div>}
            <div className="font-medium mt-2">
              Thank you for choosing sustainable options!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
