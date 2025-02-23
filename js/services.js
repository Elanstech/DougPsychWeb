/**
 * Services Page JavaScript
 * Handles all interactions and animations for the services page
 * @version 1.0.0
 * @lastUpdated 2024-02-23
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeServicesPage();
});

const initializeServicesPage = () => {
    // Initialize core functionality
    initializeAOS();
    initializeServicesHero();
    initializeHighlightCards();
    initializeServiceCards();
    initializeSmoothScroll();
    handleScrollEffects();
};

// Initialize AOS animations
const initializeAOS = () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 100
    });
};

// Hero section parallax and animations
const initializeServicesHero = () => {
    const hero = document.querySelector('.services-hero');
    const heroContent = document.querySelector('.hero-content');
    let lastScroll = 0;

    if (!hero || !heroContent) return;

    // Subtle parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        // Apply parallax effect to hero content
        heroContent.style.transform = `translateY(${rate}px)`;
        
        // Update hero background position
        hero.style.backgroundPosition = `center ${-rate * 0.5}px`;
    });
};

// Initialize highlight cards interactions
const initializeHighlightCards = () => {
    const cards = document.querySelectorAll('.highlight-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Reset all cards
            cards.forEach(c => c.classList.remove('active'));
            // Activate current card
            card.classList.add('active');
        });
    });
};

// Initialize service cards animations and interactions
const initializeServiceCards = () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Add hover interaction
        card.addEventListener('mouseenter', handleServiceCardHover);
        card.addEventListener('mouseleave', handleServiceCardLeave);
        
        // Add click handler for mobile
        card.addEventListener('click', handleServiceCardClick);
    });
};

// Handle service card hover effects
const handleServiceCardHover = (e) => {
    if (window.innerWidth < 1024) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
};

// Handle service card leave effects
const handleServiceCardLeave = (e) => {
    if (window.innerWidth < 1024) return;
    
    const card = e.currentTarget;
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
};

// Handle service card click (mobile)
const handleServiceCardClick = (e) => {
    if (window.innerWidth >= 1024) return;
    
    const card = e.currentTarget;
    card.classList.toggle('active');
};

// Initialize smooth scrolling for anchor links
const initializeSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            
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

// Handle scroll effects
const handleScrollEffects = () => {
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.services-hero');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Header effects
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Hide/show scroll indicator
                if (scrollIndicator) {
                    if (currentScroll > 100) {
                        scrollIndicator.style.opacity = '0';
                    } else {
                        scrollIndicator.style.opacity = '1';
                    }
                }
                
                // Parallax effect for hero section
                if (heroSection) {
                    const heroRect = heroSection.getBoundingClientRect();
                    if (heroRect.bottom > 0) {
                        const parallaxRate = currentScroll * 0.4;
                        heroSection.style.transform = `translateY(${parallaxRate}px)`;
                    }
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    });
};

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Refresh AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Reset any mobile-specific states
        if (window.innerWidth >= 1024) {
            document.querySelectorAll('.service-card.active').forEach(card => {
                card.classList.remove('active');
            });
        }
    }, 250);
});

// Export functions for potential use in other modules
export {
    initializeServicesPage,
    initializeHighlightCards,
    initializeServiceCards,
    handleScrollEffects
};
