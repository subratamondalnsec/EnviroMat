// components/core/RecyclingDashboard/OrdersList.jsx
import React, { useRef, useEffect } from 'react';
import { Package, Calendar, User, DollarSign, Truck } from 'lucide-react';
import gsap from 'gsap';

const OrdersList = ({ orders }) => {
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

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800', 
      processing: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <Package className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      pending: <Package className="w-4 h-4" />
    };
    return icons[status] || icons.pending;
  };

  return (
    <div ref={sectionRef} className="bg-white rounded-3xl p-6 border border-gray-400">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Package className="w-6 h-6 mr-2 text-green-500" />
          Recent Orders
        </h3>
        <div className="text-sm text-gray-600">
          {orders.length} orders this month
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{order.id}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{order.customerName}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(order.orderDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Products:</h5>
                <div className="space-y-1">
                  {order.products.map((product, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      • {product.name} (×{product.quantity})
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1 text-lg font-bold text-green-600">
                    <DollarSign className="w-5 h-5" />
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Category: {order.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrdersList;
