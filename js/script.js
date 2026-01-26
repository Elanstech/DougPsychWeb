/**
 * Doug Uhlig Psychological Services - Main JavaScript
 * Version: 2.0 - Optimized & Clean
 * Last Updated: 2025
 */

/* ==========================================================================
   TABLE OF CONTENTS:
   1. Initialization
   2. Utilities
   3. Header & Navigation
   4. Hero Section (Updated)
   5. About Section
   6. Services Section
   7. Team Section
   8. Book Section
   9. Testimonials Section
   ========================================================================== */

// ==========================================================================
// 1. INITIALIZATION
// ==========================================================================
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
    initTestimonials();
    
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

// ==========================================================================
// 2. UTILITIES
// ==========================================================================
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

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
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
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });
}

// ==========================================================================
// 3. HEADER & NAVIGATION
// ==========================================================================
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

// ==========================================================================
// 4. HERO SECTION (UPDATED - Modern Side-by-Side)
// ==========================================================================
function initHeroSlider() {
    // Service items animations
    const serviceItems = document.querySelectorAll('.services-list li');
    
    serviceItems.forEach((item, index) => {
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
            const serviceItem = item.querySelector('.service-item');
            if (serviceItem) {
                serviceItem.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
            const serviceItem = item.querySelector('.service-item');
            if (serviceItem) {
                serviceItem.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }
        });
    });

    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-photo');
    if (heroImage && window.innerWidth >= 992) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero');
            
            if (heroSection) {
                const heroTop = heroSection.offsetTop;
                const heroHeight = heroSection.offsetHeight;
                
                // Only apply parallax when hero is in view
                if (scrolled < heroHeight) {
                    const parallaxValue = (scrolled - heroTop) * 0.3;
                    heroImage.style.transform = `translateY(${parallaxValue}px)`;
                }
            }
        });
    }

    // Animate experience badge on scroll
    const experienceBadge = document.querySelector('.experience-badge');
    if (experienceBadge) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    experienceBadge.style.animation = 'fadeInUp 1s ease forwards 0.5s';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(experienceBadge);
    }

    // Add subtle animation to the hero button
    const heroButton = document.querySelector('.btn-hero');
    if (heroButton) {
        heroButton.addEventListener('mouseenter', () => {
            heroButton.style.transform = 'translateY(-3px) scale(1.05)';
        });

        heroButton.addEventListener('mouseleave', () => {
            heroButton.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Add intersection observer for content wrapper
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    contentWrapper.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(contentWrapper);
    }

    // Image lazy loading optimization
    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto && 'loading' in HTMLImageElement.prototype) {
        heroPhoto.loading = 'eager'; // Load hero image immediately
    }
}

// ==========================================================================
// 5. ABOUT SECTION
// ==========================================================================
function initAboutSection() {
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

    function animateElements() {
        if (state.elements.profileCard) {
            animateElement(state.elements.profileCard, 0);
        }

        if (state.elements.visionCard) {
            animateElement(state.elements.visionCard, 200);
        }

        state.elements.serviceHighlights.forEach((highlight, index) => {
            animateElement(highlight, 400 + (index * 200));
        });

        state.elements.credentialItems.forEach((item, index) => {
            animateElement(item, 1000 + (index * 100));
        });

        if (state.elements.experienceBadge) {
            animateElement(state.elements.experienceBadge, 300);
        }
    }

    function animateElement(element, delay) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    function initHoverEffects() {
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

    initIntersectionObserver();
    initHoverEffects();
}

// ==========================================================================
// 6. SERVICES SECTION
// ==========================================================================
function initServices() {
    const servicesSwiper = new Swiper('.services-carousel', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        grabCursor: true,
        centeredSlides: false,
        
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: false
            }
        },

        on: {
            init: function() {
                initCardInteractions();
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

    function initCardInteractions() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            const image = card.querySelector('.service-image');
            const overlay = card.querySelector('.image-overlay');
            const features = card.querySelectorAll('.service-features li');
            
            features.forEach((feature, index) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    feature.style.transition = 'all 0.5s ease';
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateY(0)';
                }, 100 + (index * 100));
            });
            
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
        });
    }

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            servicesSwiper.autoplay.stop();
        } else {
            servicesSwiper.autoplay.start();
        }
    });

    return servicesSwiper;
}

// ==========================================================================
// 7. TEAM SECTION
// ==========================================================================
function initTeamSection() {
    const teamSwiper = new Swiper('.team-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2
        },
        
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        
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
        
        navigation: {
            nextEl: '.team-carousel .swiper-button-next',
            prevEl: '.team-carousel .swiper-button-prev',
        },
        
        pagination: {
            el: '.team-carousel .swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        
        keyboard: {
            enabled: true,
            onlyInViewport: true
        }
    });

    // Handle team card animations
    const cards = document.querySelectorAll('.team-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            const image = card.querySelector('.team-member-image');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            const image = card.querySelector('.team-member-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });

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

// ==========================================================================
// 8. BOOK SECTION
// ==========================================================================
function initBookSection() {
    const bookCover = document.querySelector('.book-cover');
    const features = document.querySelectorAll('.feature');
    const bookPreview = document.querySelector('.book-preview');
    
    // Handle book cover hover effects
    if (bookCover) {
        bookCover.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 991) return;
            
            const { left, top, width, height } = bookCover.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            const rotateY = -20 + (x * 10);
            const rotateX = 5 - (y * 10);
            
            bookCover.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        bookCover.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 991) return;
            bookCover.style.transform = 'rotateY(-20deg) rotateX(5deg)';
        });
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

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (bookCover) bookCover.style.animationPlayState = 'paused';
        } else {
            if (bookCover) bookCover.style.animationPlayState = 'running';
        }
    });
}

// ==========================================================================
// 9. TESTIMONIALS SECTION
// ==========================================================================
function initTestimonials() {
    const state = {
        section: document.querySelector('.testimonials-reimagined'),
        heroTestimonial: document.querySelector('.hero-testimonial'),
        testimonialCards: document.querySelectorAll('.testimonial-card'),
        isAnimated: false,
        observer: null
    };

    if (!state.section) return;

    function initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        state.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.isAnimated) {
                    triggerAnimations();
                    state.isAnimated = true;
                }
            });
        }, options);

        state.observer.observe(state.section);
    }

    function triggerAnimations() {
        animateHeroTestimonial();
        animateTestimonialCards();
    }

    function animateHeroTestimonial() {
        if (!state.heroTestimonial) return;

        state.heroTestimonial.style.opacity = '0';
        state.heroTestimonial.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            state.heroTestimonial.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            state.heroTestimonial.style.opacity = '1';
            state.heroTestimonial.style.transform = 'translateY(0)';
        }, 200);
    }

    function animateTestimonialCards() {
        state.testimonialCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }

    function initCardInteractions() {
        state.testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    card.style.transform = 'translateY(-10px)';
                    const quoteIcon = card.querySelector('.quote-icon');
                    const clientInitial = card.querySelector('.client-initial');
                    
                    if (quoteIcon) {
                        quoteIcon.style.transform = 'scale(1.2) rotate(5deg)';
                        quoteIcon.style.opacity = '0.6';
                    }
                    if (clientInitial) {
                        clientInitial.style.transform = 'scale(1.1)';
                    }
                }
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    card.style.transform = 'translateY(0)';
                    const quoteIcon = card.querySelector('.quote-icon');
                    const clientInitial = card.querySelector('.client-initial');
                    
                    if (quoteIcon) {
                        quoteIcon.style.transform = 'scale(1) rotate(0deg)';
                        quoteIcon.style.opacity = '0.3';
                    }
                    if (clientInitial) {
                        clientInitial.style.transform = 'scale(1)';
                    }
                }
            });
        });
    }

    initIntersectionObserver();
    initCardInteractions();
}

// ==========================================================================
// EXPORTS (if using modules)
// ==========================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAllComponents,
        initHeader,
        initHeroSlider,
        initServices,
        initAboutSection,
        initTeamSection,
        initBookSection,
        initTestimonials
    };
}
