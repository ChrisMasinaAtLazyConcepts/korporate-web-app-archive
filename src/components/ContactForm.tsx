import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Upload, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';


  let attachmentUrl = null;
// EmailJS configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_p1ogvsf',
  TEMPLATE_ID: 'template_31jk1tt',
  PUBLIC_KEY: 'zxtMFNwYwk23Srrzh',
  USER_ID: 'thato.don@gmail.com',
};

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  company: yup.string().required('Company is required'),
  message: yup.string().required('Message is required'),
});

interface FormData {
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  attachmentUrl: string;
}

// File to base64 conversion
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// API functions
const api = {
  async submitEnquiry(data: FormData, file?: File) {
    let fileData = null;
    let fileName = null;
    let fileType = null;
    let fileSize = null;

    // Convert file to base64 if provided
    if (file) {
      fileData = await fileToBase64(file);
      fileName = file.name;
      fileType = file.type;
      fileSize = file.size;
      data.attachmentUrl=file.webkitRelativePath;
    }

    const payload = {
      ...data,
      fileName,
      fileType,
      fileSize,
      fileData
    };

    const response = await fetch('http://localhost:8080/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Get the response content type
    const contentType = response.headers.get('content-type');
    
    // Check if the response is actually JSON before parsing
    if (contentType && contentType.includes('application/json')) {
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.error || 'Failed to submit enquiry');
      }
      return jsonResponse;
    } else {
      // Handle non-JSON response (like plain text "OK")
      const textResponse = await response.text();
      if (!response.ok) {
        throw new Error(textResponse || 'Failed to submit enquiry');
      }
      // If the request was successful, return the text response or a success message
      return { message: textResponse || 'Enquiry submitted successfully' };
    }
  },

  async downloadFile(enquiryId: number) {
    const response = await fetch(`/api/download?id=${enquiryId}`);
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    return response;
  },
};

const sendEmailWithEmailJS = async (data: FormData, hasAttachment: boolean = false, enquiryID: string = '') => {
  const templateParams = {
    to_email: 'thato.don@gmail.com',
    title: 'Korporate Apothecary Website Enquiry',
    from_name: data.name,
    from_email: 'no-reply@korporate.co.za',
    reply_to: 'info@korporate.co.za',
    subject: `New Enquiry from ${data.name}${data.company ? ` (${data.company})` : ''}`,
    name: data.name,
    email: data.email,
    phone: data.phone || 'Not provided',
    company: data.company || 'Not provided',
    message: data.message,
    has_attachment: hasAttachment ? 'Yes' : 'No',
    date: new Date().toLocaleDateString(), 
    time: new Date().toLocaleTimeString(),
    enquiryID: enquiryID
  };
  
  console.log('Template params:', templateParams);

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.SERVICE_ID,
        template_id: EMAILJS_CONFIG.TEMPLATE_ID,
        user_id: EMAILJS_CONFIG.PUBLIC_KEY,
        template_params: templateParams,
        accessToken: EMAILJS_CONFIG.PUBLIC_KEY,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.status} - ${responseText}`);
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      return jsonResponse;
    } catch (error) {
      console.log('Email sent successfully:', responseText);
      return { message: 'Email sent successfully' };
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
};

const ContactForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Form submission started:', data);

      // Save enquiry to database with file (if any)
      const result = await api.submitEnquiry(data, selectedFile || undefined);
      console.log('Enquiry saved to database:', result);

      const enquiryID = result.enquiryId;
      // Send email via EmailJS
      await sendEmailWithEmailJS(data, !!selectedFile,enquiryID);
      console.log('Email sent successfully');

      toast.success('Enquiry submitted successfully!');
      reset();
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to transform your brand? Let's discuss your project and create something extraordinary together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+27 61 582 4373"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  {...register('company')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Project Details *
              </label>
              <textarea
                {...register('message')}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your project, goals, and how we can help..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach File (Optional - Max 10MB)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors relative">
                {selectedFile ? (
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 10MB</p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting...' : 'Send Enquiry'}</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;