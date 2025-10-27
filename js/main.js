// ====================================================
// MAIN.JS - Handles all animations and interactions
// ====================================================

// Content data (inline - replace with YAML parser if needed)
const content = {
  company: {
    name: "Chakradhari Computational Technologies Pvt. Ltd.",
    tagline: "Where Science Meets Computation",
  },
  hero: {
    title: "Where Science Meets Computation",
    subtitle: "Bridging frontier research and real-world application through rigorous computational intelligence",
    cta_primary: "Explore Our Work",
    cta_secondary: "Get in Touch"
  },
  mission: {
    title: "Mission",
    intro: "We explore, implement, and deploy the latest computational advances across physics, engineering, and data science to solve real problems. Our mission rests on three pillars:",
    pillars: [
      {
        title: "Consulting for Deep Science Projects",
        description: "Partnering with industries, research labs, and government bodies to design and implement simulation-driven solutions — from quantum systems to traffic models, from electromagnetic devices to ecosystem modeling."
      },
      {
        title: "R&D and Software Development",
        description: "Translating cutting-edge research into high-performance, production-grade tools. We specialize in scalable algorithms, HPC optimization, and domain-specific modeling, built with scientific rigor."
      },
      {
        title: "Education and Open Science",
        description: "Contributing open-source software, dashboards, and boot camps for advanced learning in computational physics, quantum computing, and digital twin technologies — fostering accessible science education."
      }
    ]
  },
  philosophy: {
    title: "Our Philosophy",
    content: "Science is evolving fast. Most industries lag behind because they rely on decade-old algorithms and methods. Chakradhari's strength lies in constantly reading the latest research, testing it, and transforming it into reliable, deployable solutions. We don't just code; we research, validate, and build."
  },
  values: {
    title: "Core Values",
    items: [
      {
        name: "Rigor",
        description: "Every solution is grounded in verified science."
      },
      {
        name: "Curiosity",
        description: "We stay at the edge of what's possible in computational science."
      },
      {
        name: "Integrity",
        description: "Knowledge from client projects stays protected; independent work fuels our open contributions."
      },
      {
        name: "Accessibility",
        description: "Complex science should not remain locked in journals — it should be teachable, tangible, and usable."
      }
    ]
  },
  capabilities: {
    title: "Capabilities",
    subtitle: "Transforming cutting-edge research into production-grade solutions",
    items: [
      {
        title: "Scientific Simulation & Modeling",
        description: "Computational electromagnetics, optics, climate and ecosystem modeling, quantum computing, and beyond.",
        tags: ["Electromagnetics", "Quantum", "Climate Modeling"]
      },
      {
        title: "Algorithmic Innovation",
        description: "Implementing the newest numerical methods from literature into industrial workflows.",
        tags: ["HPC", "Numerical Methods", "Optimization"]
      },
      {
        title: "Digital Twin Development",
        description: "Building physics-driven digital twins for predictive analysis and optimization.",
        tags: ["Real-time", "Predictive", "IoT Integration"]
      }
    ]
  },
  education: {
    title: "Education & Open Science",
    subtitle: "Making computational science accessible to everyone",
    description: "Interactive dashboards for quantum computing, digital twins, and physical simulations. Focused boot camps for universities, researchers, and engineers.",
    features: [
      "Interactive simulation dashboards",
      "Quantum computing tutorials",
      "HPC training programs",
      "Open-source contributions"
    ]
  },
  contact: {
    title: "Let's Build Something Revolutionary",
    subtitle: "Ready to transform your computational challenges into breakthrough solutions?",
    email: "info@chakradhari.com",
    phone: "+91-XXX-XXX-XXXX",
    address: "Bengaluru, Karnataka, India"
  }
};

// ====================================================
// INITIALIZATION
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderBehavior();
  initMobileMenu();
  initSmoothScroll();
});

// ====================================================
// SCROLL-TRIGGERED ANIMATIONS
// ====================================================

function initScrollAnimations() {
  // Create intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class based on data attribute
        const animationClass = entry.target.dataset.animation || 'fade-in-up';
        entry.target.classList.add(animationClass);
        
        // Stagger child animations if they exist
        const children = entry.target.querySelectorAll('[data-stagger]');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0) translateX(0)';
          }, index * 150);
        });
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation triggers
  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach(el => observer.observe(el));
}

// ====================================================
// HEADER SCROLL BEHAVIOR
// ====================================================

function initHeaderBehavior() {
  // Header is now always visible - no scroll behavior needed
  // Keep function empty or add subtle effects like shadow on scroll
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

// ====================================================
// MOBILE MENU TOGGLE
// ====================================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking nav links
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }
}

// ====================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================================

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ====================================================
// PARALLAX EFFECT (subtle, performant)
// ====================================================

function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length > 0) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          
          parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
          });
          
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }
}

// ====================================================
// CARD HOVER EFFECTS (3D tilt - optional)
// ====================================================

function init3DCardEffects() {
  const cards = document.querySelectorAll('.pillar-card, .capability-item');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Optional: Initialize 3D effects (uncomment if desired)
// document.addEventListener('DOMContentLoaded', init3DCardEffects);

// ====================================================
// PERFORMANCE OPTIMIZATIONS
// ====================================================

// Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ====================================================
// UTILITY FUNCTIONS
// ====================================================

// Debounce function for performance
function debounce(func, wait) {
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

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ====================================================
// ACCESSIBILITY ENHANCEMENTS
// ====================================================

// Add keyboard navigation support
document.addEventListener('DOMContentLoaded', () => {
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
  
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });

  // Add Enter key support for role="button" elements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.getAttribute('role') === 'button') {
      e.target.click();
    }
  });
});

// ====================================================
// CONSOLE SIGNATURE (optional branding)
// ====================================================

console.log(
  '%c Chakradhari Computational Technologies ',
  'background: linear-gradient(135deg, #0096ff 0%, #00d4ff 100%); color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: bold;'
);
console.log(
  '%c Where Science Meets Computation ',
  'color: #0096ff; font-size: 12px; font-style: italic;'
);