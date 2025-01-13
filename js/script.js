document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteManager();
});

class WebsiteManager {
  constructor() {
    this.initNavigation();
    this.initHeroSection();
    this.initServices();
    this.initTeamCarousel();
    this.initPublicationSection(); // Add this line
    this.initContactForm();
    this.initAnimations();
    this.initBackToTop();
}

    // Navigation Management
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-links li a');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                menuToggle.setAttribute('aria-expanded', 
                    menuToggle.classList.contains('active'));
            });
        }

        // Active link highlighting
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                if (navMenu.classList.contains('active')) {
                    menuToggle.click();
                }
            });
        });

        // Scroll effect for navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Hero Section
    initHeroSection() {
        const heroImages = document.querySelectorAll('.hero-image');
        
        // Parallax effect for hero images
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
    initServices() {
        const track = document.querySelector('.carousel-track');
        const prevButton = document.querySelector('.carousel-button.left');
        const nextButton = document.querySelector('.carousel-button.right');
        const cards = document.querySelectorAll('.service-card');

        if (!track || !cards.length) return;

        let currentPosition = 0;
        const cardWidth = cards[0].offsetWidth + 32; // Including gap
        const visibleCards = window.innerWidth > 768 ? 3 : 1;
        const maxPosition = Math.max(0, cards.length - visibleCards);

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
            prevButton.disabled = currentPosition === 0;
            nextButton.disabled = currentPosition >= maxPosition;
        };

        prevButton?.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition--;
                updateCarousel();
            }
        });

        nextButton?.addEventListener('click', () => {
            if (currentPosition < maxPosition) {
                currentPosition++;
                updateCarousel();
            }
        });

        updateCarousel();
    }

    // Team Carousel
    initTeamCarousel() {
        const carousel = document.querySelector('.team-carousel');
        const cards = Array.from(document.querySelectorAll('.team-card'));
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const indicators = document.querySelector('.carousel-indicators');

        if (!carousel || !cards.length) return;

        let currentIndex = 0;
        let autoScrollInterval;
        const cardsPerView = window.innerWidth > 768 ? 3 : 1;
        const totalSlides = Math.ceil(cards.length / cardsPerView);

        // Create indicators
        indicators.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('indicator-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            indicators.appendChild(dot);
        }

        const updateCarousel = () => {
            const offset = -(currentIndex * (100 / cardsPerView));
            carousel.style.transform = `translateX(${offset}%)`;

            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= totalSlides - 1;

            const dots = document.querySelectorAll('.indicator-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            cards.forEach((card, index) => {
                const isVisible = index >= currentIndex * cardsPerView && 
                                index < (currentIndex + 1) * cardsPerView;
                card.style.opacity = isVisible ? '1' : '0.3';
                card.style.transform = isVisible ? 'scale(1)' : 'scale(0.9)';
            });
        };

        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }, 5000);
        };

        const stopAutoScroll = () => {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
        };

        // Event Listeners
        prevButton?.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextButton?.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        indicators.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator-dot')) {
                const dots = Array.from(indicators.children);
                currentIndex = dots.indexOf(e.target);
                updateCarousel();
            }
        });

        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
        carousel.addEventListener('touchstart', stopAutoScroll);
        carousel.addEventListener('touchend', startAutoScroll);

        // Initialize
        updateCarousel();
        startAutoScroll();
    }

    // Add this method to your WebsiteManager class
initPublicationSection() {
    const bookCover = document.querySelector('.book-cover');
    const floatingElements = document.querySelectorAll('.float-element');
    
    if (bookCover) {
        // Enhance 3D effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xAxis = (window.innerWidth / 2 - clientX) / 25;
            const yAxis = (window.innerHeight / 2 - clientY) / 25;
            
            bookCover.style.transform = `rotateY(${30 + xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // Reset transform on mouse leave
        document.addEventListener('mouseleave', () => {
            bookCover.style.transform = 'rotateY(30deg) rotateX(0)';
        });
    }

    // Add hover effect for floating elements
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
        
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
            element.style.zIndex = '10';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.zIndex = '';
        });
    });

    // Optional: Add intersection observer for animation on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe publication section elements
    const elements = document.querySelectorAll('.book-3d, .highlight-card, .feature-list li');
    elements.forEach(el => observer.observe(el));
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
                // Simulate form submission
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
