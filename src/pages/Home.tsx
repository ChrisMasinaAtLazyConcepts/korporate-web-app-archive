import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import RecentWorks from '../components/RecentWorks';
import GlobalMap from '../components/GlobalMap';
import ContactForm from '../components/ContactForm';
import VideoPlayer from '../components/VideoPlayer';

const Home: React.FC = () => {
  return (
    <div className="pt-1">
      <Hero />
      <AboutSection />
      <ServicesSection />
      <RecentWorks />
      <GlobalMap />
      <ContactForm />
    </div>
  );
};

export default Home;