import React from 'react';
import { Shield, Users, Award, Heart } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority. All our guides are certified and experienced professionals.',
    },
    {
      icon: Users,
      title: 'Expert Guides',
      description: 'Local guides with deep knowledge of Tanzania\'s culture, wildlife, and geography.',
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized as one of Tanzania\'s top tour operators with numerous industry awards.',
    },
    {
      icon: Heart,
      title: 'Responsible Tourism',
      description: 'We support local communities and practice sustainable tourism for a better future.',
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Karibu Safariz?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With over 15 years of experience, we've perfected the art of creating unforgettable adventures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <Icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-orange-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready for Your Adventure?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Join thousands of satisfied adventurers who have trusted us with their dream experiences. 
                Let's create memories that will last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                  Plan Your Trip
                </button>
                <button className="border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-600 hover:text-white transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Happy travelers"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;