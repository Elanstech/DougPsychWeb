/**
 * Services Page JavaScript
 * @version 1.0.0
 * @lastUpdated 2025-02-21
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeServicesPage();
});

function initializeServicesPage() {
    initSmoothScrolling();
    initServiceCards();
    initAnimations();
    initScrollSpy();
    initDetailsToggle();
    handleVisibilityChanges();
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
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
}

// Service Cards Interactions
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Add hover effects for desktop
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) {
                card.style.transform = 'translateY(-10px)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1024) {
                card.style.transform = 'translateY(0)';
            }
        });

        // Add touch effects for mobile
        card.addEventListener('touchstart', () => {
            if (window.innerWidth < 1024) {
                card.style.transform = 'translateY(-5px)';
            }
        });

        card.addEventListener('touchend', () => {
            if (window.innerWidth < 1024) {
                card.style.transform = 'translateY(0)';
            }
        });

        // Add click handler for learn more buttons
        const learnMoreBtn = card.querySelector('.learn-more');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = learnMoreBtn.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    scrollToSection(targetSection);
                }
            });
        }
    });
}

// Initialize AOS Animations
function initAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 50,
            delay: 100
        });
    }

    // Fallback animations if AOS is not available
    if (typeof AOS === 'undefined') {
        const animatedElements = document.querySelectorAll('.service-card, .approach-item, .timeline-item');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease-out';
            observer.observe(element);
        });
    }
}

// Scroll Spy for Navigation
function initScrollSpy() {
    const sections = document.querySelectorAll('.service-detail');
    const navItems = document.querySelectorAll('.nav-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '-100px 0px -70% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nav items
                navItems.forEach(item => item.classList.remove('active'));
                
                // Add active class to corresponding nav item
                const activeNav = document.querySelector(
                    `.nav-item[href="#${entry.target.id}"]`
                );
                if (activeNav) {
                    activeNav.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Service Details Toggle
function initDetailsToggle() {
    const detailSections = document.querySelectorAll('.service-detail');
    
    detailSections.forEach(section => {
        const content = section.querySelector('.detail-content');
        const timeline = section.querySelector('.timeline-grid');
        
        if (content && timeline) {
            // Add initial state classes
            content.classList.add('detail-animated');
            timeline.classList.add('timeline-animated');
            
            // Observe section
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        content.classList.add('show');
                        setTimeout(() => {
                            timeline.classList.add('show');
                        }, 300);
                    }
                });
            }, {
                threshold: 0.2
            });
            
            observer.observe(section);
        }
    });
}

// Handle Page Visibility Changes
function handleVisibilityChanges() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause any animations or transitions
            document.body.classList.add('page-hidden');
        } else {
            // Resume animations
            document.body.classList.remove('page-hidden');
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }
    });
}

// Utility Functions
function scrollToSection(section) {
    const headerOffset = 100;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Handle Window Resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reset any necessary styles
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.style.transform = '';
        });
        
        // Refresh AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});

// Handle Mobile Navigation
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }
}

// Performance Optimization
function debounce(func, wait = 20) {
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

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initializeServicesPage();
    initMobileNav();
    initContactForm();
});
