import React from 'react';

const ProTeamCard = () => {
  return (
    <div className="bg-[#F8F9FA] rounded-3xl p-6 shadow-lg max-w-xs">
      <div className="space-y-4">
        {/* Team Photos */}
        <div className="flex -space-x-2">
          <img 
            src="https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=2083&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Team member 1" 
            className="w-13 h-13 rounded-full border-2 border-white object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
            alt="Team member 2" 
            className="w-13 h-13 rounded-full border-2 border-white object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" 
            alt="Team member 3" 
            className="w-13 h-13 rounded-full border-2 border-white object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-md font-bold text-[#C27BFF] tracking-tight">Top Users</h3>
          <p className="text-gray-600 text-[12px] leading-tight tracking-normal">
            Leading the way in sustainable<br />
            waste management solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProTeamCard;
