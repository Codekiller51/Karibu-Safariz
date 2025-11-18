import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { db } from '../../lib/supabase';

const HeroNew: React.FC = () => {
  const [searchForm, setSearchForm] = React.useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '1'
  });
  const [destinations, setDestinations] = React.useState<{ value: string; label: string }[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await db.getTourPackages();
        if (error) throw error;

        const uniqueDestinations = Array.from(new Set(data?.map(tour => tour.category) || []))
          .map(category => ({
            value: category,
            label: category === 'mountain-climbing' ? 'Mount Kilimanjaro' :
                   category === 'safari' ? 'Safari Parks' :
                   category === 'day-trips' ? 'Day Trips' : category
          }));

        setDestinations(uniqueDestinations);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setDestinations([
          { value: 'mountain-climbing', label: 'Mount Kilimanjaro' },
          { value: 'safari', label: 'Safari Parks' },
          { value: 'day-trips', label: 'Day Trips' }
        ]);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const searchParams = new URLSearchParams();

      if (searchForm.destination) {
        searchParams.set('category', searchForm.destination);
      }

      if (searchForm.checkIn) {
        searchParams.set('from', searchForm.checkIn);
      }

      if (searchForm.checkOut) {
        searchParams.set('to', searchForm.checkOut);
      }

      if (searchForm.guests) {
        searchParams.set('guests', searchForm.guests);
      }

      const searchQuery = searchParams.toString();
      if (searchForm.destination) {
        navigate(`/tours/${searchForm.destination}${searchQuery ? `?${searchQuery}` : ''}`);
      } else {
        navigate(`/tours${searchQuery ? `?${searchQuery}` : ''}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="relative min-h-screen pt-16 flex flex-col items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Discover. Explore. Go!
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Unlock stunning travel experiences and make unforgettable memories on your journey.
        </p>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Destination */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Destination
              </label>
              <div className="relative">
                <select
                  value={searchForm.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="">Choose a place</option>
                  {destinations.map((dest) => (
                    <option key={dest.value} value={dest.value}>
                      {dest.label}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none mt-3" />
              </div>
            </div>

            {/* Check-in Date */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Check In
              </label>
              <input
                type="date"
                value={searchForm.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Check-out Date */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Check Out
              </label>
              <input
                type="date"
                value={searchForm.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                min={searchForm.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Guests */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Guests
              </label>
              <div className="relative">
                <select
                  value={searchForm.guests}
                  onChange={(e) => handleInputChange('guests', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none mt-3" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">{isSearching ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </form>

          {/* Quick Search */}
          <div className="pt-4 border-t border-gray-200 text-left">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Kilimanjaro', 'Safari', 'Day Trips', 'Beach'].map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => {
                    const dest = search === 'Kilimanjaro' ? 'mountain-climbing' :
                                 search === 'Safari' ? 'safari' :
                                 search === 'Day Trips' ? 'day-trips' : '';
                    handleInputChange('destination', dest);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroNew;
