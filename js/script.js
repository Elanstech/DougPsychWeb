document.addEventListener('DOMContentLoaded', () => {
    // Navigation
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

    // Navbar scroll handling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove background on scroll
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

    // Back to Top Button
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

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in').forEach(element => {
        observer.observe(element);
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const formElements = form.elements;
            
            for (let element of formElements) {
                if (element.type !== 'submit') {
                    if (validateField(element) === false) {
                        isValid = false;
                    }
                }
            }

            if (isValid) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');
                }

                // Simulate form submission (replace with actual form submission)
                setTimeout(() => {
                    showNotification('Message sent successfully!', 'success');
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('loading');
                    }
                }, 1500);
            }
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => validateField(input));
        });
    });

    // Field validation function
    function validateField(field) {
        const parent = field.parentElement;
        removeError(parent);

        // Skip validation if field is empty and not required
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

        return true;
    }

    // Error handling functions
    function showError(parent, message) {
        removeError(parent);
        parent.classList.add('error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        parent.appendChild(error);
    }

    function removeError(parent) {
        parent.classList.remove('error');
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        const container = document.querySelector('.notification-container') || createNotificationContainer();
        container.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    // Google Reviews Integration
    function loadGoogleReviews() {
        // Replace with your Google Place ID
        const placeId = 'YOUR_PLACE_ID';
        const apiKey = 'YOUR_API_KEY';

        // This is a placeholder for Google Places API integration
        // You'll need to implement the actual API call based on your Google API setup
        console.log('Google Reviews would load here');
    }

    // Initialize Reviews
    loadGoogleReviews();

    // Booking Widget Integration
    function initializeBookingWidget() {
        // Add your booking widget initialization code here
        console.log('Booking widget would initialize here');
    }

    // Initialize Booking
    initializeBookingWidget();

    // ElfWidget Integration
    function initializeElfWidget() {
        // Add your ElfWidget initialization code here
        console.log('ElfWidget would initialize here');
    }

    // Initialize ElfWidget
    initializeElfWidget();
});
