

(function() {
  'use strict';

  console.log('🎯 Chakradhari Lazy Loader Starting...');

  // Configuration
  const CONFIG = {
    rootMargin: '150px',      // Load 150px before entering viewport
    threshold: 0.01,
    mobileMaxWidth: 768,
    tabletMaxWidth: 1024
  };

  // Device detection
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= CONFIG.mobileMaxWidth;
  const isTablet = screenWidth > CONFIG.mobileMaxWidth && screenWidth <= CONFIG.tabletMaxWidth;
  const isDesktop = screenWidth > CONFIG.tabletMaxWidth;

  // Connection detection
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnections = ['slow-2g', '2g', '3g'];
  const isSlowConnection = connection && slowConnections.includes(connection.effectiveType);
  const hasSaveData = connection && connection.saveData;

  console.log('📱 Device:', isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop');
  console.log('🌐 Connection:', connection?.effectiveType || 'Unknown');

  /**
   * Add loading spinner styles (injected once)
   */
  function addSpinnerStyles() {
    if (document.getElementById('lazy-loader-styles')) return;

    const style = document.createElement('style');
    style.id = 'lazy-loader-styles';
    style.textContent = `
      .lazy-loading-wrapper {
        position: relative;
        min-height: 300px;
        background: linear-gradient(135deg, rgba(0, 150, 255, 0.05) 0%, rgba(0, 150, 255, 0.02) 100%);
        border-radius: 12px;
        overflow: hidden;
      }

      .lazy-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        z-index: 5;
      }

      .lazy-spinner::after {
        content: '';
        display: block;
        width: 40px;
        height: 40px;
        margin: 5px;
        border-radius: 50%;
        border: 3px solid #0096ff;
        border-color: #0096ff transparent #0096ff transparent;
        animation: lazy-spinner 1.2s linear infinite;
      }

      @keyframes lazy-spinner {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .lazy-image-loading {
        opacity: 0;
        transition: opacity 0.6s ease;
      }

      .lazy-image-loaded {
        opacity: 1;
      }

      .lazy-spinner.hidden {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Get the best image source for current device/connection
   */
  function getBestImageSource(originalSrc) {
    // Generate mobile version path
    const mobileSrc = originalSrc.replace(/\.gif$/, '-mobile.gif');
    
    // On mobile/tablet or slow connection, prefer mobile version
    if ((isMobile || isTablet || isSlowConnection || hasSaveData)) {
      console.log('📱 Will attempt mobile version for:', originalSrc);
      return { primary: mobileSrc, fallback: originalSrc };
    }

    // Desktop with good connection uses full quality
    return { primary: originalSrc, fallback: null };
  }

  /**
   * Wrap image with loading container and spinner
   */
  function wrapImageWithLoader(img) {
    // Skip if already wrapped
    if (img.parentElement.classList.contains('lazy-loading-wrapper')) {
      return img.parentElement;
    }

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'lazy-loading-wrapper';

    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'lazy-spinner';

    // Insert wrapper and move image into it
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(spinner);
    wrapper.appendChild(img);

    return wrapper;
  }

  /**
   * Load image with fallback support
   */
  function loadImage(img, wrapper, spinner) {
    const originalSrc = img.dataset.originalSrc || img.src;
    const { primary, fallback } = getBestImageSource(originalSrc);

    console.log('📥 Loading:', primary);

    // Mark as loading
    img.classList.add('lazy-image-loading');

    // Try loading primary source
    const tempImg = new Image();
    
    tempImg.onload = function() {
      console.log('✅ Loaded:', primary);
      img.src = primary;
      img.classList.remove('lazy-image-loading');
      img.classList.add('lazy-image-loaded');
      spinner.classList.add('hidden');
    };

    tempImg.onerror = function() {
      console.warn('⚠️ Failed to load:', primary);
      
      // Try fallback if available
      if (fallback && fallback !== primary) {
        console.log('🔄 Trying fallback:', fallback);
        const fallbackImg = new Image();
        
        fallbackImg.onload = function() {
          console.log('✅ Fallback loaded:', fallback);
          img.src = fallback;
          img.classList.remove('lazy-image-loading');
          img.classList.add('lazy-image-loaded');
          spinner.classList.add('hidden');
        };

        fallbackImg.onerror = function() {
          console.error('❌ Both versions failed:', originalSrc);
          img.classList.remove('lazy-image-loading');
          spinner.classList.add('hidden');
          img.alt = 'Image failed to load';
        };

        fallbackImg.src = fallback;
      } else {
        console.error('❌ Load failed:', originalSrc);
        img.classList.remove('lazy-image-loading');
        spinner.classList.add('hidden');
      }
    };

    tempImg.src = primary;
  }

  /**
   * Setup lazy loading for all capability GIFs
   */
  function setupLazyLoading() {
    // Target all GIF images in capability sections and hero
    const images = document.querySelectorAll('.capability-gif, .hero-image-wrapper img');
    
    if (images.length === 0) {
      console.warn('⚠️ No images found with .capability-gif class');
      return;
    }

    console.log(`🖼️ Found ${images.length} images to lazy load`);

    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) {
      console.warn('⚠️ IntersectionObserver not supported, loading all images immediately');
      images.forEach(img => {
        const wrapper = wrapImageWithLoader(img);
        const spinner = wrapper.querySelector('.lazy-spinner');
        img.dataset.originalSrc = img.src;
        loadImage(img, wrapper, spinner);
      });
      return;
    }

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const wrapper = img.closest('.lazy-loading-wrapper');
          const spinner = wrapper?.querySelector('.lazy-spinner');
          
          if (wrapper && spinner) {
            loadImage(img, wrapper, spinner);
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: CONFIG.rootMargin,
      threshold: CONFIG.threshold
    });

    // Process each image
    images.forEach(img => {
      // Store original src
      img.dataset.originalSrc = img.src;
      
      // Wrap with loader
      const wrapper = wrapImageWithLoader(img);
      const spinner = wrapper.querySelector('.lazy-spinner');
      
      // Clear src to prevent immediate loading
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1px transparent GIF
      
      // Start observing
      observer.observe(img);
      console.log('👁️ Observing:', img.dataset.originalSrc);
    });

    console.log('✅ Lazy loading setup complete');
  }

  /**
   * Initialize everything
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('🚀 Initializing Chakradhari Lazy Loader');
    
    // Add required styles
    addSpinnerStyles();
    
    // Setup lazy loading
    setTimeout(() => {
      setupLazyLoading();
    }, 100); // Small delay to ensure all images are in DOM

    console.log('✨ Lazy loader ready!');
  }

  // Start initialization
  init();

  // Expose utility functions
  window.ChakradhariLazyLoad = {
    info: () => {
      console.log('📊 Lazy Load Status:', {
        device: isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop',
        connection: connection?.effectiveType || 'Unknown',
        dataSaver: hasSaveData,
        imagesFound: document.querySelectorAll('.capability-gif').length
      });
    },
    reload: () => {
      console.log('🔄 Reloading lazy loader...');
      setupLazyLoading();
    }
  };

})();