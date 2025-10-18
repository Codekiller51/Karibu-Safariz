import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, CheckCircle, Download, ExternalLink, Calendar } from 'lucide-react';

const Certifications: React.FC = () => {
  const certifications = [
    {
      title: 'Tanzania Tourism Board License',
      issuer: 'Tanzania Tourism Board',
      number: 'TTB-2024-KG-001',
      issued: '2024-01-15',
      expires: '2025-01-15',
      status: 'Active',
      description: 'Official license to operate tourism services in Tanzania',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Legal'
    },
    {
      title: 'IATA Travel Agent License',
      issuer: 'International Air Transport Association',
      number: 'IATA-TZ-789456',
      issued: '2023-06-01',
      expires: '2025-06-01',
      status: 'Active',
      description: 'Certified travel agent for international flight bookings',
      image: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Travel'
    },
    {
      title: 'Wilderness First Aid Certification',
      issuer: 'Wilderness Medical Institute',
      number: 'WFA-2024-123',
      issued: '2024-03-10',
      expires: '2026-03-10',
      status: 'Active',
      description: 'Advanced wilderness first aid and emergency response training',
      image: 'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Safety'
    },
    {
      title: 'ISO 14001 Environmental Management',
      issuer: 'International Organization for Standardization',
      number: 'ISO-14001-2024-KG',
      issued: '2024-02-20',
      expires: '2027-02-20',
      status: 'Active',
      description: 'Environmental management system certification',
      image: 'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Environmental'
    },
    {
      title: 'Fair Trade Tourism Certification',
      issuer: 'Fair Trade Tourism',
      number: 'FTT-2024-TZ-456',
      issued: '2024-01-05',
      expires: '2025-01-05',
      status: 'Active',
      description: 'Commitment to fair wages and sustainable tourism practices',
      image: 'https://images.pexels.com/photos/1821644/pexels-photo-1821644.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Social'
    },
    {
      title: 'Leave No Trace Certification',
      issuer: 'Leave No Trace Center',
      number: 'LNT-2024-789',
      issued: '2024-04-15',
      expires: '2026-04-15',
      status: 'Active',
      description: 'Environmental ethics and outdoor recreation education',
      image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Environmental'
    },
    {
      title: 'Tanzania Association of Tour Operators',
      issuer: 'TATO',
      number: 'TATO-2024-001',
      issued: '2024-01-01',
      expires: '2024-12-31',
      status: 'Active',
      description: 'Professional membership in Tanzania\'s premier tour operator association',
      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Professional'
    },
    {
      title: 'Mountain Guide Certification',
      issuer: 'Tanzania Mountain Guides Association',
      number: 'TMGA-2024-KG-001',
      issued: '2024-02-01',
      expires: '2026-02-01',
      status: 'Active',
      description: 'Professional mountain guiding certification for Kilimanjaro',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Professional'
    }
  ];

  const awards = [
    {
      title: 'Tanzania Tourism Excellence Award',
      year: '2023',
      issuer: 'Tanzania Tourism Board',
      description: 'Outstanding contribution to Tanzania tourism industry'
    },
    {
      title: 'TripAdvisor Certificate of Excellence',
      year: '2023',
      issuer: 'TripAdvisor',
      description: 'Consistently high ratings and reviews from travelers'
    },
    {
      title: 'Sustainable Tourism Gold Award',
      year: '2022',
      issuer: 'East Africa Tourism Association',
      description: 'Leadership in sustainable and responsible tourism practices'
    },
    {
      title: 'Community Impact Award',
      year: '2022',
      issuer: 'Tanzania Community Development Foundation',
      description: 'Significant contribution to local community development'
    }
  ];

  const categories = ['All', 'Legal', 'Safety', 'Environmental', 'Professional', 'Travel', 'Social'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredCertifications = selectedCategory === 'All' 
    ? certifications 
    : certifications.filter(cert => cert.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Certifications & Licenses</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our comprehensive certifications and licenses demonstrate our commitment to safety, professionalism, and industry excellence. We maintain the highest standards in all aspects of our operations.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{certifications.length}</div>
            <div className="text-gray-600">Active Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{awards.length}</div>
            <div className="text-gray-600">Industry Awards</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">15+</div>
            <div className="text-gray-600">Years Compliance</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600">Compliance Rate</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Current Certifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All our certifications are current and regularly renewed to ensure compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cert.status)}`}>
                      {cert.status}
                    </span>
                    {isExpiringSoon(cert.expires) && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Renewing Soon
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cert.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Issuer:</span>
                      <span className="font-medium">{cert.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number:</span>
                      <span className="font-medium">{cert.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issued:</span>
                      <span className="font-medium">{new Date(cert.issued).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span className="font-medium">{new Date(cert.expires).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm flex items-center justify-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button className="flex-1 border border-orange-600 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 transition-colors text-sm flex items-center justify-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Industry Awards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognition from industry leaders and organizations for our excellence and commitment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{award.title}</h3>
                  <p className="text-orange-600 font-medium text-sm mb-2">{award.issuer} • {award.year}</p>
                  <p className="text-gray-600 text-sm">{award.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to Compliance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We maintain rigorous standards and regularly update our certifications to ensure the highest level of service and safety for our guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Audits</h3>
              <p className="text-gray-600 text-sm">Annual third-party audits ensure continuous compliance with all regulations and standards.</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proactive Renewal</h3>
              <p className="text-gray-600 text-sm">We renew all certifications well before expiry dates to maintain uninterrupted service.</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuous Improvement</h3>
              <p className="text-gray-600 text-sm">We actively pursue additional certifications to enhance our service quality and expertise.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Trust in Our Expertise
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our certifications and awards reflect our unwavering commitment to excellence, safety, and professionalism. Book with confidence knowing you're in expert hands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Book Your Adventure
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
            >
              Ask About Our Standards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;