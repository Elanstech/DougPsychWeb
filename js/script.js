// Main Website Controller
class WebsiteController {
    constructor() {
        this.carouselInterval = null;
        this.currentSlide = 0;

        // Initialize all components
        this.initLoader();
        this.initNavigation();
        this.initHeroCarousel();
        this.initHeroAnimations();
        this.initBubbleEffect();
        this.initSmoothScroll();
        this.initParallaxEffects();
        this.initTeamCards();
        this.initBookAnimation();
        this.initContactForm();
        this.initScrollAnimations();
    }

    // Enhanced Hero Carousel
    initHeroCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (!slides.length) return;

        // Set up carousel functionality
        this.carouselInterval = setInterval(() => {
            this.nextSlide(slides);
        }, 5000);

        // Add swipe functionality for mobile
        let touchStartX = 0;
        const heroSection = document.querySelector('.hero');
        
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        heroSection.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    this.nextSlide(slides);
                } else {
                    this.previousSlide(slides);
                }
            }
        });
    }

    nextSlide(slides) {
        slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        slides[this.currentSlide].classList.add('active');
        this.updateSlideContent();
    }

    previousSlide(slides) {
        slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
        slides[this.currentSlide].classList.add('active');
        this.updateSlideContent();
    }

    updateSlideContent() {
        const contents = [
            {
                title: "Welcome to Doug Uhlig Psych Services",
                description: "Begin your journey to emotional wellness and personal growth",
                buttonText: "Start Your Journey"
            },
            {
                title: "Professional Psychological Care",
                description: "Expert guidance for your mental health and well-being",
                buttonText: "Learn More"
            },
            {
                title: "Personalized Approach",
                description: "Tailored therapeutic solutions for your unique needs",
                buttonText: "Book Consultation"
            }
        ];

        const currentContent = contents[this.currentSlide];
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.innerHTML = `
                <h1 class="hero-title fade-up">${currentContent.title}</h1>
                <p class="hero-description fade-up">${currentContent.description}</p>
                <div class="hero-buttons fade-up">
                    <button class="btn-primary">${currentContent.buttonText}</button>
                    <button class="btn-secondary">Contact Us</button>
                </div>
            `;
        }
    }

    // Bubble Animation Effect
    initBubbleEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            const size = Math.random() * 150 + 50;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 10 + 15}s`;
            bubble.style.opacity = Math.random() * 0.3;
            
            hero.appendChild(bubble);
            
            setTimeout(() => bubble.remove(), 20000);
        };

        // Create initial bubbles
        for (let i = 0; i < 15; i++) {
            createBubble();
        }

        // Continue creating bubbles
        setInterval(createBubble, 3000);
    }

    // Team Cards Interaction
    initTeamCards() {
        const cards = document.querySelectorAll('.team-card');
        
        cards.forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPos = ((x / card.clientWidth) - 0.5) * 20;
                const yPos = ((y / card.clientHeight) - 0.5) * 20;
                
                card.style.transform = `
                    rotateY(${xPos}deg)
                    rotateX(${-yPos}deg)
                    translateZ(20px)
                `;
            });

            // Reset transform on mouse leave
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
            });
        });
    }

    // 3D Book Animation
    initBookAnimation() {
        const book = document.querySelector('.book-3d');
        if (!book) return;

        book.addEventListener('mousemove', (e) => {
            const rect = book.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xRotation = ((y / book.clientHeight) - 0.5) * 40;
            const yRotation = ((x / book.clientWidth) - 0.5) * 40;
            
            book.style.transform = `
                perspective(1000px)
                rotateX(${-xRotation}deg)
                rotateY(${yRotation}deg)
                scale3d(1.1, 1.1, 1.1)
            `;
        });

        book.addEventListener('mouseleave', () => {
            book.style.transform = 'rotateY(30deg) scale3d(1, 1, 1)';
        });
    }

    // Contact Form Validation and Animation
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        // Floating label animation
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        // Form submission with validation
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.classList.add('loading');
                
                try {
                    // Simulate form submission
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    this.showNotification('Message sent successfully!', 'success');
                    form.reset();
                } catch (error) {
                    this.showNotification('Error sending message. Please try again.', 'error');
                } finally {
                    submitButton.classList.remove('loading');
                }
            }
        });
    }

    // Form Validation
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !this.validateEmail(input.value)) {
                this.showInputError(input, 'Please enter a valid email');
                isValid = false;
            } else {
                this.clearInputError(input);
            }
        });
        
        return isValid;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showInputError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    clearInputError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Notification System
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);
        requestAnimationFrame(() => notification.classList.add('show'));

        const close = () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        };

        notification.querySelector('.notification-close').addEventListener('click', close);
        setTimeout(close, 5000);
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-up, .fade-in, .slide-in').forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteController();
});
