document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteManager();
});

class WebsiteManager {
    constructor() {
        this.initNavigation();
        this.initHeroSection();
        this.initServicesCarousel();
        this.initTeamCarousel();
        this.initContactForm();
        this.initAnimations();
        this.initBackToTop();
    }

    // Navigation and Mobile Menu
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-links li');

        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                toggleMenu();
            });

            // Close menu when clicking on links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    toggleMenu();
                });
            });
        }

        function toggleMenu() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // Hero Section
    initHeroSection() {
        const texts = document.querySelectorAll('.changing-text');
        let currentIndex = 0;

        function animateText() {
            texts.forEach(text => text.style.opacity = '0');
            texts[currentIndex].style.opacity = '1';
            currentIndex = (currentIndex + 1) % texts.length;
        }

        setInterval(animateText, 3000);
        animateText(); // Initial animation

        // Hero images parallax effect
        const heroImages = document.querySelectorAll('.image-box img');
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xAxis = (window.innerWidth / 2 - clientX) / 50;
            const yAxis = (window.innerHeight / 2 - clientY) / 50;

            heroImages.forEach((image, index) => {
                const factor = (3 - index) * 0.2;
                image.style.transform = `translate(${xAxis * factor}px, ${yAxis * factor}px)`;
            });
        });
    }

    // Services Carousel
    initServicesCarousel() {
        const track = document.querySelector('.services-carousel .carousel-track');
        const prevButton = document.querySelector('.services-carousel .carousel-button.left');
        const nextButton = document.querySelector('.services-carousel .carousel-button.right');
        const cards = document.querySelectorAll('.services-carousel .service-card');

        console.log('Services carousel elements:', { track, prevButton, nextButton, cards });

        if (!track || !prevButton || !nextButton || !cards.length) return;

        let currentPosition = 0;
        const updateCarouselPosition = () => {
            const cardsPerView = window.innerWidth >= 768 ? 3 : 1;
            const slidePercentage = (100 / cardsPerView);

            track.style.transform = `translateX(-${currentPosition * slidePercentage}%)`;
            prevButton.disabled = currentPosition === 0;
            nextButton.disabled = currentPosition >= cards.length - cardsPerView;
        };

        prevButton.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition--;
                updateCarouselPosition();
            }
        });

        nextButton.addEventListener('click', () => {
            const cardsPerView = window.innerWidth >= 768 ? 3 : 1;
            if (currentPosition < cards.length - cardsPerView) {
                currentPosition++;
                updateCarouselPosition();
            }
        });

        // Initial update
        updateCarouselPosition();

        // Handle window resize
        window.addEventListener('resize', () => {
            updateCarouselPosition(); // Recalculate on resize
        });
    }

    // Team Carousel
    initTeamCarousel() {
        const carousel = document.querySelector('.team-carousel');
        const prevButton = document.querySelector('.team-carousel-container .carousel-button.prev');
        const nextButton = document.querySelector('.team-carousel-container .carousel-button.next');
        const indicators = document.querySelector('.carousel-indicators');
        const cards = carousel.querySelectorAll('.team-card');

        console.log('Team carousel elements:', { carousel, prevButton, nextButton, indicators, cards });

        if (!carousel || !prevButton || !nextButton || !cards.length) return;

        let currentIndex = 0;
        const updateCarousel = () => {
            const cardsPerView = window.innerWidth >= 768 ? 3 : 1;
            const slidePercentage = (100 / cardsPerView);

            carousel.style.transform = `translateX(-${currentIndex * slidePercentage}%)`;
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= cards.length - cardsPerView;

            // Update indicators
            const dots = indicators.querySelectorAll('.indicator-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextButton.addEventListener('click', () => {
            const cardsPerView = window.innerWidth >= 768 ? 3 : 1;
            if (currentIndex < cards.length - cardsPerView) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Create indicators
        const createIndicators = () => {
            indicators.innerHTML = ''; // Clear existing indicators
            const totalSlides = Math.ceil(cards.length / (window.innerWidth >= 768 ? 3 : 1));
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('indicator-dot');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                indicators.appendChild(dot);
            }
        };

        // Initial setup
        createIndicators();
        updateCarousel();

        // Handle window resize
        window.addEventListener('resize', () => {
            createIndicators();
            updateCarousel();
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            try {
                // Add your form submission logic here
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
            } catch (error) {
                this.showNotification('Error sending message. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
            }
        });

        // Floating labels
        const inputs = form.querySelectorAll('input, textarea, select');
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
    }

    // Animations
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

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
        setTimeout(() => notification.classList.add('show'), 10);

        const close = () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        };

        notification.querySelector('.notification-close').addEventListener('click', close);
        setTimeout(close, 5000);
    }
}
