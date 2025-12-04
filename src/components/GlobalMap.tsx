import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const GlobalMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string>('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const locations = [
    { name: 'Johannesburg', lat: -26.0165, lng: 27.9848 , description: 'Head Office' },
    { name: 'Durban', lat: -29.8587, lng: 31.0218, description: 'KZN Operations' },
    { name: 'Gqeberha', lat: -33.9608, lng: 25.6022, description: 'Eastern Cape Operations' },
    { name: 'Cape Town', lat: -33.9249, lng: 18.4241, description: 'Western Operations' },
    { name: 'Gaborone', lat: -24.6282, lng: 25.9231, description: 'Botswana Operations' },
    { name: 'Windhoek', lat: -22.5609, lng: 17.0658, description: 'Namibia Operations' },
  ];

  useEffect(() => {
    const initMap = () => {
      try {
        if (!mapRef.current) {
          setMapError('Map container not found');
          return;
        }

        // Check if Google Maps is available
        if (typeof google === 'undefined' || !google.maps) {
          setMapError('Google Maps API not loaded properly');
          return;
        }

        const map = new google.maps.Map(mapRef.current, {
          zoom: 4,
          center: { lat: -26.0165, lng: 27.9848 },
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e' }],
            },
          ],
        });

        locations.forEach((location) => {
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#2563eb',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold text-gray-800">${location.name}</h3>
                <p class="text-sm text-gray-600">${location.description}</p>
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });

        setIsMapLoaded(true);
        setMapError('');

      } catch (error) {
        console.error('Failed to initialize map:', error);
        setMapError('Failed to load Google Maps. Please try again later.');
      }
    };

    // Check if API key is available
    const apiKey = 'AIzaSyBgtmDrI8g4cW1Tf9nxnwp1Si8KqEdD-XM';
    if (!apiKey) {
      setMapError('Google Maps API key not configured');
      return;
    }

    // Load Google Maps API if not already loaded
    if (typeof google === 'undefined') {
      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Script is already loading, wait for it
        const checkGoogleLoaded = () => {
          if (typeof google !== 'undefined' && google.maps) {
            initMap();
          } else {
            setTimeout(checkGoogleLoaded, 100);
          }
        };
        checkGoogleLoaded();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGlobalMap`;
      script.async = true;
      script.defer = true;
      
      // Set up global callback
      (window as any).initGlobalMap = initMap;
      
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
      };
      
      script.onerror = () => {
        setMapError('Failed to load Google Maps. Please check your API key and internet connection.');
      };

      document.head.appendChild(script);
    } else {
      // Google Maps is already loaded
      initMap();
    }

    // Cleanup function
    return () => {
      if ((window as any).initGlobalMap) {
        delete (window as any).initGlobalMap;
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our International Footprint
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Serving clients worldwide with our comprehensive marketing solutions
          </p>
          <br/>
                  <div className="maps-row">
                    <div className="map-card">
                        <img
                        src={'./assets/images/map za.PNG'}
                        alt={'Korporate Logo'}
                        className="map-image object-contain transition-all duration-200 group-hover:opacity-90"
                      />
                        <div className="map-content">
                            <h3>South Africa</h3>
                            <p>Our operations across the South African region, showing key locations and distribution centers.</p>
                        </div>
                    </div>
            
                    <div className="map-card">
                        <img
                            src={'./assets/images/map africa.PNG'}
                            alt={'Korporate Logo'}
                            className="map-image object-contain transition-all duration-200 group-hover:opacity-90"
                          />
                        <div className="map-content">
                            <h3>Africa Region</h3>
                            <p>Our African operations, highlighting our presence across the continent.</p>
                        </div>
                    </div>
                </div>
        </motion.div>
          <motion.div></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center p-8">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Unavailable</h3>
                <p className="text-gray-600 mb-4">{mapError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {!isMapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="w-full h-96" 
            style={{ visibility: isMapLoaded ? 'visible' : 'hidden' }}
          />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
          {locations.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto mb-2" />
              <h4 className="text-white font-semibold text-sm">{location.name}</h4>
              <p className="text-gray-400 text-xs">{location.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalMap;