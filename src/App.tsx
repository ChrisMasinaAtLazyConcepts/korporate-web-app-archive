import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import { AuthProvider } from './contexts/AuthContext';
import Clients from './pages/Clients';
import WhatsAppChatBot from './components/WhatsAppChatBot';

function App() {
  return (
     <AuthProvider>
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
        <ChatBot />
        <WhatsAppChatBot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router></AuthProvider>
  );
}

export default App;