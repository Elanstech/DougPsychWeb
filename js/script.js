// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: 'ease-out-cubic'
});

// Mobile Menu Handler
class MobileMenu {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
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
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    closeMenu() {
        this.isOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
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
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupFloatingLabels();
    }

    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.value) {
                input.classList.add('has-value');
            }

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

// Stats Counter
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.init();
    }

    init() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            counter.innerText = '0';

            const updateCounter = () => {
                const count = +counter.innerText;
                const increment = target / 200;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCounter, 10);
                } else {
                    counter.innerText = target;
                }
            };

            // Use Intersection Observer to trigger counter
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }
}

// Review Slider
class ReviewSlider {
    constructor() {
        this.slider = document.querySelector('.reviews-slider');
        this.slides = document.querySelectorAll('.review-card');
        this.currentSlide = 0;
        
        if (this.slider && this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupControls();
        this.setupAutoPlay();
        this.setupTouchEvents();
    }

    setupControls() {
        const prevBtn = document.querySelector('.review-prev');
        const nextBtn = document.querySelector('.review-next');

        prevBtn.addEventListener('click', () => this.prevSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
    }

    setupAutoPlay() {
        setInterval(() => this.nextSlide(), 5000);
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            
            if (touchStartX - touchEndX > 50) {
                this.nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                this.prevSlide();
            }
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }

    updateSlider() {
        const offset = -this.currentSlide * 100;
        this.slider.style.transform = `translateX(${offset}%)`;
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        if (this.button) {
            this.init();
        }
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

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
    new NavbarScroll();
    new FormHandler();
    new StatsCounter();
    new ReviewSlider();
    new BackToTop();
});

// Remove loading screen
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});
