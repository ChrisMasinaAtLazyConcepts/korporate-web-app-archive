import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ExternalLink, Building2, Star, MapPin, Users } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  website: string;
  location: string;
  since: string;
  projects: number;
  category: string;
  featured?: boolean;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample client data
  const sampleClients: Client[] = [
    {
      id: '1',
      name: 'Airports Company of South Africa',
      logo: './assets/images/clients/airports-company-south-africa.png',
      industry: 'Aviation',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Enterprise',
      featured: true
    },
    {
      id: '2',
       name: 'Cheil',
      logo: './assets/images/clients/Cheil.png',
      industry: 'Corporate Services',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Enterprise',
      featured: true
    },
    {
      id: '3',
      name: 'Chicken Lovers',
      logo: './assets/images/clients/Chicken.jpg',
      industry: 'Food and Beverages',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Food and Beverages',
      featured: true
    },
    {
      id: '4',
      name: 'CSOS',
      logo: './assets/images/clients/csos.jpg',
      industry: 'Government Services',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Government Services',
      featured: true
    },
    {
      id: '5',
      name: 'Samsung',
      logo: './assets/images/clients/samsung.png',
      industry: 'Electronics',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Electronics',
      featured: true
    },
    {
      id: '6',
      name: 'Mondelez',
      logo: './assets/images/clients/Mondelez.jpg',
      industry: 'Food and Beverages',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Food and Beverages',
      featured: true
    },
    {
      id: '7',
      name: 'Prasa',
      logo: './assets/images/clients/Prasa.png',
      industry: 'Transport and Logistics',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Transport and Logistics',
      featured: true
    },
    {
      id: '8',
      name: 'Queen Glow',
      logo: './assets/images/clients/Queen-Glow.jpg',
      industry: 'Beauty Products and Services',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Beauty Products and Services',
      featured: true
    },
    {
      id: '9',
      name: 'Sanpellegrino',
      logo: './assets/images/clients/sanpellegrino.png',
      industry: 'Food and Beverages',
      description: '',
      website: '',
      location: 'Johannesburg',
      since: '',
      projects: 24,
      category: 'Food and Beverages',
      featured: true
    }
  ];

  const categories = ['All', 'Enterprise', 'Government Services','Food and Beverages', 'Beauty Products and Services', 'Transport and Logistics', 'Electronics'];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setClients(sampleClients);
      setFilteredClients(sampleClients);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let results = clients;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      results = results.filter(client => client.category === selectedCategory);
    }

    setFilteredClients(results);
  }, [searchTerm, selectedCategory, clients]);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
  };

  const closeModal = () => {
    setSelectedClient(null);
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading our valued clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Clients</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Trusted by industry leaders and innovative brands worldwide. 
              Discover the amazing companies we've had the privilege to work with.
            </p>
            <div className="mt-8 flex justify-center items-center space-x-6 text-sm md:text-base">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>{clients.length}+ Clients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients by name, industry, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Client Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredClients.length} of {clients.length} clients
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Client Grid */}
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No clients found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                  >
                    <motion.div
                      className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300"
                      whileHover={{ y: -5 }}
                      onClick={() => handleClientClick(client)}
                    >
                      {/* Client Card */}
                      <div className="relative">
                        {/* Featured Badge */}
                        {client.featured && (
                          <div className="absolute top-4 left-4 z-10">
                           
                          </div>
                        )}

                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={client.logo}
                            alt={client.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="text-white text-center">
                              <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-semibold">View Details</p>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {client.name}
                            </h3>
                            {client.featured && (
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{client.location}</span>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {client.description}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                              {client.industry}
                            </span>
                           
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64">
                <img
                  src={selectedClient.logo}
                  alt={selectedClient.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold">{selectedClient.name}</h2>
                    {selectedClient.featured && (
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <p className="text-xl text-gray-200">{selectedClient.industry}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                 X 
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedClient.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedClient.category}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                   
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-gray-400" />
                     
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">About {selectedClient.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedClient.description}</p>
                </div>

                <div className="flex space-x-4">
                  <a
                    href={selectedClient.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                   
                  </a>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clients;