// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initParallax();
    initCarousel();
    initScrollEffects();
    initForms();
    initBackToTop();
    initReviewsSlider();
    initAnimations();
    initEmergencyBanner();
});

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after click
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Navbar scroll effects
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Parallax Effect
function initParallax() {
    const parallaxItems = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxItems.forEach(item => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            item.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Hero Carousel
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    let interval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateSlides() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlides();
        resetInterval();
    }

    function startInterval() {
        interval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
        clearInterval(interval);
        startInterval();
    }

    // Event listeners
    nextButton?.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevButton?.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(interval);
    });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startInterval();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Start carousel
    updateSlides();
    startInterval();
}

// Scroll Effects
function initScrollEffects() {
    const sections = document.querySelectorAll('section');
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Form Handling
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => validateField(input));
        });
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!validateForm(form)) {
        showNotification('Please check your inputs and try again.', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('Message sent successfully!', 'success');
        form.reset();
        
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('success');
        });
    } catch (error) {
        showNotification('Error sending message. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

function validateField(field) {
    const parent = field.closest('.form-group');
    removeError(parent);

    if (!field.required && field.value === '') {
        return true;
    }

    // Required field validation
    if (field.required && field.value.trim() === '') {
        showError(parent, 'This field is required');
        return false;
    }

    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(parent, 'Please enter a valid email address');
            return false;
        }
    }

    // Phone validation
    if (field.type === 'tel') {
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(field.value)) {
            showError(parent, 'Please enter a valid phone number');
            return false;
        }
    }

    parent.classList.add('success');
    return true;
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showError(parent, message) {
    parent.classList.add('error');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    parent.appendChild(error);
}

function removeError(parent) {
    parent.classList.remove('error', 'success');
    const error = parent.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

// Reviews Slider
function initReviewsSlider() {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const prevButton = document.querySelector('.review-prev');
    const nextButton = document.querySelector('.review-next');

    if (!track || !cards.length) return;

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // Include gap

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % (cards.length - 2);
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length - 2) % (cards.length - 2);
        updateSlider();
    }

    prevButton?.addEventListener('click', prevSlide);
    nextButton?.addEventListener('click', nextSlide);

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.querySelector('#backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animations
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(element => {
        observer.observe(element);
    });
}

// Emergency Banner
function initEmergencyBanner() {
    const banner = document.querySelector('.emergency-banner');
    
    setTimeout(() => {
        banner.classList.add('show');
    }, 2000);
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    const container = document.querySelector('.notification-container');
    container.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
