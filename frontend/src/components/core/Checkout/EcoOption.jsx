// components/checkout/EcoOptions.jsx
import React from 'react';
import { Leaf } from 'lucide-react';

const EcoOptions = ({
  carbonOffset,
  setCarbonOffset,
  ecoPackaging,
  setEcoPackaging,
  carbonOffsetFee,
  ecoPackagingFee
}) => {
  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Leaf className="w-5 h-5 text-green-600 mr-2" />
        Sustainable Options
      </h3>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={carbonOffset}
            onChange={(e) => setCarbonOffset(e.target.checked)}
            className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
          <span className="ml-3 text-gray-700">
            Carbon offset my order (+₹{carbonOffsetFee.toFixed(2)})
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={ecoPackaging}
            onChange={(e) => setEcoPackaging(e.target.checked)}
            className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
          <span className="ml-3 text-gray-700">
            Eco-friendly packaging (+₹{ecoPackagingFee})
          </span>
        </label>
      </div>
    </div>
  );
};

export default EcoOptions;
