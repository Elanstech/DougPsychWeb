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

    // Loader Animation
    initLoader() {
        window.addEventListener('load', () => {
            const loader = document.querySelector('.loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 600);
            }
        });
    }

    // Modern Navigation
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Smooth navbar background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
                } else {
                    document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
                }
            });
        });
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
        
        if (heroSection) {
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
    }

    // Hero Animations
    initHeroAnimations() {
        const heroVisual = document.querySelector('.hero-visual');
        if (!heroVisual) return;

        // Parallax effect on hero images
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 20;
            const yPos = (clientY / window.innerHeight - 0.5) * 20;

            heroVisual.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });

        // Floating elements animation
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            element.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
            element.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Parallax Effects
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const rect = element.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
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

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.classList.add('loading');
                
                try {
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
        requestAnimationFrame(() => notification.classList
