// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = {
            dot: document.querySelector('.cursor-dot'),
            outline: document.querySelector('.cursor-outline')
        };
        this.bounds = {
            dot: { x: 0, y: 0 },
            outline: { x: 0, y: 0 }
        };
        this.cursorVisible = true;
        this.cursorEnlarged = false;
        
        this.init();
    }

    init() {
        // Hide cursor initially
        document.documentElement.style.cursor = 'none';
        
        // Set up event listeners
        document.addEventListener('mousedown', () => this.cursorEnlarged = true);
        document.addEventListener('mouseup', () => this.cursorEnlarged = false);
        document.addEventListener('mousemove', e => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.cursorVisible = true);
        document.addEventListener('mouseleave', () => this.cursorVisible = false);

        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll(
            'a, button, input[type="submit"], .service-card, .book-card'
        );
        
        clickables.forEach(el => {
            el.addEventListener('mouseover', () => this.cursorEnlarged = true);
            el.addEventListener('mouseout', () => this.cursorEnlarged = false);
        });

        // Start animation loop
        requestAnimationFrame(() => this.render());
    }

    onMouseMove(e) {
        this.bounds.dot.x = e.clientX;
        this.bounds.dot.y = e.clientY;
        this.bounds.outline.x = e.clientX;
        this.bounds.outline.y = e.clientY;
    }

    render() {
        if (this.cursorVisible) {
            this.cursor.dot.style.opacity = 1;
            this.cursor.outline.style.opacity = 1;

            this.cursor.dot.style.transform = `translate(${this.bounds.dot.x}px, ${this.bounds.dot.y}px)`;
            this.cursor.outline.style.transform = `translate(${this.bounds.outline.x}px, ${this.bounds.outline.y}px) scale(${this.cursorEnlarged ? 1.5 : 1})`;
        } else {
            this.cursor.dot.style.opacity = 0;
            this.cursor.outline.style.opacity = 0;
        }

        requestAnimationFrame(() => this.render());
    }
}

// Enhanced Hero Slider
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.isAnimating = false;
        this.init();
    }

    init() {
        // Create dots
        this.createDots();
        
        // Set up controls
        document.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.next').addEventListener('click', () => this.nextSlide());
        
        // Start autoplay
        this.startAutoplay();
        
        // Handle hover pause
        const slider = document.querySelector('.hero-slider');
        slider.addEventListener('mouseenter', () => this.pauseAutoplay());
        slider.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Set initial active slide
        this.activateSlide(0);
    }

    createDots() {
        const dotsContainer = document.querySelector('.slider-dots');
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    activateSlide(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.zIndex = 0;
        });

        // Add active class to current slide
        const currentSlide = this.slides[index];
        currentSlide.style.zIndex = 1;
        currentSlide.classList.add('active');

        // Update dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.activateSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.activateSlide(this.currentSlide);
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.activateSlide(this.currentSlide);
    }

    startAutoplay() {
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }

    pauseAutoplay() {
        clearInterval(this.slideInterval);
    }
}

// Form Handler with Advanced Validation
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.inputs = this.form.querySelectorAll('input, textarea');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        
        this.init();
    }

    init() {
        // Form submission
        this.form.addEventListener('submit', e => this.handleSubmit(e));
        
        // Real-time validation
        this.inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch(field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                message = 'Please enter a valid email address';
                break;
            case 'tel':
                isValid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
                message = 'Please enter a valid phone number';
                break;
            default:
                isValid = value.length >= 3;
                message = 'This field is required (minimum 3 characters)';
        }

        this.updateFieldStatus(field, isValid, message);
        return isValid;
    }

    updateFieldStatus(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.toggle('error', !isValid);
        
        let errorDiv = formGroup.querySelector('.error-message');
        if (!isValid) {
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                formGroup.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
            gsap.from(errorDiv, {
                y: -10,
                opacity: 0,
                duration: 0.3
            });
        } else if (errorDiv) {
            errorDiv.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;

        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<span class="spinner"></span> Sending...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showNotification('Message sent successfully!', 'success');
            this.form.reset();
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Send Message';
        }
    }

    validateForm() {
        let isValid = true;
        this.inputs.forEach(input => {
            if (!this.validateField(input)) isValid = false;
        });
        return isValid;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        gsap.fromTo(notification, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 }
        );

        setTimeout(() => {
            gsap.to(notification, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                onComplete: () => notification.remove()
            });
        }, 3000);
    }
}

// Loading Screen
class LoadingScreen {
    constructor() {
        this.loader = document.querySelector('.loading-screen');
        this.progress = 0;
        this.init();
    }

    init() {
        gsap.to(this, {
            progress: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => this.updateProgress()
        });
    }

    updateProgress() {
        if (this.progress >= 100) {
            this.hide();
        }
    }

    hide() {
        gsap.to(this.loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.loader.style.display = 'none';
                this.initPageAnimations();
            }
        });
    }

    initPageAnimations() {
        // Initialize hero section animations
        gsap.from('.hero-content', {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cursor = new CustomCursor();
    const slider = new HeroSlider();
    const form = new FormHandler();
    const loading = new LoadingScreen();

    // Initialize GSAP ScrollTrigger animations
    gsap.registerPlugin(ScrollTrigger);

    // Animate service cards on scroll
    gsap.utils.toArray('.service-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Parallax effect on hero section
    gsap.to('.hero-section', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        backgroundPosition: "50% 100%",
        ease: "none"
    });
});
