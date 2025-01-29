// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollEffects();
    initializePhilosophyCards();
    initializeExperienceCarousel();
    initializeParallax();
    initializeSmoothScroll();
    initializeAnimations();
});

// Parallax Effect for Hero Section
function initializeParallax() {
    const heroSection = document.querySelector('.about-hero');
    
    window.addEventListener('scroll', () => {
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            heroSection.style.backgroundPosition = `center ${-rate}px`;
        }
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Initialize Philosophy Cards
function initializePhilosophyCards() {
    const cards = document.querySelectorAll('.philosophy-card');
    let activeIndex = 0;
    
    function activateCard(index) {
        cards.forEach(card => card.classList.remove('active'));
        cards[index].classList.add('active');
    }

    // Auto-rotate cards
    function rotateCards() {
        activeIndex = (activeIndex + 1) % cards.length;
        activateCard(activeIndex);
    }

    let cardInterval = setInterval(rotateCards, 4000);

    // Pause rotation on hover
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            clearInterval(cardInterval);
            activateCard(index);
        });

        card.addEventListener('mouseleave', () => {
            activeIndex = index;
            cardInterval = setInterval(rotateCards, 4000);
        });
    });
}

// Experience Carousel
function initializeExperienceCarousel() {
    const slides = document.querySelectorAll('.experience-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        slide.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Header transformation
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Initialize Animations
function initializeAnimations() {
    // Education cards animation
    const educationCards = document.querySelectorAll('.education-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, {
        threshold: 0.1
    });

    educationCards.forEach(card => {
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Military service list animation
    const serviceItems = document.querySelectorAll('.service-list li');
    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.3s ease';
        item.style.transitionDelay = `${index * 0.1}s`;

        observer.observe(item);
    });

    // Membership cards stagger animation
    const membershipCards = document.querySelectorAll('.membership-card');
    membershipCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${index * 0.2}s`;

        observer.observe(card);
    });
}

// Number counter animation
function animateNumbers() {
    const numberElements = document.querySelectorAll('.number-animate');
    
    numberElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateNumber();
                observer.unobserve(element);
            }
        });
        
        observer.observe(element);
    });
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause all animations when tab is not visible
        document.querySelectorAll('*').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab becomes visible
        document.querySelectorAll('*').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-speed', '0s');
    // Disable animations that might be problematic
    const animatedElements = document.querySelectorAll('.animate, .fade, .slide');
    animatedElements.forEach(element => {
        element.style.animation = 'none';
        element.style.transition = 'none';
    });
}
