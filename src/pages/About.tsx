import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Heart, Shield, Mountain, Camera, Globe } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '5000+', label: 'Happy Travelers' },
    { number: '98%', label: 'Success Rate' },
    { number: '50+', label: 'Expert Guides' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority with certified guides and comprehensive safety protocols.'
    },
    {
      icon: Heart,
      title: 'Sustainable Tourism',
      description: 'We practice responsible tourism that benefits local communities and preserves nature.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Award-winning service with attention to detail in every aspect of your journey.'
    },
    {
      icon: Globe,
      title: 'Local Expertise',
      description: 'Deep local knowledge and authentic experiences with Tanzania\'s culture and wildlife.'
    }
  ];

  const quickLinks = [
    {
      title: 'Our Story',
      description: 'Learn about our journey and passion for Tanzania',
      link: '/about/story',
      icon: Mountain
    },
    {
      title: 'Our Team',
      description: 'Meet the experts who make your adventure possible',
      link: '/about/team',
      icon: Users
    },
    {
      title: 'Why Choose Us',
      description: 'Discover what sets us apart from other operators',
      link: '/about/why-choose-us',
      icon: Award
    },
    {
      title: 'Testimonials',
      description: 'Read stories from our satisfied travelers',
      link: '/about/testimonials',
      icon: Heart
    },
    {
      title: 'Gallery',
      description: 'Explore stunning photos from our adventures',
      link: '/gallery',
      icon: Camera
    },
    {
      title: 'Certifications',
      description: 'View our licenses and industry certifications',
      link: '/about/certifications',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Karibu Safariz</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Your trusted gateway to Tanzania's most spectacular adventures. For over 15 years, we've been creating unforgettable experiences that connect travelers with the heart of East Africa.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To provide authentic, safe, and transformative travel experiences that showcase Tanzania's natural wonders while supporting local communities and conservation efforts. We believe that travel should be more than just sightseeing – it should be a journey of discovery, connection, and positive impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore More About Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deeper into what makes Karibu Safariz your perfect adventure partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.link}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 rounded-lg p-3 mr-4 group-hover:bg-orange-200 transition-colors">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have trusted us with their Tanzania experience. Let's create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Explore Tours
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;