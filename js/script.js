class HeroController {
    constructor() {
        // Core elements
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.nav-dot');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        
        // State management
        this.autoPlayInterval = null;
        this.isTransitioning = false;
        this.isMobile = window.innerWidth <= 768;

        // Initialize
        this.init();
    }

    init() {
        // Initialize all components
        this.setupEventListeners();
        this.setupMobileMenu();
        this.initParallax();
        this.initBubbles();
        this.initScrollEffects();
        this.startAutoPlay();
    }

    setupEventListeners() {
        // Navigation dots click events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch swipe events
        let touchStartX = 0;
        const hero = document.querySelector('.hero');

        hero.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        hero.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        }, { passive: true });

        // Mouse hover events for autoplay
        hero.addEventListener('mouseenter', () => this.stopAutoPlay());
        hero.addEventListener('mouseleave', () => this.startAutoPlay());

        // Window resize event
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.handleResize();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    setupMobileMenu() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    initParallax() {
        if (this.isMobile) return;

        const handleParallax = (e) => {
            requestAnimationFrame(() => {
                const slides = document.querySelectorAll('.slide-image');
                slides.forEach(slide => {
                    const speed = 0.05;
                    const x = (window.innerWidth - e.clientX) * speed;
                    const y = (window.innerHeight - e.clientY) * speed;
                    slide.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
                });
            });
        };

        document.querySelector('.hero').addEventListener('mousemove', handleParallax);
    }

    initBubbles() {
        const bubbleContainer = document.querySelector('.bubble-container');
        if (!bubbleContainer) return;

        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            // Random size between 50px and 200px
            const size = Math.random() * 150 + 50;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // Random position and animation duration
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 10 + 15}s`;
            bubble.style.opacity = Math.random() * 0.3;
            
            bubbleContainer.appendChild(bubble);
            
            // Remove bubble after animation
            bubble.addEventListener('animationend', () => {
                bubble.remove();
            });
        };

        // Create initial bubbles
        for (let i = 0; i < 15; i++) {
            createBubble();
        }

        // Continue creating bubbles
        setInterval(createBubble, 3000);
    }

    initScrollEffects() {
        const header = document.querySelector('.glass-header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                // Header transparency
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Header hide/show on scroll
                if (currentScroll > lastScroll && currentScroll > 500) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }

                lastScroll = currentScroll;
            });
        });
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;

        this.isTransitioning = true;
        
        // Update slides
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');

        // Update current slide index
        this.currentSlide = index;

        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }

    previousSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }

    startAutoPlay() {
        if (!this.autoPlayInterval) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    handleResize() {
        // Reset transformations on mobile
        if (this.isMobile) {
            document.querySelectorAll('.slide-image').forEach(slide => {
                slide.style.transform = 'none';
            });
        }

        // Adjust header menu
        if (!this.isMobile && this.navMenu.classList.contains('active')) {
            this.hamburger.classList.remove('active');
            this.navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
}

// Initialize the hero section
document.addEventListener('DOMContentLoaded', () => {
    const hero = new HeroController();
});

// Smooth scroll implementation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Back to top button functionality
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Handle loading state
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});
