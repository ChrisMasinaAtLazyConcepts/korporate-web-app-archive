import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Upload, X, Folder, Image as ImageIcon, Search, Filter, Calendar, Building, Tag, Download, User, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

interface GalleryItem {
  viewed: any;
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  folder?: string;
  service_type?: string;
  company_name?: string;
  uploaded_by?: string;
  tags?: string[];
  file_size?: number;
  file_type?: string;
  rating?: number;
}

// Folder structure with sample images
const folderData = {
  'Annual Reports': [
    './assets/images/wetransfer_website_2025-09-18_1414/website/Annual Reports/GVfy86fW4AAFn5n.jpg',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ],
  'Signage': [
    'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ],
  'Website Executive Gift': [
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ],
  'Website Laptop Bags': [
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ],
  'Website Stationery': [
    'https://images.pexels.com/photos/316466/pexels-photo-316466.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ],
  'Website T Shirts': [
    'https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ],
  'Website Water Bottles': [
    'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos-2748756/pexels-photo-2748756.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ]
};

// Sample service types and companies for dropdowns
const serviceTypes = [
  'Events & Activations',
  'Strategy & Logistics',
  'Creative Solutions',
  'Digital Marketing',
  'Brand Development',
  'Print Design',
  'Web Design',
  'Social Media'
];

const companyNames = [
  'Sterkinekor',
  'Samsung',
  'Nando\'s',
  'MTN',
  'Vodacom',
  'Standard Bank',
  'Nedbank',
  'Absa'
];

const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploads, setUploads] = useState<GalleryItem[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // View All Popup States
  const [showViewAllPopup, setShowViewAllPopup] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string>('Annual Reports');
  const [currentFolderImageIndex, setCurrentFolderImageIndex] = useState(0);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

const [showServicePopup, setShowServicePopup] = useState(false);
const [serviceUploads, setServiceUploads] = useState<GalleryItem[]>([]);
const [serviceSearchTerm, setServiceSearchTerm] = useState('');
const [serviceSortBy, setServiceSortBy] = useState('newest');
const [selectedServiceItems, setSelectedServiceItems] = useState<string[]>([]);

const [showAllUploadsPopup, setShowAllUploadsPopup] = useState(false);
const [allUploadsSearchTerm, setAllUploadsSearchTerm] = useState('');
const [allUploadsServiceFilter, setAllUploadsServiceFilter] = useState('');
const [allUploadsStatusFilter, setAllUploadsStatusFilter] = useState('');
const [selectedAllItems, setSelectedAllItems] = useState<string[]>([]);

  // Default gallery items with enhanced metadata
  const defaultGallery: GalleryItem[] = [
    {
      id: '1',
      file_name: 'Sterkinekor Wicked Premiere',
      file_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      created_at: '2024-01-15',
      folder: 'Annual Reports',
      service_type: 'Events & Activations',
      company_name: 'Sterkinekor',
      uploaded_by: 'Sarah Johnson',
      tags: ['premiere', 'red-carpet', 'entertainment'],
      file_size: 2450000,
      file_type: 'image/jpeg',
      rating: 5,
      viewed: false
    },
    {
      id: '2',
      file_name: 'Samsung Product Launch',
      file_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      created_at: '2024-01-10',
      folder: 'Signage',
      service_type: 'Events & Activations',
      company_name: 'Samsung',
      uploaded_by: 'Mike Chen',
      tags: ['tech', 'launch', 'innovation'],
      file_size: 3100000,
      file_type: 'image/jpeg',
      rating: 4,
      viewed: false
    },
    {
      id: '3',
      file_name: 'Creative Brand Campaign',
      file_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      created_at: '2024-01-08',
      folder: 'Website Executive Gift',
      service_type: 'Creative Solutions',
      company_name: 'Nando\'s',
      uploaded_by: 'Emma Davis',
      tags: ['branding', 'creative', 'campaign'],
      file_size: 1890000,
      file_type: 'image/jpeg',
      rating: 5,
      viewed: true
    },
    {
      id: '4',
      file_name: 'Event Activation',
      file_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      created_at: '2024-01-05',
      folder: 'Website Laptop Bags',
      service_type: 'Events & Activations',
      company_name: 'MTN',
      uploaded_by: 'David Brown',
      tags: ['activation', 'event', 'engagement'],
      file_size: 2750000,
      file_type: 'image/jpeg',
      rating: 4,
      viewed: true
    },
    {
      id: '5',
      file_name: 'Digital Marketing Campaign',
      file_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      created_at: '2024-01-03',
      folder: 'Website Stationery',
      service_type: 'Digital Marketing',
      company_name: 'Vodacom',
      uploaded_by: 'Lisa Wang',
      tags: ['digital', 'marketing', 'online'],
      file_size: 2200000,
      file_type: 'image/jpeg',
      rating: 3,
      viewed: false
    },
    {
      id: '6',
      file_name: 'Brand Strategy Workshop',
      file_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      created_at: '2024-01-01',
      folder: 'Website T Shirts',
      service_type: 'Strategy & Logistics',
      company_name: 'Standard Bank',
      uploaded_by: 'James Wilson',
      tags: ['strategy', 'workshop', 'planning'],
      file_size: 1980000,
      file_type: 'image/jpeg',
      rating: 5,
      viewed: false
    }
  ];

  useEffect(() => {
    fetchUploads();
    checkUser();
  }, []);

  useEffect(() => {
    filterUploads();
  }, [uploads, searchTerm, selectedServiceType, selectedCompany, dateFrom, dateTo, selectedFolder, minRating, sortBy]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Combine default gallery with user uploads
      const allUploads = [...defaultGallery, ...(data || [])];
      setUploads(allUploads);
      setFilteredUploads(allUploads);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      // Use default gallery if database fetch fails
      setUploads(defaultGallery);
      setFilteredUploads(defaultGallery);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUploads = () => {
    let filtered = [...uploads];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.uploaded_by?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Service type filter
    if (selectedServiceType) {
      filtered = filtered.filter(item => item.service_type === selectedServiceType);
    }

    // Company filter
    if (selectedCompany) {
      filtered = filtered.filter(item => item.company_name === selectedCompany);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(item => new Date(item.created_at) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(item => new Date(item.created_at) <= new Date(dateTo));
    }

    // Folder filter
    if (selectedFolder) {
      filtered = filtered.filter(item => item.folder === selectedFolder);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(item => (item.rating || 0) >= minRating);
    }

    // Sort results
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.file_name.localeCompare(b.file_name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'size':
        filtered.sort((a, b) => (b.file_size || 0) - (a.file_size || 0));
        break;
    }

    setFilteredUploads(filtered);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('File size must be less than 3MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('uploads')
        .insert([
          {
            user_id: user.id,
            file_name: selectedFile.name,
            file_url: publicUrl,
            file_size: selectedFile.size,
            file_type: selectedFile.type,
          },
        ]);

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully!');
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchUploads();
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

const openServicePopup = (service: string) => {
  setSelectedServiceType(service);
  const filtered = uploads.filter(u => u.service_type === service);
  setServiceUploads(filtered);
  setShowServicePopup(true);
};

const openAllUploadsPopup = () => {
  setShowAllUploadsPopup(true);
};

const markAllAsViewed = () => {
  setUploads(prev => prev.map(u => ({ ...u, viewed: true })));
  toast.success('All items marked as viewed');
};

const toggleServiceItemSelection = (id: string) => {
  setSelectedServiceItems(prev =>
    prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
};

const toggleAllItemSelection = (id: string) => {
  setSelectedAllItems(prev =>
    prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
};

const markSelectedAsViewed = () => {
  setUploads(prev => prev.map(u =>
    selectedServiceItems.includes(u.id) ? { ...u, viewed: true } : u
  ));
  setSelectedServiceItems([]);
  toast.success('Selected items marked as viewed');
};

const markAllSelectedAsViewed = () => {
  setUploads(prev => prev.map(u =>
    selectedAllItems.includes(u.id) ? { ...u, viewed: true } : u
  ));
  setSelectedAllItems([]);
  toast.success('Selected items marked as viewed');
};

const downloadSelected = () => {
  selectedServiceItems.forEach(id => {
    const item = uploads.find(u => u.id === id);
    if (item) {
      downloadImage(item.file_url, item.file_name);
    }
  });
  toast.success(`Downloading ${selectedServiceItems.length} files`);
};

const downloadAllSelected = () => {
  selectedAllItems.forEach(id => {
    const item = uploads.find(u => u.id === id);
    if (item) {
      downloadImage(item.file_url, item.file_name);
    }
  });
  toast.success(`Downloading ${selectedAllItems.length} files`);
};

const viewImage = (item: GalleryItem) => {
  const index = uploads.findIndex(u => u.id === item.id);
  if (index !== -1) {
    setCurrentIndex(index);
    setUploads(prev => prev.map(u => u.id === item.id ? { ...u, viewed: true } : u));
  }
};

// Add filtered arrays for popups
const filteredServiceUploads = serviceUploads
  .filter(item => 
    item.file_name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    item.company_name?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  )
  .sort((a, b) => {
    switch (serviceSortBy) {
      case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'name': return a.file_name.localeCompare(b.file_name);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

const filteredAllUploads = uploads
  .filter(item => 
    item.file_name.toLowerCase().includes(allUploadsSearchTerm.toLowerCase()) ||
    item.company_name?.toLowerCase().includes(allUploadsSearchTerm.toLowerCase()) ||
    item.service_type?.toLowerCase().includes(allUploadsSearchTerm.toLowerCase())
  )
  .filter(item => 
    !allUploadsServiceFilter || item.service_type === allUploadsServiceFilter
  )
  .filter(item => {
    if (!allUploadsStatusFilter) return true;
    if (allUploadsStatusFilter === 'new') return !item.viewed;
    if (allUploadsStatusFilter === 'viewed') return item.viewed;
    return true;
  })
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredUploads.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredUploads.length) % filteredUploads.length);
  };

  // View All Popup Functions
  const openViewAllPopup = () => {
    setShowViewAllPopup(true);
    setActiveFolder('Annual Reports');
    setCurrentFolderImageIndex(0);
  };

  const closeViewAllPopup = () => {
    setShowViewAllPopup(false);
  };

  const nextFolderImage = () => {
    setCurrentFolderImageIndex(prev => 
      prev === folderData[activeFolder as keyof typeof folderData].length - 1 ? 0 : prev + 1
    );
  };

  const prevFolderImage = () => {
    setCurrentFolderImageIndex(prev => 
      prev === 0 ? folderData[activeFolder as keyof typeof folderData].length - 1 : prev - 1
    );
  };

  const handleFolderChange = (folderName: string) => {
    setActiveFolder(folderName);
    setCurrentFolderImageIndex(0);
  };

  const currentFolderImages = folderData[activeFolder as keyof typeof folderData] || [];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedServiceType('');
    setSelectedCompany('');
    setDateFrom('');
    setDateTo('');
    setSelectedFolder('');
    setMinRating(0);
    setSortBy('newest');
  };

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-1">
      {/* Hero Section */}
      <section className="py-20 bg-black bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Gallery</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Showcasing our creative work and customer artwork uploads
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {user && (
                <motion.button
                  onClick={() => setShowUploadModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Artwork</span>
                </motion.button>
              )}
              <motion.button
                onClick={openViewAllPopup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
              >
                <Folder className="w-5 h-5" />
                <span>View All Categories</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

     {/* Main Content with Sidebar */}
<section className="py-8 bg-gray-50 min-h-screen">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar */}
      <div className="lg:w-80 flex-shrink-0 space-y-6">
       

        {/* Inbox Dashboard */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          
          <div className="flex items-center justify-between mb-4">
            
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>Uploads Inbox</span>
            </h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              Live
            </span>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">New Uploads</span>
                <span className="bg-blue-600 text-white text-xs px-1 rounded">{uploads.filter(u => !u.viewed).length}</span>
              </div>
              <p className="text-lg font-bold text-blue-800">{uploads.filter(u => !u.viewed).length}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600 font-medium">Viewed</span>
                <span className="bg-green-600 text-white text-xs px-1 rounded">{uploads.filter(u => u.viewed).length}</span>
              </div>
              <p className="text-lg font-bold text-green-800">{uploads.filter(u => u.viewed).length}</p>
            </div>
          </div>

          {/* Service Type Breakdown */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Uploads by Service Type</h4>
            <div className="space-y-2">
              {serviceTypes.map(service => {
                const count = uploads.filter(u => u.service_type === service).length;
                const newCount = uploads.filter(u => u.service_type === service && !u.viewed).length;
                if (count === 0) return null;
                
                return (
                  <button
                    key={service}
                    onClick={() => openServicePopup(service)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">{service}</span>
                      {newCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1 rounded">{newCount}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{count}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <button 
              onClick={markAllAsViewed}
              className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors mb-2"
            >
              Mark All as Viewed
            </button>
            <button 
              onClick={openAllUploadsPopup}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View All Uploads
            </button>
          </div>
        </div>
         {/* Search Sidebar */}
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Search Gallery</span>
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Filters"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search artwork..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              {filteredUploads.length} of {uploads.length} items found
            </p>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* ... (existing filter code remains the same) ... */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Gallery Content */}
      {/* Gallery Content */}
<div className="flex-1">
  {filteredUploads.length > 0 ? (
    <div className="relative">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
      >
        <img
          src={filteredUploads[currentIndex].file_url}
          alt={filteredUploads[currentIndex].file_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{filteredUploads[currentIndex].file_name}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {filteredUploads[currentIndex].service_type && (
              <span className="px-2 py-1 bg-blue-600 rounded-full text-xs">
                {filteredUploads[currentIndex].service_type}
              </span>
            )}
            {filteredUploads[currentIndex].company_name && (
              <span className="px-2 py-1 bg-green-600 rounded-full text-xs">
                {filteredUploads[currentIndex].company_name}
              </span>
            )}
            {filteredUploads[currentIndex].rating && (
              <span className="px-2 py-1 bg-yellow-600 rounded-full text-xs flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {filteredUploads[currentIndex].rating}
              </span>
            )}
          </div>
          <p className="text-gray-200">
            {new Date(filteredUploads[currentIndex].created_at).toLocaleDateString()}
            {filteredUploads[currentIndex].uploaded_by && (
              <span className="ml-2">• Uploaded by {filteredUploads[currentIndex].uploaded_by}</span>
            )}
          </p>
        </div>
        <button
          onClick={() => downloadImage(filteredUploads[currentIndex].file_url, filteredUploads[currentIndex].file_name)}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-all"
          title="Download Image"
        >
          <Download className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Thumbnails */}
      <div className="flex justify-center mt-8 space-x-2 overflow-x-auto pb-4">
        {filteredUploads.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
              index === currentIndex ? 'border-blue-600' : 'border-transparent'
            }`}
          >
            <img
              src={item.file_url}
              alt={item.file_name}
              className="w-full h-full object-cover"
            />
            {item.rating && (
              <div className="absolute top-1 left-1 bg-black/50 text-white px-1 rounded text-xs flex items-center">
                <Star className="w-2 h-2 mr-1" />
                {item.rating}
              </div>
            )}
            {!item.viewed && (
              <div className="absolute top-1 right-1 bg-red-500 text-white px-1 rounded text-xs">
                New
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Image Details */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-bold text-lg mb-4">Image Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">File Name</label>
            <p className="font-medium">{filteredUploads[currentIndex].file_name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Upload Date</label>
            <p className="font-medium">{new Date(filteredUploads[currentIndex].created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">File Size</label>
            <p className="font-medium">
              {((filteredUploads[currentIndex].file_size ?? 0) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {filteredUploads[currentIndex].service_type && (
            <div>
              <label className="text-sm text-gray-600">Service Type</label>
              <p className="font-medium">{filteredUploads[currentIndex].service_type}</p>
            </div>
          )}
          {filteredUploads[currentIndex].company_name && (
            <div>
              <label className="text-sm text-gray-600">Company</label>
              <p className="font-medium">{filteredUploads[currentIndex].company_name}</p>
            </div>
          )}
          {filteredUploads[currentIndex].uploaded_by && (
            <div>
              <label className="text-sm text-gray-600">Uploaded By</label>
              <p className="font-medium flex items-center">
                <User className="w-4 h-4 mr-2" />
                {filteredUploads[currentIndex].uploaded_by}
              </p>
            </div>
          )}
        </div>
        {filteredUploads[currentIndex].tags && (
          <div className="mt-4">
            <label className="text-sm text-gray-600">Tags</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {filteredUploads[currentIndex].tags?.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="text-center py-12">
      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-600 mb-2">No images found</h3>
      <p className="text-gray-500">Try adjusting your search criteria or clear filters</p>
      <button
        onClick={clearFilters}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )}
</div>
    </div>
  </div>
</section>

{/* Service Type Popup */}
<AnimatePresence>
  {showServicePopup && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowServicePopup(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedServiceType} Uploads</h2>
            <p className="text-gray-600">
              {serviceUploads.length} items • {serviceUploads.filter(u => !u.viewed).length} new
            </p>
          </div>
          <button
            onClick={() => setShowServicePopup(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search within service type..."
                value={serviceSearchTerm}
                onChange={(e) => setServiceSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={serviceSortBy}
              onChange={(e) => setServiceSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServiceUploads.map((item) => (
                <tr key={item.id} className={item.viewed ? 'bg-white' : 'bg-blue-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedServiceItems.includes(item.id)}
                      onChange={() => toggleServiceItemSelection(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={item.file_url} alt="" className="w-8 h-8 rounded object-cover mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.file_name}</div>
                        <div className="text-sm text-gray-500">{item.file_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.company_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.viewed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.viewed ? 'Viewed' : 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{item.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => viewImage(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => downloadImage(item.file_url, item.file_name)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedServiceItems.length} of {filteredServiceUploads.length} items selected
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={markSelectedAsViewed}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Mark as Viewed
            </button>
            <button 
              onClick={downloadSelected}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Download Selected
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* All Uploads Popup */}
<AnimatePresence>
  {showAllUploadsPopup && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowAllUploadsPopup(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Uploads</h2>
            <p className="text-gray-600">
              {uploads.length} total items • {uploads.filter(u => !u.viewed).length} new
            </p>
          </div>
          <button
            onClick={() => setShowAllUploadsPopup(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search all uploads..."
                value={allUploadsSearchTerm}
                onChange={(e) => setAllUploadsSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={allUploadsServiceFilter}
              onChange={(e) => setAllUploadsServiceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Services</option>
              {serviceTypes.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            <select
              value={allUploadsStatusFilter}
              onChange={(e) => setAllUploadsStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="new">New Only</option>
              <option value="viewed">Viewed Only</option>
            </select>
          </div>
        </div>

        {/* Enhanced Data Table */}
        <div className="overflow-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAllUploads.map((item) => (
                <tr key={item.id} className={item.viewed ? 'bg-white' : 'bg-blue-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedAllItems.includes(item.id)}
                      onChange={() => toggleAllItemSelection(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={item.file_url} alt="" className="w-8 h-8 rounded object-cover mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.file_name}</div>
                        <div className="text-sm text-gray-500">
                         {(item.file_size ? item.file_size / 1024 / 1024 : 0).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.service_type || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.company_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.uploaded_by || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.viewed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.viewed ? 'Viewed' : 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => viewImage(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => downloadImage(item.file_url, item.file_name)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedAllItems.length} of {filteredAllUploads.length} items selected
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={markAllSelectedAsViewed}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Mark as Viewed
            </button>
            <button 
              onClick={downloadAllSelected}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Download Selected ({selectedAllItems.length})
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Rest of the component remains the same (Upload Modal and View All Popup) */}
      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Upload Artwork</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload artwork</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 3MB</p>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Upload Artwork'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All Popup Modal */}
      <AnimatePresence>
        {showViewAllPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeViewAllPopup}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                  <span>Image Gallery</span>
                </h2>
                <button
                  onClick={closeViewAllPopup}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 bg-gray-50">
                {Object.keys(folderData).map(folderName => (
                  <button
                    key={folderName}
                    onClick={() => handleFolderChange(folderName)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      activeFolder === folderName
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    <span>{folderName}</span>
                  </button>
                ))}
              </div>

              {/* Image Slider */}
              <div className="p-6">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                  {currentFolderImages.length > 0 ? (
                    <>
                      {/* Main Image */}
                      <div className="relative h-96 flex items-center justify-center">
                        <motion.img
                          key={currentFolderImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          src={currentFolderImages[currentFolderImageIndex]}
                          alt={`${activeFolder} ${currentFolderImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                        
                        {/* Navigation Arrows */}
                        {currentFolderImages.length > 1 && (
                          <>
                            <button
                              onClick={prevFolderImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextFolderImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentFolderImageIndex + 1} / {currentFolderImages.length}
                        </div>
                      </div>

                      {/* Thumbnails */}
                      {currentFolderImages.length > 1 && (
                        <div className="p-4 bg-gray-800">
                          <div className="flex justify-center space-x-2 overflow-x-auto">
                            {currentFolderImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentFolderImageIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                  index === currentFolderImageIndex 
                                    ? 'border-blue-400 shadow-lg' 
                                    : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-white">
                      <p className="text-xl">No images available for {activeFolder}</p>
                    </div>
                  )}
                </div>

                {/* Folder Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-bold text-gray-800">{activeFolder}</h3>
                  <p className="text-gray-600">
                    {currentFolderImages.length} images in this category
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;