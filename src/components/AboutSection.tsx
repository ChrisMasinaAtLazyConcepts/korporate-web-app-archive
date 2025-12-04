import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Award } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Strategic Focus',
      description: 'We blend strategy and innovation to craft tailored remedies that grow and transform businesses.',
    },
    {
      icon: Users,
      title: 'Creative Partnership',
      description: 'Bold, independent, and driven by innovation, we are your creative growth partners.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Driven',
      description: 'Combining professionalism with passion for diversity, integrity, and uncompromising quality.',
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Proactive, agile, and reliable solutions designed to captivate your audience and deliver real results.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
         
            <br/>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Who we are
          </h2>
         
        
      <VideoPlayer videoUrl='blob:https://www.veed.io/aa335972-d4e7-4ddb-990e-c4b3dc00d21a'/>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A term we use to describe creative alchemist of brand solutions — blending strategy and innovation to craft
            tailored remedies that grow and transform businesses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16"
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            At Korporate Apothecary, we're not just a marketing agency — we're your creative growth partners. 
            Bold, independent, and driven by innovation, we craft tailored marketing solutions that move your 
            business forward. We believe in putting you at the center of everything we do, combining 
            professionalism with a passion for diversity, integrity, and uncompromising quality. From marketing 
            to events, we offer proactive, agile, and reliable solutions designed to captivate your audience 
            and deliver real results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;