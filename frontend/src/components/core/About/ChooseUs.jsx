// components/about/WhyChooseUs.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Users, Clock, Leaf } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef([]);

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
    <section ref={sectionRef} className="py-20 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-purple-400">Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <div className="bg-gray-100 rounded-full p-4">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</h4>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="bg-gradient-to-br from-green-50 to-purple-50 border border-gray-300 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                What Makes Us Different
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center text-gray-700"
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
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-center">
                  <div className="text-5xl mb-4">🌱</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Join Our Green Community
                  </h4>
                  <p className="text-gray-600">
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
