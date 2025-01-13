// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================
    // Navigation & Mobile Menu
    // ===============================
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Handle Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Navbar Scroll Effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove background when scrolling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar when scrolling up/down
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // ===============================
    // Hero Section Animations
    // ===============================
    const heroImages = document.querySelectorAll('.hero-image');
    
    // Set initial rotation for floating animation
    heroImages.forEach((image, index) => {
        const rotation = index === 0 ? -15 : index === 1 ? 5 : -5;
        image.style.setProperty('--rotation', `${rotation}deg`);
    });

    // Mouse move parallax effect for hero images
    document.querySelector('.hero-section').addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xAxis = (window.innerWidth / 2 - clientX) / 50;
        const yAxis = (window.innerHeight / 2 - clientY) / 50;

        heroImages.forEach((image, index) => {
            const factor = (3 - index) * 0.2;
            image.style.transform = `translate(${xAxis * factor}px, ${yAxis * factor}px) rotate(var(--rotation))`;
        });
    });

    // Reset transform when mouse leaves hero section
    document.querySelector('.hero-section').addEventListener('mouseleave', () => {
        heroImages.forEach(image => {
            image.style.transform = 'rotate(var(--rotation))';
        });
    });

    // ===============================
    // Smooth Scrolling
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });

    // ===============================
    // Intersection Observer Animations
    // ===============================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('progress-fill')) {
                    entry.target.style.width = entry.target.dataset.progress + '%';
                }
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .slide-in, .progress-fill').forEach(el => {
        observer.observe(el);
    });

    // ===============================
    // Dynamic Text Animation
    // ===============================
    const typingText = document.querySelector('.changing-text');
    if (typingText) {
        const words = ['Innovation', 'Excellence', 'Creativity'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];
            const currentChar = currentWord.substring(0, charIndex);
            typingText.textContent = currentChar;

            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(typeEffect, 200);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(typeEffect, 100);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex = (wordIndex + 1) % words.length;
                }
                setTimeout(typeEffect, 1200);
            }
        }

        typeEffect();
    }

    // ===============================
    // Form Validation & Submission
    // ===============================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic form validation
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                // Add loading state
                const submitBtn = form.querySelector('[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                try {
                    // Replace with your actual form submission logic
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    form.reset();
                    showNotification('Message sent successfully!', 'success');
                } catch (error) {
                    showNotification('Error sending message. Please try again.', 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    });

    // ===============================
    // Notification System
    // ===============================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===============================
    // Image Lazy Loading
    // ===============================
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===============================
    // Performance Optimization
    // ===============================
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Apply throttling to intensive events
    window.addEventListener('resize', throttle(() => {
        // Handle resize events
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    }, 100));

    // Initialize any third-party libraries or additional features here
});
