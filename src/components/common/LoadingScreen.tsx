import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 border-2 border-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-white rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="text-center text-white relative z-10">
        {/* Logo and Brand */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Karibu Safariz</h1>
          <p className="text-xl md:text-2xl font-light opacity-90">
            Your Gateway to Tanzania's Adventures
          </p>
        </div>

        {/* Spinning Lines */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            {/* Outer spinning lines */}
            <div className="absolute inset-0 animate-spin">
              <div className="absolute top-0 left-1/2 w-1 h-16 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-16 bg-gradient-to-t from-green-400 to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute left-0 top-1/2 h-1 w-16 bg-gradient-to-r from-red-400 to-transparent transform -translate-y-1/2 rounded-full"></div>
              <div className="absolute right-0 top-1/2 h-1 w-16 bg-gradient-to-l from-purple-400 to-transparent transform -translate-y-1/2 rounded-full"></div>
            </div>
            
            {/* Middle spinning lines - opposite direction */}
            <div className="absolute inset-2 animate-spin-reverse">
              <div className="absolute top-0 left-1/2 w-0.5 h-12 bg-gradient-to-b from-yellow-400 to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-gradient-to-t from-pink-400 to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute left-0 top-1/2 h-0.5 w-12 bg-gradient-to-r from-cyan-400 to-transparent transform -translate-y-1/2 rounded-full"></div>
              <div className="absolute right-0 top-1/2 h-0.5 w-12 bg-gradient-to-l from-indigo-400 to-transparent transform -translate-y-1/2 rounded-full"></div>
            </div>
            
            {/* Inner spinning lines - fast rotation */}
            <div className="absolute inset-4 animate-spin-fast">
              <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gradient-to-b from-orange-400 to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-gradient-to-t from-teal-400 to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute left-0 top-1/2 h-0.5 w-8 bg-gradient-to-r from-lime-400 to-transparent transform -translate-y-1/2 rounded-full"></div>
              <div className="absolute right-0 top-1/2 h-0.5 w-8 bg-gradient-to-l from-rose-400 to-transparent transform -translate-y-1/2 rounded-full"></div>
            </div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="relative">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-lg font-medium opacity-90">
            Preparing your adventure...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;