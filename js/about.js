/**
 * About Page - Premium JavaScript
 * Luxury interactions and smooth animations
 */

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.initializeAOS();
        this.initHeader();
        this.initMobileNav();
        this.initVideoBackground();
        this.initSmoothScroll();
        this.initScrollAnimations();
        this.initCounters();
        this.initParallax();
        this.handleReducedMotion();
    }

    // ==========================================
    // AOS INITIALIZATION
    // ==========================================
    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                once: true,
                offset: 100,
                delay: 100,
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        }
    }

    // ==========================================
    // HEADER FUNCTIONALITY
    // ==========================================
    initHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        let ticking = false;

        const updateHeader = () => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class
            if (currentScroll > 80) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }

            // Hide/show header on scroll
            if (currentScroll > 200 && currentScroll > lastScroll) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================
    initMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const body = document.body;

        if (!navToggle || !navMenu) return;

        // Toggle menu
        navToggle.addEventListener('click', () => {
            const isActive = navToggle.classList.contains('active');
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');

            // Update ARIA
            navToggle.setAttribute('aria-expanded', !isActive);
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && 
                !navToggle.contains(e.target) && 
                navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==========================================
    // VIDEO BACKGROUND
    // ==========================================
    initVideoBackground() {
        const videoWrapper = document.querySelector('.video-background');
        const video = videoWrapper?.querySelector('video');
        
        if (!video || !videoWrapper) return;

        // Handle mobile devices
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            video.pause();
            video.remove();
            videoWrapper.classList.add('mobile-fallback');
        } else {
            // Ensure video plays
            const playVideo = () => {
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                    videoWrapper.classList.add('mobile-fallback');
                });
            };

            // Try to play when loaded
            if (video.readyState >= 2) {
                playVideo();
            } else {
                video.addEventListener('loadeddata', playVideo);
            }

            // Handle visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    video.pause();
                } else {
                    playVideo();
                }
            });
        }

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const nowMobile = window.innerWidth <= 768;
                if (nowMobile && video.parentNode) {
                    video.pause();
                    video.remove();
                    videoWrapper.classList.add('mobile-fallback');
                }
            }, 250);
        });
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // Ignore empty hashes
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Trigger counter animation if element has counter
                    const counter = entry.target.querySelector('[data-count]');
                    if (counter && !counter.classList.contains('counted')) {
                        this.animateCounter(counter);
                    }
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));

        // Observe cards
        const cards = document.querySelectorAll('.focus-card, .difference-card, .testimonial-item');
        cards.forEach(card => observer.observe(card));
    }

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            counter.setAttribute('data-target', target);
        });
    }

    animateCounter(element) {
        const target = element.getAttribute('data-target');
        const num = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[\d\s]/g, '');
        const duration = 2000;
        const increment = num / (duration / 16);
        let current = 0;

        element.classList.add('counted');

        const updateCounter = () => {
            current += increment;
            
            if (current < num) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = num + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // ==========================================
    // PARALLAX EFFECT
    // ==========================================
    initParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero title
            const heroTitle = document.querySelector('.hero-title-wrapper');
            if (heroTitle) {
                heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroTitle.style.opacity = 1 - (scrolled / 600);
            }

            // Parallax for stats
            const heroStats = document.querySelector('.hero-stats');
            if (heroStats) {
                heroStats.style.transform = `translateY(${scrolled * 0.2}px)`;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // ==========================================
    // CARD INTERACTIONS
    // ==========================================
    initCardInteractions() {
        const cards = document.querySelectorAll('.focus-card, .difference-card, .testimonial-item');
        
        cards.forEach(card => {
            // Mouse move effect
            card.addEventListener('mousemove', (e) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ==========================================
    // REDUCED MOTION
    // ==========================================
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleChange = () => {
            if (prefersReducedMotion.matches) {
                // Disable AOS
                if (typeof AOS !== 'undefined') {
                    AOS.init({ disable: true });
                }
                
                // Remove transitions
                document.body.classList.add('reduced-motion');
            } else {
                // Re-enable AOS
                if (typeof AOS !== 'undefined') {
                    AOS.init({ disable: false });
                }
                
                document.body.classList.remove('reduced-motion');
            }
        };

        prefersReducedMotion.addEventListener('change', handleChange);
        handleChange();
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
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

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ==========================================
// INITIALIZE ON DOM LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================
const animateStatCounters = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = entry.target.textContent;
                const numMatch = target.match(/\d+/);
                
                if (numMatch) {
                    const finalNum = parseInt(numMatch[0]);
                    const suffix = target.replace(/\d+/g, '').trim();
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    entry.target.classList.add('counted');
                    
                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing function
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const currentNum = Math.floor(finalNum * easeOutQuart);
                        
                        entry.target.textContent = currentNum + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.textContent = finalNum + suffix;
                        }
                    };
                    
                    requestAnimationFrame(updateCount);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
};

// Initialize counter animation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateStatCounters);
} else {
    animateStatCounters();
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================
// Skip to main content
const skipLink = document.querySelector('.skip-to-main');
if (skipLink) {
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('.philosophy-section');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
        }
    });
}

// Announce page changes for screen readers
const announcePageChange = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

// ==========================================
// WINDOW RESIZE HANDLER
// ==========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Refresh AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Recalculate layouts if needed
        document.dispatchEvent(new Event('layoutchange'));
    }, 250);
});

// ==========================================
// EXPORT FOR MODULE USAGE
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
}
