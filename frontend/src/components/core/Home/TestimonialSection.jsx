// components/core/Home/TestimonialSection.jsx
import React, { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import NumberTicker from './AnimatedNumberTicker';
import { useSelector } from 'react-redux';

const TestimonialSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStar, setHoveredStar] = useState({ cardId: null, starIndex: null });

  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-[#F3F4F6]',
    cardBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    authorText: isDarkMode ? 'text-white' : 'text-gray-700',
    quoteBg: isDarkMode ? 'bg-green-800' : 'bg-green-100',
    quoteText: isDarkMode ? 'text-green-300' : 'text-green-600',
    counterBg: isDarkMode ? 'bg-gray-800' : 'bg-[#F3F4F6]',
    counterBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    gradientOverlay: isDarkMode ? 'from-gray-900 to-transparent' : 'from-[#F9FAFB] to-transparent',
    hoverGlow: isDarkMode ? 'bg-gradient-to-r from-green-900/40 to-purple-900/40' : 'bg-gradient-to-r from-green-100/50 to-purple-100/50'
  };

  // Expanded testimonials array for infinite scroll effect
  const testimonials = [
    {
      id: 1,
      name: "Adam Johnson",
      role: "Environmental Scientist",
      company: "GreenTech Solutions",
      content: "Revolutionary sustainable materials with 40% carbon reduction.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=2083&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      company: "EcoMaterials Inc.",
      content: "Eco-friendly, cost-effective, and durable solutions. Also had a great experience with the team.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Research Director",
      company: "Sustainable Futures Lab",
      content: "Game-changing environmental responsibility and cutting-edge solutions.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Sustainability Consultant",
      company: "EcoFuture Corp",
      content: "Outstanding innovation in renewable materials. Their approach to sustainability is truly inspiring.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 5,
      name: "David Kim",
      role: "Operations Director",
      company: "Green Building Solutions",
      content: "Exceptional quality. These materials have transformed our projects.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Lisa Thompson",
      role: "Environmental Engineer",
      company: "Sustainable Designs Ltd",
      content: "Innovative solutions that exceed expectations. Blend of sustainability and performance.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 7,
      name: "James Wilson",
      role: "Chief Technology Officer",
      company: "NextGen Materials",
      content: "Revolutionary technology that's changing the industry. Highly recommend their expertise.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 8,
      name: "Maria Garcia",
      role: "Research Scientist",
      company: "BioMaterials Institute",
      content: "Cutting-edge research meets practical application. Their materials are groundbreaking.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
    }
  ];

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Individual testimonial card component
  const TestimonialCard = ({ testimonial, index }) => (
    <motion.div
      key={testimonial.id}
      onHoverStart={() => setHoveredCard(testimonial.id)}
      onHoverEnd={() => setHoveredCard(null)}
      className={`${themeStyles.cardBg} rounded-3xl p-6 border ${themeStyles.cardBorder} relative group cursor-pointer min-w-[350px] mx-3 transition-colors duration-300`}
      style={{ minHeight: '280px' }}
    >
      {/* Subtle glow effect on hover */}
      <AnimatePresence>
        {hoveredCard === testimonial.id && (
          <motion.div
            className={`absolute inset-0 ${themeStyles.hoverGlow} rounded-3xl`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Quote Icon with interactive animation */}
        <motion.div 
          className="mb-3"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className={`w-12 h-12 ${themeStyles.quoteBg} rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300`}
            whileTap={{ scale: 0.95 }}
          >
            <Quote className={`w-6 h-6 ${themeStyles.quoteText}`} />
          </motion.div>
        </motion.div>

        {/* Interactive Rating Stars */}
        <div className="flex items-center mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ 
                scale: 1.3, 
                rotate: 15,
              }}
              onHoverStart={() => setHoveredStar({ cardId: testimonial.id, starIndex: i })}
              onHoverEnd={() => setHoveredStar({ cardId: null, starIndex: null })}
              transition={{ duration: 0.2 }}
              className="cursor-pointer"
            >
              <Star 
                className={`w-5 h-5 text-yellow-400 fill-current transition-all duration-200 mr-1 ${
                  hoveredStar.cardId === testimonial.id && hoveredStar.starIndex >= i 
                    ? 'drop-shadow-md' 
                    : ''
                }`} 
              />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <motion.p 
          className={`${themeStyles.secondaryText} leading-relaxed mb-6 text-sm font-medium transition-colors duration-300`}
          initial={{ opacity: 0.9 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          "{testimonial.content}"
        </motion.p>

        {/* Author section */}
        <div className="flex items-center space-x-4">
          <motion.div className="relative">
            <motion.img
              src={testimonial.image}
              alt={testimonial.name}
              className={`w-12 h-12 rounded-full object-cover border-1 ${isDarkMode ? 'border-gray-600' : 'border-green-200'} group-hover:border-purple-300 transition-colors duration-300`}
            />
          </motion.div>
          
          <div>
            <motion.h4 className={`font-bold ${themeStyles.authorText} text-base transition-colors duration-300`}>
              {testimonial.name}
            </motion.h4>
            <motion.p className="text-sm text-purple-500 font-medium">
              {testimonial.role}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className={`mt-[6rem] ${themeStyles.background} relative overflow-hidden transition-colors duration-300`}>
      {/* Subtle background animation */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-5xl lg:text-6xl font-bold ${themeStyles.text} leading-tight mb-6 transition-colors duration-300`}>
            What Our 
            <motion.span 
              className="text-purple-400 ml-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            > Clients</motion.span><br /> Say 
            <motion.span 
              className="text-green-400 ml-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            > About </motion.span>Us
          </h2>
        </motion.div>

        {/* Infinite Scrolling Testimonials */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: [0, -(testimonials.length * 380)],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: testimonials.length * 15, // Adjust speed here
                  ease: "linear",
                },
              }}
              style={{ width: `${duplicatedTestimonials.length * 380}px` }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={`${testimonial.id}-${index}`} 
                  testimonial={testimonial} 
                  index={index} 
                />
              ))}
            </motion.div>
          </div>
          
          {/* Gradient overlays for smooth edges */}
          <div className={`absolute left-0 top-0 w-16 h-full bg-gradient-to-r ${themeStyles.gradientOverlay} pointer-events-none z-10`} />
          <div className={`absolute right-0 top-0 w-16 h-full bg-gradient-to-l ${themeStyles.gradientOverlay} pointer-events-none z-10`} />
        </div>

        {/* Animated Number Ticker Counter */}
        <motion.div
          className="text-center mt-16 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            className={`inline-flex items-center space-x-4 ${themeStyles.counterBg} rounded-full px-6 py-3 border ${themeStyles.counterBorder} transition-colors duration-300`}
          >
            <NumberTicker 
              endValue={5000}
              duration={4000}
              suffix="+"
              className={`text-3xl font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'} tabular-nums transition-colors duration-300`}
              startDelay={100}
            />
            <span className={`${themeStyles.text} font-medium text-xl transition-colors duration-300`}>Happy Clients</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
