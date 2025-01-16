// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Initialize all components
    initHeroSlider();
    initMobileNav();
    initHeaderScroll();
    initServicesCarousel();
    initTeamCarousel();
    initFormHandling();
    initBackToTop();
});

// Hero Slider Function
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;

    // Show specific slide
    function showSlide(index) {
        // Hide all slides first
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.transform = 'scale(1.1)';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        requestAnimationFrame(() => {
            slides[index].classList.add('active');
            slides[index].style.opacity = '1';
            slides[index].style.transform = 'scale(1)';
            dots[index].classList.add('active');
        });

        currentSlide = index;
    }

    // Next slide function
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Previous slide function
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // Start slideshow
    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Stop slideshow
    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Initialize dots controls
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        } else if (e.key === 'ArrowLeft') {
            stopSlideshow();
            prevSlide();
            startSlideshow();
        }
    });

    // Add hover pause functionality
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlideshow);
        heroSection.addEventListener('mouseleave', startSlideshow);
    }

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    // Start the initial slideshow
    showSlide(0);
    startSlideshow();
}

// Mobile Navigation Function
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Function
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (!document.body.classList.contains('menu-open')) {
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
    });
}

// Services Carousel Function
function initServicesCarousel() {
    new Swiper('.services-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                centeredSlides: false,
            },
            1024: {
                slidesPerView: 3,
                centeredSlides: false,
            }
        }
    });
}

// Team Carousel Function
function initTeamCarousel() {
    new Swiper('.team-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
}

// Form Handling Function
function initFormHandling() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Handle floating labels
        inputs.forEach(input => {
            input.setAttribute('placeholder', ' ');
            
            input.addEventListener('focus', () => {
                input.closest('.form-group').classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.closest('.form-group').classList.remove('focused');
                if (input.value.trim()) {
                    input.closest('.form-group').classList.add('filled');
                } else {
                    input.closest('.form-group').classList.remove('filled');
                }
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                const submitBtn = form.querySelector('[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                try {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    
                    // Simulate form submission (replace with actual API call)
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    showNotification('Message sent successfully!', 'success');
                    form.reset();
                    
                    inputs.forEach(input => {
                        input.closest('.form-group').classList.remove('filled', 'focused');
                    });
                } catch (error) {
                    showNotification('Error sending message. Please try again.', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        });
    });
}

// Back to Top Function
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('[required]');
    
    inputs.forEach(input => {
        removeError(input);
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const parent = field.closest('.form-group');
    
    if (!value) {
        showError(parent, 'This field is required');
        return false;
    }

    if (type === 'email' && !isValidEmail(value)) {
        showError(parent, 'Please enter a valid email address');
        return false;
    }

    if (type === 'tel' && !isValidPhone(value)) {
        showError(parent, 'Please enter a valid phone number');
        return false;
    }

    return true;
}

// Error Handling
function showError(parent, message) {
    parent.classList.add('error');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    parent.appendChild(error);
}

function removeError(input) {
    const parent = input.closest('.form-group');
    parent.classList.remove('error');
    const error = parent.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

// Validation Helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
