import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, CheckCircle, AlertTriangle, Info, Share2, Bookmark, Printer as Print, Download } from 'lucide-react';

const TravelInfoDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock travel info data - in real app, this would come from your database
  const travelInfo = {
    id: '1',
    title: 'Essential Travel Tips for Tanzania',
    slug: 'essential-travel-tips-tanzania',
    category: 'tips',
    content: `Tanzania is an incredible destination that offers diverse experiences from mountain climbing to wildlife safaris. Here are essential tips to make your journey memorable and smooth.

## Cultural Etiquette

Understanding and respecting local customs will enhance your experience and help you connect with Tanzanian people:

**Greetings and Communication:**
- Greet people with "Jambo" (Hello) or "Hujambo" (How are you?)
- "Asante" means thank you and is always appreciated
- "Karibu" means welcome - you'll hear this often
- Learn basic Swahili phrases - locals appreciate the effort
- English is widely spoken in tourist areas

**Dress Code and Behavior:**
- Dress modestly, especially in rural areas and Stone Town
- Cover shoulders and knees when visiting religious sites
- Remove shoes when entering homes or mosques
- Use your right hand for greetings and eating (left hand is considered unclean)
- Ask permission before photographing people
- Avoid public displays of affection

## General Travel Tips

**Transportation:**
- Book domestic flights in advance for better prices
- Use reputable tour operators for safaris
- Dalla-dallas (local buses) are cheap but crowded and can be uncomfortable
- Negotiate taxi prices beforehand or use ride-hailing apps in cities
- Road conditions can be challenging during rainy season
- Allow extra time for travel between destinations

**Money Matters:**
- Carry cash as many places don't accept cards
- US dollars are widely accepted for tourism services
- Negotiate prices at markets but be respectful
- Tip guides and service staff appropriately (10-15%)
- Keep small denominations for tips and small purchases

**Health and Safety:**
- Stay hydrated and protect yourself from the sun
- Use insect repellent, especially at dawn and dusk
- Drink bottled or purified water
- Be cautious with street food if you have a sensitive stomach
- Keep copies of important documents
- Register with your embassy

**Communication and Internet:**
- Local SIM cards are cheap and widely available
- WiFi is available in most hotels and restaurants
- WhatsApp is commonly used for communication
- Download offline maps before traveling to remote areas

## Practical Advice

**Packing Essentials:**
- Lightweight, breathable clothing in neutral colors
- Comfortable walking shoes and sandals
- Hat, sunglasses, and sunscreen
- Insect repellent and basic first aid kit
- Power adapter (Type G plugs)
- Portable charger for long safari days

**Cultural Sensitivity:**
- Be patient - "pole pole" (slowly slowly) is the Tanzanian way
- Respect local customs and traditions
- Support local businesses and communities
- Be mindful of photography, especially of people
- Learn about local history and culture

**Safari Specific Tips:**
- Wear neutral colors (khaki, olive, brown)
- Avoid bright colors and white (attracts insects)
- Bring binoculars and camera with extra batteries
- Follow your guide's instructions at all times
- Maintain distance from wildlife
- Don't feed animals or litter

## Regional Considerations

**Northern Circuit (Arusha, Serengeti, Ngorongoro):**
- Most developed tourism infrastructure
- Higher prices but better services
- Book accommodations well in advance
- Best for first-time visitors

**Southern Circuit (Selous, Ruaha):**
- More remote and less crowded
- Better value for money
- Requires more planning
- Ideal for experienced travelers

**Coastal Areas (Dar es Salaam, Zanzibar):**
- More conservative dress code
- Respect Islamic customs
- Bargaining is expected in markets
- Beach safety - check local conditions

## Final Tips

- Travel insurance is essential
- Respect wildlife and natural environments
- Support conservation efforts
- Be flexible with your itinerary
- Embrace the adventure and unexpected moments
- Connect with local people - they're incredibly welcoming`,
    excerpt: 'Everything you need to know for a successful trip to Tanzania, from cultural etiquette to practical advice.',
    featured_image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tags: ['Culture', 'Etiquette', 'Transportation', 'Communication', 'Safety', 'Practical'],
    quick_facts: [
      { label: 'Official Languages', value: 'Swahili & English', icon: '🗣️' },
      { label: 'Time Zone', value: 'EAT (UTC+3)', icon: '🕐' },
      { label: 'Electricity', value: '230V, Type G plugs', icon: '🔌' },
      { label: 'Tipping', value: '10-15% recommended', icon: '💰' },
      { label: 'Currency', value: 'Tanzanian Shilling (TZS)', icon: '💱' },
      { label: 'Emergency Number', value: '112 or 999', icon: '🚨' }
    ],
    checklist_items: [
      'Learn basic Swahili greetings',
      'Pack modest clothing',
      'Bring cash in USD and local currency',
      'Download offline maps',
      'Get local SIM card',
      'Respect local customs',
      'Use insect repellent',
      'Stay hydrated',
      'Tip service staff appropriately',
      'Be patient and flexible'
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: travelInfo.title,
        text: travelInfo.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Travel Info</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <img
            src={travelInfo.featured_image}
            alt={travelInfo.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Updated {formatDate(travelInfo.updated_at)}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 text-sm"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 text-sm"
                >
                  <Print className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {travelInfo.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {travelInfo.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {travelInfo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="prose max-w-none">
                {travelInfo.content.split('\n\n').map((section, index) => {
                  if (section.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-orange-200 pb-2">
                        {section.replace('## ', '')}
                      </h2>
                    );
                  } else if (section.startsWith('**') && section.endsWith(':**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                        {section.replace(/\*\*/g, '')}
                      </h3>
                    );
                  } else {
                    return (
                      <div key={index} className="mb-4">
                        {section.split('\n').map((line, lineIndex) => {
                          if (line.startsWith('- ')) {
                            return (
                              <div key={lineIndex} className="flex items-start space-x-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{line.replace('- ', '')}</span>
                              </div>
                            );
                          } else if (line.trim()) {
                            return (
                              <p key={lineIndex} className="text-gray-700 leading-relaxed mb-2">
                                {line}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                {travelInfo.quick_facts.map((fact, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{fact.icon}</span>
                      <span className="text-gray-600 text-sm">{fact.label}:</span>
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist */}
            {travelInfo.checklist_items && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Essential Checklist</span>
                </h3>
                <div className="space-y-2">
                  {travelInfo.checklist_items.map((item, index) => (
                    <label key={index} className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-blue-800 text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-yellow-900">Important Notice</h3>
              </div>
              <p className="text-yellow-800 text-sm">
                Travel requirements and conditions can change. Always check the latest information 
                from official sources before your trip.
              </p>
            </div>

            {/* Related Links */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Information</h3>
              <div className="space-y-3">
                <Link
                  to="/travel-info/packing-guide-tanzania"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">Packing Guide</div>
                  <div className="text-gray-600 text-xs">What to bring for your Tanzania trip</div>
                </Link>
                <Link
                  to="/travel-info/health-safety-tanzania"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">Health & Safety</div>
                  <div className="text-gray-600 text-xs">Stay healthy and safe during your visit</div>
                </Link>
                <Link
                  to="/travel-info/currency-payments-tanzania"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">Currency Guide</div>
                  <div className="text-gray-600 text-xs">Money matters and payment methods</div>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/contact"
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-center block"
                >
                  Need More Help?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelInfoDetail;