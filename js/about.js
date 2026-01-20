/**
 * About Page JavaScript
 * Matches main site patterns from script.js
 */

document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
});

function initAboutPage() {
    // Initialize core components
    initMobileNavAbout();
    initHeaderAbout();
    initVideoBackground();
    initScrollAnimations();
    initCounterAnimations();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease',
            once: true,
            mirror: false,
            offset: 100
        });
    }
}

/* ==========================================================================
   HEADER & NAVIGATION
   ========================================================================== */
function initHeaderAbout() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let isScrollingDown = false;
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Handle header visibility
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
    }

    // Debounce scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    });
}

function initMobileNavAbout() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    navToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   VIDEO BACKGROUND
   ========================================================================== */
function initVideoBackground() {
    const video = document.querySelector('.hero-video');
    
    if (!video) return;

    // Handle mobile devices
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        video.pause();
        video.style.display = 'none';
        return;
    }

    // Ensure video plays
    function playVideo() {
        video.play().catch(err => {
            console.log('Video autoplay prevented:', err);
        });
    }

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
        } else if (!isMobile) {
            playVideo();
        }
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const nowMobile = window.innerWidth <= 768;
            if (nowMobile && video.parentNode) {
                video.pause();
                video.style.display = 'none';
            } else if (!nowMobile) {
                video.style.display = 'block';
                playVideo();
            }
        }, 250);
    });
}

/* ==========================================================================
   SCROLL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add fade-in animation
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections and cards
    const elementsToObserve = document.querySelectorAll('.philosophy-intro-card, .focus-box, .diff-card, .testimonial-box, .journey-step');
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

/* ==========================================================================
   COUNTER ANIMATIONS
   ========================================================================== */
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = element.textContent;
    const numMatch = target.match(/\d+/);
    
    if (!numMatch) return;
    
    const finalNum = parseInt(numMatch[0]);
    const suffix = target.replace(/\d+/g, '').trim();
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - ease out quad
        const easeOutQuad = progress * (2 - progress);
        const currentNum = Math.floor(finalNum * easeOutQuad);
        
        element.textContent = currentNum + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = finalNum + suffix;
        }
    }
    
    requestAnimationFrame(updateCount);
}

/* ==========================================================================
   CARD INTERACTIONS
   ========================================================================== */
function initCardInteractions() {
    const cards = document.querySelectorAll('.focus-box, .diff-card, .testimonial-box');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) {
                const icon = card.querySelector('.focus-icon-wrapper, .diff-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1024) {
                const icon = card.querySelector('.focus-icon-wrapper, .diff-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            }
        });
    });
}

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 85;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */
function debounce(func, wait = 250) {
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

/* ==========================================================================
   HANDLE WINDOW RESIZE
   ========================================================================== */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});

/* ==========================================================================
   REDUCED MOTION SUPPORT
   ========================================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    if (typeof AOS !== 'undefined') {
        AOS.init({ disable: true });
    }
}

prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        if (typeof AOS !== 'undefined') {
            AOS.init({ disable: true });
        }
    } else {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: false,
                duration: 800,
                easing: 'ease',
                once: true,
                mirror: false
            });
        }
    }
});

/* ==========================================================================
   PERFORMANCE OPTIMIZATION
   ========================================================================== */
// Lazy load images if needed
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

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAboutPage,
        initHeaderAbout,
        initMobileNavAbout,
        initVideoBackground,
        initScrollAnimations,
        initCounterAnimations
    };
}
