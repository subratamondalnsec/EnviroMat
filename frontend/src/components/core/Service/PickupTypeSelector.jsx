// components/service/PickupTypeSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Zap, Calendar } from 'lucide-react';
import gsap from 'gsap';

const PickupTypeSelector = ({ selectedType: propSelectedType, onPickupTypeChange }) => {
  // FIXED: Use prop selectedType or default to standard
  const [selectedType, setSelectedType] = useState(propSelectedType?.id || 'standard');
  const selectorRef = useRef(null);

  const pickupTypes = [
    {
      id: 'standard',
      name: 'Standard Pickup',
      description: 'Scheduled pickup within 2-4 days',
      duration: '2-4 days',
      icon: <Calendar className="w-6 h-6" />,
      color: 'green',
      reduction: 0,
      price: 'Free',
      note: 'Best value: Full credit rewards for standard service'
    },
    {
      id: 'urgent',
      name: 'Urgent Pickup',
      description: 'Express pickup within 10-30 minutes',
      duration: '10-30 minutes',
      icon: <Zap className="w-6 h-6" />,
      color: 'orange',
      reduction: 20,
      price: 'Express Fee'
    }
  ];

  // FIXED: Update local state when prop changes (for reset)
  useEffect(() => {
    if (propSelectedType) {
      setSelectedType(propSelectedType.id);
    }
  }, [propSelectedType]);

  useEffect(() => {
    if (selectorRef.current) {
      gsap.fromTo(selectorRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 }
      );
    }
  }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type.id);
    onPickupTypeChange(type);
  };

  return (
    <div ref={selectorRef} className="bg-white rounded-3xl p-6 border border-gray-300 shadow-sm mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-3 text-green-500" />
        Pickup Type
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pickupTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ y: -2 }}
            className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
              selectedType === type.id
                ? type.color === 'green' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleTypeSelect(type)}
          >
            <input
              type="radio"
              name="pickupType"
              value={type.id}
              checked={selectedType === type.id}
              onChange={() => handleTypeSelect(type)}
              className="sr-only"
            />

            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${
                type.color === 'green' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {type.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {type.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-md font-bold ${
                    type.color === 'green' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {type.duration}
                  </span>
                  <span className="text-sm font-bold text-gray-500">
                    {type.price}
                  </span>
                </div>

                {type.reduction > 0 && (
                  <div className="mt-2 p-2 bg-yellow-100 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> {type.reduction}% reduction in credits for express service
                    </p>
                  </div>
                )}
                {type.note && (
                  <div className="mt-2 p-2 bg-green-100 rounded-lg">
                    <p className="text-xs text-green-800">
                      <strong>Note:</strong> {type.note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedType === type.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4"
              >
                <div className={`w-6 h-6 rounded-full ${
                  type.color === 'green' ? 'bg-green-500' : 'bg-orange-500'
                } flex items-center justify-center`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PickupTypeSelector;
