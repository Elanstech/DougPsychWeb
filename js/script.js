// Utility Functions
const utils = {
    select: (selector) => document.querySelector(selector),
    selectAll: (selector) => document.querySelectorAll(selector),
    addClass: (element, className) => element.classList.add(className),
    removeClass: (element, className) => element.classList.remove(className),
    toggleClass: (element, className) => element.classList.toggle(className),
    
    // Animation checker
    supportsAnimation: () => {
        return typeof document.documentElement.animate === 'function';
    },
    
    // Smooth scroll
    scrollTo: (element, offset = 0) => {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Loading Screen Handler
class LoadingScreen {
    constructor() {
        this.loader = utils.select('.loading-screen');
        if (this.loader) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('load', () => this.hideLoader());
    }
    
    hideLoader() {
        this.loader.style.opacity = '0';
        setTimeout(() => {
            this.loader.style.display = 'none';
            document.body.classList.add('loaded');
        }, 500);
    }
}

// Navigation Handler
class Navigation {
    constructor() {
        this.nav = utils.select('.navbar');
        this.navToggle = utils.select('.nav-toggle');
        this.navMenu = utils.select('.nav-menu');
        this.navLinks = utils.selectAll('.nav-menu a');
        this.isMenuOpen = false;
        this.lastScroll = 0;
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Scroll handling
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-toggle') && !e.target.closest('.nav-menu')) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        utils.toggleClass(this.navToggle, 'active');
        utils.toggleClass(this.navMenu, 'active');
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        utils.removeClass(this.navToggle, 'active');
        utils.removeClass(this.navMenu, 'active');
        document.body.style.overflow = '';
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const target = document.querySelector(e.currentTarget.getAttribute('href'));
        if (target) {
            this.closeMenu();
            utils.scrollTo(target, 90);
        }
    }
    
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove background on scroll
        if (currentScroll > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > this.lastScroll && currentScroll > 500) {
            this.nav.style.transform = 'translateY(-100%)';
        } else {
            this.nav.style.transform = 'translateY(0)';
        }
        
        this.lastScroll = currentScroll;
    }
}

// Form Handler
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.setupFloatingLabels();
        this.setupValidation();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.value) {
                utils.addClass(input, 'has-value');
            }
            
            input.addEventListener('input', () => {
                utils.toggleClass(input, 'has-value', input.value !== '');
            });
        });
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.validateInput(input));
        });
    }
    
    validateInput(input) {
        const parent = input.closest('.form-group');
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error message
        const existingError = parent.querySelector('.validation-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validation rules
        switch(input.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
                errorMessage = 'Please enter a valid email address';
                break;
                
            case 'tel':
                isValid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(input.value);
                errorMessage = 'Please enter a valid phone number';
                break;
                
            default:
                isValid = input.value.trim() !== '';
                errorMessage = 'This field is required';
        }
        
        if (!isValid && input.value !== '') {
            const error = document.createElement('div');
            error.className = 'validation-message error';
            error.innerHTML = `<i class="fas fa-exclamation-circle"></i>${errorMessage}`;
            parent.appendChild(error);
            utils.addClass(parent, 'error');
            utils.removeClass(parent, 'success');
        } else if (input.value !== '') {
            utils.removeClass(parent, 'error');
            utils.addClass(parent, 'success');
        } else {
            utils.removeClass(parent, 'error');
            utils.removeClass(parent, 'success');
        }
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            NotificationSystem.show('Please check your inputs and try again.', 'error');
            return;
        }
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        utils.addClass(submitBtn, 'btn-loading');
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            NotificationSystem.show('Message sent successfully!', 'success');
            this.form.reset();
            
            this.form.querySelectorAll('.form-group').forEach(group => {
                utils.removeClass(group, 'success');
                utils.removeClass(group, 'error');
            });
        } catch (error) {
            NotificationSystem.show('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            utils.removeClass(submitBtn, 'btn-loading');
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
}

// Notification System
class NotificationSystem {
    static show(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        const container = utils.select('.notification-system') || (() => {
            const div = document.createElement('div');
            div.className = 'notification-system';
            document.body.appendChild(div);
            return div;
        })();
        
        container.appendChild(notification);
        
        setTimeout(() => {
            utils.addClass(notification, 'show');
            
            setTimeout(() => {
                utils.removeClass(notification, 'show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }
}

// Scroll Progress Indicator
class ScrollProgress {
    constructor() {
        this.progressBar = utils.select('.scroll-progress-bar');
        if (this.progressBar) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }
    
    updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        this.progressBar.style.width = `${scrolled}%`;
    }
}

// Animation Observer
class AnimationObserver {
    constructor() {
        if ('IntersectionObserver' in window) {
            this.init();
        }
    }
    
    init() {
        const options = {
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
        
        document.querySelectorAll('[data-animate]').forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
    new Navigation();
    new FormHandler('consultationForm');
    new FormHandler('contactForm');
    new ScrollProgress();
    new AnimationObserver();
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 50,
        once: true,
        easing: 'ease-out-cubic'
    });
});
