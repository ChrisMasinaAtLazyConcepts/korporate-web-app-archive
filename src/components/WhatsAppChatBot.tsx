import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'quick_reply';
}

interface QuickReply {
  id: string;
  text: string;
  payload: string;
}

const WhatsAppChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Korporate Apothecary. How can I assist you today? 💼',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showHumanHandoff, setShowHumanHandoff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, quickReplies]);

  // WhatsApp Business specific responses
  const botResponses = {
    services: `Our Services 🚀

• Events & Activations - Memorable brand experiences
• Strategy & Logistics - Comprehensive planning
• Creative Solutions - Innovative marketing campaigns
• Digital Marketing - Online presence optimization

Would you like to schedule a consultation?`,
    
    about: `About Korporate Apothecary 💫

We're your strategic growth partner, blending creativity with results-driven marketing solutions. We've helped brands like Sterkinekor and Samsung achieve remarkable success.

Ready to transform your business?`,
    
    contact: `Contact Options 📞

• Call us: +27 61 582 4373
• Email: info@korporate.co.za
• Visit: Johannesburg North, South Africa
• Business Hours: Mon-Fri 8AM-5PM

Shall I connect you with our team?`,
    
    pricing: `Pricing Structure 💰

We offer customized pricing based on:
- Project scope & complexity
- Duration & resources needed
- Expected deliverables

*Best option: Free consultation to discuss your specific needs!*`,
    
    portfolio: `Our Portfolio 🌟

Recent successful projects:
- Sterkinekor Brand Activation
- Samsung Product Launch
- Corporate Event Management
- Digital Campaigns

Want to see case studies?`,
    
    consultation: `Perfect! 🎯

Please provide:
1. Your name
2. Company name
3. Preferred contact method
4. Best time for consultation

Or simply reply with "Schedule" to book directly!`,
    
    urgent: `Urgent Support 🚨

For immediate assistance:
📞 Call: +27 61 582 4373 (24/7)
📧 Email: info@korporate.co.za

We'll prioritize your request!`,
    
    human: `Great! I'll connect you with our human team right away. They'll be able to provide personalized assistance and answer any specific questions you have. 👥`,
    
    default: `Thanks for your message! 💬

I can help with:
- Service information
- Pricing estimates
- Project consultations
- Portfolio examples

What would you like to know more about?`
  };

  const quickReplyOptions = [
    { id: 'services', text: 'Our Services', payload: 'services' },
    { id: 'pricing', text: 'Get Quote', payload: 'pricing' },
    { id: 'contact', text: 'Contact Sales', payload: 'contact' },
    { id: 'consultation', text: 'Book Consultation', payload: 'consultation' },
    { id: 'human', text: 'Chat with Human', payload: 'human' },
  ];

  const getBotResponse = (userMessage: string): { text: string; quickReplies?: QuickReply[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('service') || message.includes('what do you do')) {
      return { 
        text: botResponses.services,
        quickReplies: [
          { id: 'consult', text: 'Book Consultation', payload: 'consultation' },
          { id: 'portfolio', text: 'See Portfolio', payload: 'portfolio' },
          { id: 'human', text: 'Talk to Human', payload: 'human' }
        ]
      };
    } else if (message.includes('about') || message.includes('who are you')) {
      return { 
        text: botResponses.about,
        quickReplies: [
          { id: 'services', text: 'View Services', payload: 'services' },
          { id: 'portfolio', text: 'Our Work', payload: 'portfolio' },
          { id: 'human', text: 'Talk to Team', payload: 'human' }
        ]
      };
    } else if (message.includes('contact') || message.includes('reach') || message.includes('talk')) {
      return { 
        text: botResponses.contact,
        quickReplies: [
          { id: 'call', text: 'Call Now', payload: 'call' },
          { id: 'consult', text: 'Schedule Call', payload: 'consultation' },
          { id: 'human', text: 'Live Chat', payload: 'human' }
        ]
      };
    } else if (message.includes('price') || message.includes('cost') || message.includes('quote')) {
      return { 
        text: botResponses.pricing,
        quickReplies: [
          { id: 'consult', text: 'Get Quote', payload: 'consultation' },
          { id: 'services', text: 'View Services', payload: 'services' },
          { id: 'human', text: 'Detailed Quote', payload: 'human' }
        ]
      };
    } else if (message.includes('work') || message.includes('portfolio') || message.includes('example')) {
      return { 
        text: botResponses.portfolio,
        quickReplies: [
          { id: 'consult', text: 'Discuss Project', payload: 'consultation' },
          { id: 'services', text: 'Our Services', payload: 'services' },
          { id: 'human', text: 'Case Studies', payload: 'human' }
        ]
      };
    } else if (message.includes('schedule') || message.includes('book') || message.includes('meeting')) {
      return { 
        text: botResponses.consultation,
        quickReplies: [
          { id: 'confirm', text: 'Confirm Details', payload: 'confirm' },
          { id: 'later', text: 'Later', payload: 'later' },
          { id: 'human', text: 'Live Booking', payload: 'human' }
        ]
      };
    } else if (message.includes('urgent') || message.includes('emergency') || message.includes('asap')) {
      return { 
        text: botResponses.urgent,
        quickReplies: [
          { id: 'call', text: 'Call Support', payload: 'call' },
          { id: 'email', text: 'Send Email', payload: 'email' },
          { id: 'human', text: 'Urgent Help', payload: 'human' }
        ]
      };
    } else if (message.includes('human') || message.includes('agent') || message.includes('person') || message.includes('team')) {
      return { 
        text: botResponses.human,
        quickReplies: []
      };
    } else {
      return { 
        text: botResponses.default,
        quickReplies: quickReplyOptions
      };
    }
  };

  const handleQuickReply = (payload: string) => {
    const quickReplyMessage: Message = {
      id: Date.now().toString(),
      text: getQuickReplyText(payload),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, quickReplyMessage]);
    setQuickReplies([]);
    setIsTyping(true);

    setTimeout(() => {
      if (payload === 'human') {
        // Trigger human handoff
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponses.human,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        
        // Show human handoff option after a short delay
        setTimeout(() => {
          setShowHumanHandoff(true);
        }, 1000);
      } else {
        const response = getBotResponse(payload);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        
        if (response.quickReplies) {
          setQuickReplies(response.quickReplies);
        }
        
        setIsTyping(false);
      }
    }, 1000);
  };

  const getQuickReplyText = (payload: string): string => {
    const replies: { [key: string]: string } = {
      services: 'Tell me about your services',
      pricing: 'I need a price quote',
      contact: 'I want to contact sales',
      consultation: 'Schedule a consultation',
      portfolio: 'Show me your portfolio',
      call: 'I need to call now',
      email: 'Send me email details',
      confirm: 'Confirm my details',
      later: 'Maybe later',
      human: 'I want to chat with a human'
    };
    return replies[payload] || 'More information';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setQuickReplies([]);
    setIsTyping(true);

    setTimeout(() => {
      if (inputValue.toLowerCase().includes('human') || 
          inputValue.toLowerCase().includes('agent') || 
          inputValue.toLowerCase().includes('person') ||
          inputValue.toLowerCase().includes('team')) {
        // Trigger human handoff
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponses.human,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        
        // Show human handoff option after a short delay
        setTimeout(() => {
          setShowHumanHandoff(true);
        }, 1000);
      } else {
        const response = getBotResponse(inputValue);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        
        if (response.quickReplies) {
          setQuickReplies(response.quickReplies);
        }
        
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
const openWhatsApp = () => {
  // Open actual WhatsApp with pre-filled message
  const phoneNumber = '+27615824373';
  const message = `Hello Korporate Apothecary! I need assistance with:

📍 *Sent via Korporate.co.za*`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

const transferToHuman = () => {
  // Compile conversation history for WhatsApp
  const conversation = messages.map(msg => 
    `${msg.isBot ? 'Bot' : 'You'}: ${msg.text}`
  ).join('\n\n');

  const phoneNumber = '+27615824373';
  const message = `🔔 *CHATBOT HANDOFF - WEBSITE LEAD* 🔔

*Conversation Summary:*
${conversation}

---
*Handoff from Korporate.co.za Chatbot*
*Please continue assistance*`;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // Open WhatsApp with the compiled conversation
  window.open(url, '_blank');
  
  // Show confirmation message
  const confirmationMessage: Message = {
    id: Date.now().toString(),
    text: '✅ Perfect! I\'ve transferred our conversation to our human team on WhatsApp. They\'ll continue assisting you right away!',
    isBot: true,
    timestamp: new Date(),
  };
  
  setMessages(prev => [...prev, confirmationMessage]);
  setShowHumanHandoff(false);
  
  // Close chat window after transfer
  setTimeout(() => {
    setIsOpen(false);
  }, 3000);
};

  return (
    <>
      {/* WhatsApp FAB Button */}
      <motion.button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-24 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-200 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        title="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-full mr-2 px-2 py-1 bg-[#25D366] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat on WhatsApp
        </span>
      </motion.button>

      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-green-100"
          >
            {/* Header with WhatsApp-style branding */}
           <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Korporate Assistant</h3>
                          <p className="text-sm text-blue-100">How can we help you today?</p>
                        </div>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
          

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-white text-gray-800 shadow-sm border border-green-100'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-green-100'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-green-100">
                    <div className="flex space-x-1 items-center">
                      <div className="text-xs text-gray-500 mr-2">Typing...</div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Human Handoff Option */}
              {showHumanHandoff && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">Connect with Human Agent</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Ready to speak with our team? I'll transfer our conversation to WhatsApp where a human agent will continue assisting you.
                    </p>
                    <button
                      onClick={transferToHuman}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Continue on WhatsApp</span>
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Quick Replies */}
              {quickReplies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start space-x-2 flex-wrap"
                >
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply.payload)}
                      className="bg-white border border-green-300 text-green-700 px-3 py-2 rounded-full text-sm hover:bg-green-50 transition-colors mb-2 shadow-sm"
                    >
                      {reply.text}
                    </button>
                  ))}
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-green-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>💬 Type "human" to speak with our team</span>
                <button 
                  onClick={openWhatsApp}
                  className="text-green-600 hover:text-green-700 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Open WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppChatBot;