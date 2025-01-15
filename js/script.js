// Main JavaScript for DougPsychWeb

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeroSection();
    initNavigation();
    initServices();
    initTestimonials();
    initContactForm();
    initAppointmentBooking();
    initAnimations();
    initAccessibility();
});

// Utility Functions
const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance optimization
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Smooth scroll function
    smoothScroll: (target, duration = 500) => {
        const targetPosition = target.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
};

// Navigation and Header
function initNavigation() {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    // Sticky Header
    window.addEventListener('scroll', utils.throttle(() => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }, 100));

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', 
                nav.classList.contains('active'));
        });
    }

    // Smooth Scroll Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) utils.smoothScroll(target);
        });
    });
}

// Hero Section
function initHeroSection() {
    // Text Animation
    const textAnimation = () => {
        const changingTexts = document.querySelectorAll('.changing-text');
        let currentIndex = 0;

        function updateText() {
            changingTexts.forEach(text => {
                text.style.opacity = '0';
                text.style.transform = 'translateY(100%)';
            });

            changingTexts[currentIndex].style.opacity = '1';
            changingTexts[currentIndex].style.transform = 'translateY(0)';
            currentIndex = (currentIndex + 1) % changingTexts.length;
        }

        updateText();
        setInterval(updateText, 3000);
    };

    // Parallax Effect
    const parallaxEffect = () => {
        const images = document.querySelectorAll('.image-box img');
        
        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.pageYOffset;
            images.forEach((img, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = -(scrolled * speed);
                img.style.transform = `translateY(${yPos}px) scale(1.01)`;
            });
        }, 10));
    };

    textAnimation();
    parallaxEffect();
}

// Services Section
function initServices() {
    const services = document.querySelectorAll('.service-card');

    services.forEach(service => {
        service.addEventListener('mouseenter', () => {
            service.classList.add('active');
        });

        service.addEventListener('mouseleave', () => {
            service.classList.remove('active');
        });
    });

    // Service Modal
    const serviceModals = document.querySelectorAll('.service-modal');
    const modalTriggers = document.querySelectorAll('.service-modal-trigger');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.querySelector(modalId);
            if (modal) openModal(modal);
        });
    });

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        modal.querySelector('.close-modal').addEventListener('click', () => {
            closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Testimonials Section
function initTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;

    let currentSlide = 0;
    const slides = testimonialSlider.querySelectorAll('.testimonial');
    const totalSlides = slides.length;
    const dots = document.querySelector('.slider-dots');

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dots.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        testimonialSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function updateDots() {
        dots.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Auto advance
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    
    // Form validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s+-]{10,15}$/,
        message: /^[\s\S]{10,500}$/
    };

    // Real-time validation
    inputs.forEach(input => {
        const field = input.getAttribute('name');
        if (!patterns[field]) return;

        input.addEventListener('input', () => {
            validateField(input, patterns[field]);
        });
    });

    function validateField(input, pattern) {
        const isValid = pattern.test(input.value.trim());
        input.classList.toggle('invalid', !isValid);
        return isValid;
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            const field = input.getAttribute('name');
            if (patterns[field] && !validateField(input, patterns[field])) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please correct the errors before submitting.', 'error');
            return;
        }

        try {
            const formData = new FormData(form);
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Submission failed');

            showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        }
    });
}

// Appointment Booking System
function initAppointmentBooking() {
    const bookingForm = document.querySelector('.booking-form');
    if (!bookingForm) return;

    const dateInput = bookingForm.querySelector('input[type="date"]');
    const timeSlots = bookingForm.querySelector('.time-slots');

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Update available time slots when date changes
    dateInput.addEventListener('change', async () => {
        try {
            const response = await fetch(`/api/available-slots?date=${dateInput.value}`);
            const slots = await response.json();
            updateTimeSlots(slots);
        } catch (error) {
            console.error('Failed to fetch time slots:', error);
        }
    });

    function updateTimeSlots(slots) {
        timeSlots.innerHTML = slots.map(slot => `
            <button class="time-slot" data-time="${slot}">
                ${formatTime(slot)}
            </button>
        `).join('');
    }

    function formatTime(timeString) {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    // Handle booking submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Add your booking submission logic here
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => fadeObserver.observe(element));

    // Parallax scrolling for backgrounds
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', utils.throttle(() => {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10));
}

// Accessibility
function initAccessibility() {
    // Skip to main content
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('main').focus();
        });
    }

    // ARIA attributes for interactive elements
    document.querySelectorAll('button, [role="button"]').forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals, dropdowns, etc.
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Show animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto close
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            resourcesLoadTime: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            domInteractive: 0,
            domComplete: 0
        };
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.measurePaintTiming();
        this.measureResourceTiming();
        this.setupPerformanceObserver();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const timing = performance.timing;
            this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domInteractive = timing.domInteractive - timing.navigationStart;
            this.metrics.domComplete = timing.domComplete - timing.navigationStart;
            this.logMetrics('Page Load Metrics');
        });
    }

    measurePaintTiming() {
        if (window.PerformanceObserver) {
            const paintObserver = new PerformanceObserver((entries) => {
                entries.getEntries().forEach((entry) => {
                    this.metrics[entry.name] = entry.startTime;
                });
            });
            paintObserver.observe({ entryTypes: ['paint'] });
        }
    }

    measureResourceTiming() {
        if (window.PerformanceObserver) {
            const resourceObserver = new PerformanceObserver((entries) => {
                entries.getEntries().forEach((entry) => {
                    if (entry.initiatorType === 'img' || entry.initiatorType === 'script') {
                        this.metrics.resourcesLoadTime += entry.duration;
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    setupPerformanceObserver() {
        if (window.PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log(`Performance Entry: ${entry.name}`, entry);
                });
            });
            observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
        }
    }

    logMetrics(title = 'Performance Metrics') {
        console.group(title);
        Object.entries(this.metrics).forEach(([key, value]) => {
            console.log(`${key}: ${value}ms`);
        });
        console.groupEnd();
    }
}

// Scroll Animation Manager
class ScrollAnimationManager {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.animatedElements.forEach(el => el.classList.add('animated'));
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(el => observer.observe(el));
    }
}

// Form Validation Manager
class FormManager {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
            this.setupFieldValidation(form);
        });
    }

    setupFieldValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.validateField(input));
        });
    }

    validateField(field) {
        const validityState = field.validity;
        const errorElement = field.nextElementSibling;

        if (!validityState.valid) {
            field.classList.add('invalid');
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.textContent = this.getErrorMessage(field, validityState);
            }
        } else {
            field.classList.remove('invalid');
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.textContent = '';
            }
        }
    }

    getErrorMessage(field, validity) {
        if (validity.valueMissing) return `${field.name} is required`;
        if (validity.typeMismatch) return `Please enter a valid ${field.type}`;
        if (validity.tooShort) return `Minimum ${field.minLength} characters required`;
        if (validity.tooLong) return `Maximum ${field.maxLength} characters allowed`;
        return 'Invalid input';
    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        try {
            const formData = new FormData(form);
            const response = await this.submitForm(formData);
            this.handleResponse(response, form);
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError(form);
        }
    }

    async submitForm(formData) {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData
        });
        return response.json();
    }

    handleResponse(response, form) {
        if (response.success) {
            this.showSuccess(form);
            form.reset();
        } else {
            this.showError(form, response.message);
        }
    }

    showSuccess(form) {
        const alert = this.createAlert('success', 'Form submitted successfully!');
        form.parentElement.insertBefore(alert, form);
        setTimeout(() => alert.remove(), 5000);
    }

    showError(form, message = 'An error occurred. Please try again.') {
        const alert = this.createAlert('error', message);
        form.parentElement.insertBefore(alert, form);
        setTimeout(() => alert.remove(), 5000);
    }

    createAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        return alert;
    }
}

// Modal Manager
class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('[data-modal]');
        this.init();
    }

    init() {
        this.modals.forEach(modal => {
            const trigger = document.querySelector(`[data-modal-trigger="${modal.id}"]`);
            const closeBtn = modal.querySelector('.modal-close');
            
            if (trigger) {
                trigger.addEventListener('click', () => this.openModal(modal));
            }
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal));
            }
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(modal) {
        modal.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    closeAllModals() {
        this.modals.forEach(modal => this.closeModal(modal));
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Performance Monitoring
    const performanceMonitor = new PerformanceMonitor();
    
    // Initialize Scroll Animations
    const scrollAnimationManager = new ScrollAnimationManager();
    
    // Initialize Form Management
    const formManager = new FormManager();
    
    // Initialize Modal Management
    const modalManager = new ModalManager();
    
    // Initialize Hero Section (from previous code)
    initHeroSection();
});

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // You could send this to your error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send this to your error tracking service
});
