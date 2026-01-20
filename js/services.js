/**
 * Services Page JavaScript - Premium Edition
 * Handles all interactions and animations for the services page
 * @version 3.0.0
 * @lastUpdated 2025-01-20
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeServicesPage();
});

/**
 * Initialize all services page components
 */
const initializeServicesPage = () => {
    // Core initialization
    initializeAOS();
    initializeServiceCards();
    initializeServiceStats();
    initializeHeroAnimations();
    initializeScrollEffects();
    initializeSmoothScroll();
    initializeAdditionalServices();
    
    // Handle window resize
    handleResponsive();
};

/**
 * Initialize AOS (Animate On Scroll) library
 */
const initializeAOS = () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100,
            disable: false
        });
    }
};

/**
 * Initialize hero section animations
 */
const initializeHeroAnimations = () => {
    const heroFeatures = document.querySelectorAll('.hero-feature-item');
    const heroCard = document.querySelector('.hero-info-card');
    
    // Stagger animate hero features
    heroFeatures.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            feature.style.transition = 'all 0.5s ease';
            feature.style.opacity = '1';
            feature.style.transform = 'translateX(0)';
        }, 300 + (index * 150));
    });
    
    // Animate hero card
    if (heroCard) {
        heroCard.style.opacity = '0';
        heroCard.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            heroCard.style.opacity = '1';
            heroCard.style.transform = 'translateY(0)';
        }, 500);
    }
};

/**
 * Initialize service showcase cards
 */
const initializeServiceCards = () => {
    const serviceCards = document.querySelectorAll('.service-showcase-item');
    
    serviceCards.forEach((card, index) => {
        // Add scroll reveal animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    animateCardContent(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        observer.observe(card);
        
        // Add hover effects for images
        const image = card.querySelector('.service-img-container img');
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
        
        // Add hover effects for benefit cards
        const benefitCards = card.querySelectorAll('.benefit-item-card');
        benefitCards.forEach(benefit => {
            benefit.addEventListener('mouseenter', () => {
                benefit.style.transform = 'translateX(15px)';
            });
            
            benefit.addEventListener('mouseleave', () => {
                benefit.style.transform = 'translateX(0)';
            });
        });
    });
};

/**
 * Animate card content when revealed
 */
const animateCardContent = (card) => {
    const benefits = card.querySelectorAll('.benefit-item-card');
    const stats = card.querySelectorAll('.stat-box-item');
    
    // Animate benefits
    benefits.forEach((benefit, index) => {
        benefit.style.opacity = '0';
        benefit.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            benefit.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            benefit.style.opacity = '1';
            benefit.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animate stats
    stats.forEach((stat, index) => {
        setTimeout(() => {
            animateStatNumber(stat);
        }, index * 200);
    });
};

/**
 * Animate service statistics numbers
 */
const initializeServiceStats = () => {
    const statBoxes = document.querySelectorAll('.stat-box-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateStatNumber(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statBoxes.forEach(box => observer.observe(box));
};

/**
 * Animate individual stat number with counting effect
 */
const animateStatNumber = (statBox) => {
    const statNum = statBox.querySelector('.stat-num');
    if (!statNum) return;
    
    const targetText = statNum.textContent;
    const hasPercent = targetText.includes('%');
    const hasPlus = targetText.includes('+');
    const isDash = targetText.includes('-');
    
    // Extract numeric value
    let targetValue = parseInt(targetText.replace(/\D/g, ''));
    
    // Handle special cases
    if (isDash) {
        // For ranges like "6-12", just display as is
        return;
    }
    
    // Determine increment based on final value
    const increment = targetValue > 100 ? 5 : targetValue > 50 ? 2 : 1;
    const duration = 2000; // 2 seconds
    const steps = duration / 30; // 30ms per step
    const stepValue = targetValue / steps;
    
    let currentValue = 0;
    
    const counter = setInterval(() => {
        currentValue += stepValue;
        
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(counter);
        }
        
        const displayValue = Math.floor(currentValue);
        let displayText = displayValue.toString();
        
        if (hasPercent) {
            displayText += '%';
        }
        if (hasPlus && currentValue >= targetValue) {
            displayText += '+';
        }
        
        statNum.textContent = displayText;
    }, 30);
    
    // Add pulse animation
    statBox.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
        statBox.style.animation = '';
    }, 500);
};

/**
 * Initialize additional services cards
 */
const initializeAdditionalServices = () => {
    const serviceCards = document.querySelectorAll('.additional-service-card');
    
    serviceCards.forEach((card, index) => {
        // Add scroll reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, {
            threshold: 0.2
        });
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        observer.observe(card);
        
        // Add hover effect for image
        const image = card.querySelector('.service-card-img img');
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
        
        // Add hover effect for list items
        const listItems = card.querySelectorAll('.service-card-points li');
        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(8px)';
                item.style.color = 'var(--royal-blue)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
                item.style.color = 'var(--text-medium)';
            });
        });
    });
};

/**
 * Initialize smooth scrolling for anchor links
 */
const initializeSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            
            if (href !== '#' && href !== '') {
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
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            }
        });
    });
};

/**
 * Close mobile navigation menu
 */
const closeMobileMenu = () => {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
};

/**
 * Handle scroll effects
 */
const initializeScrollEffects = () => {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Header scroll effect
                if (currentScroll > 100) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
                
                // Parallax effect for hero section
                const hero = document.querySelector('.services-hero');
                if (hero && currentScroll < hero.offsetHeight) {
                    const parallaxSpeed = 0.5;
                    hero.style.transform = `translateY(${currentScroll * parallaxSpeed}px)`;
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    });
};

/**
 * Handle responsive behavior
 */
const handleResponsive = () => {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            // Refresh AOS on resize
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // Reset mobile menu on desktop
            if (window.innerWidth >= 1024) {
                closeMobileMenu();
            }
        }, 250);
    });
};

/**
 * Add pulse animation keyframes dynamically
 */
const addCustomAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .service-showcase-item.revealed {
            animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
    `;
    document.head.appendChild(style);
};

// Add custom animations on load
addCustomAnimations();

/**
 * Image lazy loading optimization
 */
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
        }
    });
});

/**
 * Export functions for potential use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeServicesPage,
        initializeServiceCards,
        initializeServiceStats,
        animateStatNumber
    };
}
