// Main Application Class
class PsychologyWebsite {
    constructor() {
        // Initialize components
        this.navigation = new Navigation();
        this.heroSlider = new HeroSlider();
        this.forms = new FormHandler();
        this.scrollEffects = new ScrollEffects();
        this.backToTop = new BackToTop();
        
        // Initialize the application
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.navigation.init();
            this.heroSlider.init();
            this.forms.init();
            this.scrollEffects.init();
            this.backToTop.init();
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
        this.isMenuOpen = false;
        this.lastScroll = 0;
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
                this.closeMenu();
            }
        });

        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavLinkClick(e));
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Auto-hide navbar on scroll down
            if (currentScroll > this.lastScroll && currentScroll > 500) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }

            this.lastScroll = currentScroll;
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.navToggle?.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    handleNavLinkClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
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
    }
}

// Hero Slider
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slider .slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.intervalDuration = 5000;
    }

    init() {
        if (this.slides.length > 0) {
            this.setupSlider();
            this.setupTouchEvents();
        }
    }

    setupSlider() {
        this.showSlide(this.currentSlide);
        this.startSlideshow();

        // Pause on hover
        const heroSection = document.querySelector('.hero');
        heroSection.addEventListener('mouseenter', () => this.pauseSlideshow());
        heroSection.addEventListener('mouseleave', () => this.startSlideshow());
    }

    setupTouchEvents() {
        const heroSection = document.querySelector('.hero');
        let touchStartX = 0;
        let touchEndX = 0;

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            this.pauseSlideshow();
        });

        heroSection.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        heroSection.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            this.startSlideshow();
        });
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[index].classList.add('active');
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    startSlideshow() {
        this.slideInterval = setInterval(() => this.nextSlide(), this.intervalDuration);
    }

    pauseSlideshow() {
        clearInterval(this.slideInterval);
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.validateField(input));
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!this.validateForm(form)) {
            this.showNotification('Please check your inputs and try again.', 'error');
            return;
        }

        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            
            // Reset success states
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success');
            });
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    validateField(field) {
        const parent = field.closest('.form-group');
        this.removeError(parent);

        if (!field.required && field.value === '') {
            return true;
        }

        // Required field validation
        if (field.required && field.value.trim() === '') {
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

        parent.classList.add('success');
        return true;
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    showError(parent, message) {
        parent.classList.add('error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        parent.appendChild(error);
    }

    removeError(parent) {
        parent.classList.remove('error', 'success');
        const error = parent.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        const container = document.querySelector('.notification-container') 
            || this.createNotificationContainer();
        
        container.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }
}

// Scroll Effects
class ScrollEffects {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .fade-up, .fade-left, .fade-right');
        this.sections = document.querySelectorAll('section');
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
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(element => observer.observe(element));
        this.sections.forEach(section => observer.observe(section));
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        this.scrollThreshold = 300;
    }

    init() {
        if (this.button) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => this.toggleButtonVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    toggleButtonVisibility() {
        if (window.pageYOffset > this.scrollThreshold) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize the application
const app = new PsychologyWebsite();
