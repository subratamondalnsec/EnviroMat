// components/about/OurServices.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Sun, Recycle, TreePine, Package } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OurServices = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current, 
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      icon: <Home className="w-10 h-10" />,
      title: "Building Materials",
      description: "Sustainable construction materials including recycled concrete, bamboo products, and eco-friendly insulation.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: <Sun className="w-10 h-10" />,
      title: "Solar Products",
      description: "Complete solar solutions including panels, batteries, and installation accessories for renewable energy.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <TreePine className="w-10 h-10" />,
      title: "Garden & Home",
      description: "Eco-friendly accessories for sustainable living, from composters to biodegradable planters.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Package className="w-10 h-10" />,
      title: "Eco Packaging",
      description: "Biodegradable and recyclable packaging solutions for businesses committed to sustainability.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <Recycle className="w-10 h-10" />,
      title: "Waste Management",
      description: "Consulting and products for efficient waste management and recycling programs.",
      color: "from-blue-400 to-blue-600"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-400">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive sustainable solutions for all your eco-friendly needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
