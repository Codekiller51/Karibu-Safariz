import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedTours from '../components/home/FeaturedTours';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedTours />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
};

export default Home;