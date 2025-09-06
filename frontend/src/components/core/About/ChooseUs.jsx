// components/about/WhyChooseUs.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Users, Clock, Leaf } from 'lucide-react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const sectionRef = useRef(null);
  const statsRef = useRef([]);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    subtitle: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    statIconBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    statNumber: isDarkMode ? 'text-white' : 'text-gray-900',
    statLabel: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    statDesc: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    benefitsBg: isDarkMode ? 'from-green-900/20 to-purple-900/20 border-gray-600' : 'from-green-50 to-purple-50 border-gray-300',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    cardText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    cardTitle: isDarkMode ? 'text-white' : 'text-gray-900'
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(statsRef.current, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      number: "5000+",
      label: "Happy Customers",
      description: "Satisfied customers who chose sustainability"
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      number: "50T+",
      label: "CO₂ Saved",
      description: "Carbon footprint reduced through our products"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      number: "100+",
      label: "Partner Suppliers",
      description: "Vetted eco-friendly suppliers worldwide"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      number: "24/7",
      label: "Support",
      description: "Round-the-clock customer assistance"
    }
  ];

  const benefits = [
    "✓ Quality guaranteed eco-friendly materials",
    "✓ Competitive pricing on sustainable products",
    "✓ Fast delivery with carbon-neutral shipping",
    "✓ Expert consultation on green building",
    "✓ Comprehensive product warranties",
    "✓ Community of sustainability advocates"
  ];

  return (
    <section ref={sectionRef} className={`py-20 ${themeStyles.background} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl lg:text-5xl font-bold ${themeStyles.heading} mb-6 transition-colors duration-300`}>
            Why Choose <span className="text-purple-400">Us</span>
          </h2>
          <p className={`text-xl ${themeStyles.subtitle} max-w-3xl mx-auto transition-colors duration-300`}>
            We're more than just a supplier – we're your partners in building a sustainable future
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={el => statsRef.current[index] = el}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className={`${themeStyles.statIconBg} rounded-full p-4 transition-colors duration-300`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className={`text-3xl font-bold ${themeStyles.statNumber} mb-2 transition-colors duration-300`}>{stat.number}</h3>
              <h4 className={`text-lg font-semibold ${themeStyles.statLabel} mb-2 transition-colors duration-300`}>{stat.label}</h4>
              <p className={`${themeStyles.statDesc} text-sm transition-colors duration-300`}>{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className={`bg-gradient-to-br ${themeStyles.benefitsBg} border rounded-3xl p-8 lg:p-12 transition-colors duration-300`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className={`text-3xl font-bold ${themeStyles.heading} mb-6 transition-colors duration-300`}>
                What Makes Us Different
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center ${themeStyles.cardText} transition-colors duration-300`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-green-500 font-bold mr-3">{benefit.split(' ')[0]}</span>
                    <span>{benefit.substring(2)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className={`${themeStyles.cardBg} rounded-2xl p-8 shadow-lg transition-colors duration-300`}>
                <div className="text-center">
                  <div className="text-5xl mb-4">🌱</div>
                  <h4 className={`text-xl font-bold ${themeStyles.cardTitle} mb-2 transition-colors duration-300`}>
                    Join Our Green Community
                  </h4>
                  <p className={`${themeStyles.cardText} transition-colors duration-300`}>
                    Be part of a growing community committed to sustainable living and environmental responsibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
