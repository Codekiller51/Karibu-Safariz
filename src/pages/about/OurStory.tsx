import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mountain, Heart, Users, Award } from 'lucide-react';

const OurStory: React.FC = () => {
  const milestones = [
    {
      year: '2009',
      title: 'The Beginning',
      description: 'Founded by passionate mountaineers with a dream to share Tanzania\'s beauty with the world.',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: '2012',
      title: 'First Safari Expansion',
      description: 'Extended our services to include wildlife safaris, bringing guests closer to Africa\'s Big Five.',
      image: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: '2015',
      title: 'Community Partnership',
      description: 'Established partnerships with local Maasai communities for authentic cultural experiences.',
      image: 'https://images.pexels.com/photos/1821644/pexels-photo-1821644.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: '2018',
      title: 'Award Recognition',
      description: 'Received Tanzania Tourism Excellence Award for outstanding service and sustainability practices.',
      image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: '2020',
      title: 'Digital Innovation',
      description: 'Launched virtual tour experiences and enhanced safety protocols during global challenges.',
      image: 'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      year: '2024',
      title: 'Sustainable Future',
      description: 'Committed to carbon-neutral operations and expanded conservation initiatives.',
      image: 'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const founders = [
    {
      name: 'Joseph Mwangi',
      role: 'Founder & CEO',
      story: 'Born at the foot of Mount Kilimanjaro, Joseph\'s passion for the mountain began in childhood. After summiting Kilimanjaro over 200 times, he founded Karibu Tours & Safariz to share his love for Tanzania\'s natural wonders.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Sarah Kimani',
      role: 'Co-Founder & Operations Director',
      story: 'A wildlife biologist turned entrepreneur, Sarah brings scientific expertise and conservation awareness to every safari experience, ensuring sustainable tourism practices.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/about"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to About</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story - Karibu Safariz</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From humble beginnings to becoming Tanzania's premier adventure operator, our journey has been guided by passion, authenticity, and an unwavering commitment to creating extraordinary experiences.
          </p>
        </div>

        {/* Hero Story Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src="https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Mount Kilimanjaro"
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Where It All Began</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                In 2009, a small group of local guides with an extraordinary passion for Mount Kilimanjaro and Tanzania's wildlife came together with a simple yet powerful vision: to create authentic, transformative travel experiences that would connect visitors with the true spirit of Tanzania.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                What started as a modest operation with just three guides has grown into a family of over 50 dedicated professionals, but our core values remain unchanged – safety, authenticity, and respect for both our guests and the natural environment we call home.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Mountain className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-600">Est. 2009</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-600">5000+ Travelers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-600">Award Winning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founders Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Founders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The visionaries who turned a passion for Tanzania into a world-class adventure company
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{founder.name}</h3>
                    <p className="text-orange-600 font-medium">{founder.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{founder.story}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that shaped Karibu Tours & Safariz into the company we are today
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-orange-200 h-full hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:pr-8">
                    <div className={`bg-white rounded-lg shadow-lg p-6 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="text-2xl font-bold text-orange-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:flex w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="flex-1 md:pl-8">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-48 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-orange-50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every decision we make and every experience we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600 text-sm">We love what we do and it shows in every adventure we create.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Supporting local communities is at the heart of our operations.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adventure</h3>
              <p className="text-gray-600 text-sm">Creating transformative experiences that inspire and challenge.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">Striving for perfection in every detail of your journey.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Be Part of Our Story
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of adventurers who have become part of the Karibu Tours & Safariz family. Your story starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Start Your Adventure
            </Link>
            <Link
              to="/contact"
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-600 hover:text-white transition-colors font-semibold"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;