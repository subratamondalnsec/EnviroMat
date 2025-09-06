import HeroSection from "../components/core/Home/HeroSection";
import LegacySection from "../components/core/Home/LegacySection";
import ServicesCard from "../components/core/Home/ServicesCard";
import InfiniteMarquee from "../components/core/Home/Marquee";
import TestimonialSection from "../components/core/Home/TestimonialSection";

import Footer from "../components/common/Footer";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const cardsData = [
    {
      tag: "Our Service",
      heading: "Waste Collection & Waste Management",
      description: "Advanced waste processing and recycling technologies.",
      image:
        "https://images.unsplash.com/photo-1635691315495-ff39debe5764?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8V2FzdGUlMjBjb2xsZWN0aW9ufGVufDB8fDB8fHww",
      progressLabel: "Collection Rate",
      progressValue: 95,
      progressColor: "#10B981",
      exploreText: "Learn More",
    },
    {
      tag: "Our Service",
      heading: "Eco-Friendly Material Development",
      description:
        "Creating innovative, sustainable, and environmentally-conscious materials for various industries.",
      image:
        "https://images.unsplash.com/photo-1660721671073-e139688fa3cf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fFJlY3ljbGVkJTIwbWF0ZXJpYWx8ZW58MHwyfDB8fHww",
      progressLabel: "Recyclibility Rate",
      progressValue: 75,
      progressColor: "#C27BFF",
      exploreText: "Learn More",
    },
    {
      tag: "Our Service",
      heading: "User Value Creation",
      description:
        "Creating innovative, sustainable, and environmentally-conscious materials for various industries.",
      image:
        "https://images.unsplash.com/photo-1651054558996-03455fe2702f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTd8fFVzZXIlMjB2YWx1ZXxlbnwwfDJ8MHx8fDA%3D",
      progressLabel: "Return Value",
      progressValue: 88,
      progressColor: "#C27BFF",
      exploreText: "Learn More",
    },
  ];

  useEffect(() => {
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current].filter(
      Boolean
    );

    if (cards.length === 0) return;

    // Set initial positions
    cards.forEach((card, index) => {
      gsap.set(card, {
        y: 300 + index * 300,
        scale: 0.8,
        zIndex: index - cards.length,
      });
    });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${cards.length * window.innerHeight}`,
        scrub: 1,
        pin: true,
      },
    });

    // Animate cards
    cards.forEach((card, index) => {
      tl.to(
        card,
        {
          y: index * 60,
          scale: 1 - index * 0.02,
          duration: 1,
          ease: "power2.out",
        },
        index * 0.2
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <LegacySection />

      {/* Infinite Marquee Scroller */}

      <InfiniteMarquee
        speed={40}
        direction="right"
        className="bg-purple-300 border-y-purple-400 rotate-5 translate-y-[300%]"
        textClassName="text-4xl md:text-5xl font-medium text-gray-600"
        pauseOnHover={false}
      />

      <InfiniteMarquee
        speed={40}
        direction="left"
        className="bg-purple-300 border-y-purple-400 -rotate-5 translate-y-[200%]"
        textClassName="text-4xl md:text-5xl font-medium text-gray-600"
        pauseOnHover={false}
      />

      {/* Service Cards Animation */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="sticky top-0 flex items-center justify-center w-full h-full">
          {/* Card 1 */}
          <div
            ref={card1Ref}
            className="absolute flex items-center justify-center w-full h-full"
          >
            <div className="w-full max-w-7xl px-4">
              <ServicesCard {...cardsData[0]} className="h-full w-full" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            ref={card2Ref}
            className="absolute flex items-center justify-center w-full h-full"
          >
            <div className="w-full max-w-7xl px-4">
              <ServicesCard {...cardsData[1]} className="h-full w-full" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            ref={card3Ref}
            className="absolute flex items-center justify-center w-full h-full"
          >
            <div className="w-full max-w-7xl px-4">
              <ServicesCard {...cardsData[2]} className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default Home;
