// components/checkout/CartItemsSection.jsx
import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';

const CartItemsSection = ({ cartItems, subtotal, refSetter }) => {
  return (
    <div className="mb-8">
      <div 
        ref={refSetter}
        className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-3 text-green-600" />
            Your Cart (
            {cartItems.reduce(
              (sum, item) => sum + (item?.quantity || 0),
              0
            )}{" "}
            items)
          </h2>
          <div className="text-2xl font-bold text-green-600">
            ₹{subtotal.toFixed(2)}
          </div>
        </div>

        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <motion.div
              key={item?.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200"
            >
              <img
                src={item?.image || "/placeholder.jpg"}
                alt={item?.name || "Product"}
                className="w-20 h-20 rounded-xl object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {item?.name || "Product Name"}
                </h3>
                <p className="text-purple-600 font-medium text-sm">
                  {item?.category || "Category"}
                </p>
                <p className="text-gray-600 text-sm line-clamp-1">
                  {item?.description || "Product description"}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">
                    Quantity: {item?.quantity || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    Unit Price: ₹{(item?.price || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-purple-600">
                  ₹
                  {((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}
                </div>
                {(item?.originalPrice || 0) > (item?.price || 0) && (
                  <div className="text-sm text-gray-500 line-through">
                    ₹
                    {(
                      (item?.originalPrice || 0) * (item?.quantity || 0)
                    ).toFixed(2)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartItemsSection;
