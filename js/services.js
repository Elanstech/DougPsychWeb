/**
 * Services Page JavaScript
 * Handles all interactions and animations for the services page
 * @version 2.0.0
 * @lastUpdated 2025-03-09
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeServicesPage();
});

const initializeServicesPage = () => {
    // Initialize core functionality
    initializeAOS();
    initializeServicesHero();
    initializeServiceFeatures();
    initializeServiceCards();
    initializeJourneySteps();
    initializeTestimonials();
    initializeSmoothScroll();
    handleScrollEffects();
    handleNavigation();
    initializeAdditionalServices();
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
    const heroCard = document.querySelector('.hero-card');
    const heroFeatures = document.querySelectorAll('.hero-feature');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!hero || !heroContent) return;

    // Add initial animation for hero elements
    setTimeout(() => {
        if (heroCard) {
            heroCard.style.opacity = '0';
            heroCard.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroCard.style.transition = 'all 0.8s ease';
                heroCard.style.opacity = '1';
                heroCard.style.transform = 'translateY(0)';
            }, 500);
        }
        
        if (heroFeatures.length > 0) {
            heroFeatures.forEach((feature, index) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    feature.style.transition = 'all 0.5s ease';
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateY(0)';
                }, 200 * (index + 1));
            });
        }
    }, 300);

    // Subtle parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (scrolled > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }
        
        // Apply parallax effect to hero content
        heroContent.style.transform = `translateY(${rate}px)`;
        
        // Animate header on scroll
        if (scrolled > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });
};

// Initialize service features interactions
const initializeServiceFeatures = () => {
    const features = document.querySelectorAll('.service-feature');
    
    if (features.length === 0) return;
    
    features.forEach(feature => {
        const image = feature.querySelector('.service-image');
        const details = feature.querySelector('.service-details');
        const benefits = feature.querySelectorAll('.benefit');
        const stats = feature.querySelectorAll('.stat');
        
        // Add hover interactions for benefits
        benefits.forEach(benefit => {
            benefit.addEventListener('mouseenter', () => {
                benefits.forEach(b => b.classList.remove('active'));
                benefit.classList.add('active');
            });
        });
        
        // Add hover effects for stats
        if (stats.length > 0) {
            stats.forEach(stat => {
                stat.addEventListener('mouseenter', () => {
                    const number = stat.querySelector('.stat-number');
                    if (number) {
                        number.style.transform = 'scale(1.1)';
                        number.style.transition = 'transform 0.3s ease';
                    }
                });
                
                stat.addEventListener('mouseleave', () => {
                    const number = stat.querySelector('.stat-number');
                    if (number) {
                        number.style.transform = 'scale(1)';
                    }
                });
            });
        }
        
        // Add scroll animations
        window.addEventListener('scroll', () => {
            const featureTop = feature.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (featureTop < windowHeight * 0.75) {
                feature.classList.add('in-view');
                
                // Stagger animate benefits
                benefits.forEach((benefit, index) => {
                    setTimeout(() => {
                        benefit.classList.add('animated');
                    }, 200 * index);
                });
                
                // Animate stats
                if (stats.length > 0) {
                    stats.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.classList.add('animated');
                            
                            // Animate number counting
                            const number = stat.querySelector('.stat-number');
                            if (number) {
                                const targetValue = number.innerText;
                                const isPercentage = targetValue.includes('%');
                                let value = 0;
                                let finalValue = parseInt(targetValue.replace(/\D/g, ''));
                                
                                // Handle ranges like "6-12"
                                if (targetValue.includes('-')) {
                                    const range = targetValue.split('-');
                                    finalValue = parseInt(range[0]);
                                }
                                
                                // Special case for "100%" to make animation faster
                                const increment = finalValue === 100 ? 5 : 1;
                                
                                const animateCounter = setInterval(() => {
                                    value += increment;
                                    
                                    if (value >= finalValue) {
                                        value = finalValue;
                                        clearInterval(animateCounter);
                                    }
                                    
                                    // Handle special formats
                                    if (targetValue.includes('-')) {
                                        number.innerText = targetValue;
                                    } else if (isPercentage) {
                                        number.innerText = value + '%';
                                    } else {
                                        number.innerText = value;
                                    }
                                }, 30);
                            }
                        }, 300 * index);
                    });
                }
            }
        });
    });
};

// Initialize service cards animations and interactions
const initializeServiceCards = () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceCards.length === 0) return;
    
    serviceCards.forEach(card => {
        // Add hover interaction
        card.addEventListener('mouseenter', handleServiceCardHover);
        card.addEventListener('mouseleave', handleServiceCardLeave);
        
        // Add scroll animations
        window.addEventListener('scroll', () => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.8) {
                card.classList.add('in-view');
            }
        });
    });
};

// Handle service card hover effects
const handleServiceCardHover = (e) => {
    if (window.innerWidth < 1024) return;
    
    const card = e.currentTarget;
    const cardImage = card.querySelector('.service-card-image img');
    
    if (cardImage) {
        cardImage.style.transform = 'scale(1.05)';
    }
    
    card.classList.add('hovered');
};

// Handle service card leave effects
const handleServiceCardLeave = (e) => {
    if (window.innerWidth < 1024) return;
    
    const card = e.currentTarget;
    const cardImage = card.querySelector('.service-card-image img');
    
    if (cardImage) {
        cardImage.style.transform = 'scale(1)';
    }
    
    card.classList.remove('hovered');
};

// Initialize additional services interactions
const initializeAdditionalServices = () => {
    const servicePoints = document.querySelectorAll('.service-points li');
    
    if (servicePoints.length === 0) return;
    
    servicePoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            point.style.transform = 'translateX(5px)';
            point.style.color = 'var(--royal-blue)';
            point.style.transition = 'all 0.3s ease';
        });
        
        point.addEventListener('mouseleave', () => {
            point.style.transform = 'translateX(0)';
            point.style.color = 'var(--text-medium)';
        });
    });
};

// Initialize journey steps animations
const initializeJourneySteps = () => {
    const journeySteps = document.querySelectorAll('.journey-step');
    
    if (journeySteps.length === 0) return;
    
    journeySteps.forEach((step, index) => {
        // Add initial state
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        
        // Add scroll animations
        window.addEventListener('scroll', () => {
            const stepTop = step.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (stepTop < windowHeight * 0.75) {
                step.classList.add('in-view');
                
                // Staggered animation
                setTimeout(() => {
                    step.style.transition = 'all 0.6s ease';
                    step.style.opacity = '1';
                    step.style.transform = 'translateY(0)';
                    
                    // Animate content with delay
                    setTimeout(() => {
                        step.classList.add('content-visible');
                    }, 300);
                }, 200 * index);
            }
        });
    });
};

// Initialize testimonials slider
const initializeTestimonials = () => {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    if (!testimonialsSlider) return;
    
    new Swiper(testimonialsSlider, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        }
    });
};

// Initialize smooth scrolling for anchor links
const initializeSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            if (anchor.getAttribute('href') !== '#') {
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
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navToggle = document.querySelector('.nav-toggle');
                    
                    if (navMenu && navToggle && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                        
                        const spans = navToggle.querySelectorAll('span');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
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
                        scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
                    } else {
                        scrollIndicator.style.opacity = '1';
                        scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
                    }
                }
                
                // Parallax effect for sections with data-parallax attribute
                document.querySelectorAll('[data-parallax]').forEach(element => {
                    const speed = element.getAttribute('data-parallax') || 0.1;
                    const rect = element.getBoundingClientRect();
                    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isInView) {
                        const offset = (window.innerHeight - rect.top) * speed;
                        element.style.transform = `translateY(${offset}px)`;
                    }
                });
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    });
};

// Handle mobile navigation
const handleNavigation = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Close menu when clicking menu items
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
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
            
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    }, 250);
});

// Image loading optimization
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.onload = () => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            };
        }
    });
    
    // Initialize animations for elements already in viewport
    const elementsToAnimate = document.querySelectorAll('.service-feature, .journey-step, .service-card, .benefit');
    elementsToAnimate.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            element.classList.add('in-view');
            
            // For benefit elements inside in-view service features
            if (element.classList.contains('service-feature')) {
                const benefits = element.querySelectorAll('.benefit');
                benefits.forEach((benefit, index) => {
                    setTimeout(() => {
                        benefit.classList.add('animated');
                    }, 200 * index);
                });
            }
        }
    });
});

// Export functions for potential use in other modules
export {
    initializeServicesPage,
    initializeServiceFeatures,
    initializeServiceCards,
    initializeJourneySteps,
    handleScrollEffects
};
