import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Award, Heart, Clock, Star, CheckCircle, Mountain } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const advantages = [
    {
      icon: Shield,
      title: 'Unmatched Safety Record',
      description: 'Our 98% success rate and zero major incidents speak to our commitment to safety.',
      details: [
        'Certified rescue specialists on every expedition',
        'Comprehensive safety equipment and protocols',
        'Regular health monitoring and emergency procedures',
        'Insurance coverage for all activities'
      ]
    },
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Born and raised in Tanzania, our guides know every trail, every animal, every story.',
      details: [
        'Native guides with generational knowledge',
        'Deep understanding of local culture and customs',
        'Established relationships with communities',
        'Insider access to hidden gems and experiences'
      ]
    },
    {
      icon: Award,
      title: 'Award-Winning Service',
      description: 'Recognized by Tanzania Tourism Board and international travel organizations.',
      details: [
        'Tanzania Tourism Excellence Award Winner',
        'TripAdvisor Certificate of Excellence',
        'Sustainable Tourism Gold Certification',
        '4.9/5 average customer rating'
      ]
    },
    {
      icon: Heart,
      title: 'Sustainable Tourism',
      description: 'Every adventure supports conservation efforts and local communities.',
      details: [
        '10% of profits go to conservation projects',
        'Employment for 200+ local community members',
        'Carbon offset programs for all tours',
        'Partnerships with wildlife conservation organizations'
      ]
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance before, during, and after your adventure.',
      details: [
        'Pre-trip planning and consultation',
        'Emergency support during tours',
        'Post-trip follow-up and assistance',
        'Multilingual customer service team'
      ]
    },
    {
      icon: Star,
      title: 'Personalized Experiences',
      description: 'Every tour is customized to match your interests, fitness level, and preferences.',
      details: [
        'Flexible itineraries and route options',
        'Dietary accommodations and special requests',
        'Private and group tour options',
        'Photography and special interest tours'
      ]
    }
  ];

  const comparisons = [
    {
      feature: 'Local Guides',
      us: 'Native Tanzanian experts',
      others: 'International guides'
    },
    {
      feature: 'Group Size',
      us: 'Small groups (max 12)',
      others: 'Large groups (20+)'
    },
    {
      feature: 'Success Rate',
      us: '98% summit success',
      others: '85% average'
    },
    {
      feature: 'Safety Record',
      us: 'Zero major incidents',
      others: 'Industry average'
    },
    {
      feature: 'Community Impact',
      us: '200+ local jobs created',
      others: 'Limited local involvement'
    },
    {
      feature: 'Conservation',
      us: '10% profits to conservation',
      others: 'Minimal contribution'
    }
  ];

  const testimonialHighlights = [
    {
      quote: "The level of professionalism and care was extraordinary. I felt safe every step of the way.",
      author: "Sarah Johnson, USA",
      tour: "Kilimanjaro Machame Route"
    },
    {
      quote: "Our guide's knowledge of wildlife behavior made our safari absolutely magical.",
      author: "Michael Chen, Canada",
      tour: "Serengeti Safari"
    },
    {
      quote: "The cultural experiences were authentic and respectful. Truly life-changing.",
      author: "Emma Wilson, UK",
      tour: "Cultural Village Tour"
    }
  ];

  const certifications = [
    'Tanzania Tourism Board Licensed',
    'IATA Certified Travel Agent',
    'Wilderness First Aid Certified',
    'Leave No Trace Certified',
    'ISO 14001 Environmental Management',
    'Fair Trade Tourism Certified'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/about"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to About</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Karibu Safariz?</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            With countless tour operators in Tanzania, here's what sets us apart and makes us the preferred choice for discerning travelers seeking authentic, safe, and transformative experiences.
          </p>
        </div>

        {/* Key Advantages */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Unique Advantages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Six compelling reasons why thousands of travelers trust us with their Tanzania adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                  <p className="text-gray-600 mb-4">{advantage.description}</p>
                  <ul className="space-y-2">
                    {advantage.details.map((detail, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Compare</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the difference that sets Karibu Safariz apart from other operators
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">Karibu Safariz</th>
                    <th className="px-6 py-4 text-left font-semibold">Other Operators</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((comparison, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{comparison.feature}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{comparison.us}</td>
                      <td className="px-6 py-4 text-gray-600">{comparison.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Testimonial Highlights */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Guests Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from travelers who chose Karibu Tours & Safariz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialHighlights.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-blue-600">{testimonial.tour}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Certifications & Licenses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our credentials demonstrate our commitment to excellence and industry standards
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Track Record</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Numbers that speak to our experience and commitment to excellence
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">5000+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white p-8 md:p-12 text-center">
          <Mountain className="h-16 w-16 mx-auto mb-6 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Karibu Tours & Safariz Difference
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who chose excellence, safety, and authenticity for their Tanzania adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Explore Our Tours
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;