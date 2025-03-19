/**
 * DougPsychWeb Main JavaScript
 * @version 1.0.0
 * @lastUpdated 2025-02-07
 */

// ===============================
// INITIALIZATION & UTILITIES
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    initializeAllComponents();
});

function initializeAllComponents() {
    // Core components
    initHeader();
    initMobileNav();
    initHeroSlider();
    
    // Main sections
    initServices();
    initAboutSection();
    initTeamSection();
    initBookSection();
    initLocationsSection();
    initContactSection();
    
    // Utilities
    initSmoothScroll();
    initIntersectionObservers();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease',
            once: true,
            mirror: false
        });
    }
}

// Global Utilities
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

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initIntersectionObservers() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });
}

// ===============================
// HEADER & NAVIGATION
// ===============================
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let isScrollingDown = false;
    const scrollThreshold = 100;

    const handleScroll = () => {
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
    };

    window.addEventListener('scroll', debounce(handleScroll, 10));
}

function initMobileNav() {
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

    // Event Listeners
    navToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}
// ===============================
// HERO SECTION
// ===============================
function initHeroSlider() {
    const state = {
        slides: document.querySelectorAll('.hero-slider .slide'),
        dots: document.querySelectorAll('.nav-dot'),
        progress: document.querySelector('.progress'),
        currentSlide: 0,
        slideInterval: null,
        slideDuration: 5000,
        startTime: null,
        isHovered: false
    };

    function updateProgress(timestamp) {
        if (!state.startTime) state.startTime = timestamp;
        const elapsed = timestamp - state.startTime;
        const progressPercent = (elapsed / state.slideDuration) * 100;

        if (state.progress) {
            state.progress.style.height = `${Math.min(progressPercent, 100)}%`;
        }

        if (elapsed < state.slideDuration) {
            requestAnimationFrame(updateProgress);
        }
    }

    function showSlide(index) {
        // Reset progress
        if (state.progress) state.progress.style.height = '0%';
        state.startTime = null;
        requestAnimationFrame(updateProgress);

        // Update slides
        state.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.zIndex = 1;
        });
        state.dots.forEach(dot => dot.classList.remove('active'));

        state.slides[index].classList.add('active');
        state.slides[index].style.zIndex = 2;
        state.dots[index].classList.add('active');

        state.currentSlide = index;
    }

    function nextSlide() {
        if (!state.isHovered) {
            showSlide((state.currentSlide + 1) % state.slides.length);
        }
    }

    function startSlideshow() {
        if (state.slideInterval) clearInterval(state.slideInterval);
        state.slideInterval = setInterval(nextSlide, state.slideDuration);
    }

    function stopSlideshow() {
        if (state.slideInterval) {
            clearInterval(state.slideInterval);
            state.slideInterval = null;
        }
    }

    // Initialize event listeners
    state.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });

    // Handle service items interactions
    const serviceItems = document.querySelectorAll('.services-list li');
    serviceItems.forEach((item, index) => {
        // Initial state and animation
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 200 + (index * 100));

        // Hover effects
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px)';
            item.querySelector('.service-item').style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
            item.querySelector('.service-item').style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        });
    });

    // Handle visibility and focus changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            showSlide(state.currentSlide);
            startSlideshow();
        }
    });

    window.addEventListener('focus', () => {
        showSlide(state.currentSlide);
        startSlideshow();
    });

    window.addEventListener('blur', () => {
        stopSlideshow();
    });

    // Handle slider hover
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            state.isHovered = true;
        });
        sliderContainer.addEventListener('mouseleave', () => {
            state.isHovered = false;
        });
    }

    // Initialize slider
    showSlide(0);
    startSlideshow();
}

// ===============================
// SERVICES SECTION
// ===============================
function initServices() {
    // Initialize Swiper
    const servicesSwiper = new Swiper('.services-carousel', {
        // Basic settings
        slidesPerView: 3, // Default to show 3 cards
        spaceBetween: 30,
        loop: true,
        speed: 800,
        grabCursor: true,
        centeredSlides: false,
        
        // Autoplay settings
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        
        // Navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        
        // Responsive breakpoints
        breakpoints: {
            // When screen width is less than 768px
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true
            },
            // When screen width is between 768px and 1023px
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false
            },
            // When screen width is 1024px and above
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: false
            }
        },

        // Accessibility
        a11y: {
            prevSlideMessage: 'Previous service',
            nextSlideMessage: 'Next service',
            firstSlideMessage: 'This is the first service',
            lastSlideMessage: 'This is the last service',
            paginationBulletMessage: 'Go to service {{index}}'
        },

        // Callbacks
        on: {
            init: function() {
                initPeopleAnimations();
                initCardInteractions();
                lazyLoadImages();
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            },
            slideChange: function() {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }
        }
    });

    // Handle Person Element Animations
    function initPeopleAnimations() {
        const people = document.querySelectorAll('.person');
        
        // Give each person element a custom animation delay and slight rotation
        people.forEach((person, index) => {
            // Set custom rotation for each person element
            const rotation = -15 + (index * 10); // Varies from -15 to +15 degrees
            person.style.setProperty('--rotation', `${rotation}deg`);
            
            // Add random subtle movements
            setInterval(() => {
                const randomX = Math.random() * 10 - 5; // Range: -5px to 5px
                const randomY = Math.random() * 10 - 5; // Range: -5px to 5px
                const randomScale = 0.98 + Math.random() * 0.04; // Range: 0.98 to 1.02
                
                person.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale}) rotate(${rotation}deg)`;
            }, 8000 + (index * 1000)); // Staggered intervals
        });
    }

    // Lazy load images for better performance
    function lazyLoadImages() {
        const serviceImages = document.querySelectorAll('.service-image');
        
        // Create intersection observer for lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.setAttribute('src', src);
                        img.removeAttribute('data-src');
                        
                        // Add loaded class when image is fully loaded
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        // Observe all service images
        serviceImages.forEach(img => {
            // Only observe images with data-src attribute
            if (img.getAttribute('data-src')) {
                imageObserver.observe(img);
            } else {
                // Add loaded class to images that don't need lazy loading
                img.classList.add('loaded');
            }
        });
    }

    // Handle Service Card Interactions
    function initCardInteractions() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            const image = card.querySelector('.service-image');
            const overlay = card.querySelector('.image-overlay');
            const features = card.querySelectorAll('.service-features li');
            
            // Add initial staggered animation delay to list items
            features.forEach((feature, index) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    feature.style.transition = 'all 0.5s ease';
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateY(0)';
                }, 100 + (index * 100));
            });
            
            // Card hover effects for desktop
            card.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    card.style.transform = 'translateY(-10px)';
                    if (image) image.style.transform = 'scale(1.05)';
                    if (overlay) overlay.style.paddingBottom = '25px';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    card.style.transform = '';
                    if (image) image.style.transform = '';
                    if (overlay) overlay.style.paddingBottom = '';
                }
            });

            // Card touch effects for mobile
            card.addEventListener('touchstart', () => {
                if (window.innerWidth < 1024) {
                    card.style.transform = 'translateY(-5px)';
                }
            });

            card.addEventListener('touchend', () => {
                if (window.innerWidth < 1024) {
                    card.style.transform = '';
                }
            });

            // Handle image loading errors
            if (image) {
                image.addEventListener('error', () => {
                    // Replace with a fallback image or color
                    image.src = 'https://images.unsplash.com/photo-1527082395-e939b847da0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                    console.warn('Image failed to load, using fallback');
                });
            }
        });
    }

    // Update card heights for consistency
    function updateCardHeights() {
        // Group cards by their slide groups in current view
        const slideGroups = {};
        const slidesPerView = servicesSwiper.params.slidesPerView;
        const activeIndex = servicesSwiper.activeIndex;
        
        // Only equalize heights for non-mobile views
        if (slidesPerView === 1) return;
        
        // Get all visible cards
        const visibleCards = Array.from(document.querySelectorAll('.swiper-slide-visible .service-card'));
        
        // Reset heights first
        visibleCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Calculate max height for visible cards
        let maxHeight = Math.max(...visibleCards.map(card => card.offsetHeight));
        
        // Apply the max height
        visibleCards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            servicesSwiper.update();
            updateCardHeights();
            
            // Reset transforms on mobile/desktop switch
            const cards = document.querySelectorAll('.service-card');
            cards.forEach(card => {
                card.style.transform = '';
                const image = card.querySelector('.service-image');
                const overlay = card.querySelector('.image-overlay');
                if (image) image.style.transform = '';
                if (overlay) overlay.style.paddingBottom = '';
            });
        }, 250);
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            servicesSwiper.autoplay.stop();
        } else {
            servicesSwiper.autoplay.start();
        }
    });

    // Initial card height update
    setTimeout(() => {
        updateCardHeights();
    }, 500);

    // Update card heights after all images are loaded
    window.addEventListener('load', () => {
        updateCardHeights();
    });

    // Add update event after each slide change
    servicesSwiper.on('slideChangeTransitionEnd', updateCardHeights);

    return servicesSwiper;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const servicesSection = document.querySelector('.services');
    if (servicesSection) {
        initServices();
    }
});

// Handle accessibility focus
function initAccessibilityFocus() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Make cards focusable for keyboard navigation
        card.setAttribute('tabindex', '0');
        
        // Add focus styles for keyboard navigation
        card.addEventListener('focusin', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.12)';
            const image = card.querySelector('.service-image');
            if (image) image.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('focusout', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
            const image = card.querySelector('.service-image');
            if (image) image.style.transform = '';
        });

        // Allow keyboard users to "click" on cards with Enter key
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const link = card.querySelector('a');
                if (link) link.click();
            }
        });
    });
    
    // Handle keyboard navigation for the swiper
    document.addEventListener('keydown', (e) => {
        const servicesSwiper = document.querySelector('.services-carousel').swiper;
        if (!servicesSwiper) return;
        
        if (document.activeElement.closest('.services-carousel')) {
            if (e.key === 'ArrowRight') {
                servicesSwiper.slideNext();
            } else if (e.key === 'ArrowLeft') {
                servicesSwiper.slidePrev();
            }
        }
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initAccessibilityFocus();
    }, 1000); // Delay to ensure Swiper is properly initialized
});

// Helper function for debouncing resize events
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

// ===============================
// ABOUT SECTION
// ===============================
// About Section Initialization
function initAboutSection() {
    // State management
    const state = {
        isIntersecting: false,
        isAnimated: false,
        observer: null,
        elements: {
            section: document.querySelector('.about'),
            profileCard: document.querySelector('.profile-card'),
            visionCard: document.querySelector('.vision-card'),
            serviceHighlights: document.querySelectorAll('.service-highlight'),
            credentialItems: document.querySelectorAll('.credential-item'),
            profileImage: document.querySelector('.profile-image'),
            experienceBadge: document.querySelector('.experience-badge')
        }
    };

    // Initialize Intersection Observer for scroll animations
    function initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        state.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.isAnimated) {
                    state.isIntersecting = true;
                    animateElements();
                    state.isAnimated = true;
                }
            });
        }, options);

        if (state.elements.section) {
            state.observer.observe(state.elements.section);
        }
    }

    // Animate elements sequentially
    function animateElements() {
        // Profile card animation
        if (state.elements.profileCard) {
            animateElement(state.elements.profileCard, 0);
        }

        // Vision card animation
        if (state.elements.visionCard) {
            animateElement(state.elements.visionCard, 200);
        }

        // Service highlights animation
        state.elements.serviceHighlights.forEach((highlight, index) => {
            animateElement(highlight, 400 + (index * 200));
        });

        // Credential items animation
        state.elements.credentialItems.forEach((item, index) => {
            animateElement(item, 1000 + (index * 100));
        });

        // Experience badge animation
        if (state.elements.experienceBadge) {
            animateElement(state.elements.experienceBadge, 300);
        }
    }

    // Animate single element
    function animateElement(element, delay) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    // Initialize hover effects
    function initHoverEffects() {
        // Profile card hover effect
        if (state.elements.profileCard) {
            const card = state.elements.profileCard;
            const image = state.elements.profileImage;
            const badge = state.elements.experienceBadge;

            card.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    if (image) image.style.transform = 'scale(1.05)';
                    if (badge) badge.style.transform = 'translateY(-5px)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    if (image) image.style.transform = 'scale(1)';
                    if (badge) badge.style.transform = 'translateY(0)';
                }
            });
        }

        // Service highlights hover effects
        state.elements.serviceHighlights.forEach(highlight => {
            highlight.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    highlight.style.transform = 'translateY(-10px)';
                }
            });

            highlight.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    highlight.style.transform = 'translateY(0)';
                }
            });
        });

        // Credential items hover effects
        state.elements.credentialItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    item.style.transform = 'translateY(-5px)';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    item.style.transform = 'translateY(0)';
                }
            });
        });
    }

    // Handle window resize
    function handleResize() {
        const resizeDebounce = debounce(() => {
            if (window.innerWidth < 1024) {
                // Reset all transforms on mobile
                resetTransforms();
            }
        }, 250);

        window.addEventListener('resize', resizeDebounce);
    }

    // Reset transforms for mobile
    function resetTransforms() {
        if (state.elements.profileImage) {
            state.elements.profileImage.style.transform = '';
        }
        if (state.elements.experienceBadge) {
            state.elements.experienceBadge.style.transform = '';
        }
        state.elements.serviceHighlights.forEach(highlight => {
            highlight.style.transform = '';
        });
        state.elements.credentialItems.forEach(item => {
            item.style.transform = '';
        });
    }

    // Debounce utility function
    function debounce(func, wait) {
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

    // Handle visibility changes
    function handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                resetTransforms();
            }
        });
    }

    // Initialize AOS if available
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                mirror: false,
                offset: 50
            });
        }
    }

    // Initialize everything
    function init() {
        initIntersectionObserver();
        initHoverEffects();
        handleResize();
        handleVisibilityChange();
        initAOS();
    }

    // Cleanup function
    function cleanup() {
        if (state.observer) {
            state.observer.disconnect();
        }
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    // Initialize
    init();

    // Return cleanup function
    return cleanup;
}

// ===============================
// TEAM SECTION
// ===============================
function initTeamSection() {
    // Initialize Swiper
    const teamSwiper = new Swiper('.team-carousel', {
        // Basic settings
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        
        // Enable lazy loading
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2
        },
        
        // Autoplay configuration
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        
        // Responsive breakpoints
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        
        // Enable keyboard control
        keyboard: {
            enabled: true,
            onlyInViewport: true
        }
    });

    // Handle team card animations and interactions
    const cards = document.querySelectorAll('.team-card');
    cards.forEach((card, index) => {
        // Initial animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);

        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            const image = card.querySelector('.card-image img');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            const image = card.querySelector('.card-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            teamSwiper.update();
            updateCardHeights();
        }, 250);
    });

    // Update card heights for consistency
    function updateCardHeights() {
        const cards = document.querySelectorAll('.team-card');
        let maxHeight = 0;

        // Reset heights
        cards.forEach(card => {
            card.style.height = 'auto';
            const height = card.offsetHeight;
            maxHeight = Math.max(maxHeight, height);
        });

        // Apply max height to all cards
        cards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }

    // Initialize card heights
    updateCardHeights();

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            teamSwiper.autoplay.stop();
        } else {
            teamSwiper.autoplay.start();
        }
    });

    return teamSwiper;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTeamSection();
});

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTeamSection
    };
}

// ===============================
// BOOK SECTION
// ===============================
function initBookSection() {
    const bookCover = document.querySelector('.book-cover');
    const features = document.querySelectorAll('.feature');
    const bookPreview = document.querySelector('.book-preview');
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Handle book cover hover effects
    if (bookCover) {
        bookCover.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 991) return; // Disable on mobile
            
            const { left, top, width, height } = bookCover.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            const rotateY = -20 + (x * 10); // Limit rotation range
            const rotateX = 5 - (y * 10);
            
            bookCover.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        bookCover.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 991) return;
            bookCover.style.transform = 'rotateY(-20deg) rotateX(5deg)';
        });
    }

    // Handle scroll animations for book preview
    function handleScroll() {
        if (!bookPreview || window.innerWidth <= 991) return;
        
        const scroll = window.pageYOffset;
        const bookRect = bookPreview.getBoundingClientRect();
        const maxScroll = 50; // Maximum pixels to move

        if (bookRect.top <= 120) {
            const scrolled = Math.min(scroll * 0.1, maxScroll);
            bookPreview.style.transform = `translateY(${scrolled}px)`;
        }
    }

    // Feature hover effects
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 768) return;
            feature.style.transform = 'translateX(10px)';
        });

        feature.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            feature.style.transform = 'translateX(0)';
        });
    });

    // Handle scroll events with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset transformations on mobile
            if (window.innerWidth <= 991) {
                if (bookCover) bookCover.style.transform = '';
                if (bookPreview) bookPreview.style.transform = '';
            }
        }, 250);
    });

    // Initialize price format if needed
    const priceElement = document.querySelector('.price');
    if (priceElement) {
        const formatPrice = (price) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        };
        
        // Example: format price if it's not already formatted
        const rawPrice = priceElement.textContent.replace('$', '');
        if (!isNaN(rawPrice)) {
            priceElement.textContent = formatPrice(parseFloat(rawPrice));
        }
    }

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Reset animations when tab is not visible
            if (bookCover) bookCover.style.animationPlayState = 'paused';
        } else {
            if (bookCover) bookCover.style.animationPlayState = 'running';
        }
    });

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===============================
// Locations Section JavaScript
// ===============================

function initPremiumTestimonials() {
    // Initialize Swiper for testimonials
    const testimonialsSwiper = new Swiper('.testimonials-slider', {
        // Core settings
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 600,
        grabCursor: true,
        watchSlidesProgress: true,
        
        // Ensure consistent height
        autoHeight: false,
        
        // Loop and autoplay settings
        loop: true,
        loopAdditionalSlides: 2,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        
        // Effect settings
        effect: 'slide',
        
        // Custom pagination
        pagination: {
            el: '.testimonials-pagination',
            clickable: true,
            dynamicBullets: true,
            renderBullet: function(index, className) {
                return `<span class="${className}"></span>`;
            }
        },
        
        // Custom navigation
        navigation: {
            nextEl: '.nav-next',
            prevEl: '.nav-prev',
        },
        
        // Responsive breakpoints
        breakpoints: {
            576: {
                slidesPerView: 1.2,
                spaceBetween: 15,
                centeredSlides: true
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 25
            },
            1200: {
                slidesPerView: 2,
                spaceBetween: 30
            }
        },
        
        // Accessibility
        a11y: {
            enabled: true,
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
            firstSlideMessage: 'This is the first testimonial',
            lastSlideMessage: 'This is the last testimonial',
            paginationBulletMessage: 'Go to testimonial {{index}}'
        },
        
        // Event callbacks
        on: {
            init: function() {
                initAnimations();
                equalizeCardHeights();
                
                // Refresh AOS animations if available
                if (typeof AOS !== 'undefined') {
                    setTimeout(() => {
                        AOS.refresh();
                    }, 500);
                }
            },
            resize: function() {
                equalizeCardHeights();
            },
            slideChangeTransitionStart: function() {
                animate();
            }
        }
    });
    
    // Initialize animations for testimonial cards and featured testimonial
    function initAnimations() {
        // Set up featured testimonial
        const featuredTestimonial = document.querySelector('.featured-testimonial');
        if (featuredTestimonial) {
            // Add entrance animation
            featuredTestimonial.style.opacity = '0';
            featuredTestimonial.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                featuredTestimonial.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                featuredTestimonial.style.opacity = '1';
                featuredTestimonial.style.transform = 'translateY(0)';
            }, 300);
            
            // Add hover interactions
            featuredTestimonial.addEventListener('mouseenter', () => {
                featuredTestimonial.style.transform = 'translateY(-10px)';
            });
            
            featuredTestimonial.addEventListener('mouseleave', () => {
                featuredTestimonial.style.transform = 'translateY(0)';
            });
        }
        
        // Setup all testimonial cards
        const cards = document.querySelectorAll('.testimonial-card');
        cards.forEach((card, index) => {
            // Add staggered entrance animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500 + (index * 150));
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Animate stats
        animateStats();
    }
    
    // Function to ensure all testimonial cards are the same height
    function equalizeCardHeights() {
        const cards = document.querySelectorAll('.testimonial-card');
        const currentHeight = parseInt(cards[0]?.style.height || 0);
        
        // First, reset heights to auto to get natural height
        cards.forEach(card => {
            card.style.height = '';
        });
        
        // Get max height considering content
        let maxContentHeight = 0;
        cards.forEach(card => {
            const contentHeight = card.scrollHeight;
            if (contentHeight > maxContentHeight) {
                maxContentHeight = contentHeight;
            }
        });
        
        // Apply the greater of fixed height or content height
        const fixedHeight = 320; // Our default fixed height
        const finalHeight = Math.max(maxContentHeight, fixedHeight);
        
        // Set all cards to the final height
        cards.forEach(card => {
            card.style.height = `${finalHeight}px`;
        });
    }
    
    // Animate the stats with counting effect
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        // Check if IntersectionObserver is available
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        countUp(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statNumbers.forEach(stat => {
                observer.observe(stat);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            setTimeout(() => {
                statNumbers.forEach(stat => {
                    countUp(stat);
                });
            }, 1000);
        }
    }
    
    // Count up animation for stat numbers
    function countUp(element) {
        const text = element.textContent;
        const value = parseFloat(text.replace(/[^\d.-]/g, ''));
        const suffix = text.replace(/[\d.-]/g, '');
        
        if (isNaN(value)) return;
        
        const duration = 2000; // Animation duration in ms
        const frameDuration = 1000/60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        const countTo = value;
        
        const counter = setInterval(() => {
            frame++;
            
            // Calculate current count with easing
            const progress = frame / totalFrames;
            const easedProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const count = countTo * easedProgress;
            
            // Handle different number formats
            if (value % 1 === 0) {
                // Integer
                element.textContent = Math.floor(count) + suffix;
            } else {
                // Decimal
                element.textContent = count.toFixed(1) + suffix;
            }
            
            if (frame === totalFrames) {
                clearInterval(counter);
                element.textContent = value + suffix; // Ensure final value is exact
            }
        }, frameDuration);
    }
    
    // Animate elements when they come into view
    function animate() {
        const cards = document.querySelectorAll('.swiper-slide-active .testimonial-card, .swiper-slide-next .testimonial-card');
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    // Handle window resize events
    const debouncedResize = debounce(() => {
        equalizeCardHeights();
        
        // Check if we should reset transforms on mobile
        if (window.innerWidth < 768) {
            const elements = document.querySelectorAll('.featured-testimonial, .testimonial-card');
            elements.forEach(el => {
                el.style.transform = '';
            });
        }
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            testimonialsSwiper.autoplay.stop();
        } else {
            testimonialsSwiper.autoplay.start();
            equalizeCardHeights();
        }
    });
    
    // Utility function to debounce events
    function debounce(func, wait) {
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
    
    // Return the initialized swiper instance
    return testimonialsSwiper;
}

// Initialize testimonials when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add to the main initialization if available, otherwise initialize directly
    if (typeof window.initializeAllComponents === 'function') {
        const originalInit = window.initializeAllComponents;
        window.initializeAllComponents = function() {
            originalInit();
            initPremiumTestimonials();
        };
    } else {
        initPremiumTestimonials();
    }
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
});

// ===============================
// Locations Section JavaScript
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    initializeLocations();
});

function initializeLocations() {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Add hover effects to location cards
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click animation to direction buttons
    const directionButtons = document.querySelectorAll('.btn-directions');
    directionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);

            // Track click if analytics is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'get_directions', {
                    'location': this.closest('.location-card').querySelector('h3').textContent
                });
            }
        });
    });

    // Floating elements animation
    const floatingElements = document.querySelectorAll('.float-item');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * -1}s`;
    });

    // Lazy load maps when they come into view
    const mapObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                }
                observer.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });

    // Observe map iframes
    document.querySelectorAll('.location-image iframe').forEach(iframe => {
        mapObserver.observe(iframe);
    });

    // Add scroll reveal for amenities
    const amenityItems = document.querySelectorAll('.amenity-item');
    amenityItems.forEach((item, index) => {
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', `${index * 100}`);
    });

    // Handle mobile touch interactions
    if ('ontouchstart' in window) {
        locationCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px)';
            });

            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update map size on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const maps = document.querySelectorAll('.location-image iframe');
            maps.forEach(map => {
                // Force map refresh on resize
                map.style.height = map.offsetHeight + 'px';
            });
        }, 250);
    });

    // Add error handling for maps
    document.querySelectorAll('.location-image iframe').forEach(iframe => {
        iframe.addEventListener('error', function() {
            this.style.display = 'none';
            const errorMessage = document.createElement('div');
            errorMessage.className = 'map-error';
            errorMessage.innerHTML = `
                <i class="fas fa-map-marked-alt"></i>
                <p>Map loading error. Please try again later.</p>
            `;
            this.parentElement.appendChild(errorMessage);
        });
    });

    // Initialize contact buttons
    const contactButtons = document.querySelectorAll('.detail-item a[href^="tel:"]');
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact', {
                    'method': 'phone',
                    'location': this.closest('.location-card').querySelector('h3').textContent
                });
            }
        });
    });
}

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeLocations
    };
}

// ===============================
// CONTACT SECTION
// ===============================
function initContactSection() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        initFormHandling(contactForm);
        initFormLabels(contactForm);
    }

    initBackToTop();
    initFooterInteractions();
}

function initFormHandling(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showToast('Message sent successfully! We will get back to you soon.');
            form.reset();
        } catch (error) {
            showToast('An error occurred. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function initFormLabels(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            if (input.value) label.classList.add('active');
            
            input.addEventListener('focus', () => label.classList.add('active'));
            input.addEventListener('blur', () => {
                if (!input.value) label.classList.remove('active');
            });
        }
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', debounce(() => {
            backToTop.classList.toggle('visible', window.pageYOffset > 500);
        }, 100));

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Export modules if using a module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAllComponents,
        initHeader,
        initHeroSlider,
        initServices,
        initAboutSection,
        initTeamSection,
        initBookSection,
        initPremiumTestimonials,
        initLocationsSection,
        initContactSection
    };
}
