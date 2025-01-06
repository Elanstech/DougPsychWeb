// Main Application Class
class PsychologyWebsite {
    constructor() {
        this.initializeModules();
        this.initializeEventListeners();
    }

    initializeModules() {
        this.navigation = new Navigation();
        this.heroSlider = new HeroSlider();
        this.forms = new FormHandler();
        this.animations = new AnimationHandler();
        this.scrollEffects = new ScrollEffects();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.navigation.init();
            this.heroSlider.init();
            this.forms.init();
            this.animations.init();
            this.scrollEffects.init();
            
            // Initialize AOS
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        });
    }
}

// Navigation Handler
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScroll = 0;
        this.isMenuOpen = false;
    }

    init() {
        this.handleMobileMenu();
        this.handleNavScroll();
        this.handleSmoothScroll();
    }

    handleMobileMenu() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.isMenuOpen = !this.isMenuOpen;
                this.navToggle.classList.toggle('active');
                this.navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
                this.closeMenu();
            }
        });
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.navToggle?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    handleNavScroll() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Auto-hide navbar on scroll down
            if (currentScroll > this.lastScroll && currentScroll > 500 && !this.isMenuOpen) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }

            this.lastScroll = currentScroll;
        });
    }

    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    this.closeMenu();
                }
            });
        });
    }
}

// Hero Slider
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.slideInterval = 5000; // 5 seconds
        this.autoPlayTimer = null;
    }

    init() {
        if (this.slides.length > 0) {
            this.startAutoPlay();
            this.addEventListeners();
        }
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.slideInterval);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayTimer);
    }

    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }

    prevSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }

    addEventListeners() {
        // Add touch support
        let touchStartX = 0;
        let touchEndX = 0;

        document.querySelector('.hero').addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        document.querySelector('.hero').addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);

        // Handle swipe
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const swipeLength = touchEndX - touchStartX;

            if (Math.abs(swipeLength) > swipeThreshold) {
                if (swipeLength > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        };
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
    }

    init() {
        this.setupFormValidation();
        this.handleInputEffects();
    }

    setupFormValidation() {
        this.forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (this.validateForm(form)) {
                    const submitBtn = form.querySelector('[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    
                    try {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                        
                        // Simulate form submission (replace with actual API call)
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        this.showNotification('Message sent successfully!', 'success');
                        form.reset();
                    } catch (error) {
                        this.showNotification('Error sending message. Please try again.', 'error');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const parent = field.closest('.form-group');
        this.removeError(parent);

        // Required field validation
        if (!field.value.trim()) {
            this.showError(parent, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showError(parent, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (field.type === 'tel') {
            const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phoneRegex.test(field.value)) {
                this.showError(parent, 'Please enter a valid phone number');
                return false;
            }
        }

        return true;
    }

    showError(parent, message) {
        parent.classList.add('error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        parent.appendChild(error);
    }

    removeError(parent) {
        parent.classList.remove('error');
        const error = parent.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    handleInputEffects() {
        const inputs = document.querySelectorAll('.modern-form input, .modern-form textarea, .modern-form select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.form-group').classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.closest('.form-group').classList.remove('focused');
                if (input.value) {
                    input.closest('.form-group').classList.add('filled');
                } else {
                    input.closest('.form-group').classList.remove('filled');
                }
            });
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Animation Handler
class AnimationHandler {
    constructor() {
        this.elements = document.querySelectorAll('.fade-up, .service-card, .modality-card');
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Scroll Effects
class ScrollEffects {
    constructor() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
    }

    init() {
        this.handleParallax();
        this.handleScrollIndicator();
    }

    handleParallax() {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                this.parallaxElements.forEach(element => {
                    const speed = element.dataset.parallax || 0.5;
                    const rect = element.getBoundingClientRect();
                    const scrolled = window.pageYOffset;
                    
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const translateY = scrolled * speed;
                        element.style.transform = `translateY(${translateY}px)`;
                    }
                });
            });
        });
    }

    handleScrollIndicator() {
        if (this.scrollIndicator) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 100) {
                    this.scrollIndicator.classList.add('hidden');
                } else {
                    this.scrollIndicator.classList.remove('hidden');
                }
            });
        }
    }
}

// Initialize the application
const app = new PsychologyWebsite();
