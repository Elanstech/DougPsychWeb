// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Mobile Menu Handler
class MobileMenu {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        // Toggle menu on button click
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-toggle') && !e.target.closest('.nav-menu')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.isOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Navbar Scroll Handler
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove background on scroll
        if (currentScroll > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll up/down
        if (currentScroll > this.lastScroll && currentScroll > 500) {
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            this.navbar.style.transform = 'translateY(0)';
        }

        this.lastScroll = currentScroll;
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupFloatingLabels();
        }
    }

    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Initial state check
            if (input.value) {
                input.classList.add('has-value');
            }

            // Input events
            input.addEventListener('input', () => {
                input.classList.toggle('has-value', input.value !== '');
            });
        });
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        switch(input.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                break;
            case 'tel':
                isValid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
                break;
            default:
                isValid = value.length >= 3;
        }

        input.classList.toggle('error', !isValid);
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showNotification('Please check your inputs and try again.', 'error');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Message sent successfully!', 'success');
            this.form.reset();
            
            // Reset floating labels
            this.form.querySelectorAll('input, textarea').forEach(input => {
                input.classList.remove('has-value');
            });
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }
}

// Back to Top Button Handler
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.toggleButton());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    toggleButton() {
        if (window.pageYOffset > 300) {
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

// Smooth Scroll Handler
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        e.preventDefault();
        const target = document.querySelector(e.currentTarget.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Loading Animation Handler
class LoadingScreen {
    constructor() {
        this.loader = document.querySelector('.loading-screen');
        if (this.loader) {
            this.init();
        }
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoader();
            }, 1000);
        });
    }

    hideLoader() {
        this.loader.style.opacity = '0';
        setTimeout(() => {
            this.loader.style.display = 'none';
        }, 500);
    }
}

// Animation Handler for Counters
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        if (this.counters.length) {
            this.init();
        }
    }

    init() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
    new NavbarScroll();
    new FormHandler();
    new BackToTop();
    new SmoothScroll();
    new LoadingScreen();
    new CounterAnimation();
});

// Handle page transitions
window.addEventListener('beforeunload', () => {
    document.body.classList.add('page-transition');
});

// Handle service worker if needed
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed:', err);
        });
    });
}
