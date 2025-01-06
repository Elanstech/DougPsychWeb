// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Initialize Swiper for Hero Slider
    const heroSwiper = new Swiper('.hero-slider', {
        loop: true,
        effect: 'fade',
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    // Initialize Swiper for Team Carousel
    const teamSwiper = new Swiper('.team-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
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
});

// Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});
// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

// Navbar Scroll Effect
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
    if (currentScroll > lastScroll && currentScroll > 500 && !document.body.classList.contains('menu-open')) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

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

// Form Handling
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    // Handle floating labels
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Add placeholder for label animation
        input.setAttribute('placeholder', ' ');
        
        // Handle focus and blur events
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

    // Form submission handling
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
                
                // Reset form states
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

// Utility Functions
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
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle Book Cover 3D Effect
const bookCover = document.querySelector('.book-cover');
if (bookCover) {
    bookCover.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = bookCover.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const rotateY = (x - 0.5) * 20;
        const rotateX = (y - 0.5) * -20;
        
        bookCover.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    bookCover.addEventListener('mouseleave', () => {
        bookCover.style.transform = 'rotateY(0) rotateX(0)';
    });
}
