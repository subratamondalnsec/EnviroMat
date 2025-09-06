import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  // Animation variants for different sliding directions
  const slideFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const slideFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const slideFromBottom = {
    hidden: { y: 30, opacity: 0 },
    visible: (index) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <footer ref={footerRef} className="bg-black relative">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Column - Logo and Navigation */}
          <motion.div 
            className="space-y-6"
            variants={slideFromLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
          >
            {/* Logo with animation */}
            <motion.div 
              className="flex items-center space-x-3"
              variants={slideFromLeft}
              custom={0}
              whileHover={{}}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                whileHover={{}}
                transition={{ duration: 0.3 }}
              >
                <img src="/Logo2.png" alt="logo" className="w-full h-full" />
              </motion.div>
              <span className="text-2xl font-medium text-white/70">
                Enviromat
              </span>
            </motion.div>

            {/* Navigation Links with stagger animation */}
            <div className="flex space-x-6">
              {['About Us', 'Product', 'FAQ'].map((linkText, index) => (
                <motion.a
                  key={linkText}
                  href="#"
                  className="text-white/70 hover:text-gray-300 transition-colors relative"
                  variants={slideFromLeft}
                  custom={index + 1}
                  whileHover={{ color: '#10B981' }}
                  transition={{ duration: 0.2 }}
                >
                  {linkText}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-0.5 ${index === 1 ? 'bg-purple-400' : 'bg-green-400'}`}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Second Column - Newsletter Subscription */}
          <motion.div
            variants={slideFromBottom}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
          >
            <motion.h4 
              className="text-gray-400 text-sm font-medium mb-4"
              variants={slideFromBottom}
              custom={0}
              whileHover={{ color: '#10B981' }}
              transition={{ duration: 0.2 }}
            >
              Newsletter
            </motion.h4>
            <motion.p 
              className="text-white/70 text-sm mb-4"
              variants={slideFromBottom}
              custom={1}
            >
              Subscribe to our newsletter for updates
            </motion.p>
            <motion.div 
              className="flex"
              variants={slideFromBottom}
              custom={2}
            >
              <motion.input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-purple-400 text-sm text-white placeholder-gray-400 transition-all duration-300"
                whileFocus={{ 
                  borderColor: '#C084FC',
                  boxShadow: '0 0 0 2px rgba(192, 132, 252, 0.2)'
                }}
              />
              <motion.button 
                className="px-4 py-2 bg-purple-400 text-white rounded-r-lg hover:bg-purple-500 transition-colors text-sm font-medium"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: '#9333ea'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Subscribe
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Social Media */}
          <motion.div 
            className="space-y-4 ml-20"
            variants={slideFromRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
          >
            <motion.h4 
              className="text-gray-400 text-sm font-medium mb-4"
              variants={slideFromRight}
              custom={0}
              whileHover={{}}
              transition={{ duration: 0.2 }}
            >
              Social Media
            </motion.h4>
            <ul className="space-y-2">
              {['Linkedin', 'Facebook', 'Instagram', 'Twitter', 'Youtube'].map((social, index) => (
                <motion.li 
                  key={social}
                  variants={slideFromRight}
                  custom={index + 1}
                >
                  <motion.a
                    href="#"
                    className="text-white/70 hover:text-gray-300 transition-colors text-sm relative inline-block"
                    whileHover={{ 
                      color: '#10B981'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {social}
                    <motion.span
                      className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-green-400 rounded-full"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Fourth Column - Contact Info and Address */}
          <motion.div 
            className="space-y-6"
            variants={slideFromRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
          >
            {/* Contact Info */}
            <div>
              <motion.h4 
                className="text-gray-400 text-sm font-medium mb-4"
                variants={slideFromRight}
                custom={0}
                whileHover={{ }}
                transition={{ duration: 0.2 }}
              >
                Contact Info
              </motion.h4>
              <ul className="space-y-2">
                <motion.li 
                  variants={slideFromRight}
                  custom={1}
                  whileHover={{ color: '#10B981' }} 
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/70 text-sm">
                    +88 0324234234
                  </span>
                </motion.li>
                <motion.li 
                  variants={slideFromRight}
                  custom={2}
                  whileHover={{ color: '#10B981' }} 
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/70 text-sm">
                    hello@fibostudio.com
                  </span>
                </motion.li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <motion.h4 
                className="text-gray-400 text-sm font-medium mb-4"
                variants={slideFromRight}
                custom={3}
                whileHover={{}}
                transition={{ duration: 0.2 }}
              >
                Address
              </motion.h4>
              <motion.p 
                className="text-white/70 text-sm"
                variants={slideFromRight}
                custom={4}
                whileHover={{color: '#10B981'}}
                transition={{ duration: 0.2 }}
              >
                336 East Shewrapara, Mirpur, Dhaka, Bangladesh
              </motion.p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="w-full flex items-center justify-center mt-30"
          variants={slideFromBottom}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={5}
        >
          <motion.span
            className="text-[7.29vw] lg:text-[10.5vw] font-bold select-none leading-tight tracking-tighter cursor-pointer scale-[1.02]"
            style={{
              background:
                "linear-gradient(180deg, #3BF799 30%, #24D152 50%, #000000 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 20px rgba(59, 247, 153, 0.3)"
            }}
            whileHover={{
              textShadow: "0 0 30px rgba(59, 247, 153, 0.5)"
            }}
            transition={{ duration: 0.3 }}
          >
            Waste Management
          </motion.span>
        </motion.div>

        {/* Bottom Section - Copyright and Policies */}
        <motion.div 
          className="border-t border-gray-800 mt-2 pt-8"
          variants={slideFromBottom}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={6}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="text-sm text-gray-500"
              variants={slideFromLeft}
              custom={7}
              whileHover={{ color: '#9CA3AF' }}
              transition={{ duration: 0.2 }}
            >
              © 2025 Tech Squad. All rights reserved.
            </motion.div>
            <div className="flex space-x-6 text-sm">
              {['Privacy Policy', 'Terms of Services', 'Accessibility'].map((policy, index) => (
                <motion.a
                  key={policy}
                  href="#"
                  className="text-gray-500 hover:text-gray-300 transition-colors relative"
                  variants={slideFromRight}
                  custom={index + 8}
                  whileHover={{
                    color: '#10B981'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {policy}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-green-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
