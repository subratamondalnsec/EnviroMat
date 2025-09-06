// components/checkout/CoinPaymentOption.jsx
import React from 'react';

const CoinPaymentOption = ({
  payWithCoins,
  setPayWithCoins,
  userCoins,
  total
}) => {
  return (
    <div className="border rounded-lg border-gray-300 p-4 bg-yellow-50">
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={payWithCoins}
          onChange={() => setPayWithCoins((prev) => !prev)}
          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring focus:ring-green-200 focus:ring-opacity-50"
        />
        <span className="text-gray-800 font-medium">
          Pay using existing coins (You have{" "}
          <span className="font-bold text-green-600">
            {userCoins}
          </span>{" "}
          coins)
        </span>
      </label>
      
      {payWithCoins && (
        <p className="mt-2 text-sm text-gray-600">
          {userCoins >= total
            ? `Your coins fully cover the total amount. You will pay ₹0.00.`
            : `Your coins will cover ₹${Math.min(userCoins, total).toFixed(2)}. You will pay ₹${(total - userCoins).toFixed(2)} by card.`}
        </p>
      )}
    </div>
  );
};

export default CoinPaymentOption;
