import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-primary flex items-center justify-center z-50">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.3),transparent)] pointer-events-none"></div>
      </div>

      <div className="text-center text-white relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Karibu Safariz</h1>
          <p className="text-xl md:text-2xl font-light opacity-90">
            Your Gateway to Tanzania's Adventures
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 animate-spin">
              <div className="absolute top-0 left-1/2 w-1 h-10 bg-gradient-to-b from-white to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-10 bg-gradient-to-t from-white to-transparent transform -translate-x-1/2 rounded-full"></div>
              <div className="absolute left-0 top-1/2 h-1 w-10 bg-gradient-to-r from-white to-transparent transform -translate-y-1/2 rounded-full"></div>
              <div className="absolute right-0 top-1/2 h-1 w-10 bg-gradient-to-l from-white to-transparent transform -translate-y-1/2 rounded-full"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
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