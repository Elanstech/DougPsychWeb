// Main Website Management Class
class WebsiteManager {
    constructor() {
        this.heroSlideshow = null;
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeComponents() {
        // Initialize all components
        this.initLoader();
        this.initCursor();
        this.initNavigation();
        this.heroSlideshow = new HeroSlideshow(); // Initialize hero slideshow
        this.initAnimations();
        this.initCarousels();
        this.initBook3D();
        this.initContactForm();
        this.initCounters();
        this.initParticles();
    }

    setupEventListeners() {
        // Global event listeners
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('load', () => this.handleLoad());
    }

    // Loader Animation
    initLoader() {
        window.addEventListener('load', () => {
            const loader = document.querySelector('.loader-wrapper');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 1000);
            }
        });
    }

    // Navigation
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    if (navMenu?.classList.contains('active')) {
                        menuToggle.click();
                    }
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Hero Slideshow Class
    initAnimations() {
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Reveal text animation
        const revealText = (element) => {
            const text = element.textContent;
            element.textContent = '';
            
            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.animationDelay = `${index * 0.1}s`;
                element.appendChild(span);
            });
        };

        document.querySelectorAll('.reveal-text').forEach(revealText);

        // Split lines animation
        document.querySelectorAll('.split-lines').forEach(element => {
            const lines = element.innerHTML.split('<br>');
            element.innerHTML = lines
                .map(line => `<span class="line"><span class="line-inner">${line}</span></span>`)
                .join('');
        });
    }

    // Team Carousel
    initCarousels() {
        class TeamCarousel {
            constructor() {
                this.carousel = document.querySelector('.team-carousel');
                this.slides = document.querySelectorAll('.team-slide');
                this.prevBtn = document.querySelector('.prev-btn');
                this.nextBtn = document.querySelector('.next-btn');
                this.dotsContainer = document.querySelector('.carousel-dots');
                
                this.currentSlide = 0;
                this.slidesPerView = this.getSlidesPerView();
                this.maxSlide = Math.max(0, this.slides.length - this.slidesPerView);
                
                this.init();
            }
            
            init() {
                if (!this.carousel) return;
                
                this.createDots();
                this.goToSlide(0);
                this.activateDot(0);
                this.bindEvents();
                this.startAutoPlay();
            }
            
            getSlidesPerView() {
                if (window.innerWidth <= 768) return 1;
                if (window.innerWidth <= 1024) return 2;
                return 3;
            }
            
            createDots() {
                if (!this.dotsContainer) return;
                
                const numberOfDots = Math.ceil(this.slides.length / this.slidesPerView);
                this.dotsContainer.innerHTML = Array.from(
                    { length: numberOfDots },
                    (_, i) => `<button class="dot" data-slide="${i}"></button>`
                ).join('');
            }
            
            activateDot(slide) {
                if (!this.dotsContainer) return;
                
                document.querySelectorAll('.dot')
                    .forEach(dot => dot.classList.remove('active'));
                document.querySelector(
                    `.dot[data-slide="${Math.floor(slide / this.slidesPerView)}"]`
                )?.classList.add('active');
            }
            
            goToSlide(slide) {
                if (!this.carousel) return;
                
                this.currentSlide = Math.min(Math.max(0, slide), this.maxSlide);
                const offset = -this.currentSlide * (100 / this.slidesPerView);
                this.carousel.style.transform = `translateX(${offset}%)`;
                
                // Update active states
                this.slides.forEach((s, i) => {
                    s.classList.toggle('active',
                        i >= this.currentSlide && i < this.currentSlide + this.slidesPerView
                    );
                });
                
                this.activateDot(this.currentSlide);
                this.updateButtons();
            }
            
            nextSlide() {
                this.goToSlide(this.currentSlide + 1);
            }
            
            prevSlide() {
                this.goToSlide(this.currentSlide - 1);
            }
            
            updateButtons() {
                if (this.prevBtn) {
                    this.prevBtn.disabled = this.currentSlide === 0;
                }
                if (this.nextBtn) {
                    this.nextBtn.disabled = this.currentSlide >= this.maxSlide;
                }
            }
            
            bindEvents() {
                this.prevBtn?.addEventListener('click', () => this.prevSlide());
                this.nextBtn?.addEventListener('click', () => this.nextSlide());
                
                this.dotsContainer?.addEventListener('click', e => {
                    if (e.target.classList.contains('dot')) {
                        const slide = parseInt(e.target.dataset.slide) * this.slidesPerView;
                        this.goToSlide(slide);
                    }
                });
                
                // Touch events
                let touchStartX = 0;
                let touchEndX = 0;
                
                this.carousel?.addEventListener('touchstart', e => {
                    touchStartX = e.touches[0].clientX;
                    this.stopAutoPlay();
                });
                
                this.carousel?.addEventListener('touchend', e => {
                    touchEndX = e.changedTouches[0].clientX;
                    const diff = touchStartX - touchEndX;
                    
                    if (Math.abs(diff) > 50) {
                        if (diff > 0) this.nextSlide();
                        else this.prevSlide();
                    }
                    
                    this.startAutoPlay();
                });
                
                // Resize handling
                window.addEventListener('resize', () => {
                    const newSlidesPerView = this.getSlidesPerView();
                    if (newSlidesPerView !== this.slidesPerView) {
                        this.slidesPerView = newSlidesPerView;
                        this.maxSlide = Math.max(0, this.slides.length - this.slidesPerView);
                        this.createDots();
                        this.goToSlide(0);
                    }
                });
            }
            
            startAutoPlay() {
                this.stopAutoPlay();
                this.autoPlayInterval = setInterval(() => {
                    if (this.currentSlide >= this.maxSlide) {
                        this.goToSlide(0);
                    } else {
                        this.nextSlide();
                    }
                }, 5000);
            }
            
            stopAutoPlay() {
                if (this.autoPlayInterval) {
                    clearInterval(this.autoPlayInterval);
                    this.autoPlayInterval = null;
                }
            }
        }

        // Initialize carousel
        new TeamCarousel();
    }

    // 3D Book Effect
    initBook3D() {
        const book = document.querySelector('.book-3d');
        if (!book) return;

        book.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = book.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            book.style.transform = `
                rotateY(${30 + x * 20}deg)
                rotateX(${-y * 20}deg)
                translateZ(50px)
            `;
        });

        book.addEventListener('mouseleave', () => {
            book.style.transform = 'rotateY(30deg) rotateX(0) translateZ(0)';
        });

        // Floating elements animation
        document.querySelectorAll('.float-element').forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Floating labels
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });

            field.addEventListener('blur', () => {
                if (!field.value) {
                    field.parentElement.classList.remove('focused');
                }
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            try {
                // Form validation
                const isValid = this.validateForm(form);
                if (!isValid) {
                    throw new Error('Please fill in all required fields correctly.');
                }

                // Construct mailto URL
                const formData = new FormData(form);
                const subject = formData.get('subject');
                const body = `
                    Name: ${formData.get('name')}
                    Email: ${formData.get('email')}
                    Message: ${formData.get('message')}
                `;

                window.location.href = `mailto:contact@douguhlig.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                // Show success message
                this.showNotification('Thank you for your message! Opening your email client...', 'success');
                form.reset();

            } catch (error) {
                this.showNotification(error.message, 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        });
    }

    validateForm(form) {
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        let isValid = true;

        // Name validation
        if (!name.value.trim()) {
            this.showFieldError(name, 'Please enter your name');
            isValid = false;
        } else {
            this.clearFieldError(name);
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError(email);
        }

        // Message validation
        if (!message.value.trim()) {
            this.showFieldError(message, 'Please enter your message');
            isValid = false;
        } else {
            this.clearFieldError(message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
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

    // Counter Animation
    initCounters() {
        const startCounters = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        counter.textContent = Math.round(current);

                        if (current < target) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        };

        const observer = new IntersectionObserver(startCounters, {
            threshold: 0.5
        });

        document.querySelectorAll('.counter').forEach(counter => {
            observer.observe(counter);
        });
    }

    // Particle Effects
    initParticles() {
        const createParticles = (container) => {
            const particleCount = 50;
            const colors = ['#ffb88c', '#de6262'];

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.width = `${Math.random() * 3 + 1}px`;
                particle.style.height = particle.style.width;
                particle.style.animationDuration = `${Math.random() * 2 + 2}s`;
                particle.style.animationDelay = `${Math.random() * 2}s`;
                container.appendChild(particle);
            }
        };

        document.querySelectorAll('.particle-container').forEach(createParticles);

        // Neural network effect
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    animation: {
                        enable: true,
                        speed: 1,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                lineLinked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    outMode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detectOn: 'canvas',
                events: {
                    onHover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onClick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        lineLinked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }

    // Scroll Handling
    handleScroll() {
        // Back to top button visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Parallax effects for various elements
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Resize Handling
    handleResize() {
        // Update any size-dependent calculations
        this.updateLayout();
    }

    // Load Handling
    handleLoad() {
        // Initialize any elements that need the page to be fully loaded
        this.initializeLoadDependentElements();
    }

    // Layout Updates
    updateLayout() {
        // Recalculate any dynamic layout elements
        this.updateDynamicElements();
    }

    // Load Dependent Elements
    initializeLoadDependentElements() {
        // Initialize elements that require the page to be fully loaded
        this.initializeAfterLoad();
    }

    // Dynamic Elements Update
    updateDynamicElements() {
        // Update any elements that need recalculation on resize
        // This could include carousel slides per view, grid layouts, etc.
    }

    // After Load Initialization
    initializeAfterLoad() {
        // Initialize any elements that need the page to be fully loaded
        document.body.classList.add('page-loaded');
    }
}

// Initialize the website manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteManager();
});
