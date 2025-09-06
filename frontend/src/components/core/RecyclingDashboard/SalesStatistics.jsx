// components/core/RecyclingDashboard/SalesStatistics.jsx
import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarChart3, TrendingUp, Package } from 'lucide-react';
import gsap from 'gsap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesStatistics = ({ salesData }) => {
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
    labels: salesData.months,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: salesData.revenue,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y',
      },
      {
        label: 'Orders Count',
        data: salesData.orders,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
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
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            weight: 'bold'
          },
          callback: function(value) {
            return '₹' + (value / 1000) + 'k';
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      },
    },
  };

  const totalRevenue = salesData.revenue.reduce((a, b) => a + b, 0);
  const totalOrders = salesData.orders.reduce((a, b) => a + b, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div ref={sectionRef} className="bg-white rounded-3xl p-6 border border-gray-400">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
          Sales Performance Analytics
        </h3>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">6 Month Trend</span>
        </div>
      </div>

      <div className="h-80 mb-6">
        <Bar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="text-2xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Revenue (6M)</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders (6M)</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">
            ₹{avgOrderValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Avg. Order Value</div>
        </div>
      </div>
    </div>
  );
};

export default SalesStatistics;
