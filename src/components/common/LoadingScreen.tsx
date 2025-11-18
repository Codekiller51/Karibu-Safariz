import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 animate-spin">
            <div className="absolute top-0 left-1/2 w-1 h-10 bg-gradient-to-b from-blue-600 to-transparent transform -translate-x-1/2 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 w-1 h-10 bg-gradient-to-t from-blue-600 to-transparent transform -translate-x-1/2 rounded-full"></div>
            <div className="absolute left-0 top-1/2 h-1 w-10 bg-gradient-to-r from-blue-600 to-transparent transform -translate-y-1/2 rounded-full"></div>
            <div className="absolute right-0 top-1/2 h-1 w-10 bg-gradient-to-l from-blue-600 to-transparent transform -translate-y-1/2 rounded-full"></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;