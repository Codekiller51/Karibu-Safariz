import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mountain, Camera, Heart, Shield, Users, Award, Mail, Phone } from 'lucide-react';

const OurTeam: React.FC = () => {
  const leadership = [
    {
      name: 'Joseph Mwangi',
      role: 'Founder & CEO',
      experience: '15+ years',
      specialization: 'Kilimanjaro Expeditions',
      bio: 'Born and raised in Moshi, Joseph has summited Kilimanjaro over 200 times. His deep knowledge of the mountain and passion for adventure tourism led to the founding of Kilimanjaro Gates.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      achievements: ['200+ Kilimanjaro Summits', 'Tanzania Tourism Award Winner', 'Certified Mountain Guide'],
      languages: ['English', 'Swahili', 'German']
    },
    {
      name: 'Sarah Kimani',
      role: 'Operations Director',
      experience: '12+ years',
      specialization: 'Wildlife Safaris',
      bio: 'A wildlife biologist with extensive experience in East African ecosystems. Sarah ensures all our safari operations maintain the highest standards of wildlife conservation and guest safety.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      achievements: ['Wildlife Biology PhD', 'Conservation Award Recipient', 'Published Researcher'],
      languages: ['English', 'Swahili', 'French']
    },
    {
      name: 'Michael Ochieng',
      role: 'Head Guide',
      experience: '10+ years',
      specialization: 'Cultural Tours',
      bio: 'Michael bridges the gap between visitors and local communities, providing authentic cultural experiences while ensuring respectful and sustainable tourism practices.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      achievements: ['Cultural Heritage Specialist', 'Community Leader', 'Multilingual Guide'],
      languages: ['English', 'Swahili', 'Maasai', 'Spanish']
    }
  ];

  const guides = [
    {
      name: 'David Mollel',
      specialization: 'Kilimanjaro Expert',
      experience: '8 years',
      summits: '150+',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Grace Mushi',
      specialization: 'Safari Guide',
      experience: '6 years',
      summits: 'Wildlife Expert',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Peter Lyimo',
      specialization: 'Photography Guide',
      experience: '7 years',
      summits: 'Photo Expert',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Mary Kessy',
      specialization: 'Cultural Guide',
      experience: '5 years',
      summits: 'Cultural Expert',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'James Mwanga',
      specialization: 'Adventure Guide',
      experience: '9 years',
      summits: '120+',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Anna Mbwilo',
      specialization: 'Eco-Tourism Guide',
      experience: '4 years',
      summits: 'Eco Expert',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const departments = [
    {
      name: 'Operations Team',
      icon: Users,
      description: 'Ensuring smooth logistics and exceptional service delivery',
      members: 12
    },
    {
      name: 'Safety & Rescue',
      icon: Shield,
      description: 'Certified rescue specialists and safety coordinators',
      members: 8
    },
    {
      name: 'Cultural Liaisons',
      icon: Heart,
      description: 'Connecting guests with authentic local experiences',
      members: 6
    },
    {
      name: 'Photography Team',
      icon: Camera,
      description: 'Capturing your adventure memories professionally',
      members: 4
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Meet the passionate professionals who make your Tanzania adventure unforgettable. Our diverse team combines local expertise with international standards to deliver exceptional experiences.
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
            <div className="text-gray-600">Team Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">25+</div>
            <div className="text-gray-600">Expert Guides</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">15+</div>
            <div className="text-gray-600">Languages Spoken</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600">Local Experts</div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The visionary leaders who guide our mission and ensure exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-orange-600 font-medium mb-2">{leader.role}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>{leader.experience}</span>
                    <span>•</span>
                    <span>{leader.specialization}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{leader.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Achievements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {leader.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center">
                          <Award className="h-3 w-3 text-orange-600 mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Languages:</h4>
                    <div className="flex flex-wrap gap-2">
                      {leader.languages.map((language, i) => (
                        <span key={i} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Guides */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Expert Guides</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our certified guides bring years of experience and deep local knowledge to every adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{guide.name}</h3>
                  <p className="text-orange-600 font-medium text-sm mb-2">{guide.specialization}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{guide.experience} experience</span>
                    <span>{guide.summits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Departments</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized teams working together to create seamless adventures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                  <div className="text-2xl font-bold text-orange-600">{dept.members}</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Join Our Team */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Are you passionate about adventure tourism and Tanzania's natural beauty? We're always looking for talented individuals to join our growing family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Send Your CV</span>
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;