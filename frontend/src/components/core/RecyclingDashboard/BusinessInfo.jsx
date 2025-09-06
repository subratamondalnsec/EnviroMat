// components/core/RecyclingDashboard/BusinessInfo.jsx
import React, { useRef, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Award, Calendar } from 'lucide-react';
import gsap from 'gsap';

const BusinessInfo = ({ businessInfo }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const infoItems = [
    {
      icon: <Mail className="w-4 h-4 text-blue-500" />,
      label: "Email",
      value: businessInfo.contactEmail
    },
    {
      icon: <Phone className="w-4 h-4 text-green-500" />,
      label: "Phone",
      value: businessInfo.contactPhone
    },
    {
      icon: <MapPin className="w-4 h-4 text-red-500" />,
      label: "Location", 
      value: businessInfo.location
    },
    {
      icon: <Calendar className="w-4 h-4 text-purple-500" />,
      label: "Established",
      value: businessInfo.establishedDate
    }
  ];

  return (
    <div ref={sectionRef} className="bg-white rounded-3xl p-5 border border-gray-400">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Building2 className="w-5 h-5 mr-2 text-green-500" />
        Business Information
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Left Column - Contact Info (2 columns) */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="font-medium text-gray-900 text-sm truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Certifications & Business Type */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
              <Award className="w-4 h-4 mr-1 text-yellow-500" />
              Certifications
            </h4>
            <div className="space-y-1">
              {businessInfo.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
