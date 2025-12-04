// components/Header.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import AdminLogin from './AdminLogin';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout, isLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-gray-900">
              <img
                    src={'./assets/images/korporatelogo.jpg'}
                    alt={'Korporate Logo'}
                    className="w-30 h-16 md:w-25 md:h-16 object-contain transition-all duration-200 group-hover:opacity-90"
                  />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/services" className="text-gray-600 hover:text-gray-900">
                Services
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                About 
              </Link>
               <Link to="/gallery" className="text-gray-600 hover:text-gray-900">
                Gallery
              </Link>
               <Link to="/clients" className="text-gray-600 hover:text-gray-900">
                Clients
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Dashboard Button */}
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm">
                        {user.email}
                      </span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-700">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AdminLogin 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};

export default Header;