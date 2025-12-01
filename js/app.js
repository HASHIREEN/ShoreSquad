/**
 * ShoreSquad - Interactive Beach Cleanup Rally App
 * Modern JavaScript with ES6+ features, accessibility, and performance optimization
 */

class ShoreSquadApp {
  constructor() {
    this.init();
    this.isLoading = false;
    this.userLocation = null;
    this.weatherData = null;
    this.beaches = [];
    this.rallies = [];
    this.map = null;
    this.currentUser = null;
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents();
    this.setupIntersectionObserver();
    this.setupAccessibility();
    this.loadInitialData();
    this.setupServiceWorker();
    
    // Simulate app loading
    this.showLoadingOverlay(true);
    setTimeout(() => {
      this.showLoadingOverlay(false);
      this.animateHeroStats();
    }, 1500);
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Navigation
    this.bindNavigation();
    
    // Hero section
    this.bindHeroActions();
    
    // Map functionality
    this.bindMapFeatures();
    
    // Weather functionality
    this.bindWeatherFeatures();
    
    // Rally functionality
    this.bindRallyFeatures();
    
    // Leaderboard functionality
    this.bindLeaderboard();
    
    // Form handling
    this.bindForms();
    
    // Window events
    this.bindWindowEvents();
  }

  /**
   * Navigation event handlers
   */
  bindNavigation() {
    const navToggle = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        navToggle.classList.toggle('active');
      });
    }

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Close mobile menu
            if (navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              navToggle.setAttribute('aria-expanded', 'false');
              navToggle.classList.remove('active');
            }
          }
        }
      });
    });

    // Header scroll effect
    this.handleHeaderScroll();
  }

  /**
   * Hero section event handlers
   */
  bindHeroActions() {
    const startRallyBtn = document.getElementById('start-rally-btn');
    const joinRallyBtn = document.getElementById('join-rally-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    if (startRallyBtn) {
      startRallyBtn.addEventListener('click', () => {
        this.scrollToSection('#rallies');
        setTimeout(() => {
          this.focusElement('#rally-name');
        }, 500);
      });
    }

    if (joinRallyBtn) {
      joinRallyBtn.addEventListener('click', () => {
        this.scrollToSection('#map');
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.showModal('login');
      });
    }

    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        this.showModal('signup');
      });
    }

    // App preview animation
    this.animateAppPreview();
  }

  /**
   * Map feature event handlers
   */
  bindMapFeatures() {
    const loadMapBtn = document.getElementById('load-map-btn');
    const locationSearch = document.getElementById('location-search');
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const googleMapTab = document.getElementById('google-map-tab');
    const interactiveMapTab = document.getElementById('interactive-map-tab');

    if (loadMapBtn) {
      loadMapBtn.addEventListener('click', () => {
        this.loadInteractiveMap();
      });
    }

    if (locationSearch) {
      locationSearch.addEventListener('input', this.debounce((e) => {
        this.searchLocations(e.target.value);
      }, 500));
    }

    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateMapFilters();
      });
    });

    // Map tab switching
    if (googleMapTab && interactiveMapTab) {
      googleMapTab.addEventListener('click', () => {
        this.switchMapTab('google');
      });
      
      interactiveMapTab.addEventListener('click', () => {
        this.switchMapTab('interactive');
      });
    }

    // Load nearby beaches
    this.loadNearbyBeaches();
  }

  /**
   * Weather feature event handlers
   */
  bindWeatherFeatures() {
    // Auto-load weather based on location
    this.getUserLocation()
      .then(location => {
        this.userLocation = location;
        this.loadWeatherData(location);
      })
      .catch(error => {
        console.log('Location access denied, using default location');
        this.loadWeatherData({ lat: 1.3521, lng: 103.8198 }); // Singapore default
      });
  }

  /**
   * Rally feature event handlers
   */
  bindRallyFeatures() {
    const rallyForm = document.getElementById('rally-form');
    
    if (rallyForm) {
      rallyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.createRally();
      });
    }

    // Load active rallies
    this.loadActiveRallies();
  }

  /**
   * Leaderboard event handlers
   */
  bindLeaderboard() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabType = btn.getAttribute('data-tab');
        this.switchLeaderboardTab(tabType);
        
        // Update active state
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Load initial leaderboard
    this.loadLeaderboard('individual');
  }

  /**
   * Form handling
   */
  bindForms() {
    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    });
  }

  /**
   * Window event handlers
   */
  bindWindowEvents() {
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 16)); // ~60fps

    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  /**
   * Setup Intersection Observer for animations
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    // Add fade-in class to section elements
    document.querySelectorAll('section > .container').forEach(el => {
      el.classList.add('fade-in');
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Announce dynamic content changes
    this.createAriaLiveRegion();
    
    // Enhance keyboard navigation
    this.setupKeyboardNavigation();
  }

  /**
   * Header scroll effect
   */
  handleHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    const updateHeader = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
    };
    
    window.addEventListener('scroll', this.throttle(updateHeader, 16));
  }

  /**
   * Animate hero statistics with counting effect
   */
  animateHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateStat = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateStat);
        } else {
          stat.textContent = target.toLocaleString();
        }
      };
      
      updateStat();
    });
  }

  /**
   * Animate app preview in phone mockup
   */
  animateAppPreview() {
    const appPreview = document.getElementById('app-preview');
    if (!appPreview) return;

    const screens = [
      { emoji: '🗺️', text: 'Beach Map' },
      { emoji: '🌤️', text: 'Weather' },
      { emoji: '👥', text: 'Rallies' },
      { emoji: '🏆', text: 'Leaderboard' }
    ];
    
    let currentScreen = 0;
    
    const updateScreen = () => {
      const screen = screens[currentScreen];
      appPreview.innerHTML = `
        <div style="text-align: center; color: #374151;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">${screen.emoji}</div>
          <div style="font-size: 1.5rem; font-weight: 600;">${screen.text}</div>
        </div>
      `;
      currentScreen = (currentScreen + 1) % screens.length;
    };
    
    updateScreen(); // Initial screen
    setInterval(updateScreen, 3000); // Change every 3 seconds
  }

  /**
   * Load interactive map (now with real Leaflet.js implementation)
   */
  loadInteractiveMap() {
    const mapContainer = document.getElementById('beach-map');
    const loadMapBtn = document.getElementById('load-map-btn');
    
    if (loadMapBtn) {
      loadMapBtn.style.display = 'none';
    }
    
    // Clear existing content
    mapContainer.innerHTML = '';
    
    try {
      // Initialize map centered on Singapore (you can change this to any location)
      this.map = L.map('beach-map').setView([1.3521, 103.8198], 12);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      
      // Add some sample beach markers
      const beaches = [
        {
          name: 'Sentosa Beach',
          coords: [1.2494, 103.8303],
          status: 'Needs Cleanup',
          description: 'Popular tourist beach with high foot traffic',
          difficulty: 'Beginner'
        },
        {
          name: 'East Coast Park',
          coords: [1.3006, 103.9063],
          status: 'Active Rally',
          description: 'Long stretch of beach perfect for group cleanups',
          difficulty: 'Intermediate'
        },
        {
          name: 'Changi Beach',
          coords: [1.3890, 103.9915],
          status: 'Clean',
          description: 'Quiet beach with occasional debris',
          difficulty: 'Advanced'
        },
        {
          name: 'Pasir Ris Beach',
          coords: [1.3721, 103.9474],
          status: 'Needs Cleanup',
          description: 'Family-friendly beach with mangrove areas',
          difficulty: 'Beginner'
        }
      ];
      
      // Add markers for each beach
      beaches.forEach(beach => {
        const markerColor = beach.status === 'Needs Cleanup' ? 'red' : 
                           beach.status === 'Active Rally' ? 'green' : 'blue';
        
        // Create custom icon based on status
        const icon = L.divIcon({
          html: `<div style="background: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
          iconSize: [26, 26],
          className: 'custom-marker'
        });
        
        const marker = L.marker(beach.coords, { icon }).addTo(this.map);
        
        // Add popup with beach information
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">${beach.name}</h3>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${beach.description}</p>
            <div style="margin: 10px 0;">
              <span style="background: ${markerColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px;">${beach.status}</span>
              <span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${beach.difficulty}</span>
            </div>
            <button onclick="app.selectBeachFromMap('${beach.name}')" style="background: #0ea5e9; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 8px;">
              ${beach.status === 'Active Rally' ? 'Join Rally' : 'Create Rally Here'}
            </button>
          </div>
        `);
        
        // Add click event to select beach
        marker.on('click', () => {
          this.selectBeach(beach);
        });
      });
      
      // Add map controls
      const legend = L.control({position: 'bottomright'});
      legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">Beach Status</h4>
            <div style="margin: 4px 0;"><span style="color: red;">●</span> Needs Cleanup</div>
            <div style="margin: 4px 0;"><span style="color: green;">●</span> Active Rally</div>
            <div style="margin: 4px 0;"><span style="color: blue;">●</span> Clean</div>
          </div>
        `;
        return div;
      };
      legend.addTo(this.map);
      
      this.announceToScreenReader('Interactive beach map has been loaded with beach cleanup locations');
      
      // If user has location permission, try to center on their location
      if (this.userLocation) {
        this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
        
        // Add user location marker
        L.marker([this.userLocation.lat, this.userLocation.lng], {
          icon: L.divIcon({
            html: '<div style="background: #ff6b6b; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            className: 'user-location-marker'
          })
        }).addTo(this.map).bindPopup('Your Location');
      }
      
    } catch (error) {
      console.error('Error loading map:', error);
      mapContainer.innerHTML = `
        <div class="map-placeholder">
          <div style="text-align: center; color: #ef4444;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <div>Unable to load interactive map</div>
            <button class="btn btn-primary" onclick="app.loadInteractiveMap()" style="margin-top: 1rem;">Retry</button>
          </div>
        </div>
      `;
    }
  }

  /**
   * Search locations
   */
  searchLocations(query) {
    if (query.length < 2) return;
    
    // Simulate search
    console.log(`Searching for: ${query}`);
    this.announceToScreenReader(`Searching for ${query}`);
  }

  /**
   * Update map filters
   */
  updateMapFilters() {
    const filters = Array.from(document.querySelectorAll('.filter-group input:checked'))
      .map(input => input.id);
    
    console.log('Active filters:', filters);
    this.announceToScreenReader(`Map filters updated: ${filters.join(', ')}`);
  }

  /**
   * Load nearby beaches (mock data)
   */
  loadNearbyBeaches() {
    const beachList = document.getElementById('beach-list');
    if (!beachList) return;
    
    const mockBeaches = [
      { name: 'Sentosa Beach', distance: '2.3km', status: 'Needs cleanup', difficulty: 'Beginner' },
      { name: 'East Coast Park', distance: '5.1km', status: 'Active rally', difficulty: 'Intermediate' },
      { name: 'Changi Beach', distance: '12.7km', status: 'Clean', difficulty: 'Advanced' }
    ];
    
    beachList.innerHTML = mockBeaches.map(beach => `
      <div class="beach-item" style="padding: 1rem; margin-bottom: 1rem; background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer;" tabindex="0" role="button">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">${beach.name}</div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">${beach.distance} away</div>
        <div style="display: flex; gap: 0.5rem;">
          <span class="badge" style="padding: 0.25rem 0.5rem; background: ${beach.status.includes('cleanup') ? '#fbbf24' : beach.status.includes('rally') ? '#22c55e' : '#e5e7eb'}; color: ${beach.status.includes('Clean') ? '#374151' : 'white'}; border-radius: 0.25rem; font-size: 0.75rem;">${beach.status}</span>
          <span class="badge" style="padding: 0.25rem 0.5rem; background: #f3f4f6; color: #374151; border-radius: 0.25rem; font-size: 0.75rem;">${beach.difficulty}</span>
        </div>
      </div>
    `).join('');
    
    // Add click handlers
    beachList.querySelectorAll('.beach-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        this.selectBeach(mockBeaches[index]);
      });
      
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectBeach(mockBeaches[index]);
        }
      });
    });
  }

  /**
   * Select a beach from the list
   */
  selectBeach(beach) {
    console.log('Selected beach:', beach);
    this.announceToScreenReader(`Selected ${beach.name}, ${beach.distance || 'location selected'}`);
    
    // Update map focus (if map is loaded)
    if (this.map && beach.coords) {
      this.map.setView(beach.coords, 15);
    }
    
    // Auto-fill rally form if creating a rally
    const rallyLocation = document.getElementById('rally-location');
    if (rallyLocation) {
      rallyLocation.value = beach.name;
    }
  }

  /**
   * Select beach from map popup (called from popup button)
   */
  selectBeachFromMap(beachName) {
    const beach = { name: beachName };
    this.selectBeach(beach);
    
    // Scroll to rally form
    this.scrollToSection('#rallies');
    setTimeout(() => {
      this.focusElement('#rally-name');
    }, 500);
  }

  /**
   * Switch between Google Maps and Interactive Map
   */
  switchMapTab(tabType) {
    const googleMapTab = document.getElementById('google-map-tab');
    const interactiveMapTab = document.getElementById('interactive-map-tab');
    const googleMapContainer = document.getElementById('google-map-container');
    const interactiveMapContainer = document.getElementById('interactive-map-container');

    // Update tab buttons
    googleMapTab.classList.toggle('active', tabType === 'google');
    interactiveMapTab.classList.toggle('active', tabType === 'interactive');

    // Update map containers
    googleMapContainer.classList.toggle('active', tabType === 'google');
    interactiveMapContainer.classList.toggle('active', tabType === 'interactive');

    this.announceToScreenReader(`Switched to ${tabType === 'google' ? 'next cleanup location' : 'interactive beach'} map`);
  }

  /**
   * Join the next cleanup event
   */
  joinNextCleanup() {
    // Create a rally entry for the next cleanup
    const nextCleanup = {
      id: Date.now(),
      name: 'Pasir Ris Beach Cleanup Rally',
      location: 'Pasir Ris Beach - Street View Asia',
      date: this.getNextSaturday().toISOString().slice(0, 16),
      description: 'Join us for our weekly beach cleanup at Pasir Ris! Perfect for beginners and families.',
      creator: { name: 'ShoreSquad Team' },
      participants: 15,
      status: 'active',
      coordinates: [1.381497, 103.955574]
    };

    // Add to rallies if not already there
    const existingRally = this.rallies.find(r => r.location.includes('Pasir Ris'));
    if (!existingRally) {
      this.rallies.unshift(nextCleanup);
      this.updateActiveRallies();
    }

    // Show success message
    this.showNotification('🎉 You\'ve joined the Pasir Ris Beach Cleanup! See you there!', 'success');
    this.announceToScreenReader('Joined Pasir Ris Beach cleanup rally');

    // Scroll to rallies section to show the joined event
    setTimeout(() => {
      this.scrollToSection('#rallies');
    }, 1000);
  }

  /**
   * Get next Saturday date for default cleanup
   */
  getNextSaturday() {
    const today = new Date();
    const nextSaturday = new Date();
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    nextSaturday.setDate(today.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
    nextSaturday.setHours(9, 0, 0, 0); // 9 AM
    return nextSaturday;
  }

  /**
   * Get user's geolocation
   */
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Load weather data (mock implementation)
   */
  async loadWeatherData(location) {
    const currentWeather = document.getElementById('current-weather');
    const weatherForecast = document.getElementById('weather-forecast');
    
    if (!currentWeather) return;
    
    try {
      // Show loading state
      currentWeather.innerHTML = `
        <div class="weather-loading">
          <div class="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      `;
      
      // Simulate API call
      await this.delay(1500);
      
      // Mock weather data
      const mockCurrentWeather = {
        temp: 28,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12,
        emoji: '☀️'
      };
      
      const mockForecast = [
        { day: 'Today', high: 30, low: 24, condition: 'Sunny', emoji: '☀️' },
        { day: 'Tomorrow', high: 28, low: 23, condition: 'Partly Cloudy', emoji: '⛅' },
        { day: 'Tuesday', high: 26, low: 22, condition: 'Light Rain', emoji: '🌦️' },
        { day: 'Wednesday', high: 29, low: 24, condition: 'Sunny', emoji: '☀️' },
        { day: 'Thursday', high: 31, low: 25, condition: 'Hot', emoji: '🌞' }
      ];
      
      // Update current weather
      currentWeather.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">${mockCurrentWeather.emoji}</div>
          <div style="font-size: 2rem; font-weight: 600; margin-bottom: 0.5rem;">${mockCurrentWeather.temp}°C</div>
          <div style="color: #6b7280; margin-bottom: 1rem;">${mockCurrentWeather.condition}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.875rem;">
            <div>
              <div style="color: #6b7280;">Humidity</div>
              <div style="font-weight: 600;">${mockCurrentWeather.humidity}%</div>
            </div>
            <div>
              <div style="color: #6b7280;">Wind</div>
              <div style="font-weight: 600;">${mockCurrentWeather.windSpeed} km/h</div>
            </div>
          </div>
        </div>
      `;
      
      // Update forecast
      if (weatherForecast) {
        weatherForecast.innerHTML = mockForecast.map(day => `
          <div style="background: white; padding: 1rem; border-radius: 0.5rem; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">${day.day}</div>
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${day.emoji}</div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${day.high}°/${day.low}°</div>
            <div style="font-size: 0.75rem; color: #6b7280;">${day.condition}</div>
          </div>
        `).join('');
      }
      
      this.weatherData = { current: mockCurrentWeather, forecast: mockForecast };
      this.announceToScreenReader(`Weather loaded: ${mockCurrentWeather.temp} degrees, ${mockCurrentWeather.condition}`);
      
    } catch (error) {
      console.error('Error loading weather data:', error);
      currentWeather.innerHTML = `
        <div style="text-align: center; color: #ef4444;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
          <div>Unable to load weather data</div>
          <button class="btn btn-outline" onclick="app.loadWeatherData(app.userLocation || {lat: 1.3521, lng: 103.8198})" style="margin-top: 1rem;">Retry</button>
        </div>
      `;
    }
  }

  /**
   * Create a new rally
   */
  createRally() {
    const form = document.getElementById('rally-form');
    const formData = new FormData(form);
    
    const rally = {
      id: Date.now(),
      name: formData.get('rally-name') || document.getElementById('rally-name').value,
      location: formData.get('rally-location') || document.getElementById('rally-location').value,
      date: formData.get('rally-date') || document.getElementById('rally-date').value,
      description: formData.get('rally-description') || document.getElementById('rally-description').value,
      creator: this.currentUser || { name: 'You' },
      participants: 1,
      status: 'active'
    };
    
    // Validate required fields
    if (!rally.name || !rally.location || !rally.date) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Add to rallies array
    this.rallies.unshift(rally);
    
    // Update UI
    this.updateActiveRallies();
    
    // Reset form
    form.reset();
    
    // Show success message
    this.showNotification(`Rally "${rally.name}" created successfully! 🚀`, 'success');
    this.announceToScreenReader(`Rally ${rally.name} has been created`);
  }

  /**
   * Load and display active rallies
   */
  loadActiveRallies() {
    // Mock data for initial load
    if (this.rallies.length === 0) {
      this.rallies = [
        {
          id: 1,
          name: 'Sunset Beach Warriors',
          location: 'Sentosa Beach',
          date: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
          description: 'Join us for an epic sunset cleanup session!',
          creator: { name: 'EcoWarrior22' },
          participants: 12,
          status: 'active'
        },
        {
          id: 2,
          name: 'Morning Shore Squad',
          location: 'East Coast Park',
          date: new Date(Date.now() + 172800000).toISOString().slice(0, 16), // Day after tomorrow
          description: 'Early birds cleaning the shores before the crowds arrive.',
          creator: { name: 'BeachGuardian' },
          participants: 8,
          status: 'active'
        }
      ];
    }
    
    this.updateActiveRallies();
  }

  /**
   * Update active rallies display
   */
  updateActiveRallies() {
    const activeRalliesContainer = document.getElementById('active-rallies');
    if (!activeRalliesContainer) return;
    
    const activeRallies = this.rallies.filter(rally => rally.status === 'active');
    
    if (activeRallies.length === 0) {
      activeRalliesContainer.innerHTML = `
        <div style="text-align: center; color: #6b7280; padding: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏖️</div>
          <p>No active rallies yet.</p>
          <p style="font-size: 0.875rem;">Create the first one!</p>
        </div>
      `;
      return;
    }
    
    activeRalliesContainer.innerHTML = activeRallies.map(rally => {
      const rallyDate = new Date(rally.date);
      const isUpcoming = rallyDate > new Date();
      
      return `
        <div class="rally-card" style="background: white; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #0ea5e9;">
          <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
            <div>
              <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">${rally.name}</h4>
              <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">📍 ${rally.location}</p>
              <p style="color: #6b7280; font-size: 0.875rem;">🗓️ ${rallyDate.toLocaleDateString()} at ${rallyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.25rem; font-weight: 600; color: #0ea5e9;">${rally.participants}</div>
              <div style="font-size: 0.75rem; color: #6b7280;">participants</div>
            </div>
          </div>
          
          ${rally.description ? `<p style="color: #374151; margin-bottom: 1rem; font-size: 0.875rem;">${rally.description}</p>` : ''}
          
          <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.75rem; color: #6b7280;">by ${rally.creator.name}</span>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="app.joinRally(${rally.id})">
                Join Rally
              </button>
              ${rally.creator.name === 'You' ? `<button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="app.editRally(${rally.id})">Edit</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Join a rally
   */
  joinRally(rallyId) {
    const rally = this.rallies.find(r => r.id === rallyId);
    if (!rally) return;
    
    rally.participants += 1;
    this.updateActiveRallies();
    
    this.showNotification(`You've joined "${rally.name}"! 🎉`, 'success');
    this.announceToScreenReader(`Joined rally: ${rally.name}`);
  }

  /**
   * Load and switch leaderboard tabs
   */
  loadLeaderboard(type) {
    const leaderboardContainer = document.getElementById(`${type}-leaderboard`);
    if (!leaderboardContainer) return;
    
    // Mock leaderboard data
    const mockData = {
      individual: [
        { name: 'EcoWarrior22', avatar: '🌊', score: 2450, rallies: 15, kg: 125 },
        { name: 'BeachGuardian', avatar: '🏖️', score: 2120, rallies: 12, kg: 98 },
        { name: 'CleanupCrusader', avatar: '⚡', score: 1890, rallies: 11, kg: 87 },
        { name: 'ShoreHero', avatar: '🦸‍♀️', score: 1650, rallies: 9, kg: 76 },
        { name: 'WaveWatcher', avatar: '👀', score: 1420, rallies: 8, kg: 65 }
      ],
      teams: [
        { name: 'Ocean Defenders', avatar: '🌊', score: 8900, members: 24, rallies: 45 },
        { name: 'Coastal Crusaders', avatar: '🏰', score: 7650, members: 18, rallies: 38 },
        { name: 'Beach Patrol', avatar: '🚨', score: 6430, members: 15, rallies: 32 }
      ],
      monthly: [
        { name: 'NewCleanupStar', avatar: '⭐', score: 580, rallies: 4, kg: 23 },
        { name: 'FreshFace', avatar: '😊', score: 420, rallies: 3, kg: 18 },
        { name: 'EcoNewbie', avatar: '🌱', score: 290, rallies: 2, kg: 12 }
      ]
    };
    
    const data = mockData[type] || [];
    
    leaderboardContainer.innerHTML = data.map((item, index) => `
      <div class="leaderboard-item" style="display: flex; align-items: center; padding: 1rem; background: ${index < 3 ? '#f9fafb' : 'white'}; border-radius: 0.5rem; margin-bottom: 0.5rem; border-left: ${index === 0 ? '4px solid #f59e0b' : index === 1 ? '4px solid #e5e7eb' : index === 2 ? '4px solid #cd7c2f' : '4px solid transparent'};">
        <div style="font-size: 1.5rem; margin-right: 1rem; background: #f3f4f6; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          ${index < 3 ? (index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉') : item.avatar}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #374151; margin-bottom: 0.25rem;">${item.name}</div>
          <div style="font-size: 0.875rem; color: #6b7280;">
            ${type === 'teams' ? `${item.members} members • ${item.rallies} rallies` : `${item.rallies} rallies • ${item.kg || 'N/A'} kg cleaned`}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.25rem; font-weight: 600; color: #0ea5e9;">${item.score}</div>
          <div style="font-size: 0.75rem; color: #6b7280;">points</div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Switch leaderboard tab
   */
  switchLeaderboardTab(tabType) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });
    
    // Show selected tab pane
    const targetPane = document.getElementById(`${tabType}-tab`);
    if (targetPane) {
      targetPane.classList.add('active');
      this.loadLeaderboard(tabType);
    }
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    // Add scroll-based animations here
    const scrollY = window.scrollY;
    
    // Parallax effect for hero section (if needed)
    const hero = document.querySelector('.hero');
    if (hero && scrollY < window.innerHeight) {
      const parallaxSpeed = 0.5;
      hero.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Recalculate layouts if needed
    if (this.map) {
      // Resize map
      this.map.invalidateSize();
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e) {
    // ESC key to close modals/menus
    if (e.key === 'Escape') {
      this.closeModals();
      this.closeMobileMenu();
    }
    
    // Tab navigation enhancements
    if (e.key === 'Tab') {
      // Add custom tab behavior if needed
    }
  }

  /**
   * Setup keyboard navigation enhancements
   */
  setupKeyboardNavigation() {
    // Add keyboard support for custom interactive elements
    const interactiveElements = document.querySelectorAll('[role="button"]:not(button)');
    
    interactiveElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  /**
   * Create ARIA live region for announcements
   */
  createAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
  }

  /**
   * Announce content to screen readers
   */
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Show/hide loading overlay
   */
  showLoadingOverlay(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.toggle('active', show);
      overlay.setAttribute('aria-hidden', !show);
      
      if (show) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#0ea5e9'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  /**
   * Show modal (placeholder)
   */
  showModal(type) {
    console.log(`Show ${type} modal`);
    this.showNotification(`${type} functionality coming soon! 🚧`, 'info');
  }

  /**
   * Close modals
   */
  closeModals() {
    // Close any open modals
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const navMenu = document.querySelector('.navbar-menu');
    const navToggle = document.querySelector('.navbar-toggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
    }
  }

  /**
   * Scroll to section
   */
  scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Focus element
   */
  focusElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
    }
  }

  /**
   * Validate form field
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    let isValid = true;
    let message = '';
    
    // Remove existing validation styles
    field.classList.remove('field-error', 'field-success');
    
    // Check required fields
    if (field.required && !value) {
      isValid = false;
      message = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }
    
    // Apply validation styles
    field.classList.add(isValid ? 'field-success' : 'field-error');
    
    // Show validation message
    this.showFieldMessage(field, message, isValid);
    
    return isValid;
  }

  /**
   * Show field validation message
   */
  showFieldMessage(field, message, isValid) {
    // Remove existing message
    const existingMessage = field.parentNode.querySelector('.field-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    if (!isValid && message) {
      const messageEl = document.createElement('div');
      messageEl.className = 'field-message';
      messageEl.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      `;
      messageEl.textContent = message;
      field.parentNode.appendChild(messageEl);
    }
  }

  /**
   * Load initial data
   */
  loadInitialData() {
    // Set default form values
    this.setDefaultFormValues();
    
    // Load user preferences
    this.loadUserPreferences();
  }

  /**
   * Set default form values
   */
  setDefaultFormValues() {
    const rallyDate = document.getElementById('rally-date');
    if (rallyDate) {
      // Set minimum date to today
      const today = new Date();
      const minDate = today.toISOString().slice(0, 16);
      rallyDate.min = minDate;
      
      // Set default to next Saturday at 9 AM
      const nextSaturday = new Date();
      nextSaturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
      nextSaturday.setHours(9, 0, 0, 0);
      rallyDate.value = nextSaturday.toISOString().slice(0, 16);
    }
  }

  /**
   * Load user preferences from localStorage
   */
  loadUserPreferences() {
    try {
      const preferences = localStorage.getItem('shoresquad-preferences');
      if (preferences) {
        const prefs = JSON.parse(preferences);
        // Apply user preferences
        console.log('Loaded user preferences:', prefs);
      }
    } catch (error) {
      console.log('No user preferences found');
    }
  }

  /**
   * Setup service worker for PWA functionality
   */
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  /**
   * Utility: Debounce function calls
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Utility: Throttle function calls
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Utility: Delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ShoreSquadApp();
});

// Handle page visibility for performance optimization
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause non-critical operations
    console.log('Page hidden, pausing operations');
  } else {
    // Page is visible, resume operations
    console.log('Page visible, resuming operations');
    if (window.app) {
      // Refresh weather if data is old
      if (window.app.weatherData) {
        // Check if weather data is older than 1 hour
        const lastUpdate = window.app.weatherData.lastUpdate || 0;
        if (Date.now() - lastUpdate > 3600000) {
          window.app.loadWeatherData(window.app.userLocation);
        }
      }
    }
  }
});

// Export for testing purposes (if running in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ShoreSquadApp };
}