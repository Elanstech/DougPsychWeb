// Initialize AOS animations
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// GSAP ScrollTrigger Setup
gsap.registerPlugin(ScrollTrigger);

// Global Variables
const state = {
    currentSlide: 0,
    totalSlides: document.querySelectorAll('.slide').length,
    isAnimating: false,
    lastScroll: 0
};

// Helper Functions
const select = selector => document.querySelector(selector);
const selectAll = selector => document.querySelectorAll(selector);

// Loading Screen
class LoadingScreen {
    constructor() {
        this.loader = select('.loading-overlay');
    }

    hide() {
        gsap.to(this.loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.loader.style.display = 'none';
                this.initializeAnimations();
            }
        });
    }

    initializeAnimations() {
        // Hero section animations
        gsap.from('.hero-content', {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    }
}

// Navigation Handler
class Navigation {
    constructor() {
        this.nav = select('.main-nav');
        this.toggle = select('.nav-toggle');
        this.links = selectAll('.nav-links a');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        // Mobile menu toggle
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Scroll handling
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll for nav links
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
    }

    toggleMenu() {
        const links = select('.nav-links');
        links.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            this.nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > this.lastScroll && !this.nav.classList.contains('scroll-down')) {
            this.nav.classList.remove('scroll-up');
            this.nav.classList.add('scroll-down');
        } else if (currentScroll < this.lastScroll && this.nav.classList.contains('scroll-down')) {
            this.nav.classList.remove('scroll-down');
            this.nav.classList.add('scroll-up');
        }
        
        this.lastScroll = currentScroll;
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetPosition = select(targetId).offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        window.requestAnimationFrame(step);
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
            if (progress < duration) window.requestAnimationFrame(step);
        }
    }
}

// Hero Slider
class HeroSlider {
    constructor() {
        this.slides = selectAll('.slide');
        this.dots = select('.slider-dots');
        this.prevBtn = select('.prev');
        this.nextBtn = select('.next');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    init() {
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dots.appendChild(dot);
        });

        // Set up controls
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Start autoplay
        this.startAutoplay();
        
        // Pause on hover
        select('.hero-slider').addEventListener('mouseenter', () => this.stopAutoplay());
        select('.hero-slider').addEventListener('mouseleave', () => this.startAutoplay());

        // Update initial state
        this.updateSlides();
    }

    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update dots
        selectAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlides();
    }

    startAutoplay() {
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        clearInterval(this.slideInterval);
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = select('#contactForm');
        this.inputs = this.form.querySelectorAll('input, textarea');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.init();
    }

    init() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input animations
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => this.handleFocus(input));
            input.addEventListener('blur', () => this.handleBlur(input));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;

        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError();
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = 'Send Message';
        }
    }

    validateForm() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !this.validateEmail(input.value)) {
                this.showInputError(input, 'Please enter a valid email');
                isValid = false;
            }
        });

        return isValid;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showInputError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorDiv = formGroup.querySelector('.error-message');
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
    }

    handleFocus(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('focused');
    }

    handleBlur(input) {
        const formGroup = input.closest('.form-group');
        if (!input.value) {
            formGroup.classList.remove('focused');
        }
    }

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Message sent successfully!';
        this.form.appendChild(message);

        gsap.from(message, {
            y: -20,
            opacity: 0,
            duration: 0.5
        });

        setTimeout(() => {
            gsap.to(message, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => message.remove()
            });
        }, 3000);
    }

    showError() {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.textContent = 'There was an error sending your message. Please try again.';
        this.form.appendChild(message);

        gsap.from(message, {
            y: -20,
            opacity: 0,
            duration: 0.5
        });

        setTimeout(() => {
            gsap.to(message, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => message.remove()
            });
        }, 3000);
    }
}

// Books Section Handler
class BooksHandler {
    constructor() {
        this.booksGrid = select('.books-grid');
        this.modal = select('.book-modal');
        this.modalContent = select('.book-details');
        this.closeBtn = select('.close-modal');
        this.init();
    }

    init() {
        this.loadBooks();
        this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    async loadBooks() {
        // Sample books data - replace with actual API call
        const books = [
            {
                title: "Understanding CBT",
                description: "A comprehensive guide to Cognitive Behavioral Therapy",
                price: 29.99,
                image: "assets/images/book1.jpg"
            },
            // Add more books here
        ];

        books.forEach(book => {
            const bookElement = this.createBookElement(book);
            this.booksGrid.appendChild(bookElement);
        });
    }

    createBookElement(book) {
        const div = document.createElement('div');
        div.className = 'book-card';
        div.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.description}</p>
                <span class="price">$${book.price}</span>
                <button class="buy-button">Purchase</button>
            </div>
        `;

        div.addEventListener('click', () => this.openBookDetails(book));
        return div;
    }

    openBookDetails(book) {
        this.modalContent.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.image}" alt="${book.title}">
            <p>${book.description}</p>
            <div class="price-section">
                <span class="price">$${book.price}</span>
                <button class="purchase-btn">Purchase Now</button>
            </div>
        `;

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loading = new LoadingScreen();
    const nav = new Navigation();
    const slider = new HeroSlider();
    const form = new FormHandler();
    const books = new BooksHandler();

    // Hide loading screen
    window.addEventListener('load', () => {
        loading.hide();
    });

    // GSAP Animations
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    });

    // Parallax effect on hero section
    gsap.to('.hero-section', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        backgroundPosition: '50% 100%',
        ease: 'none'
    });
});

// Utility function for smooth scrolling
function easeInOutCubic(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t + 2) + b;
}
