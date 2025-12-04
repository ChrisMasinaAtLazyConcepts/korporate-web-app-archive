import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const SocialButtons: React.FC = () => {
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/Korporate-Apothecary-1457361754372325/', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://www.instagram.com/korporateapothecary/?hl=en', label: 'Instagram', color: 'hover:text-pink-600' },
  ];

  return (
    <div className="flex justify-center space-x-6">
      {socialLinks.map((social, index) => (
        <motion.a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-400 ${social.color} transition-colors duration-200`}
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <social.icon className="w-6 h-6" />
          <span className="sr-only">{social.label}</span>
        </motion.a>
      ))}
    </div>
  );
};

export default SocialButtons;