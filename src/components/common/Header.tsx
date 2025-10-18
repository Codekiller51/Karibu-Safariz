import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mountain, User, LogOut, ChevronDown, Phone, Mail, MapPin, Facebook, Instagram, Twitter, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleMobileSubmenu = (itemName: string) => {
    setExpandedMobile(expandedMobile === itemName ? null : itemName);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    {
      name: 'Safaris & Tours',
      href: '/tours',
      megaMenu: [
        {
          category: 'Kilimanjaro Climbing Packages',
          items: [
            { name: 'Machame Route (7 Days)', href: '/tours/mountain-climbing/machame' },
            { name: 'Marangu Route (6 Days)', href: '/tours/mountain-climbing/marangu' },
            { name: 'Lemosho Route (8 Days)', href: '/tours/mountain-climbing/lemosho' },
            { name: 'Rongai Route (7 Days)', href: '/tours/mountain-climbing/rongai' },
            { name: 'Northern Circuit (9 Days)', href: '/tours/mountain-climbing/northern' },
            { name: 'Umbwe Route (6 Days)', href: '/tours/mountain-climbing/umbwe' }
          ]
        },
        {
          category: 'Wildlife Safari',
          items: [
            { name: 'Serengeti National Park', href: '/tours/safari/serengeti' },
            { name: 'Ngorongoro Crater', href: '/tours/safari/ngorongoro' },
            { name: 'Tarangire National Park', href: '/tours/safari/tarangire' },
            { name: 'Lake Manyara', href: '/tours/safari/manyara' },
            { name: 'Ruaha National Park', href: '/tours/safari/ruaha' },
            { name: 'Selous Game Reserve', href: '/tours/safari/selous' }
          ]
        },
        {
          category: 'Day Trips & Safari Camps',
          items: [
            { name: 'Cultural Village Tours', href: '/tours/day-trips/cultural' },
            { name: 'Coffee Plantation Tours', href: '/tours/day-trips/coffee' },
            { name: 'Waterfall Hikes', href: '/tours/day-trips/waterfalls' },
            { name: 'Hot Springs', href: '/tours/day-trips/hot-springs' },
            { name: 'Maasai Boma Visit', href: '/tours/day-trips/maasai' }
          ]
        },
        {
          category: 'Zanzibar Trips',
          items: [
            { name: 'Stone Town Historical Tour', href: '/tours/zanzibar/stone-town' },
            { name: 'Spice Farm Tours', href: '/tours/zanzibar/spice' },
            { name: 'Beach Holiday Packages', href: '/tours/zanzibar/beach' },
            { name: 'Dolphin Tours', href: '/tours/zanzibar/dolphin' },
            { name: 'Prison Island', href: '/tours/zanzibar/prison-island' }
          ]
        }
      ]
    },
    {
      name: 'Destinations',
      href: '/destinations',
      megaMenu: [
        {
          category: 'Mountains & Peaks',
          items: [
            { name: 'Mount Kilimanjaro', href: '/destinations/mount-kilimanjaro' },
            { name: 'Mount Meru', href: '/destinations/mount-meru' },
            { name: 'Ol Doinyo Lengai', href: '/destinations/ol-doinyo-lengai' },
            { name: 'Mount Hanang', href: '/destinations/mount-hanang' }
          ]
        },
        {
          category: 'National Parks',
          items: [
            { name: 'Serengeti National Park', href: '/destinations/serengeti-national-park' },
            { name: 'Ngorongoro Crater', href: '/destinations/ngorongoro-crater' },
            { name: 'Tarangire National Park', href: '/destinations/tarangire-national-park' },
            { name: 'Lake Manyara National Park', href: '/destinations/lake-manyara-national-park' },
            { name: 'Arusha National Park', href: '/destinations/arusha-national-park' },
            { name: 'Ruaha National Park', href: '/destinations/ruaha-national-park' }
          ]
        },
        {
          category: 'Cultural & Historical',
          items: [
            { name: 'Stone Town, Zanzibar', href: '/destinations/stone-town-zanzibar' },
            { name: 'Maasai Villages', href: '/destinations/maasai-villages' },
            { name: 'Olduvai Gorge', href: '/destinations/olduvai-gorge' },
            { name: 'Bagamoyo Historical Town', href: '/destinations/bagamoyo' },
            { name: 'Kondoa Rock Art Sites', href: '/destinations/kondoa-rock-art' }
          ]
        },
        {
          category: 'Coastal & Islands',
          items: [
            { name: 'Zanzibar Beaches', href: '/destinations/zanzibar-beaches' },
            { name: 'Pemba Island', href: '/destinations/pemba-island' },
            { name: 'Mafia Island', href: '/destinations/mafia-island' },
            { name: 'Dar es Salaam Coast', href: '/destinations/dar-es-salaam-coast' },
            { name: 'Kilifi & Watamu', href: '/destinations/kilifi-watamu' }
          ]
        }
      ]
    },
    {
      name: 'About Us',
      href: '/about',
      dropdown: [
        { name: 'Our Story', href: '/about/story' },
        { name: 'Our Team', href: '/about/team' },
        { name: 'Why Choose Us', href: '/about/why-choose-us' },
        { name: 'Testimonials', href: '/about/testimonials' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Certifications', href: '/about/certifications' }
      ]
    },
    {
      name: 'Travel Info',
      href: '/travel-info', 
      dropdown: [
        { name: 'Essential Travel Tips', href: '/travel-info/essential-travel-tips-tanzania' },
        { name: 'Packing Guide', href: '/travel-info/packing-guide-tanzania' },
        { name: 'Visa & Entry Requirements', href: '/travel-info/tanzania-visa-entry-requirements' },
        { name: 'Best Time to Visit', href: '/travel-info/best-time-visit-tanzania' },
        { name: 'Health & Safety', href: '/travel-info/health-safety-tanzania' },
        { name: 'Currency & Payments', href: '/travel-info/currency-payments-tanzania' },
        { name: 'Weather Information', href: '/travel-info/tanzania-weather-climate' }
      ]
    },
    { name: 'Contact Us', href: '/contact' }
  ];

  return (
    <>
      {/* Top Contact Bar - Hidden when scrolled */}
      <div className={`bg-gray-900 text-white py-2 text-sm transition-all duration-300 ${
        isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+255 123 456 789</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@kilimanjarogates.com</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Arusha, Tanzania</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>WhatsApp</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-orange-400 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg top-0' 
          : 'bg-white/95 backdrop-blur-sm top-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://kilimanjarogates.com/logo.png" 
                alt="KG Logo" 
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">
                Karibu Safariz
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.megaMenu || item.dropdown ? (
                    <div className="relative">
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-1 py-2 transition-colors duration-200 ${
                          location.pathname.startsWith(item.href) && item.href !== '/'
                            ? 'text-orange-600 font-semibold border-b-2 border-orange-600'
                            : location.pathname === item.href && item.href === '/'
                            ? 'text-orange-600 font-semibold border-b-2 border-orange-600'
                            : 'text-gray-700 hover:text-orange-600'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                      </Link>

                      {/* Mega Menu */}
                      {item.megaMenu && (
                        <div className="absolute top-full left-0 mt-0 w-screen max-w-4xl bg-white rounded-lg shadow-2xl border border-gray-200 py-8 px-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {item.megaMenu.map((section, index) => (
                              <div key={index}>
                                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide border-b border-orange-200 pb-2">
                                  {section.category}
                                </h3>
                                <div className="space-y-2">
                                  {section.items.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      to={subItem.href}
                                      className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Featured Call-to-Action */}
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">Need Help Planning?</h4>
                                <p className="text-sm text-gray-600">Speak with our travel experts</p>
                              </div>
                              <Link
                                to="/contact"
                                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
                              >
                                Contact Us
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Regular Dropdown */}
                      {item.dropdown && (
                        <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                          <div className="px-4">
                            {item.dropdown.map((subItem, index) => (
                              <Link
                                key={index}
                                to={subItem.href}
                                className="block px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`py-2 transition-colors duration-200 ${
                        location.pathname === item.href
                          ? 'text-orange-600 font-semibold border-b-2 border-orange-600'
                          : 'text-gray-700 hover:text-orange-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-orange-600"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Book your trip
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.href}
                        className={`flex-1 block px-3 py-2 text-base font-medium ${
                          location.pathname === item.href
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                        onClick={() => {
                          if (!item.megaMenu && !item.dropdown) {
                            setIsMenuOpen(false);
                          }
                        }}
                      >
                        {item.name}
                      </Link>
                      
                      {/* Mobile Submenu Toggle */}
                      {(item.megaMenu || item.dropdown) && (
                        <button
                          onClick={() => toggleMobileSubmenu(item.name)}
                          className="px-3 py-2 text-gray-500 hover:text-orange-600"
                        >
                          <ChevronRight className={`h-5 w-5 transition-transform ${
                            expandedMobile === item.name ? 'rotate-90' : ''
                          }`} />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Submenu */}
                    {expandedMobile === item.name && (item.megaMenu || item.dropdown) && (
                      <div className="pl-4 space-y-1 bg-gray-50">
                        {item.megaMenu && item.megaMenu.map((section, index) => (
                          <div key={index}>
                            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {section.category}
                            </div>
                            {section.items.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                        
                        {item.dropdown && item.dropdown.map((subItem, index) => (
                          <Link
                            key={index}
                            to={subItem.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="border-t pt-2">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2 text-base font-medium text-white bg-orange-600 hover:bg-orange-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Book your trip
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;