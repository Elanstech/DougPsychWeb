// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteManager();
});

class WebsiteManager {
    constructor() {
        // Initialize all components
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

    // Hero Section with Parallax
    initHeroSection() {
        const heroImages = document.querySelectorAll('.hero-image');
        const heroText = document.querySelector('.hero-text');
        
        // Parallax effect for hero images
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xAxis = (window.innerWidth / 2 - clientX) / 50;
            const yAxis = (window.innerHeight / 2 - clientY) / 50;

            heroImages.forEach((image, index) => {
                const factor = (3 - index) * 0.2;
                image.style.transform = `translate(${xAxis * factor}px, ${yAxis * factor}px)`;
            });

            if (heroText) {
                heroText.style.transform = `translate(${xAxis * -0.1}px, ${yAxis * -0.1}px)`;
            }
        });

        // Reset transforms when mouse leaves
        document.addEventListener('mouseleave', () => {
            heroImages.forEach(image => {
                image.style.transform = 'translate(0, 0)';
            });
            if (heroText) {
                heroText.style.transform = 'translate(0, 0)';
            }
        });
    }

    // Services Carousel
    initServices() {
        const track = document.querySelector('.carousel-track');
        const prevButton = document.querySelector('.carousel-button.left');
        const nextButton = document.querySelector('.carousel-button.right');
        const cards = document.querySelectorAll('.service-card');
        const indicators = document.querySelector('.service-indicators');

        if (!track || !cards.length) return;

        let currentPosition = 0;
        const cardWidth = cards[0].offsetWidth + 32; // Including gap
        const visibleCards = window.innerWidth > 768 ? 3 : 1;
        const maxPosition = Math.max(0, cards.length - visibleCards);
        let autoScrollInterval;

        // Create indicator dots
        if (indicators) {
            indicators.innerHTML = '';
            for (let i = 0; i <= maxPosition; i++) {
                const dot = document.createElement('button');
                dot.classList.add('indicator-dot');
                dot.setAttribute('aria-label', `Service Slide ${i + 1}`);
                indicators.appendChild(dot);
            }
        }

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
            prevButton.disabled = currentPosition === 0;
            nextButton.disabled = currentPosition >= maxPosition;

            // Update indicator dots
            if (indicators) {
                const dots = document.querySelectorAll('.indicator-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentPosition);
                });
            }

            // Update card visibility with smooth transitions
            cards.forEach((card, index) => {
                const isVisible = index >= currentPosition && 
                                index < currentPosition + visibleCards;
                card.style.opacity = isVisible ? '1' : '0.3';
                card.style.transform = isVisible ? 'scale(1)' : 'scale(0.9)';
            });
        };

        // Auto-scroll functionality
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

        // Event Listeners
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

        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoScroll();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = touchStartX - touchEndX;
            
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0 && currentPosition < maxPosition) {
                    currentPosition++;
                } else if (swipeDistance < 0 && currentPosition > 0) {
                    currentPosition--;
                }
                updateCarousel();
            }
            startAutoScroll();
        });

        // Handle indicator clicks
        if (indicators) {
            indicators.addEventListener('click', (e) => {
                if (e.target.classList.contains('indicator-dot')) {
                    const dots = Array.from(indicators.children);
                    currentPosition = dots.indexOf(e.target);
                    updateCarousel();
                }
            });
        }

        // Initialize carousel
        updateCarousel();
        startAutoScroll();

        // Pause auto-scroll on hover
        track.addEventListener('mouseenter', stopAutoScroll);
        track.addEventListener('mouseleave', startAutoScroll);
    }

    class TeamCarousel {
    constructor() {
        // Core elements
        this.carousel = document.querySelector('.team-carousel');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.querySelector('.carousel-dots');

        // Configuration
        this.currentSlide = 0;
        this.autoPlayInterval = 5000; // 5 seconds between slides
        this.slidesPerView = this.getSlidesPerView();
        this.autoPlayTimer = null;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        // Team members data
        this.teamMembers = [
            {
                name: 'Angela Christina Ferri',
                role: 'Clinical Psychologist',
                image: 'images/team/angela.jpg',
                specialties: ['Anxiety', 'Depression', 'Trauma'],
                email: 'angela@douguhlig.com'
            },
            {
                name: 'Jaqueline Galynsky',
                role: 'Mental Health Counselor',
                image: 'images/team/jaqueline.jpg',
                specialties: ['CBT', 'Mindfulness', 'Stress'],
                email: 'jaqueline@douguhlig.com'
            },
            {
                name: 'Zbigniew Korczak',
                role: 'Psychiatric Specialist',
                image: 'images/team/zbigniew.jpg',
                specialties: ['Psychiatry', 'Evaluation', 'Disorders'],
                email: 'zbigniew@douguhlig.com'
            },
            {
                name: 'Stephanie Palacios',
                role: 'Family Therapist',
                image: 'images/team/stephanie.jpg',
                specialties: ['Family', 'Relationships', 'Parenting'],
                email: 'stephanie@douguhlig.com'
            },
            {
                name: 'Rashanda Allen',
                role: 'Behavioral Therapist',
                image: 'images/team/rashanda.jpg',
                specialties: ['Behavioral', 'Cognitive', 'Therapy'],
                email: 'rashanda@douguhlig.com'
            },
            {
                name: 'Yunetta Baron',
                role: 'Child Psychologist',
                image: 'images/team/yunetta.jpg',
                specialties: ['Children', 'Development', 'Play Therapy'],
                email: 'yunetta@douguhlig.com'
            },
            {
                name: 'Thomas Gerard Smith',
                role: 'Trauma Specialist',
                image: 'images/team/thomas.jpg',
                specialties: ['Trauma', 'PTSD', 'Recovery'],
                email: 'thomas@douguhlig.com'
            }
        ];

        this.init();
    }

    init() {
        this.renderSlides();
        this.createDots();
        this.updateCarousel();
        this.bindEvents();
        this.startAutoPlay();
        this.setupTouchEvents();
        this.setupResizeObserver();
    }

    getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    renderSlides() {
        this.carousel.innerHTML = this.teamMembers.map((member, index) => `
            <div class="team-slide" data-index="${index}">
                <div class="card-inner">
                    <div class="member-image">
                        <img src="${member.image}" alt="${member.name}" loading="lazy">
                        <div class="image-overlay"></div>
                    </div>
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <span class="role">${member.role}</span>
                        <div class="specialties">
                            ${member.specialties.map(specialty => 
                                `<span>${specialty}</span>`
                            ).join('')}
                        </div>
                        <a href="mailto:${member.email}" class="contact-btn">
                            <i class="fas fa-envelope"></i> Contact
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    createDots() {
        const numberOfDots = Math.ceil(this.teamMembers.length / this.slidesPerView);
        this.dotsContainer.innerHTML = Array.from({ length: numberOfDots }, (_, i) => `
            <div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
        `).join('');
    }

    updateCarousel() {
        const slides = document.querySelectorAll('.team-slide');
        const slideWidth = 100 / this.slidesPerView;
        const translateValue = -this.currentSlide * slideWidth;
        
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${translateValue}%)`;
            slide.classList.toggle('active', 
                index >= this.currentSlide && 
                index < this.currentSlide + this.slidesPerView
            );
        });

        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(this.currentSlide / this.slidesPerView));
        });
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Dot navigation
        this.dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index * this.slidesPerView);
            }
        });

        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    setupTouchEvents() {
        this.carousel.addEventListener('touchstart', (e) => this.touchStart(e));
        this.carousel.addEventListener('touchmove', (e) => this.touchMove(e));
        this.carousel.addEventListener('touchend', () => this.touchEnd());
    }

    touchStart(e) {
        this.isDragging = true;
        this.startPos = e.touches[0].clientX;
        this.stopAutoPlay();
    }

    touchMove(e) {
        if (!this.isDragging) return;
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - this.startPos;
        
        if (Math.abs(diff) > 50) { // Minimum drag distance
            this.currentTranslate = this.prevTranslate + diff;
            requestAnimationFrame(() => this.updateSlidePosition());
        }
    }

    touchEnd() {
        this.isDragging = false;
        const movedBy = this.currentTranslate - this.prevTranslate;
        
        if (Math.abs(movedBy) > 100) { // Minimum distance for slide change
            if (movedBy < 0) this.nextSlide();
            else this.prevSlide();
        }
        
        this.startAutoPlay();
    }

    updateSlidePosition() {
        this.carousel.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.teamMembers.length - this.slidesPerView) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        this.currentSlide = Math.min(
            Math.max(0, index),
            this.teamMembers.length - this.slidesPerView
        );
        this.updateCarousel();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => this.nextSlide(), this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    setupResizeObserver() {
        window.addEventListener('resize', () => {
            const newSlidesPerView = this.getSlidesPerView();
            if (newSlidesPerView !== this.slidesPerView) {
                this.slidesPerView = newSlidesPerView;
                this.currentSlide = 0;
                this.createDots();
                this.updateCarousel();
            }
        });
    }
}

// Initialize the carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TeamCarousel();
});

    // Publication Section
    initPublicationSection() {
        const bookCover = document.querySelector('.book-cover');
        const floatingElements = document.querySelectorAll('.float-element');
        
        if (bookCover) {
            // 3D effect on mouse move
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

        // Floating elements animation
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

        // Scroll animations
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

        const elements = document.querySelectorAll('.book-3d, .highlight-card, .feature-list li');
        elements.forEach(el => observer.observe(el));
    }

    // Google Reviews Integration
    initGoogleReviews() {
        window.addEventListener('load', () => {
            const reviewsContainer = document.querySelector('.reviews-widget-container');
            if (!reviewsContainer) return;

            reviewsContainer.classList.add('loading');

            const checkWidget = setInterval(() => {
                const widget = document.querySelector('.elfsight-app-345fc429-0347-4493-8043-afbb1cb52b6e iframe');
                if (widget) {
                    reviewsContainer.classList.remove('loading');
                    clearInterval(checkWidget);
                }
            }, 500);
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Form validation
            if (!this.validateForm(name, email, message)) {
                return;
            }

            // Construct mailto URL
            const mailtoUrl = `mailto:contact@douguhlig.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}`
            )}`;

            // Show success notification
            this.showNotification('Thank you for your message! Opening your email client...', 'success');

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

    // Form validation helper
    validateForm(name, email, message) {
        if (!name.trim()) {
            this.showNotification('Please enter your name', 'error');
            return false;
        }

        if (!email.trim() || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (!message.trim()) {
            this.showNotification('Please enter your message', 'error');
            return false;
        }

        return true;
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

        const scrollThreshold = 500;
        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    if (window.pageYOffset > scrollThreshold) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                    isScrolling = false;
                });
                isScrolling = true;
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

        // Close button event listener
        notification.querySelector('.notification-close').addEventListener('click', close);

        // Auto close after 5 seconds
        setTimeout(close, 5000);
    }

    // Utility method for handling loading states
    setLoadingState(element, isLoading) {
        if (isLoading) {
            element.classList.add('loading');
            element.setAttribute('disabled', '');
        } else {
            element.classList.remove('loading');
            element.removeAttribute('disabled');
        }
    }

    // Utility method for handling errors
    handleError(error, fallbackMessage = 'Something went wrong') {
        console.error('Error:', error);
        this.showNotification(fallbackMessage, 'error');
    }
}

// Initialize the website manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteManager();
});
