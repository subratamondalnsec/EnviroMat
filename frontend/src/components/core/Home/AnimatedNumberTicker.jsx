// components/core/Home/AnimatedNumberTicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const NumberTicker = ({ 
  endValue, 
  duration = 2000, 
  suffix = '+', 
  prefix = '',
  startDelay = 0,
  className = '',
  onComplete = () => {}
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);

  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles - only applied if no custom className is provided for colors
  const defaultThemeStyles = {
    text: isDarkMode ? 'text-green-400' : 'text-green-600',
    glow: isDarkMode ? 'drop-shadow-lg' : '',
    shadow: isDarkMode ? 'text-shadow-green' : ''
  };

  // Combine default theme styles with custom className
  const finalClassName = className || `${defaultThemeStyles.text} ${defaultThemeStyles.glow}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible && !hasAnimated) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, hasAnimated]);

  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    const timeout = setTimeout(() => {
      let start = 0;
      const increment = endValue / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          start = endValue;
          clearInterval(timer);
          setHasAnimated(true);
          onComplete();
        }
        setCount(Math.floor(start));
      }, 16);

      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [isVisible, hasAnimated, endValue, duration, startDelay, onComplete]);

  const formatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <motion.span 
      ref={countRef}
      className={`${finalClassName} transition-colors duration-300`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: startDelay / 1000,
        ease: "backOut"
      }}
      style={{
        textShadow: isDarkMode ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
      }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
};

export default NumberTicker;
