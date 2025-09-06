// components/about/OurTeam.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OurTeam = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current, 
        { y: 60, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.7, 
          stagger: 0.15,
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

  const team = [
    {
      name: "Subrata Mondal",
      role: "Full Stack Developer",
      bio: "Full stack developer specializing in web applications and system architecture.",
      image: "/api/placeholder/300/300",
      color: "from-green-400 to-emerald-500"
    },
    {
      name: "Subhadip Jana",
      role: "UI/UX Designer & Frontend Developer",
      bio: "Creative designer and frontend developer focused on building intuitive user experiences.",
      image: "/api/placeholder/300/300", 
      color: "from-purple-400 to-purple-500"
    },
    {
      name: "Sushovan Paul",
      role: "Backend Developer",
      bio: "Backend developer focused on building robust and scalable server-side solutions.",
      image: "/api/placeholder/300/300",
      color: "from-blue-400 to-blue-500"
    },
    {
      name: "Supratik Roychoudhury",
      role: "AIML Developer",
      bio: "AI/ML developer specializing in intelligent systems and data-driven solutions.",
      image: "/api/placeholder/300/300",
      color: "from-orange-400 to-orange-500"
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
            Meet Our <span className="text-green-400">Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals driving our mission to create a more sustainable world
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="relative mb-6">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${member.color} mx-auto flex items-center justify-center text-white text-2xl font-bold`}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-green-100 transition-colors">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                    <Linkedin className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;