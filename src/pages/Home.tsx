import React from 'react';
import FeaturedTripsSlider from '../components/home/FeaturedTripsSlider';
import TrustBadges from '../components/common/TrustBadges';
import PopularLocations from '../components/home/PopularLocations';
import BookYourTrip from '../components/home/BookYourTrip';
import LastMinuteDeals from '../components/home/LastMinuteDeals';
import SpecialTrips from '../components/home/SpecialTrips';
import TourGallery from '../components/home/TourGallery';
import CTABanner from '../components/home/CTABanner';
import Testimonials from '../components/home/Testimonials';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <FeaturedTripsSlider />
      <TrustBadges />
      <PopularLocations />
      <BookYourTrip />
      <LastMinuteDeals />
      <SpecialTrips />
      <TourGallery />
      <div className="py-8 md:py-12">
        <CTABanner
          title="Ready for your Next Adventure"
          subtitle="Book now and start your unforgettable journey"
          backgroundImage="https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          ctaText="Explore Now"
          ctaLink="/tours"
        />
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;