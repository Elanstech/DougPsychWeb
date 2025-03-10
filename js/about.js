// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

// Main initialization function
function initializeAboutPage() {
    // Core functions
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initHoverEffects();
    
    // Section-specific initializations
    initStorySection();
    initPhilosophySection();
    initApproachSection();
    initTimelineSection();
    initTestimonialsSection();
    
    // Utilities
    initSmoothScroll();
    initLazyLoading();
    initBackToTop();
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
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }

    // Custom animations for elements not using AOS
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach((element) => {
        observer.observe(element);
    });
}

/* ======================================
   HOVER EFFECTS
====================================== */
function initHoverEffects() {
    // Philosophy cards hover effect
    const philosophyCards = document.querySelectorAll('.philosophy-card');
    philosophyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                card.style.background = 'rgba(255, 255, 255, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.background = '';
            }
        });
    });

    // Approach cards hover effect
    const approachCards = document.querySelectorAll('.approach-card');
    approachCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
    });

    // Testimonial cards hover effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
    });
}

/* ======================================
   STORY SECTION
====================================== */
function initStorySection() {
    // Image hover effect
    const storyImage = document.querySelector('.story-image img');
    const imageFrame = document.querySelector('.image-frame');
    
    if (storyImage && imageFrame) {
        imageFrame.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                storyImage.style.transform = 'scale(1.03)';
            }
        });
        
        imageFrame.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                storyImage.style.transform = '';
            }
        });
    }

    // Milestone animations
    const milestoneItems = document.querySelectorAll('.milestone-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    milestoneItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

/* ======================================
   PHILOSOPHY SECTION
====================================== */
function initPhilosophySection() {
    // Quote animation
    const philosophyQuote = document.querySelector('.philosophy-quote');
    
    if (philosophyQuote) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    philosophyQuote.classList.add('fade-in');
                    observer.unobserve(philosophyQuote);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(philosophyQuote);
    }

    // Card staggered animations
    const philosophyCards = document.querySelectorAll('.philosophy-card');
    
    const cardsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            philosophyCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 200);
            });
            cardsObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.1 });
    
    if (philosophyCards.length > 0) {
        cardsObserver.observe(document.querySelector('.philosophy-cards'));
    }
}

/* ======================================
   APPROACH SECTION
====================================== */
function initApproachSection() {
    // List item hover effects
    const listItems = document.querySelectorAll('.approach-list li');
    listItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                item.style.transform = 'translateX(10px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                item.style.transform = '';
            }
        });
    });

    // Environment feature hover effects
    const envFeatures = document.querySelectorAll('.env-feature');
    envFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                feature.style.transform = 'translateY(-5px)';
            }
        });
        
        feature.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                feature.style.transform = '';
            }
        });
    });

    // Method item hover effects
    const methodItems = document.querySelectorAll('.method-item');
    methodItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                item.style.transform = 'translateY(-5px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                item.style.transform = '';
            }
        });
    });
}

/* ======================================
   TIMELINE SECTION
====================================== */
function initTimelineSection() {
    // Timeline step animations
    const timelineSteps = document.querySelectorAll('.process-step');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    timelineSteps.forEach((step) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(step);
    });

    // Icon pulse animation
    const stepIcons = document.querySelectorAll('.step-icon');
    stepIcons.forEach(icon => {
        // Only apply animations if reduced motion is not preferred
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Apply animation
        }
    });
}

/* ======================================
   TESTIMONIALS SECTION
====================================== */
function initTestimonialsSection() {
    // Testimonial card animations
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            testimonialCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 200);
            });
            observer.unobserve(entries[0].target);
        }
    }, { threshold: 0.1 });
    
    if (testimonialCards.length > 0) {
        observer.observe(document.querySelector('.testimonials-grid'));
    }
}

/* ======================================
   SMOOTH SCROLL
====================================== */
function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Adjust for header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ======================================
   LAZY LOADING
====================================== */
function initLazyLoading() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/* ======================================
   BACK TO TOP BUTTON
====================================== */
function initBackToTop() {
    // Create back to top button if it doesn't exist
    let backToTop = document.getElementById('backToTop');
    
    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.id = 'backToTop';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.style.position = 'fixed';
        backToTop.style.bottom = '20px';
        backToTop.style.right = '20px';
        backToTop.style.zIndex = '99';
        backToTop.style.display = 'none';
        backToTop.style.padding = '10px 15px';
        backToTop.style.borderRadius = '50%';
        backToTop.style.background = 'var(--gold-gradient-metallic)';
        backToTop.style.color = 'white';
        backToTop.style.border = 'none';
        backToTop.style.cursor = 'pointer';
        backToTop.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        backToTop.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(backToTop);
    }

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'block';
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTop.style.display = 'none';
                }
            }, 300);
        }
    });

    // Scroll to top when button is clicked
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ======================================
   VIDEO BACKGROUND
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

/* ======================================
   UTILITY FUNCTIONS
====================================== */
// Debounce function to limit function calls
function debounce(func, wait = 20) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add class with delay
function addClassWithDelay(element, className, delay) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

// Handle reduced motion preference
function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function setReducedMotion(reduced) {
        const root = document.documentElement;
        if (reduced) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }
    }
    
    setReducedMotion(prefersReducedMotion.matches);
    
    prefersReducedMotion.addEventListener('change', () => {
        setReducedMotion(prefersReducedMotion.matches);
        
        if (typeof AOS !== 'undefined') {
            if (prefersReducedMotion.matches) {
                AOS.init({ disable: true });
            } else {
                AOS.init({
                    duration: 800,
                    easing: 'ease-out',
                    once: true,
                    offset: 100,
                    disable: false
                });
            }
        }
    });
}

// Initialize the reduced motion handler
handleReducedMotion();

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAboutPage
    };
}
