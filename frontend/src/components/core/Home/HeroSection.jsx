// components/core/Home/HeroSection.jsx
import React, { useEffect, useRef } from "react";
import { Leaf, Globe, Droplets } from "lucide-react";
import ProTeamCard from "./ProTeamCard";
import { motion } from "motion/react";
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);
  const headingRef = useRef(null);
  const buttonsRef = useRef(null);
  const iconsRef = useRef([]);
  const imagesRef = useRef([]);
  const rightImageRef = useRef(null);
  const proTeamCardRef = useRef(null);
  const decorativeElementsRef = useRef([]);

  // Get theme state from Redux
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  
  // Navigation hook
  const navigate = useNavigate();

  // Navigation functions
  const handleGetStarted = () => {
    navigate('/shop');
  };

  const handleContribute = () => {
    navigate('/services');
  };

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    buttonPrimary: isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white border-1 border-green-400' : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400',
    buttonSecondary: isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-1 border-purple-400' : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-400',
    iconBg: isDarkMode ? 'bg-green-800 text-green-300' : 'bg-[#9cfdcc] text-[#52d091]',
    iconHover: isDarkMode ? 'hover:bg-green-700' : 'hover:border-[#52d091]'
  };

  // Add elements to refs arrays
  const addToIconsRefs = (el, index) => {
    if (el && !iconsRef.current.includes(el)) {
      iconsRef.current[index] = el;
    }
  };

  const addToImagesRefs = (el, index) => {
    if (el && !imagesRef.current.includes(el)) {
      imagesRef.current[index] = el;
    }
  };

  const addToDecorativeRefs = (el, index) => {
    if (el && !decorativeElementsRef.current.includes(el)) {
      decorativeElementsRef.current[index] = el;
    }
  };

  useEffect(() => {
    const subtitle = subtitleRef.current;
    const heading = headingRef.current;
    const buttons = buttonsRef.current;
    const icons = iconsRef.current.filter(Boolean);
    const images = imagesRef.current.filter(Boolean);
    const rightImage = rightImageRef.current;
    const proTeamCard = proTeamCardRef.current;
    const decorativeElements = decorativeElementsRef.current.filter(Boolean);

    // Set initial states for all elements
    gsap.set(subtitle, {
      y: 50,
      opacity: 0,
    });

    gsap.set(heading, {
      y: 80,
      opacity: 0,
      scale: 0.9,
    });

    gsap.set(buttons, {
      y: 60,
      opacity: 0,
    });

    gsap.set(icons, {
      y: 80,
      opacity: 0,
      scale: 0,
      rotation: -180,
    });

    gsap.set(images, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotation: 10,
    });

    gsap.set(rightImage, {
      x: 200,
      opacity: 0,
      scale: 0.8,
    });

    gsap.set(proTeamCard, {
      y: 150,
      opacity: 0,
      scale: 0.7,
    });

    gsap.set(decorativeElements, {
      scale: 0,
      opacity: 0,
    });

    // Create main timeline that runs immediately on load
    const tl = gsap.timeline({ delay: 0.2 });

    // Animate subtitle first
    tl.to(subtitle, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    })

    // Animate heading
    .to(heading, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.7)',
    }, '-=0.4')

    // Animate buttons
    .to(buttons, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5')

    // Animate right image
    .to(rightImage, {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'back.out(1.7)',
    }, '-=0.8')

    // Animate icons with stagger
    .to(icons, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(2)',
    }, '-=0.6')

    // Animate images with stagger
    .to(images, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      stagger: 0.25,
      ease: 'back.out(1.7)',
    }, '-=0.5')

    // Animate ProTeamCard
    .to(proTeamCard, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'back.out(1.7)',
    }, '-=0.4')

    // Animate decorative elements
    .to(decorativeElements, {
      scale: 1,
      opacity: 1,
      duration: 1,
      stagger: 0.3,
      ease: 'back.out(1.7)',
    }, '-=0.6');

    // Add continuous floating animation to decorative elements after initial animation
    tl.call(() => {
      decorativeElements.forEach((element, index) => {
        gsap.to(element, {
          y: index % 2 === 0 ? -20 : 20,
          duration: 3,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.5,
        });
      });
    });

    // Add hover animations to icons
    icons.forEach((icon) => {
      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.1,
          rotation: 15,
          duration: 0.3,
          ease: 'back.out(2)',
        });
      });

      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'back.out(2)',
        });
      });
    });

    return () => {
      tl.kill();
    };
  }, [isDarkMode]);

  return (
    <section ref={sectionRef} className={`relative min-h-screen overflow-hidden ${themeStyles.background} transition-colors duration-300`}>
      <div className="max-w-full mx-auto sm:px-5 lg:pl-8 py-2 lg:py-3">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-end h-[90%] w-full ">
            {/* Title Container */}
            <div className="title flex flex-col gap-4 mb-[6vh]">
              {/* Main Heading */}
              <div className="space-y-1">
                <p ref={subtitleRef} className={`${themeStyles.secondaryText} text-lg transition-colors duration-300`}>
                  Sculpting the Future with Green Materials
                </p>

                <h1 ref={headingRef} className={`text-6xl lg:text-7xl font-medium ${themeStyles.text} leading-tighter transform-gpu transition-colors duration-300`}>
                  Leading the Way
                  <br />
                  in <span className="text-[#08DF73]">Sustainable</span>
                  <br />
                  Materials
                </h1>
              </div>

              {/* CTA Buttons */}
              <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 transform-gpu">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className={`px-8 py-3 border-[1.5px] rounded-full font-medium transition-all duration-300 ${themeStyles.buttonPrimary}`}
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContribute}
                  className={`px-7 py-3 border-[1.5px] rounded-full font-medium transition-all duration-300 ${themeStyles.buttonSecondary}`}
                >
                  Contribute
                </motion.button>
              </div>
            </div>

            <div className="w-[105%] flex justify-between items-end">
              {/* Bottom Icons */}
              <div className="flex items-center space-x-4 pt-8 z-10">
                <div 
                  ref={(el) => addToIconsRefs(el, 0)}
                  className={`w-12 h-12 ${themeStyles.iconBg} rounded-full flex items-center justify-center border border-transparent ${themeStyles.iconHover} transition-all duration-300 transform-gpu cursor-pointer`}
                >
                  <Leaf className="w-6 h-6" />
                </div>
                <div 
                  ref={(el) => addToIconsRefs(el, 1)}
                  className={`w-12 h-12 ${themeStyles.iconBg} rounded-full flex items-center justify-center border border-transparent ${themeStyles.iconHover} transition-all duration-300 transform-gpu cursor-pointer`}
                >
                  <Globe className="w-6 h-6" />
                </div>
                <div 
                  ref={(el) => addToIconsRefs(el, 2)}
                  className={`w-12 h-12 ${themeStyles.iconBg} rounded-full flex items-center justify-center border border-transparent ${themeStyles.iconHover} transition-all duration-300 transform-gpu cursor-pointer`}
                >
                  <Droplets className="w-6 h-6" />
                </div>
              </div>
              
              {/* Product Showcases */}
              <div className="flex space-x-4 pt-8">
                <div 
                  ref={(el) => addToImagesRefs(el, 0)}
                  className="w-25 h-30 lg:w-30 lg:h-35 bg-gray-300 rounded-xl overflow-hidden transform-gpu hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=center"
                    alt="Sustainable product 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  ref={(el) => addToImagesRefs(el, 1)}
                  className="w-25 h-30 lg:w-30 lg:h-35 bg-green-200 rounded-xl overflow-hidden transform-gpu hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=400&fit=crop&crop=center"
                    alt="Sustainable product 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Green Leaf Background */}
          <div className="relative">
            <div className="relative p-2 lg:px-0 min-h-[600px] h-screen flex items-center justify-end">
              {/* Large leaf background image */}
              <div 
                ref={rightImageRef}
                className="h-[98%] -translate-y-[0.9%] w-[95%] rounded-4xl overflow-hidden transform-gpu shadow-lg"
              >
                <img
                  src="https://images.unsplash.com/photo-1603977865139-05ba89d5eefe?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGdyZWVuJTIwd2FzdGUlMjBpbGx1c3RyYXRpb258ZW58MHwxfDB8fHwy"
                  alt="Green leaves background"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Pro Team Card */}
              <div ref={proTeamCardRef} className="absolute bottom-10 right-4 transform-gpu">
                <ProTeamCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div 
        ref={(el) => addToDecorativeRefs(el, 0)}
        className={`absolute top-20 right-10 w-32 h-32 ${isDarkMode ? 'bg-green-800' : 'bg-green-100'} rounded-full opacity-20 blur-xl transform-gpu transition-colors duration-300`}
      ></div>
      <div 
        ref={(el) => addToDecorativeRefs(el, 1)}
        className={`absolute bottom-20 left-10 w-24 h-24 ${isDarkMode ? 'bg-green-700' : 'bg-green-200'} rounded-full opacity-30 blur-lg transform-gpu transition-colors duration-300`}
      ></div>
    </section>
  );
};

export default HeroSection;
