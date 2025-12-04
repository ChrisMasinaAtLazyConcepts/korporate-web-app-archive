import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentWorks: React.FC = () => {
  const [expandedWork, setExpandedWork] = useState<number | null>(null);

  const works = [
    {
      client: 'Sterkinekor',
      project: 'Wicked Movie Premiere',
      image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      brief: 'Branding Support for Wicked Movie Premiere',
      description: "We're thrilled to have brought the magic of Wicked to life for the premiere! Our team delivered an enchanting set of branding elements that set the perfect tone for the evening. From a bold wall banner that instantly immersed guests in the world of Oz, to custom-designed popcorn boxes that added a magical touch to every snack – every detail was crafted with the Wicked experience in mind. We also rolled out cinema posters that amplified anticipation and photo-ready queue panels that guided attendees through the venue in true premiere style. It was a spellbinding production from start to finish – and we're proud to have helped turn the cinema into a scene straight out of Wicked.",
    },
    {
      client: 'Samsung',
      project: 'Product Launch Campaign',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      brief: 'Global Product Launch Strategy',
      description: 'Executed a comprehensive global product launch campaign for Samsung\'s latest innovation. Our strategic approach included multi-channel marketing, influencer partnerships, and immersive brand experiences across key markets. The campaign generated significant buzz and exceeded engagement targets by 150%.',
    },
    {
      client: 'Tech Startup',
      project: 'Brand Identity & Digital Presence',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      brief: 'Complete Brand Transformation',
      description: 'Developed a complete brand identity and digital presence for an emerging tech startup. From logo design to website development, social media strategy, and content creation, we provided end-to-end solutions that positioned the client as an industry leader.',
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedWork(expandedWork === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Recent Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Showcasing our latest creative solutions and successful partnerships
          </p>
        </motion.div>

        <div className="space-y-8">
          {works.map((work, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={work.image}
                    alt={work.project}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{work.client}</h3>
                      <p className="text-lg text-blue-600 font-semibold">{work.brief}</p>
                    </div>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                      <Link to="/gallery" className="text-gray-600 hover:text-gray-900">
                        See Details
                      </Link>
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedWork === index ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-600 leading-relaxed mb-4">{work.description}</p>
                      </motion.div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {work.description.substring(0, 150)}...
                      </p>
                    )}
                  </AnimatePresence>
                  
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {expandedWork === index ? 'Show Less' : 'Read More'}
                    </span>
                    {expandedWork === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentWorks;