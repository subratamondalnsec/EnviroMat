// components/about/AboutHero.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, Recycle, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

const AboutHero = () => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const iconsRef = useRef([]);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    subtitle: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    iconLabel: isDarkMode ? 'text-gray-300' : 'text-gray-700'
  };

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
      )
      .fromTo(descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(iconsRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={`relative min-h-[70vh] ${themeStyles.background} py-20 overflow-hidden transition-colors duration-300`}>
      {/* Background Animation */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-6xl my-12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 
            ref={titleRef}
            className={`text-5xl lg:text-7xl font-bold ${themeStyles.heading} leading-tight mb-8 transition-colors duration-300`}
          >
            Building a <span className="text-green-400">Sustainable</span>{' '}
            <span className="text-purple-400">Future</span> Together
          </h1>
          
          <p 
            ref={descRef}
            className={`text-xl lg:text-2xl ${themeStyles.subtitle} max-w-4xl mx-auto mb-12 leading-relaxed transition-colors duration-300`}
          >
            We're passionate about providing eco-friendly materials and solutions that help create a 
            greener tomorrow. Join us in our mission to make sustainable living accessible to everyone.
          </p>

          {/* Feature Icons */}
          <div className="flex justify-center space-x-12 mb-8">
            {[
              { icon: <Leaf className="w-8 h-8" />, label: "100% Eco-Friendly", color: "text-green-500" },
              { icon: <Recycle className="w-8 h-8" />, label: "Recycled Materials", color: "text-purple-500" },
              { icon: <Shield className="w-8 h-8" />, label: "Quality Assured", color: "text-blue-500" }
            ].map((item, index) => (
              <div 
                key={index}
                ref={el => iconsRef.current[index] = el}
                className="flex flex-col items-center"
              >
                <div className={`${item.color} mb-2`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-medium ${themeStyles.iconLabel} transition-colors duration-300`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
