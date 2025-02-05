// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

// Main initialization function
function initializeAboutPage() {
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initParallax();
    initBackToTop();
    initTimelineScrollEffect();
    initContentBlockAnimations();
    initValueCards();
    initVideoBackground();
}

/* ======================================
   HEADER FUNCTIONALITY
====================================== */
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let isScrollingDown = false;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
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
    });
}

/* ======================================
   MOBILE NAVIGATION
====================================== */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu on button click
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

/* ======================================
   SCROLL ANIMATIONS
====================================== */
function initScrollAnimations() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    // Custom animations for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

/* ======================================
   PARALLAX EFFECT
====================================== */
function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-background');
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            parallaxSections.forEach(section => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                section.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

/* ======================================
   BACK TO TOP BUTTON
====================================== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ======================================
   TIMELINE SCROLL EFFECT
====================================== */
function initTimelineScrollEffect() {
    const timeline = document.querySelector('.journey-timeline');
    if (!timeline) return;

    const entries = timeline.querySelectorAll('.timeline-entry');
    
    const options = {
        root: null,
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    entries.forEach(entry => {
        observer.observe(entry);
    });
}

/* ======================================
   CONTENT BLOCK ANIMATIONS
====================================== */
function initContentBlockAnimations() {
    const blocks = document.querySelectorAll('.philosophy-card, .value-card');
    
    const options = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    blocks.forEach(block => {
        observer.observe(block);
    });
}

/* ======================================
   VALUE CARDS INTERACTION
====================================== */
function initValueCards() {
    const cards = document.querySelectorAll('.value-card');
    
    cards.forEach(card => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });

            // Touch support for mobile
            card.addEventListener('touchstart', () => {
                card.classList.toggle('flipped');
            });
        }
    });
}

/* ======================================
   VIDEO BACKGROUND HANDLING
====================================== */
function initVideoBackground() {
    const videoWrapper = document.querySelector('.video-background');
    const video = videoWrapper?.querySelector('video');
    
    if (!video || !videoWrapper) return;

    function handleMobileVideo() {
        if (window.innerWidth <= 768) {
            // On mobile, use poster image instead of video
            if (video) {
                video.pause();
                video.style.display = 'none';
            }
            videoWrapper.classList.add('mobile-fallback');
        } else {
            // On desktop, play video
            videoWrapper.classList.remove('mobile-fallback');
            if (video) {
                video.style.display = 'block';
                video.play().catch(() => {
                    videoWrapper.classList.add('mobile-fallback');
                });
            }
        }
    }

    // Handle video loading
    video.addEventListener('loadeddata', () => {
        handleMobileVideo();
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.innerWidth > 768) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });

    // Handle resize events with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleMobileVideo, 250);
    });

    // Initial check
    handleMobileVideo();
}
function initHeroAnimations() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    // Add smooth reveal for features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        if (typeof AOS !== 'undefined') {
            AOS.init({ disable: true });
        }
    } else {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: false,
                duration: 1000,
                easing: 'ease-out',
                once: true,
                offset: 100
            });
        }
    }
});

/* ======================================
   IMAGE LOADING OPTIMIZATION
====================================== */
function handleImageLoad(img) {
    img.style.opacity = '1';
    const frame = img.closest('.image-frame');
    if (frame) {
        frame.classList.add('image-loaded');
    }
}

document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
        handleImageLoad(img);
    } else {
        img.addEventListener('load', () => handleImageLoad(img));
    }
    img.addEventListener('error', () => {
        img.src = 'placeholder.jpg'; // Fallback image
        console.error('Error loading image:', img.src);
    });
});

/* ======================================
   PERFORMANCE OPTIMIZATION
====================================== */
// Handle window resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        // Disable animations
        if (typeof AOS !== 'undefined') {
            AOS.init({ disable: true });
        }
        
        // Remove parallax effect
        const parallaxSections = document.querySelectorAll('.parallax-background');
        parallaxSections.forEach(section => {
            section.style.transform = 'none';
        });
    } else {
        // Re-enable animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: false,
                duration: 1000,
                easing: 'ease-out',
                once: true,
                offset: 100
            });
        }
    }
});

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAboutPage
    };
}
