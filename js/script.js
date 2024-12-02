// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Mobile Menu Handler
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.nav-toggle');
        this.menu = document.querySelector('.mobile-menu');
        this.hamburger = document.querySelector('.hamburger');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking menu items
        const menuItems = this.menu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-toggle') && !e.target.closest('.mobile-menu')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }
}

// Hero Slider
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelector('.slider-dots');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }

    init() {
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dots.appendChild(dot);
        });

        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Start autoplay
        this.startAutoplay();

        // Pause on hover
        const slider = document.querySelector('.hero-slider');
        slider.addEventListener('mouseenter', () => this.pauseAutoplay());
        slider.addEventListener('mouseleave', () => this.startAutoplay());

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
    }

    goToSlide(index) {
        // Remove active classes
        this.slides[this.currentSlide].classList.remove('active');
        this.dots.children[this.currentSlide].classList.remove('active');

        // Set new slide
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.dots.children[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.slides.length);
    }

    prevSlide() {
        this.goToSlide((this.currentSlide - 1 + this.slides.length) % this.slides.length);
    }

    startAutoplay() {
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }

    pauseAutoplay() {
        clearInterval(this.slideInterval);
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
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check initial state
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            this.form.reset();
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

// Back to Top Button
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
    new HeroSlider();
    new FormHandler();
    new BackToTop();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
