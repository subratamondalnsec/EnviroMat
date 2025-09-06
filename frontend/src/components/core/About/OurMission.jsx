// components/about/OurMission.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OurMission = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current, 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const missionData = [
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Our Mission",
      description: "To revolutionize the way people think about materials by providing sustainable, high-quality alternatives that don't compromise on performance or affordability."
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-500" />,
      title: "Our Vision",
      description: "A world where every construction project, every home improvement, and every purchase contributes to a healthier planet for future generations."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Our Values",
      description: "Sustainability, transparency, innovation, and community. We believe in doing business responsibly while creating positive environmental impact."
    }
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
            What Drives Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our commitment to sustainability goes beyond just selling products – it's about creating lasting change.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {missionData.map((item, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="bg-gray-50 rounded-3xl p-8 text-center shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-white rounded-full p-4 shadow-md">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurMission;
