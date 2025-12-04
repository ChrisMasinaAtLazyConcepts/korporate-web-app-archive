import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Palette, Megaphone, CheckCircle } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Calendar,
      title: 'Events & Activations',
      description: 'Creating memorable experiences that captivate and engage your audience through innovative event planning and brand activations.',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Corporate Events',
        'Product Launches',
        'Brand Activations',
        'Experiential Marketing',
        'Trade Shows',
        'Conference Management',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Strategy & Logistics',
      description: 'Comprehensive strategic planning and logistics management to ensure your campaigns run smoothly and deliver maximum impact.',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Strategic Planning',
        'Campaign Management',
        'Logistics Coordination',
        'Performance Analytics',
        'Market Research',
        'Competitive Analysis',
      ],
    },
    {
      icon: Palette,
      title: 'Creative Solutions',
      description: 'Innovative creative solutions that bring your brand vision to life through compelling design and storytelling.',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Brand Design',
        'Creative Direction',
        'Content Creation',
        'Visual Identity',
        'Graphic Design',
        'Video Production',
      ],
    },
    {
      icon: Megaphone,
      title: 'Digital Marketing',
      description: 'Data-driven digital marketing strategies that amplify your brand presence and drive meaningful engagement.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: [
        'Social Media Marketing',
        'Content Strategy',
        'SEO Optimization',
        'Paid Advertising',
        'Email Marketing',
        'Influencer Partnerships',
      ],
    },
  ];

  return (
    <div className="pt-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive marketing solutions designed to transform your business and captivate your audience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Let's discuss how our services can help you achieve your business goals and create lasting impact.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;