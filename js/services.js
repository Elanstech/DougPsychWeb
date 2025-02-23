/**
 * Advanced Services Page JavaScript
 * Elegant animations and smooth interactions
 * @version 2.0.0
 * @lastUpdated 2024-02-22
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeServices();
});

// Main initialization function
const initializeServices = () => {
    // Initialize all features
    initializeAOS();
    initializeHeader();
    initializeHeroParallax();
    initializeServiceCards();
    initializeProcessTimeline();
    initializeScrollEffects();
    initializeModals();
    initializeSmoothScroll();
    initializeInsuranceLogos();
    handleMobileNavigation();
};

// Initialize AOS animations with custom configuration
const initializeAOS = () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 100,
        anchorPlacement: 'top-bottom',
        mirror: true,
        disable: () => window.innerWidth < 768
    });
};

// Advanced header interactions
const initializeHeader = () => {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let scrolling = false;

    // Sophisticated scroll handling
    window.addEventListener('scroll', () => {
        if (!scrolling) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Add/remove classes based on scroll direction
                if (currentScroll > lastScroll && currentScroll > 100) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
                
                // Add special class for scrolled state
                if (currentScroll > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }

                lastScroll = currentScroll;
                scrolling = false;
            });
            scrolling = true;
        }
    });
};

// Hero section parallax effect
const initializeHeroParallax = () => {
    const hero = document.querySelector('.services-hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        // Apply sophisticated parallax transformation
        hero.style.transform = `translateY(${rate}px)`;
        hero.querySelector('.hero-content').style.transform = `translateY(-${rate * 0.5}px)`;
    });
};

// Interactive service cards
const initializeServiceCards = () => {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Create hover effect
        card.addEventListener('mouseenter', (e) => {
            if (window.innerWidth >= 1024) {
                const { left, top } = card.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;

                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
                card.classList.add('card-hover');
            }
        });

        // Handle click animation
        card.addEventListener('click', (e) => {
            if (window.innerWidth < 1024) {
                createRippleEffect(e, card);
            }
        });
    });
};

// Create ripple effect for mobile interactions
const createRippleEffect = (e, element) => {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size/2}px`;
    ripple.style.top = `${e.clientY - rect.top - size/2}px`;
    
    element.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
};

// Animate process timeline
const initializeProcessTimeline = () => {
    const timeline = document.querySelector('.process-timeline');
    const items = document.querySelectorAll('.timeline-item');
    
    if (!timeline || !items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 0.2}s`;
                entry.target.classList.add('timeline-item-visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    items.forEach(item => observer.observe(item));
};

// Smooth scroll implementation
const initializeSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Initialize service modals
const initializeModals = () => {
    const modalTriggers = document.querySelectorAll('.service-link');
    const modals = document.querySelectorAll('.service-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('href');
            const modal = document.querySelector(modalId);
            
            if (modal) {
                openModal(modal);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.service-modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.service-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
};

// Modal opening animation
const openModal = (modal) => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Trigger entrance animation
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('modal-content-visible');
    }, 10);
};

// Modal closing animation
const closeModal = (modal) => {
    modal.querySelector('.modal-content').classList.remove('modal-content-visible');
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }, 300);
};

// Insurance logos animation
const initializeInsuranceLogos = () => {
    const logos = document.querySelectorAll('.insurance-logo');
    
    logos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            logo.classList.add('logo-hover');
        });

        logo.addEventListener('mouseleave', () => {
            logo.classList.remove('logo-hover');
        });
    });
};

// Mobile navigation handler
const handleMobileNavigation = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
};

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initializeServices();
});
