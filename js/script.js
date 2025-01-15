// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Core Variables
    const heroSlider = {
        slides: document.querySelectorAll('.hero-slide'),
        dots: document.querySelectorAll('.nav-dot'),
        progressBar: document.querySelector('.progress-bar'),
        currentSlide: 0,
        slideInterval: null,
        intervalDuration: 5000, // 5 seconds per slide
    };

    // Initialize Hero Slider
    const initHeroSlider = () => {
        // Set up initial state
        updateSlide(0);
        startSlideTimer();

        // Add event listeners for navigation dots
        heroSlider.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlide(index);
                resetSlideTimer();
            });
        });

        // Add touch support for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;

        document.querySelector('.hero-slider').addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        document.querySelector('.hero-slider').addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        // Handle touch swipe
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    updateSlide((heroSlider.currentSlide + 1) % heroSlider.slides.length);
                } else {
                    // Swipe right - previous slide
                    updateSlide(heroSlider.currentSlide === 0 ? heroSlider.slides.length - 1 : heroSlider.currentSlide - 1);
                }
                resetSlideTimer();
            }
        };
    };

    // Update Slide Function
    const updateSlide = (index) => {
        // Remove active class from current slide and dot
        heroSlider.slides[heroSlider.currentSlide].classList.remove('active');
        heroSlider.dots[heroSlider.currentSlide].classList.remove('active');

        // Update current slide index
        heroSlider.currentSlide = index;

        // Add active class to new slide and dot
        heroSlider.slides[index].classList.add('active');
        heroSlider.dots[index].classList.add('active');

        // Update progress bar
        updateProgress(index);

        // Trigger slide content animation
        animateSlideContent(heroSlider.slides[index]);
    };

    // Progress Bar Animation
    const updateProgress = (index) => {
        const progress = ((index + 1) / heroSlider.slides.length) * 100;
        heroSlider.progressBar.style.transform = `translateX(${progress - 100}%)`;
    };

    // Slide Timer Functions
    const startSlideTimer = () => {
        heroSlider.slideInterval = setInterval(() => {
            updateSlide((heroSlider.currentSlide + 1) % heroSlider.slides.length);
        }, heroSlider.intervalDuration);
    };

    const resetSlideTimer = () => {
        clearInterval(heroSlider.slideInterval);
        startSlideTimer();
    };

    // Animate Slide Content
    const animateSlideContent = (slide) => {
        const content = slide.querySelector('.slide-content');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';

        // Trigger reflow
        void content.offsetWidth;

        // Add animation
        content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    };

    // Floating Bubbles Animation
    const animateBubbles = () => {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach((bubble, index) => {
            bubble.style.animation = `float ${20 + index * 5}s infinite linear`;
        });
    };

    // Smooth Scroll Function
    const initSmoothScroll = () => {
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
    };

    // Navbar Scroll Effect
    const initNavbarEffect = () => {
        const navbar = document.querySelector('.main-nav');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove background blur based on scroll position
            if (currentScroll > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            }

            // Hide/show navbar based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    };

    // Back to Top Button
    const initBackToTop = () => {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 1000) {
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
    };

    // Initialize everything
    const init = () => {
        initHeroSlider();
        animateBubbles();
        initSmoothScroll();
        initNavbarEffect();
        initBackToTop();
    };

    // Start the application
    init();
});
