import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Close modal if user is already logged in
  React.useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Auth error details:', error);
        handleAuthError(error);
        return;
      }

      if (data?.user) {
        toast.success('Login successful!');
        onClose();
        setEmail('');
        setPassword('');
        // No need to reload - auth state will update automatically
      }

    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: any) => {
    if (error.message?.includes('Invalid login credentials')) {
      toast.error('Invalid email or password');
    } else if (error.message?.includes('Email not confirmed')) {
      toast.error('Please verify your email first');
    } else if (error.status === 400) {
      toast.error('Authentication service error. Please try again later.');
    } else {
      toast.error('Login failed. Please check your connection and try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded mb-3"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded mb-4"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full mt-3 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;