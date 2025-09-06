import React from 'react';
import { motion } from "motion/react";

const CoinButton = ({ addToIconButtonsRefs }) => (
  <motion.button 
    ref={(el) => addToIconButtonsRefs(el, 0)}
    whileHover={{ scale: 1.03 }} 
    whileTap={{ scale: 0.95 }}
    className="bg-[#F9FAFB] backdrop-blur-xl px-2 gap-1 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors font-[500] text-[#4a5565] transform-gpu"
  >
    480
    <img src="/Coin.png" alt="coins" className="w-7 h-7 text-gray-600" />
  </motion.button>
);

export default CoinButton;