// Modern Contact Page JavaScript
// Enhanced functionality with smooth animations and modern interactions

document.addEventListener('DOMContentLoaded', function() {
    initializeModernContactPage();
});

// Main initialization function
function initializeModernContactPage() {
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initHeroAnimations();
    initCardInteractions();
    initFormHandling();
    initMapLinks();
    initSmoothScrolling();
    initParallaxEffects();
    initAccessibility();
    initPerformanceOptimizations();
}

/* ======================================
   HEADER FUNCTIONALITY
====================================== */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let isScrollingDown = false;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Hide/show header on scroll (only if menu is not open)
        if (!document.body.classList.contains('menu-open')) {
            if (currentScroll > lastScroll && !isScrollingDown && currentScroll > 200) {
                isScrollingDown = true;
                header.style.transform = 'translateY(-100%)';
            } else if (currentScroll < lastScroll && isScrollingDown) {
                isScrollingDown = false;
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

/* ======================================
   MOBILE NAVIGATION
====================================== */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle menu on button click
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileMenu();
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    function toggleMobileMenu() {
        const isOpen = navToggle.classList.contains('active');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Trap focus in menu
        navMenu.querySelector('.nav-link')?.focus();
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

/* ======================================
   SCROLL ANIMATIONS
====================================== */
function initScrollAnimations() {
    // Initialize AOS with enhanced settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 0,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });

        // Refresh AOS on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                AOS.refresh();
            }, 250);
        });
    }

    // Custom scroll-triggered animations
    initCustomScrollAnimations();
}

function initCustomScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for custom animations
    const animatedElements = document.querySelectorAll('.stat-item, .contact-card, .location-card, .insurance-card, .faq-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ======================================
   HERO ANIMATIONS
====================================== */
function initHeroAnimations() {
    const heroShapes = document.querySelectorAll('.shape');
    const floatingElements = document.querySelectorAll('.float-element');
    
    // Add staggered animation delays to shapes
    heroShapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.5}s`;
    });

    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 1}s`;
    });

    // Parallax effect for hero content
    let ticking = false;
    
    function updateHeroParallax() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const heroShapes = document.querySelector('.floating-shapes');
        
        if (heroContent && scrolled < window.innerHeight) {
            const rate = scrolled * -0.3;
            heroContent.style.transform = `translateY(${rate}px)`;
        }
        
        if (heroShapes && scrolled < window.innerHeight) {
            const rate = scrolled * -0.1;
            heroShapes.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestAnimationFrame(updateHeroParallax);
            ticking = true;
        }
    });
}

/* ======================================
   CARD INTERACTIONS
====================================== */
function initCardInteractions() {
    // Contact cards hover effects
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        initCardHover(card);
    });

    // Location cards hover effects
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        initCardHover(card);
    });

    // Insurance cards hover effects
    const insuranceCards = document.querySelectorAll('.insurance-card');
    insuranceCards.forEach(card => {
        initCardHover(card);
    });

    // FAQ items hover effects
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(card => {
        initCardHover(card);
    });

    function initCardHover(card) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        card.addEventListener('mouseenter', () => {
            animateCardHover(card, true);
        });

        card.addEventListener('mouseleave', () => {
            animateCardHover(card, false);
        });

        // Touch support for mobile
        card.addEventListener('touchstart', () => {
            animateCardHover(card, true);
        });

        card.addEventListener('touchend', () => {
            setTimeout(() => animateCardHover(card, false), 150);
        });
    }

    function animateCardHover(card, isHover) {
        const icon = card.querySelector('.card-icon, .detail-icon, .insurance-icon, .faq-icon');
        
        if (isHover) {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = 'var(--shadow-2xl)';
            
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.background = 'var(--gold-gradient)';
            }
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-lg)';
            
            if (icon) {
                icon.style.transform = 'scale(1)';
                if (!icon.classList.contains('detail-icon')) {
                    icon.style.background = 'var(--primary-blue)';
                } else {
                    icon.style.background = 'var(--primary-blue-light)';
                }
            }
        }
    }
}

/* ======================================
   FORM HANDLING
====================================== */
function initFormHandling() {
    // Monitor Elfsight widget loading
    const formContainer = document.querySelector('.form-widget');
    if (!formContainer) return;

    const elfsightWidget = formContainer.querySelector('[data-elfsight-app-lazy]');
    if (!elfsightWidget) return;

    // Add loading state
    formContainer.classList.add('loading');
    
    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'form-loading';
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading contact form...</p>
    `;
    formContainer.appendChild(loadingIndicator);

    // Check if widget is loaded
    const checkInterval = setInterval(() => {
        const widgetContent = elfsightWidget.querySelector('.elfsight-app-widget');
        
        if (widgetContent) {
            clearInterval(checkInterval);
            formContainer.classList.remove('loading');
            if (loadingIndicator.parentNode) {
                loadingIndicator.remove();
            }
            
            // Add success styling
            formContainer.classList.add('loaded');
            
            // Trigger animation
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 100);
        }
    }, 500);

    // Stop checking after 15 seconds
    setTimeout(() => {
        clearInterval(checkInterval);
        if (formContainer.classList.contains('loading')) {
            formContainer.classList.remove('loading');
            formContainer.classList.add('error');
            
            if (loadingIndicator.parentNode) {
                loadingIndicator.innerHTML = `
                    <div class="error-icon">⚠️</div>
                    <p>Form loading error. Please <a href="tel:9176176731">call us directly</a> or <a href="mailto:duhlig2004@yahoo.com">send an email</a>.</p>
                `;
            }
        }
    }, 15000);

    // Smooth scroll to form when clicking CTA buttons
    const formCTAButtons = document.querySelectorAll('a[href="#contact-form"]');
    formCTAButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo(formContainer, 1000);
        });
    });
}

/* ======================================
   MAP LINKS FUNCTIONALITY
====================================== */
function initMapLinks() {
    const directionsLinks = document.querySelectorAll('.directions-link');
    
    directionsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add analytics tracking if needed
            gtag && gtag('event', 'directions_click', {
                'event_category': 'engagement',
                'event_label': link.textContent.trim()
            });
            
            // Add visual feedback
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

/* ======================================
   SMOOTH SCROLLING
====================================== */
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target, 800);
            }
        });
    });
}

function smoothScrollTo(element, duration = 800) {
    const targetPosition = element.offsetTop - 100; // Account for fixed header
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    // Easing function
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

/* ======================================
   PARALLAX EFFECTS
====================================== */
function initParallaxEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parallaxElements = document.querySelectorAll('.floating-shapes, .floating-elements');
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * (0.1 + index * 0.05);
            element.style.transform = `translateY(${rate}px)`;
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/* ======================================
   ACCESSIBILITY ENHANCEMENTS
====================================== */
function initAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }

    // Enhanced focus management
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused');
        });

        element.addEventListener('blur', () => {
            element.classList.remove('focused');
        });
    });

    // Keyboard navigation for cards
    const interactiveCards = document.querySelectorAll('.contact-card, .location-card, .insurance-card, .faq-item');
    
    interactiveCards.forEach(card => {
        // Make cards focusable
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });

    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

/* ======================================
   PERFORMANCE OPTIMIZATIONS
====================================== */
function initPerformanceOptimizations() {
    // Intersection Observer for lazy loading animations
    const lazyElements = document.querySelectorAll('[data-aos]');
    
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        lazyElements.forEach(el => {
            lazyObserver.observe(el);
        });
    }

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 100);
        
        document.body.classList.add('scrolling');
    });

    // Preload critical resources
    const criticalImages = [
        'logo.png',
        'elanstechlogo.jpeg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/* ======================================
   UTILITY FUNCTIONS
====================================== */

// Throttle function for performance
function throttle(func, limit) {
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

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        // Disable animations
        document.body.classList.add('reduce-motion');
        if (typeof AOS !== 'undefined') {
            AOS.init({ disable: true });
        }
    } else {
        // Re-enable animations
        document.body.classList.remove('reduce-motion');
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: false,
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }
    }
});

// Initialize reduced motion check
if (prefersReducedMotion.matches) {
    document.body.classList.add('reduce-motion');
}

/* ======================================
   ERROR HANDLING
====================================== */
window.addEventListener('error', (e) => {
    console.error('Contact page error:', e.error);
    
    // Graceful degradation for critical features
    if (e.error.message.includes('AOS')) {
        console.warn('AOS failed to load, continuing without animations');
    }
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

/* ======================================
   ANALYTICS & TRACKING
====================================== */
function trackUserInteraction(action, element) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'contact_page',
            'event_label': element,
            'value': 1
        });
    }
    
    // Custom analytics if needed
    if (window.customAnalytics) {
        window.customAnalytics.track(action, {
            page: 'contact',
            element: element,
            timestamp: Date.now()
        });
    }
}

// Track important interactions
document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    if (target.href && target.href.includes('tel:')) {
        trackUserInteraction('phone_click', 'contact_phone');
    } else if (target.href && target.href.includes('mailto:')) {
        trackUserInteraction('email_click', 'contact_email');
    } else if (target.href && target.href.includes('maps.google.com')) {
        trackUserInteraction('directions_click', 'office_location');
    }
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeModernContactPage,
        smoothScrollTo,
        throttle,
        debounce
    };
}
