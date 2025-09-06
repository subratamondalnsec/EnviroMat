import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { motion } from "motion/react";

const ServicesCard = ({ 
  tag = "Our Services",
  heading = "Eco-Friendly Material Development",
  description = "Creating innovative, sustainable, and environmentally-conscious materials for various industries.",
  image = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center",
  imageAlt = "Sustainable materials",
  progressLabel = "Success Rate",
  progressValue = 90,
  progressColor = "#a855f7",
  detailsText = "Details",
  exploreText = "Explore More",
  icon = FileText
}) => {
  return (
    <section className="w-full py-2">
      <div className="max-w-7xl mx-auto px-2 sm:mx-6 lg:mx-8 rounded-3xl">
        <div className="bg-green-100 rounded-3xl p-8 lg:p-12 border border-gray-300 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Services Tag */}
              <div className="inline-block">
                <span className="px-6 py-2 bg-white/60 text-gray-700 rounded-full text-sm font-medium border border-gray-300">
                  {tag}
                </span>
              </div>

              {/* Decorative dots */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                <div className="w-3 h-3 bg-green-100 rounded-full"></div>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1] tracking-tighter">
                {heading}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-tight tracking-tight max-w-md">
                {description}
              </p>
            </div>

            {/* Right Content */}
            <div className="relative">
              {/* Background Image */}
              <div className="relative rounded-3xl overflow-hidden h-80 lg:h-96">
                <img 
                  src={image} 
                  alt={imageAlt} 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20"></div>

                {/* Progress Rate Card */}
                <div className="absolute top-8 left-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <p className="text-grey-700 text-sm font-normal">
                      {progressLabel}
                    </p>
                    
                    {/* Circular Progress */}
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#feebe746"
                          strokeWidth="8"
                          fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={progressColor}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressValue / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-700">{progressValue}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explore More Button */}
                <div className="absolute bottom-8 right-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/50 backdrop-blur-sm text-gray-700 rounded-full font-medium hover:bg-white transition-colors shadow-lg"
                  >
                    {exploreText}
                  </motion.button>
                </div>

                {/* Top Right Icon */}
                <div className="absolute top-8 right-8">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    {React.createElement(icon, { className: "w-6 h-6 text-gray-600" })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCard;
