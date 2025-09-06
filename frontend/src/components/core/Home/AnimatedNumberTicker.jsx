// components/NumberTicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: startDelay / 1000 }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
};

export default NumberTicker;
