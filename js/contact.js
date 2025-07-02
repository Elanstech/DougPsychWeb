/**
 * Contact Page JavaScript - Complete Implementation
 * @version 2.0.0
 * @lastUpdated 2025-02-07
 * 
 * Handles all functionality for the redesigned contact page including:
 * - Header and navigation
 * - Hero animations
 * - Contact form integration
 * - Card interactions
 * - Location maps
 * - Insurance section
 * - FAQ interactions
 * - Accessibility features
 * - Performance optimizations
 */

// ===============================
// INITIALIZATION & CORE SETUP
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// Main initialization function
function initializeContactPage() {
    try {
        // Core components
        initHeader();
        initMobileNavigation();
        initHeroSection();
        
        // Main sections
        initContactInfoSection();
        initLocationsSection();
        initInsuranceSection();
        initFAQSection();
        initCTASection();
        
        // Utilities and enhancements
        initScrollAnimations();
        initSmoothScrolling();
        initAccessibilityFeatures();
        initPerformanceOptimizations();
        
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 0,
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        }
        
        console.log('Contact page initialized successfully');
    } catch (error) {
        console.error('Error initializing contact page:', error);
        // Graceful degradation - page should still function without JS enhancements
    }
}

// ===============================
// HEADER & NAVIGATION
// ===============================
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
    }, { passive: true });
}

function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    if (!navToggle || !navMenu) return;

    // Toggle menu function
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
        
        // Ensure header is visible when menu is open
        if (header) {
            header.style.transform = 'translateY(0)';
        }
        
        // Trap focus in menu
        const firstFocusable = navMenu.querySelector('.nav-link');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Animate menu items
        const menuItems = navMenu.querySelectorAll('.nav-link, .btn-consultation');
        menuItems.forEach((item, index) => {
            item.style.transform = 'translateX(20px)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, index * 50);
        });
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset menu item animations
        const menuItems = navMenu.querySelectorAll('.nav-link, .btn-consultation');
        menuItems.forEach(item => {
            item.style.transform = '';
            item.style.opacity = '';
            item.style.transition = '';
        });
    }

    // Event listeners
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking nav links
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
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
            navToggle.focus();
        }
    });

    // Handle focus trap in mobile menu
    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// ===============================
// HERO SECTION
// ===============================
function initHeroSection() {
    const heroSection = document.querySelector('.contact-hero');
    if (!heroSection) return;

    // Animate hero stats
    initHeroStats();
    
    // Add floating animation to background elements
    initHeroBackground();
    
    // Handle scroll parallax
    initHeroParallax();
}

function initHeroStats() {
    const statItems = document.querySelectorAll('.hero-stats .stat-item');
    
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }

    function animateStats() {
        statItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                
                // Animate the number counting
                const numberElement = item.querySelector('.stat-number');
                if (numberElement) {
                    animateCounter(numberElement);
                }
            }, index * 150);
        });
    }

    function animateCounter(element) {
        const finalValue = element.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        const suffix = finalValue.replace(/\d/g, '');
        
        if (isNaN(numericValue)) return;

        let currentValue = 0;
        const increment = numericValue / 60; // 60 frames for 1 second at 60fps
        const duration = 1500;
        const frameTime = duration / 60;

        element.textContent = '0' + suffix;

        const counter = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                element.textContent = finalValue;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }
        }, frameTime);
    }
}

function initHeroBackground() {
    // Add subtle floating animation to background elements
    const backgroundElements = document.querySelectorAll('.contact-hero-bg::before, .contact-hero-bg::after');
    
    // Create floating animation with CSS custom properties
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-gentle {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
        }
    `;
    document.head.appendChild(style);
}

function initHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.contact-hero .container');
        const heroBackground = document.querySelector('.contact-hero-bg');
        
        if (scrolled < window.innerHeight) {
            if (heroContent) {
                const rate = scrolled * -0.2;
                heroContent.style.transform = `translateY(${rate}px)`;
            }
            
            if (heroBackground) {
                const rate = scrolled * -0.1;
                heroBackground.style.transform = `translateY(${rate}px)`;
            }
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// ===============================
// CONTACT INFO SECTION
// ===============================
function initContactInfoSection() {
    initContactForm();
    initContactCards();
}

function initContactForm() {
    const formContainer = document.querySelector('.form-widget');
    const elfsightWidget = document.querySelector('[data-elfsight-app-lazy]');
    
    if (!formContainer || !elfsightWidget) return;

    // Add loading state
    formContainer.classList.add('loading');
    
    // Create enhanced loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'form-loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p class="loading-text">Loading contact form...</p>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
        </div>
    `;
    
    // Add loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .form-loading-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            background: rgba(248, 249, 250, 0.8);
            border-radius: 16px;
            margin: 20px 0;
        }
        
        .loading-content {
            text-align: center;
            padding: 2rem;
        }
        
        .loading-spinner {
            position: relative;
            width: 60px;
            height: 60px;
            margin: 0 auto 1.5rem;
        }
        
        .spinner-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-top-color: var(--royal-blue);
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
        }
        
        .spinner-ring:nth-child(2) {
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
            border-top-color: var(--metallic-gold);
            animation-delay: -0.5s;
        }
        
        .spinner-ring:nth-child(3) {
            width: 60%;
            height: 60%;
            top: 20%;
            left: 20%;
            border-top-color: var(--royal-blue-light);
            animation-delay: -1s;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-text {
            color: var(--text-medium);
            font-size: 1.1rem;
            margin-bottom: 1rem;
            font-weight: 500;
        }
        
        .loading-progress {
            width: 200px;
            height: 4px;
            background: rgba(26, 35, 126, 0.1);
            border-radius: 2px;
            margin: 0 auto;
            overflow: hidden;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--royal-blue), var(--metallic-gold));
            width: 0%;
            border-radius: 2px;
            animation: progress 3s ease-in-out infinite;
        }
        
        @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(loadingStyles);
    
    formContainer.appendChild(loadingIndicator);

    // Enhanced widget loading detection
    let checkAttempts = 0;
    const maxAttempts = 30; // 15 seconds total
    
    const checkInterval = setInterval(() => {
        checkAttempts++;
        
        // Check for various indicators that the widget has loaded
        const widgetContent = elfsightWidget.querySelector('.elfsight-app-widget, iframe, form, .eapps-form');
        const hasContent = widgetContent && (
            widgetContent.offsetHeight > 50 || 
            widgetContent.querySelector('input, textarea, button')
        );
        
        if (hasContent || checkAttempts >= maxAttempts) {
            clearInterval(checkInterval);
            
            if (hasContent) {
                // Success - widget loaded
                formContainer.classList.remove('loading');
                formContainer.classList.add('loaded');
                
                if (loadingIndicator.parentNode) {
                    loadingIndicator.style.opacity = '0';
                    setTimeout(() => {
                        loadingIndicator.remove();
                    }, 300);
                }
                
                // Add success animation
                setTimeout(() => {
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                    
                    // Trigger success notification
                    showNotification('Contact form loaded successfully!', 'success');
                }, 100);
                
            } else {
                // Error - widget failed to load
                handleFormLoadError(formContainer, loadingIndicator);
            }
        }
    }, 500);

    // Fallback error handling
    setTimeout(() => {
        if (formContainer.classList.contains('loading')) {
            clearInterval(checkInterval);
            handleFormLoadError(formContainer, loadingIndicator);
        }
    }, 20000); // 20 second maximum wait time
    
    // Handle form CTA button clicks
    initFormCTAButtons();
}

function handleFormLoadError(formContainer, loadingIndicator) {
    formContainer.classList.remove('loading');
    formContainer.classList.add('error');
    
    if (loadingIndicator.parentNode) {
        loadingIndicator.innerHTML = `
            <div class="error-content">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Form Loading Error</h3>
                <p>We're experiencing technical difficulties with our contact form.</p>
                <div class="error-actions">
                    <a href="tel:9176176731" class="btn-error-action">
                        <i class="fas fa-phone"></i>
                        Call Us: (917) 617-6731
                    </a>
                    <a href="mailto:duhlig2004@yahoo.com" class="btn-error-action">
                        <i class="fas fa-envelope"></i>
                        Email Us
                    </a>
                </div>
                <button class="btn-retry" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    Retry
                </button>
            </div>
        `;
        
        // Add error styles
        const errorStyles = document.createElement('style');
        errorStyles.textContent = `
            .error-content {
                text-align: center;
                padding: 2rem;
                color: var(--text-dark);
            }
            
            .error-icon {
                font-size: 3rem;
                color: #e74c3c;
                margin-bottom: 1rem;
            }
            
            .error-content h3 {
                color: var(--royal-blue);
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            
            .error-content p {
                color: var(--text-medium);
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .error-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }
            
            .btn-error-action {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.8rem 1.5rem;
                background: var(--royal-blue);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .btn-error-action:hover {
                background: var(--metallic-gold);
                transform: translateY(-2px);
                color: var(--royal-blue);
            }
            
            .btn-retry {
                background: var(--metallic-gold);
                color: var(--royal-blue);
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 25px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .btn-retry:hover {
                background: var(--royal-blue);
                color: white;
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .error-actions {
                    flex-direction: column;
                    align-items: center;
                }
                
                .btn-error-action {
                    width: 100%;
                    max-width: 250px;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(errorStyles);
    }
    
    // Show error notification
    showNotification('Contact form failed to load. Please use the phone or email options.', 'error');
}

function initFormCTAButtons() {
    const formCTAButtons = document.querySelectorAll('a[href="#contact-form"], .btn-secondary');
    
    formCTAButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.getAttribute('href') === '#contact-form') {
                e.preventDefault();
                
                const formSection = document.querySelector('.contact-form-container');
                if (formSection) {
                    smoothScrollTo(formSection, 1000);
                    
                    // Focus on form after scroll
                    setTimeout(() => {
                        const firstInput = formSection.querySelector('input, textarea');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 1000);
                }
            }
        });
    });
}

function initContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        initCardInteractions(card);
        addCardAccessibility(card);
    });
}

function initCardInteractions(card) {
    const cardIcon = card.querySelector('.card-icon');
    const cardAction = card.querySelector('.card-action');
    
    // Enhanced hover effects
    card.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            
            if (cardIcon) {
                cardIcon.style.transform = 'scale(1.1) rotate(5deg)';
                cardIcon.style.background = 'var(--gold-gradient-metallic)';
            }
            
            if (cardAction) {
                const button = cardAction.querySelector('.btn-contact');
                if (button) {
                    button.style.transform = 'translateY(-2px)';
                }
            }
        }
    });

    card.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
            
            if (cardIcon) {
                cardIcon.style.transform = 'scale(1) rotate(0deg)';
                cardIcon.style.background = 'var(--royal-blue)';
            }
            
            if (cardAction) {
                const button = cardAction.querySelector('.btn-contact');
                if (button) {
                    button.style.transform = 'translateY(0)';
                }
            }
        }
    });

    // Touch effects for mobile
    card.addEventListener('touchstart', () => {
        if (window.innerWidth < 1024) {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.2s ease';
        }
    });

    card.addEventListener('touchend', () => {
        if (window.innerWidth < 1024) {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 200);
        }
    });

    // Handle contact link clicks
    const contactLinks = card.querySelectorAll('.contact-link, .btn-contact');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add click animation
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = '';
            }, 150);
            
            // Track interaction
            trackContactInteraction(link);
        });
    });
}

function addCardAccessibility(card) {
    // Make cards focusable for keyboard navigation
    card.setAttribute('tabindex', '0');
    
    // Add ARIA labels
    const cardTitle = card.querySelector('h4');
    if (cardTitle) {
        card.setAttribute('aria-label', cardTitle.textContent);
    }
    
    // Handle keyboard navigation
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            
            // Find and trigger the primary action
            const primaryAction = card.querySelector('.btn-contact, .contact-link');
            if (primaryAction) {
                primaryAction.click();
            }
        }
    });
    
    // Add focus styles
    card.addEventListener('focus', () => {
        card.style.outline = '2px solid var(--metallic-gold)';
        card.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', () => {
        card.style.outline = '';
        card.style.outlineOffset = '';
    });
}

// ===============================
// LOCATIONS SECTION
// ===============================
function initLocationsSection() {
    const locationCards = document.querySelectorAll('.location-card');
    
    locationCards.forEach(card => {
        initLocationCard(card);
    });
    
    initLocationMaps();
    initDirectionsButtons();
}

function initLocationCard(card) {
    const detailIcons = card.querySelectorAll('.detail-icon');
    const features = card.querySelectorAll('.feature');
    
    // Card hover effects
    card.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.style.transform = 'translateY(-10px)';
            
            // Animate detail icons
            detailIcons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.style.background = 'var(--gold-gradient-metallic)';
                    icon.style.transform = 'scale(1.1)';
                }, index * 100);
            });
            
            // Animate features
            features.forEach((feature, index) => {
                setTimeout(() => {
                    const icon = feature.querySelector('i');
                    if (icon) {
                        icon.style.color = 'var(--metallic-gold)';
                        icon.style.transform = 'scale(1.2)';
                    }
                }, index * 50);
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
            card.style.transform = 'translateY(0)';
            
            // Reset detail icons
            detailIcons.forEach(icon => {
                icon.style.background = 'var(--royal-blue-light)';
                icon.style.transform = 'scale(1)';
            });
            
            // Reset features
            features.forEach(feature => {
                const icon = feature.querySelector('i');
                if (icon) {
                    icon.style.color = 'var(--royal-blue)';
                    icon.style.transform = 'scale(1)';
                }
            });
        }
    });
}

function initLocationMaps() {
    const mapIframes = document.querySelectorAll('.location-image iframe');
    
    mapIframes.forEach(iframe => {
        // Add loading state
        const container = iframe.parentElement;
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'map-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="map-loading-content">
                <div class="map-loading-spinner"></div>
                <p>Loading map...</p>
            </div>
        `;
        
        // Add loading styles
        const mapLoadingStyles = document.createElement('style');
        mapLoadingStyles.textContent = `
            .map-loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(248, 249, 250, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                transition: opacity 0.3s ease;
            }
            
            .map-loading-content {
                text-align: center;
                color: var(--text-medium);
            }
            
            .map-loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(26, 35, 126, 0.1);
                border-top-color: var(--royal-blue);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
        `;
        document.head.appendChild(mapLoadingStyles);
        
        container.style.position = 'relative';
        container.appendChild(loadingOverlay);
        
        // Handle iframe load
        iframe.addEventListener('load', () => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.remove();
                }
            }, 300);
        });
        
        // Handle iframe error
        iframe.addEventListener('error', () => {
            loadingOverlay.innerHTML = `
                <div class="map-error-content">
                    <i class="fas fa-map-marker-alt" style="font-size: 2rem; color: var(--royal-blue); margin-bottom: 1rem;"></i>
                    <p>Map unavailable</p>
                    <small>Click "Get Directions" below</small>
                </div>
            `;
        });
        
        // Add click handler for maps (for mobile touch)
        iframe.addEventListener('click', () => {
            // Track map interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'map_interaction', {
                    'event_category': 'engagement',
                    'event_label': 'map_click'
                });
            }
        });
    });
}

function initDirectionsButtons() {
    const directionsButtons = document.querySelectorAll('.btn-directions, .directions-link');
    
    directionsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Track directions click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'directions_click', {
                    'event_category': 'engagement',
                    'event_label': button.textContent.trim()
                });
            }
            
            // Show loading state briefly
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
            
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 1000);
        });
    });
}

// ===============================
// INSURANCE SECTION
// ===============================
function initInsuranceSection() {
    const insuranceCards = document.querySelectorAll('.insurance-card');
    
    insuranceCards.forEach(card => {
        initInsuranceCard(card);
    });
    
    initInsuranceVerification();
}

function initInsuranceCard(card) {
    const insuranceIcon = card.querySelector('.insurance-icon');
    const insuranceList = card.querySelectorAll('.insurance-item');
    
    // Card hover effects
    card.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.style.transform = 'translateY(-10px)';
            
            if (insuranceIcon) {
                insuranceIcon.style.background = 'var(--gold-gradient-metallic)';
                insuranceIcon.style.transform = 'scale(1.1)';
            }
            
            // Animate insurance items
            insuranceList.forEach((item, index) => {
                setTimeout(() => {
                    const icon = item.querySelector('i');
                    if (icon) {
                        icon.style.color = 'var(--metallic-gold)';
                        icon.style.transform = 'scale(1.2)';
                    }
                }, index * 50);
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
            card.style.transform = 'translateY(0)';
            
            if (insuranceIcon) {
                insuranceIcon.style.background = 'var(--royal-blue)';
                insuranceIcon.style.transform = 'scale(1)';
            }
            
            // Reset insurance items
            insuranceList.forEach(item => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.color = 'var(--royal-blue)';
                    icon.style.transform = 'scale(1)';
                }
            });
        }
    });
}

function initInsuranceVerification() {
    const verifyButtons = document.querySelectorAll('.btn-verify');
    
    verifyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Track verification click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'insurance_verification_click', {
                    'event_category': 'engagement',
                    'event_label': 'insurance_verification'
                });
            }
            
            // Show temporary feedback
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 1500);
        });
    });
}

// ===============================
// FAQ SECTION
// ===============================
function initFAQSection() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        initFAQItem(item);
    });
}

function initFAQItem(item) {
    const faqIcon = item.querySelector('.faq-icon');
    const faqContent = item.querySelector('.faq-content');
    
    // Hover effects
    item.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            item.style.transform = 'translateY(-10px)';
            
            if (faqIcon) {
                faqIcon.style.background = 'var(--gold-gradient-metallic)';
                faqIcon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        }
    });

    item.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
            item.style.transform = 'translateY(0)';
            
            if (faqIcon) {
                faqIcon.style.background = 'var(--royal-blue)';
                faqIcon.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    });
    
    // Make FAQ items interactive
    item.style.cursor = 'pointer';
    item.setAttribute('tabindex', '0');
    
    // Add click/touch to expand functionality (future enhancement)
    item.addEventListener('click', () => {
        // Add pulse animation
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = '';
        }, 150);
        
        // Track FAQ interaction
        if (typeof gtag !== 'undefined') {
            const question = item.querySelector('h3').textContent;
            gtag('event', 'faq_interaction', {
                'event_category': 'engagement',
                'event_label': question
            });
        }
    });
    
    // Keyboard accessibility
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
}

// ===============================
// CTA SECTION
// ===============================
function initCTASection() {
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn-primary, .cta-buttons .btn-secondary');
    
    ctaButtons.forEach(button => {
        initCTAButton(button);
    });
    
    initCTAAnimations();
}

function initCTAButton(button) {
    // Enhanced button interactions
    button.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(5px)';
            }
        }
    });

    button.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        }
    });

    button.addEventListener('click', (e) => {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Track CTA click
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'event_category': 'engagement',
                'event_label': button.textContent.trim()
            });
        }
    });
}

function initCTAAnimations() {
    const ctaSection = document.querySelector('.cta-section');
    if (!ctaSection) return;
    
    // Intersection Observer for CTA animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCTAElements();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(ctaSection);

    function animateCTAElements() {
        const ctaContent = ctaSection.querySelector('.cta-content');
        const ctaButtons = ctaSection.querySelectorAll('.cta-buttons .btn-primary, .cta-buttons .btn-secondary');
        
        if (ctaContent) {
            ctaContent.style.opacity = '0';
            ctaContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                ctaContent.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                ctaContent.style.opacity = '1';
                ctaContent.style.transform = 'translateY(0)';
            }, 200);
        }
        
        ctaButtons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 600 + (index * 200));
        });
    }
}

// ===============================
// SCROLL ANIMATIONS
// ===============================
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

    // Custom scroll-triggered animations for elements without AOS
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
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.stat-item, .contact-card, .location-card, .insurance-card, .faq-item');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 100}ms`;
                    child.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);

    // Observe elements for custom animations
    const animatedElements = document.querySelectorAll('.hero-stats, .contact-grid, .locations-grid, .insurance-grid, .faq-grid');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===============================
// SMOOTH SCROLLING
// ===============================
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '#contact-form') return;
            
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

// ===============================
// ACCESSIBILITY FEATURES
// ===============================
function initAccessibilityFeatures() {
    initKeyboardNavigation();
    initFocusManagement();
    initScreenReaderSupport();
    initReducedMotionSupport();
}

function initKeyboardNavigation() {
    // Enhanced keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll(
        '.contact-card, .location-card, .insurance-card, .faq-item, .btn-contact, .btn-directions, .btn-verify'
    );

    interactiveElements.forEach(element => {
        // Make elements focusable if they aren't already
        if (!element.hasAttribute('tabindex') && !element.matches('a, button, input, select, textarea')) {
            element.setAttribute('tabindex', '0');
        }

        // Add keyboard event handlers
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                
                // Find the primary action and trigger it
                if (element.matches('.contact-card, .location-card, .insurance-card, .faq-item')) {
                    const primaryAction = element.querySelector('a, button, .btn-contact, .btn-directions, .btn-verify');
                    if (primaryAction) {
                        primaryAction.click();
                    }
                } else {
                    element.click();
                }
            }
        });
    });
}

function initFocusManagement() {
    // Enhanced focus management for better UX
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused');
            
            // Add focus outline for better visibility
            if (!element.style.outline) {
                element.style.outline = '2px solid var(--metallic-gold)';
                element.style.outlineOffset = '2px';
            }
        });

        element.addEventListener('blur', () => {
            element.classList.remove('focused');
            
            // Remove custom outline
            if (element.style.outline === '2px solid var(--metallic-gold)') {
                element.style.outline = '';
                element.style.outlineOffset = '';
            }
        });
    });

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
}

function initScreenReaderSupport() {
    // Create live region for announcements
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    `;
    document.body.appendChild(announcer);

    // Global function for screen reader announcements
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };

    // Add ARIA labels and descriptions where needed
    addAriaLabels();
}

function addAriaLabels() {
    // Contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        const title = card.querySelector('h4');
        if (title) {
            card.setAttribute('aria-label', `Contact method: ${title.textContent}`);
        }
    });

    // Location cards
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        const title = card.querySelector('h3');
        if (title) {
            card.setAttribute('aria-label', `Office location: ${title.textContent}`);
        }
    });

    // FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        if (question) {
            item.setAttribute('aria-label', `FAQ: ${question.textContent}`);
        }
    });
}

function initReducedMotionSupport() {
    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            // Disable animations
            document.body.classList.add('reduce-motion');
            
            if (typeof AOS !== 'undefined') {
                AOS.init({ disable: true });
            }
            
            // Disable CSS animations
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
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
    }

    // Initial check
    handleReducedMotion();
    
    // Listen for changes
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
}

// ===============================
// PERFORMANCE OPTIMIZATIONS
// ===============================
function initPerformanceOptimizations() {
    initLazyLoading();
    initImageOptimization();
    initScrollOptimization();
    initResourcePreloading();
}

function initLazyLoading() {
    // Intersection Observer for lazy loading animations and images
    const lazyElements = document.querySelectorAll('[data-aos], .lazy-load');
    
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate', 'loaded');
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
}

function initImageOptimization() {
    // Optimize images for performance
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" if not already present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Handle image load errors
        img.addEventListener('error', () => {
            // Replace with placeholder or hide
            img.style.display = 'none';
            console.warn('Image failed to load:', img.src);
        });
    });
}

function initScrollOptimization() {
    // Optimize scroll events with passive listeners and throttling
    let scrollTimeout;
    let isScrolling = false;
    
    const optimizedScrollHandler = throttle(() => {
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('scrolling');
        }, 100);
    }, 16); // ~60fps

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
}

function initResourcePreloading() {
    // Preload critical resources
    const criticalResources = [
        { href: 'logo.png', as: 'image' },
        { href: 'elanstechlogo.jpeg', as: 'image' }
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.as;
        link.href = resource.href;
        document.head.appendChild(link);
    });
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

// Throttle function for performance optimization
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

// Debounce function for performance optimization
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

// Show notification function
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                max-width: 400px;
                z-index: 10000;
                transform: translateX(420px);
                transition: transform 0.3s ease;
                border-left: 4px solid var(--royal-blue);
            }
            
            .notification-success {
                border-left-color: #27ae60;
            }
            
            .notification-error {
                border-left-color: #e74c3c;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                padding: 1rem;
                gap: 0.75rem;
            }
            
            .notification-icon {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-success .notification-icon {
                color: #27ae60;
            }
            
            .notification-error .notification-icon {
                color: #e74c3c;
            }
            
            .notification-message {
                flex: 1;
                color: var(--text-dark);
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: var(--text-dark);
            }
            
            @media (max-width: 768px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    transform: translateY(-100px);
                }
                
                .notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Show notification
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto hide
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    // Screen reader announcement
    if (window.announceToScreenReader) {
        window.announceToScreenReader(message);
    }
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Track contact interactions for analytics
function trackContactInteraction(element) {
    if (typeof gtag === 'undefined') return;
    
    let action = 'contact_interaction';
    let label = element.textContent.trim();
    
    if (element.href) {
        if (element.href.includes('tel:')) {
            action = 'phone_click';
            label = 'contact_phone';
        } else if (element.href.includes('mailto:')) {
            action = 'email_click';
            label = 'contact_email';
        } else if (element.href.includes('maps.google.com')) {
            action = 'directions_click';
            label = 'office_location';
        }
    }
    
    gtag('event', action, {
        'event_category': 'contact_page',
        'event_label': label,
        'value': 1
    });
}

// ===============================
// ERROR HANDLING & DEBUGGING
// ===============================

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Contact page error:', e.error);
    
    // Graceful degradation for critical features
    if (e.error && e.error.message) {
        if (e.error.message.includes('AOS')) {
            console.warn('AOS failed to load, continuing without animations');
        } else if (e.error.message.includes('gtag')) {
            console.warn('Analytics tracking unavailable');
        }
    }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
            }
        });
    });
    observer.observe({entryTypes: ['navigation']});
}

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

// ===============================
// EXPORT FOR MODULE SYSTEMS
// ===============================

// Export for testing purposes or module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeContactPage,
        initHeader,
        initMobileNavigation,
        initHeroSection,
        initContactInfoSection,
        initLocationsSection,
        initInsuranceSection,
        initFAQSection,
        initCTASection,
        smoothScrollTo,
        showNotification,
        throttle,
        debounce
    };
}

// ===============================
// INITIALIZATION CHECK
// ===============================

// Ensure initialization happens even if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeContactPage);
} else {
    // DOM is already loaded
    initializeContactPage();
}

console.log('Contact page JavaScript loaded successfully');
