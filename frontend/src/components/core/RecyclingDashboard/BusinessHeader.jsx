// components/core/RecyclingDashboard/BusinessHeader.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building2, TrendingUp, Package, DollarSign, Plus } from 'lucide-react';
import gsap from 'gsap';

const BusinessHeader = ({ businessInfo, onAddProduct }) => {
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${businessInfo.totalRevenue.toLocaleString()}`,
      growth: businessInfo.revenueGrowth,
      icon: <DollarSign className="w-6 h-6" />,
      color: "green"
    },
    {
      label: "Total Orders",
      value: businessInfo.totalOrders,
      growth: businessInfo.ordersGrowth,
      icon: <Package className="w-6 h-6" />,
      color: "blue"
    },
    {
      label: "Active Products",
      value: businessInfo.activeProducts,
      growth: businessInfo.productsGrowth,
      icon: <Building2 className="w-6 h-6" />,
      color: "purple"
    }
  ];

  return (
    <div ref={headerRef} className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex items-center space-x-6 mb-6 lg:mb-0">
          <div className="bg-white bg-opacity-20 rounded-full p-1">
            <img 
              src={businessInfo.businessImg} 
              alt={businessInfo.businessName} 
              className="w-24 h-24 rounded-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{businessInfo.businessName}</h1>
            <p className="text-green-100 text-lg">Established {businessInfo.establishedDate}</p>
            <p className="text-green-100 text-sm">{businessInfo.businessType}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-gray-500 text-sm">
                {businessInfo.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-4">
          {/* Add Product Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddProduct}
            className="bg-white bg-opacity-90 hover:bg-white text-green-600 px-6 py-3 rounded-xl shadow font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </motion.button>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white bg-opacity-15 rounded-2xl p-4 text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className={`text-${stat.color}-500`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="flex items-center justify-center mt-1 text-gray-500">
                  <TrendingUp className="w-3 h-3 mr-1 " />
                  <span className="text-xs">+{stat.growth}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;
