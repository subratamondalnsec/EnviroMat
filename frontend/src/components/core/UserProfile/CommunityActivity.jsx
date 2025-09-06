// components/profile/CommunityActivity.jsx
import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { MessageSquare, Heart, MessageCircle } from 'lucide-react';
import gsap from 'gsap';

ChartJS.register(ArcElement, Tooltip, Legend);

const CommunityActivity = ({ activityData }) => {
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

  const chartData = {
    labels: ['Posts Created', 'Likes Received', 'Comments Made'],
    datasets: [
      {
        data: [activityData.posts, activityData.likes, activityData.comments],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    }
  };

  const activities = [
    {
      icon: <MessageSquare className="w-5 h-5 text-green-500" />,
      label: "Posts Created",
      value: activityData.posts,
      trend: "+12% this month"
    },
    {
      icon: <Heart className="w-5 h-5 text-purple-500" />,
      label: "Likes Received",
      value: activityData.likes,
      trend: "+23% this month"
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
      label: "Comments Made",
      value: activityData.comments,
      trend: "+8% this month"
    }
  ];

  return (
    <div ref={sectionRef} className="bg-white rounded-3xl p-6 border border-gray-400">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageSquare className="w-6 h-6 mr-2 text-green-500" />
        Community Activity
      </h3>
      
      <div className=" grid lg:grid-cols-2 gap-6">

        <div className="h-64">
          <Doughnut data={chartData} options={options} />
        </div>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-200 rounded-xl">
              <div className="flex items-center space-x-3">
                {activity.icon}
                <div>
                  <p className="font-semibold text-gray-900">{activity.label}</p>
                  <p className="text-sm text-green-600">{activity.trend}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900">{activity.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityActivity;
