// components/profile/QuickStats.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Recycle, MessageSquare, ShoppingBag, Coins } from 'lucide-react';
import gsap from 'gsap';

const QuickStats = ({ stats }) => {
  const statsRef = useRef([]);

  useEffect(() => {
    const elements = statsRef.current.filter(Boolean);
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(elements,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    });

    return () => ctx.revert();
  }, []);

  const statsData = [
    {
      icon: <Recycle className="w-8 h-8 text-green-300" />,
      value: `${stats.totalWasteSold}kg`,
      label: "Total Waste Sold",
      change: `+${stats.wasteGrowth}%`,
      color: "from-green-400 to-green-600"
    },
    {
      icon: <Coins className="w-8 h-8 text-yellow-300" />,
      value: `₹${stats.totalEarned}`,
      label: "Total Credits Earned",
      change: `+${stats.earningsGrowth}%`,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-300" />,
      value: stats.communityPosts,
      label: "Community Posts",
      change: `+${stats.postsGrowth}%`,
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-blue-300" />,
      value: `₹${stats.totalSpent}`,
      label: "Credits Spent",
      change: `${stats.spendingChange}%`,
      color: "from-blue-400 to-blue-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          ref={el => statsRef.current[index] = el}
          className="bg-white rounded-3xl p-6 border border-gray-400 hover:border-gray-500 transition-all duration-300"

          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
              {stat.icon}
            </div>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
          <p className="text-gray-600">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
