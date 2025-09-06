// components/core/RecyclingDashboard/CategoryPerformance.jsx
import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Package, TrendingUp } from 'lucide-react';
import gsap from 'gsap';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPerformance = ({ categories }) => {
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

  const categoryNames = Object.keys(categories);
  const categoryValues = Object.values(categories);

  const chartData = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(34, 197, 94, 1)'
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
          padding: 15,
          font: {
            size: 10,
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

  const topCategory = categoryNames.reduce((a, b) => 
    categories[a] > categories[b] ? a : b
  );

  return (
    <div ref={sectionRef} className="bg-white rounded-3xl p-6 border border-gray-400">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Package className="w-6 h-6 mr-2 text-purple-500" />
          Category Performance
        </h3>
      </div>

      <div className="h-64 mb-4">
        <Doughnut data={chartData} options={options} />
      </div>

      <div className="bg-purple-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Top Performer</p>
            <p className="text-lg font-bold text-purple-800">{topCategory}</p>
          </div>
          <div className="flex items-center text-purple-600">
            <TrendingUp className="w-5 h-5 mr-1" />
            <span className="font-bold">{categories[topCategory]} sales</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPerformance;
