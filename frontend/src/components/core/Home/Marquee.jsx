// components/EnhancedMarquee.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';

const EnhancedMarquee = ({ 
  text = "Shaping a greener future, One waste at a time", 
  speed = 50,
  pauseOnHover = true,
  direction = 'left',
  className = 'bg-gradient-to-r from-green-100 via-gray-50 to-green-100'
}) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    // Clone for seamless loop
    const clone = content.cloneNode(true);
    container.appendChild(clone);

    const contentWidth = content.offsetWidth;

    // Set initial positions based on direction
    if (direction === 'right') {
      gsap.set(content, { x: -contentWidth });
      gsap.set(clone, { x: -contentWidth });
    } else {
      gsap.set([content, clone], { x: 0 });
    }

    // Create timeline
    const tl = gsap.timeline({ repeat: -1 });
    
    if (direction === 'right') {
      // For right direction: content starts off-screen left, clone starts visible
      tl.to([content, clone], {
        x: contentWidth,
        duration: contentWidth / speed,
        ease: 'none',
      });
    } else {
      // For left direction: both start visible, move left
      tl.to([content, clone], {
        x: -contentWidth,
        duration: contentWidth / speed,
        ease: 'none',
      });
    }

    tlRef.current = tl;

    // Pause on hover functionality
    if (pauseOnHover) {
      const handleMouseEnter = () => tl.pause();
      const handleMouseLeave = () => tl.resume();

      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        tl.kill();
        if (container.contains(clone)) {
          container.removeChild(clone);
        }
      };
    }

    return () => {
      tl.kill();
      if (container.contains(clone)) {
        container.removeChild(clone);
      }
    };
  }, [speed, pauseOnHover, text, direction]);

  const repeatedText = Array(10).fill(text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`overflow-hidden whitespace-nowrap w-[110%] -translate-x-1 py-4 border-y border-gray-400 ${className}`}
      ref={containerRef}
    >
      <div 
        ref={contentRef}
        className="inline-flex items-center"
        style={{ gap: '6rem' }}
      >
        {repeatedText.map((item, index) => (
          <motion.span
            key={index}
            className="text-3xl font-medium text-gray-700 tracking-wider"
            
            style={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedMarquee;
