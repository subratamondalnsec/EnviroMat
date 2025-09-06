// components/service/CreditSummary.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coins, TrendingUp, Package } from 'lucide-react';
import gsap from 'gsap';

const CreditSummary = ({ 
  images, 
  pickupType, 
  onSellClick, 
  refSetter 
}) => {
  const summaryRef = useRef(null);

  useEffect(() => {
    if (summaryRef.current) {
      gsap.fromTo(summaryRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.6 }
      );
    }
  }, []);

  // Calculate total credits
  const baseCredits = images.reduce((total, image) => total + image.credits, 0);
  const reductionPercentage = pickupType?.reduction || 0;
  const reductionAmount = (baseCredits * reductionPercentage) / 100;
  const finalCredits = baseCredits - reductionAmount;

  const isReadyToSell = images.length > 0 && baseCredits > 0;

  return (
    <div 
      ref={(el) => { summaryRef.current = el; refSetter && refSetter(el); }}
      className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm sticky top-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Coins className="w-6 h-6 mr-2 text-green-500" />
        Credit Summary
      </h3>

      {/* Summary Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-200 rounded-lg">
          <span className="flex items-center text-gray-700">
            <Package className="w-4 h-4 mr-2" />
            Items Uploaded
          </span>
          <span className="font-semibold text-gray-900">{images.length}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-200 rounded-lg">
          <span className="text-gray-700">Base Credits</span>
          <span className="font-semibold text-green-600">+{baseCredits}</span>
        </div>

        {reductionAmount > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
            <span className="text-gray-700">Express Fee ({reductionPercentage}%)</span>
            <span className="font-semibold text-orange-600">-{reductionAmount.toFixed(1)}</span>
          </div>
        )}

        <div className="border-t border-gray-300 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total Credits</span>
            <span className="text-2xl font-bold text-green-600 flex item-center gap-2">
                <Coins />
              {finalCredits.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Pickup Type Info */}
      {pickupType && (
        <div className="mb-6 p-4 bg-blue-100 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Pickup Details</h4>
          <p className="text-sm text-blue-800">{pickupType.name}</p>
          <p className="text-xs text-blue-600">{pickupType.description}</p>
        </div>
      )}

      {/* Individual Item Breakdown */}
      {images.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Item Breakdown</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {images.map((image, index) => (
              <div key={image.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">
                  Item {index + 1} ({image.category})
                </span>
                <span className="text-green-600 font-medium">+{image.credits}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sell Button */}
      <motion.button
        whileHover={{ scale: isReadyToSell ? 1.02 : 1 }}
        whileTap={{ scale: isReadyToSell ? 0.98 : 1 }}
        onClick={onSellClick}
        disabled={!isReadyToSell}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
          isReadyToSell
            ? 'bg-[#cb8fff] border border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isReadyToSell ? (
          <span className="flex items-center justify-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Sell Waste (<Coins className='text-gray-700 mx-1 w-4 h-4' /> {finalCredits.toFixed(1)})
          </span>
        ) : (
          'Upload Images to Continue'
        )}
      </motion.button>

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Credits will be added to your account after pickup confirmation
        </p>
      </div>
    </div>
  );
};

export default CreditSummary;
