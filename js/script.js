document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteManager();
});

class WebsiteManager {
    constructor() {
        this.initNavigation();
        this.initHeroSection();
        this.initServices();
        this.initTeamCarousel(); // Changed from initTeamCards to initTeamCarousel
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

    // Services Section
    initServices() {
        const track = document.querySelector('.carousel-track');
        const prevButton = document.querySelector('.carousel-button.left');
        const nextButton = document.querySelector('.carousel-button.right');
        const cards = document.querySelectorAll('.service-card');

        if (!track || !prevButton || !nextButton) return;

        let currentPosition = 0;
        const cardWidth = cards[0].offsetWidth;
        const visibleCards = 3;
        const maxPosition = cards.length - visibleCards;

        prevButton.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition--;
                updateCarouselPosition();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPosition < maxPosition) {
                currentPosition++;
                updateCarouselPosition();
            }
        });

        function updateCarouselPosition() {
            track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
            prevButton.disabled = currentPosition === 0;
            nextButton.disabled = currentPosition === maxPosition;
        }
    }

    // Team Carousel (New Implementation)
    initTeamCarousel() {
        const carousel = document.querySelector('.team-carousel');
        if (!carousel) return;

        const cards = document.querySelectorAll('.team-card');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const indicators = document.querySelector('.carousel-indicators');

        let currentIndex = 0;
        const cardsPerView = window.innerWidth >= 768 ? 3 : 1;
        const totalSlides = Math.ceil(cards.length / cardsPerView);

        // Create indicators
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('indicator-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            indicators.appendChild(dot);
        }

        // Update carousel state
        const updateCarousel = () => {
            const translation = -(currentIndex * (100 / cardsPerView));
            carousel.style.transform = `translateX(${translation}%)`;
            
            // Update button states
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === totalSlides - 1;

            // Update card visibility
            cards.forEach((card, index) => {
                const isVisible = index >= currentIndex * cardsPerView && 
                                index < (currentIndex + 1) * cardsPerView;
                card.style.opacity = isVisible ? '1' : '0.3';
                card.style.transform = isVisible ? 'scale(1)' : 'scale(0.9)';
            });

            // Update indicators
            const dots = indicators.querySelectorAll('.indicator-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        // Navigation handlers
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Indicator clicks
        indicators.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator-dot')) {
                const dots = Array.from(indicators.children);
                currentIndex = dots.indexOf(e.target);
                updateCarousel();
            }
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > 50) {
                if (difference > 0 && currentIndex < totalSlides - 1) {
                    currentIndex++;
                } else if (difference < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateCarousel();
            }
        });

        // Initial update
        updateCarousel();

        // Resize handling
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newCardsPerView = window.innerWidth >= 768 ? 3 : 1;
                if (newCardsPerView !== cardsPerView) {
                    location.reload(); // Refresh page on breakpoint change
                }
            }, 250);
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
