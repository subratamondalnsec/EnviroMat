// components/about/OurTeam.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OurTeam = () => {
  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-[#F9FAFB]',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    subtitle: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200',
    memberName: isDarkMode ? 'text-white' : 'text-gray-900',
    memberBio: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    socialBg: isDarkMode ? 'bg-gray-700 hover:bg-green-700' : 'bg-gray-100 hover:bg-green-100',
    socialIcon: isDarkMode ? 'text-gray-400' : 'text-gray-600'
  };

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
            Meet Our <span className="text-green-400">Team</span>
          </h2>
          <p className={`text-xl ${themeStyles.subtitle} max-w-3xl mx-auto transition-colors duration-300`}>
            The passionate individuals driving our mission to create a more sustainable world
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className={`${themeStyles.cardBg} rounded-3xl p-6 shadow-sm border hover:shadow-md transition-all duration-300`}
              whileHover={{ y: -2 }}
            >
              <div className="relative mb-6">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${member.color} mx-auto flex items-center justify-center text-white text-2xl font-bold`}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              
              <div className="text-center">
                <h3 className={`text-xl font-bold ${themeStyles.memberName} mb-2 transition-colors duration-300`}>{member.name}</h3>
                <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                <p className={`${themeStyles.memberBio} text-sm leading-relaxed mb-4 transition-colors duration-300`}>{member.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  <button className={`p-2 ${themeStyles.socialBg} rounded-full transition-colors duration-300`}>
                    <Mail className={`w-4 h-4 ${themeStyles.socialIcon}`} />
                  </button>
                  <button className={`p-2 ${themeStyles.socialBg} rounded-full transition-colors duration-300`}>
                    <Linkedin className={`w-4 h-4 ${themeStyles.socialIcon}`} />
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
