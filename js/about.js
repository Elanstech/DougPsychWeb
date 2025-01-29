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
}

// Header Functionality
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

// Mobile Navigation Implementation
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

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Scroll Animations with Intersection Observer
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

// Parallax Effect for Hero Section
function initParallax() {
    const heroSection = document.querySelector('.about-hero');
    if (!heroSection || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        const moveAmount = scroll * 0.5;
        heroSection.style.backgroundPositionY = `${moveAmount}px`;
    });
}

// Back to Top Button
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

// Handle window resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Refresh AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});

// Handle image loading
document.querySelectorAll('.image-frame img').forEach(img => {
    if (img.complete) {
        handleImageLoad(img);
    } else {
        img.addEventListener('load', () => handleImageLoad(img));
    }
    img.addEventListener('error', handleImageError);
});

function handleImageLoad(img) {
    img.style.opacity = '1';
    const frame = img.closest('.image-frame');
    if (frame) {
        frame.classList.add('image-loaded');
    }
}

function handleImageError(e) {
    const img = e.target;
    img.src = 'placeholder.jpg'; // Fallback image
    console.error('Error loading image:', e);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
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

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or timers if needed
    } else {
        // Resume animations or refresh timers if needed
    }
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
        const heroSection = document.querySelector('.about-hero');
        if (heroSection) {
            heroSection.style.backgroundPositionY = '0';
        }
        
        // Disable custom animations
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.style.transition = 'none';
            item.style.transform = 'none';
            item.style.opacity = '1';
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
        initScrollAnimations();
        initParallax();
    }
});

// Initialize Timeline Scroll Effect
function initTimelineScrollEffect() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const items = timeline.querySelectorAll('.timeline-item');
    
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

    items.forEach(item => {
        observer.observe(item);
    });
}

// Handle Content Block Animations
function initContentBlockAnimations() {
    const blocks = document.querySelectorAll('.content-block');
    
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

// CTA Cards Hover Effect
function initCTACards() {
    const cards = document.querySelectorAll('.cta-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!prefersReducedMotion.matches) {
                card.style.transform = 'translateY(-10px)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!prefersReducedMotion.matches) {
                card.style.transform = 'translateY(0)';
            }
        });
    });
}

// Initialize all about page specific features
function initAboutPageFeatures() {
    initTimelineScrollEffect();
    initContentBlockAnimations();
    initCTACards();
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initAboutPageFeatures);
