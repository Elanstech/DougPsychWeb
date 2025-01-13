document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteManager();
});

class WebsiteManager {
  constructor() {
    this.initNavigation();
    this.initHeroSection();
    this.initServices();
    this.initTeamCarousel();
    this.initPublicationSection();
    this.initGoogleReviews();
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

    // Add this to your WebsiteManager class in script.js
initTeamCarousel() {
    const track = document.querySelector('.team-carousel');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const cards = document.querySelectorAll('.team-card');
    const indicators = document.querySelector('.carousel-indicators');

    if (!track || !cards.length) return;

    let currentPosition = 0;
    const cardWidth = cards[0].offsetWidth + 32; // Including gap
    const visibleCards = window.innerWidth > 768 ? 3 : 1;
    const maxPosition = Math.max(0, cards.length - visibleCards);

    // Create indicator dots
    indicators.innerHTML = '';
    for (let i = 0; i <= maxPosition; i++) {
        const dot = document.createElement('button');
        dot.classList.add('indicator-dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        indicators.appendChild(dot);
    }

    const updateCarousel = () => {
        // Update carousel position
        track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
        
        // Update button states
        prevButton.disabled = currentPosition === 0;
        nextButton.disabled = currentPosition >= maxPosition;

        // Update indicator dots
        const dots = document.querySelectorAll('.indicator-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPosition);
        });

        // Update card visibility
        cards.forEach((card, index) => {
            const isVisible = index >= currentPosition && 
                            index < currentPosition + visibleCards;
            card.style.opacity = isVisible ? '1' : '0.3';
            card.style.transform = isVisible ? 'scale(1)' : 'scale(0.9)';
        });
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

    // Indicator clicks
    indicators.addEventListener('click', (e) => {
        if (e.target.classList.contains('indicator-dot')) {
            const dots = Array.from(indicators.children);
            currentPosition = dots.indexOf(e.target);
            updateCarousel();
        }
    });

    // Initialize carousel
    updateCarousel();

    // Add auto-scroll functionality
    let autoScrollInterval;
    
    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            if (currentPosition < maxPosition) {
                currentPosition++;
            } else {
                currentPosition = 0;
            }
            updateCarousel();
        }, 5000);
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    };

    // Start auto-scroll and handle hover pause
    startAutoScroll();
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);
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

// Add this method to your WebsiteManager class
initGoogleReviews() {
    // Wait for the widget to load
    window.addEventListener('load', () => {
        const reviewsContainer = document.querySelector('.reviews-widget-container');
        if (!reviewsContainer) return;

        // Add loading state
        reviewsContainer.classList.add('loading');

        // Check if widget is loaded
        const checkWidget = setInterval(() => {
            const widget = document.querySelector('.elfsight-app-345fc429-0347-4493-8043-afbb1cb52b6e iframe');
            if (widget) {
                reviewsContainer.classList.remove('loading');
                clearInterval(checkWidget);
            }
        }, 500);
    });
}


   // Add this to your WebsiteManager class
initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Construct mailto URL
        const mailtoUrl = `mailto:contact@douguhlig.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
        )}`;

        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'contact-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>Thank you for your message! Opening your email client...</p>
            </div>
        `;
        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Open mailto link
        window.location.href = mailtoUrl;
    });

    // Add floating label animation
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (!input) return;

        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                group.classList.remove('focused');
            }
        });

        // Check initial state
        if (input.value) {
            group.classList.add('focused');
        }
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
