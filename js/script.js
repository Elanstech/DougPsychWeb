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
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.moveCursor(e));
        document.addEventListener('mouseenter', () => this.showCursor());
        document.addEventListener('mouseleave', () => this.hideCursor());
        
        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, input[type="submit"]');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => this.enlargeCursor());
            el.addEventListener('mouseleave', () => this.resetCursor());
        });
    }

    moveCursor(e) {
        const { dot, outline } = this.cursor;
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        outline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    showCursor() {
        const { dot, outline } = this.cursor;
        dot.style.opacity = '1';
        outline.style.opacity = '1';
    }

    hideCursor() {
        const { dot, outline } = this.cursor;
        dot.style.opacity = '0';
        outline.style.opacity = '0';
    }

    enlargeCursor() {
        this.cursor.outline.style.transform += ' scale(1.5)';
    }

    resetCursor() {
        this.cursor.outline.style.transform = this.cursor.outline.style.transform.replace(' scale(1.5)', '');
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
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

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
            submitBtn.textContent = 'Send Message';
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Loading Screen
class LoadingScreen {
    constructor() {
        this.loader = document.querySelector('.loading-screen');
        setTimeout(() => this.hide(), 2000);
    }

    hide() {
        this.loader.style.opacity = '0';
        setTimeout(() => {
            this.loader.style.display = 'none';
        }, 500);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
    new HeroSlider();
    new FormHandler();
    new LoadingScreen();
});
