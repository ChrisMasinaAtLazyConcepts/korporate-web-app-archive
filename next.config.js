/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // API configuration
  api: {
    // Increase body size limit for file uploads (matches your API config)
    bodyParser: {
      sizeLimit: '5mb',
    },
    // Response size limit
    responseLimit: '5mb',
    // External resolver for API routes
    externalResolver: true,
  },
  
  // Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Enable standalone output for better deployment
  output: 'standalone',
  
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig