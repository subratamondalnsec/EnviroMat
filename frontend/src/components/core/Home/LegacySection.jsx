// components/core/Home/LegacySection.jsx
import React, { useEffect, useRef } from 'react';
import { Instagram, Play, Facebook } from 'lucide-react';
import { motion } from "motion/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSelector } from 'react-redux';

gsap.registerPlugin(ScrollTrigger);

const LegacySection = () => {
  const sectionRef = useRef(null);
  const leftCardRef = useRef(null);
  const centerCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const headingRef = useRef(null);

  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-800',
    centerCardBg: isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80',
    centerCardButton: isDarkMode ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
  };

  const valuesTags = [
    { text: 'Sustainable', color: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800' },
    { text: 'Ethical', color: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-800' },
    { text: 'Eco-conscious', color: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-800' },
    { text: 'Pioneering', color: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800' },
    { text: 'Responsible', color: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-800' },
    { text: 'Thoughtful', color: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800' },
    { text: 'Progressive', color: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800' },
    { text: 'Forward-looking', color: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-800' },
    { text: 'Ethical', color: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-800' },
    { text: 'Eco-conscious', color: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-800' },
    { text: 'Pioneering', color: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800' },
    { text: 'Responsible', color: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-800' },
    { text: 'Thoughtful', color: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800' },
    { text: 'Progressive', color: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800' },
  ];

  useEffect(() => {
    const cards = [leftCardRef.current, centerCardRef.current, rightCardRef.current];
    const heading = headingRef.current;

    // Set initial state for heading
    gsap.set(heading, {
      y: 50,
      opacity: 0,
    });

    // Set initial state for cards
    cards.forEach((card, index) => {
      if (card) {
        gsap.set(card, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationY: index === 0 ? -15 : index === 2 ? 15 : 0,
        });
      }
    });

    // Create timeline for the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: '0% 20%',
        scrub: 1,
        toggleActions: 'play none none reverse',
      }
    });

    // Animate heading first
    tl.to(heading, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Animate cards with stagger effect
    cards.forEach((card, index) => {
      if (card) {
        tl.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }, `-=0.6`);
      }
    });

    // Animate value tags
    const valueTags = centerCardRef.current?.querySelectorAll('[data-value-tag]');
    if (valueTags) {
      gsap.set(valueTags, { scale: 0, opacity: 0 });
      
      gsap.to(valueTags, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: centerCardRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isDarkMode]);

  return (
    <section ref={sectionRef} className={`py-20 ${themeStyles.background} overflow-hidden transition-colors duration-300`}>
      <div className="max-w-full mx-auto px-8 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            <span className={themeStyles.text}>We're not just </span>
            <span className="text-purple-400">building</span><br />
            <span className="text-purple-400">materials</span>
            <span className={themeStyles.text}> – we're building</span><br />
            <span className={themeStyles.text}>a </span>
            <span className="text-green-400">legacy out change</span>
          </h2>
        </div>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-4 gap-6 items-center">
          {/* Left Column - Social Media */}
          <div ref={leftCardRef} className="relative col-span-1">
            <div className="bg-gradient-to-br from-green-300 to-green-500 rounded-4xl p-8 h-80 relative overflow-hidden transform-gpu">
              {/* Background texture/image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop&crop=center" 
                  alt="Green texture background" 
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/60 to-green-600/60"></div>
              </div>
              
              <div className="relative z-10 flex flex-col justify-center h-full">
                <p className="text-white text-xl font-medium mb-8">
                  Follow us<br />
                  for more:
                </p>
                
                <div className="flex space-x-4">
                  <button className="w-12 h-12 border-2 border-white/30 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors transform hover:scale-110">
                    <Instagram className="w-6 h-6 text-white" />
                  </button>
                  <button className="w-12 h-12 border-2 border-white/30 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors transform hover:scale-110">
                    <Play className="w-6 h-6 text-white" />
                  </button>
                  <button className="w-12 h-12 border-2 border-white/30 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors transform hover:scale-110">
                    <Facebook className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - CTA and Values */}
          <div ref={centerCardRef} className={`text-center space-y-8 ${themeStyles.centerCardBg} h-80 rounded-4xl col-span-2 transform-gpu transition-colors duration-300`}>
            <div className="space-y-6 mt-6">
              <p className={`text-md font-medium ${themeStyles.secondaryText} tracking-tighter leading-snug transition-colors duration-300`}>
                Join us in sculpting<br />
                green and sustainable world
              </p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full transition-colors font-medium ${themeStyles.centerCardButton}`}
              >
                Get Started
              </motion.button>
            </div>

            {/* Values Tags */}
            <div className="flex flex-wrap justify-around gap-2 max-w-[95%] mx-auto">
              {valuesTags.map((tag, index) => (
                <span 
                  key={index}
                  data-value-tag
                  className={`px-4 py-2 rounded-full text-sm font-medium ${tag.color} transform hover:scale-105 transition-all duration-300 cursor-default`}
                  style={{
                    transform: `rotate(${Math.random() * 10 - 5}deg)`,
                  }}
                >
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Stone/Materials Image */}
          <div ref={rightCardRef} className="relative col-span-1">
            <div className="bg-gray-300 rounded-4xl h-80 overflow-hidden transform-gpu">
              <img 
                src="https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=600&h=600&fit=crop&crop=center" 
                alt="Natural stone materials" 
                className="w-full h-full object-cover"
              />
              
              {/* Abstract white circles overlay */}
              <div className="absolute inset-0">
                <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/80 rounded-full transform hover:scale-110 transition-transform"></div>
                <div className="absolute bottom-16 right-16 w-8 h-8 bg-white/60 rounded-full transform hover:scale-110 transition-transform"></div>
                <div className="absolute bottom-20 right-6 w-12 h-12 bg-white/40 rounded-full transform hover:scale-110 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
