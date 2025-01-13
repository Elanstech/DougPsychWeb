// Main JavaScript (script.js)

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initPreloader();
    initHeroSection();
    initNavigation();
    initCarousels();
    initPortfolio();
    initTestimonials();
    initServices();
    initCustomCursor();
    initAnimations();
    initContactForm();
    initFooter();
    initPerformance();
});

// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.add('loaded');
        }, 1000);
    });
}

// Hero Section
function initHeroSection() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Hero Slider/Gallery
    const galleryItems = heroSection.querySelectorAll('.gallery-item');
    const navDots = heroSection.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let isAnimating = false;
    let autoRotateInterval;

    function rotateGallery(newIndex) {
        if (isAnimating || newIndex === currentSlide) return;
        isAnimating = true;

        const current = galleryItems[currentSlide];
        const next = galleryItems[newIndex];

        // Handle transitions
        current.classList.remove('active');
        next.classList.add('active');

        // Update navigation dots
        navDots[currentSlide].classList.remove('active');
        navDots[newIndex].classList.add('active');

        currentSlide = newIndex;
        
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Auto rotate
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            rotateGallery((currentSlide + 1) % galleryItems.length);
        }, 5000);
    }

    // Navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => rotateGallery(index));
    });

    // Start auto-rotation
    startAutoRotate();

    // Pause on hover
    heroSection.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
    heroSection.addEventListener('mouseleave', startAutoRotate);

    // Text Animation
    const heroText = heroSection.querySelector('.hero-text');
    if (heroText) {
        const text = heroText.textContent;
        heroText.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.1}s`;
            heroText.appendChild(span);
        });
    }
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar || !menuToggle) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    // Handle scroll behavior
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove background on scroll
        navbar.classList.toggle('scrolled', currentScroll > scrollThreshold);
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('menu-active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            navbar.classList.remove('menu-active');
            menuToggle.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu
                navbar.classList.remove('menu-active');
                menuToggle.classList.remove('active');
            }
        });
    });
}
// Carousels (Services, Testimonials, Portfolio)
function initCarousels() {
    // Services Carousel
    const servicesCarousel = document.querySelector('.services-carousel');
    if (servicesCarousel) {
        const track = servicesCarousel.querySelector('.carousel-track');
        const items = track.querySelectorAll('.carousel-item');
        const prevButton = servicesCarousel.querySelector('.carousel-prev');
        const nextButton = servicesCarousel.querySelector('.carousel-next');
        const dotsContainer = servicesCarousel.querySelector('.carousel-dots');
        
        let currentIndex = 0;
        const itemsPerView = window.innerWidth < 768 ? 1 : 
                           window.innerWidth < 1024 ? 2 : 3;
        
        // Create dots
        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        function updateCarousel() {
            const slideWidth = track.clientWidth / itemsPerView;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            
            // Update dots
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Update buttons
            if (prevButton && nextButton) {
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex >= items.length - itemsPerView;
            }
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, items.length - itemsPerView));
            updateCarousel();
        }

        // Event Listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
        }

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    goToSlide(currentIndex + 1); // Swipe left
                } else {
                    goToSlide(currentIndex - 1); // Swipe right
                }
            }
        }, { passive: true });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                currentIndex = 0;
                updateCarousel();
            }, 250);
        });

        // Initial setup
        updateCarousel();
    }

    // Testimonials Carousel
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    if (testimonialsCarousel) {
        const track = testimonialsCarousel.querySelector('.testimonials-track');
        const items = track.querySelectorAll('.testimonial-item');
        const prevBtn = testimonialsCarousel.querySelector('.testimonial-prev');
        const nextBtn = testimonialsCarousel.querySelector('.testimonial-next');
        
        let currentTestimonial = 0;
        let isAnimating = false;
        let autoplayInterval;

        function showTestimonial(index) {
            if (isAnimating) return;
            isAnimating = true;

            // Hide current testimonial
            items[currentTestimonial].classList.remove('active');
            
            // Show new testimonial
            currentTestimonial = index;
            items[currentTestimonial].classList.add('active');

            // Update navigation state
            prevBtn.disabled = currentTestimonial === 0;
            nextBtn.disabled = currentTestimonial === items.length - 1;

            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        function nextTestimonial() {
            if (currentTestimonial < items.length - 1) {
                showTestimonial(currentTestimonial + 1);
            }
        }

        function prevTestimonial() {
            if (currentTestimonial > 0) {
                showTestimonial(currentTestimonial - 1);
            }
        }

        // Event listeners
        prevBtn.addEventListener('click', prevTestimonial);
        nextBtn.addEventListener('click', nextTestimonial);

        // Auto-play functionality
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                if (currentTestimonial === items.length - 1) {
                    showTestimonial(0);
                } else {
                    nextTestimonial();
                }
            }, 5000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Start/stop autoplay on hover
        testimonialsCarousel.addEventListener('mouseenter', stopAutoplay);
        testimonialsCarousel.addEventListener('mouseleave', startAutoplay);

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > 50) {
                if (difference > 0 && currentTestimonial < items.length - 1) {
                    nextTestimonial();
                } else if (difference < 0 && currentTestimonial > 0) {
                    prevTestimonial();
                }
            }
            startAutoplay();
        }, { passive: true });

        // Initial setup
        showTestimonial(0);
        startAutoplay();
    }
}

// Portfolio Section
function initPortfolio() {
    const portfolioSection = document.querySelector('.portfolio-section');
    if (!portfolioSection) return;

    const filterButtons = portfolioSection.querySelectorAll('.filter-btn');
    const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
    const portfolioGrid = portfolioSection.querySelector('.portfolio-grid');

    // Isotope-like filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter items
            portfolioItems.forEach(item => {
                const itemCategories = item.getAttribute('data-categories').split(' ');
                const shouldShow = filterValue === 'all' || itemCategories.includes(filterValue);
                
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = shouldShow ? 'block' : 'none';
                    setTimeout(() => {
                        item.style.opacity = shouldShow ? '1' : '0';
                    }, 50);
                }, 300);
            });
        });
    });

    // Portfolio item hover effect
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        
        item.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateY(0)';
        });

        item.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(100%)';
        });
    });

    // Portfolio modal
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalContent = {
                title: item.getAttribute('data-title'),
                description: item.getAttribute('data-description'),
                image: item.querySelector('img').src,
                category: item.getAttribute('data-categories'),
                link: item.getAttribute('data-link')
            };
            
            openPortfolioModal(modalContent);
        });
    });
}

// Portfolio Modal
function openPortfolioModal(content) {
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <img src="${content.image}" alt="${content.title}">
            <h3>${content.title}</h3>
            <p class="category">${content.category}</p>
            <p class="description">${content.description}</p>
            ${content.link ? `<a href="${content.link}" class="project-link" target="_blank">View Project</a>` : ''}
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animation
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    });

    // Close on outside click
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}
// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    let speed = 0.1; // Cursor movement speed

    // Update cursor position smoothly
    function updateCursor() {
        const deltaX = mouseX - cursorX;
        const deltaY = mouseY - cursorY;
        
        cursorX += deltaX * speed;
        cursorY += deltaY * speed;
        followerX += (mouseX - followerX) * (speed * 0.5);
        followerY += (mouseY - followerY) * (speed * 0.5);

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        requestAnimationFrame(updateCursor);
    }

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Handle cursor states for interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .service-card, .portfolio-item, .team-member, input, textarea'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });

    // Start cursor animation
    updateCursor();
}

// Contact Form with Validation
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const submitButton = form.querySelector('button[type="submit"]');
    let isSubmitting = false;

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[\d\s+-]{10,15}$/,
        message: /^[\s\S]{10,500}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Please enter a valid name (2-50 characters)',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number (10-15 digits)',
        message: 'Message must be between 10 and 500 characters'
    };

    // Real-time validation
    inputs.forEach(input => {
        const field = input.getAttribute('name');
        
        input.addEventListener('input', () => {
            validateField(input, field);
        });

        input.addEventListener('blur', () => {
            validateField(input, field);
        });
    });

    function validateField(input, field) {
        const value = input.value.trim();
        const pattern = patterns[field];
        const errorContainer = input.nextElementSibling;

        if (!pattern.test(value)) {
            input.classList.add('error');
            if (errorContainer && errorContainer.classList.contains('error-message')) {
                errorContainer.textContent = errorMessages[field];
                errorContainer.style.display = 'block';
            }
            return false;
        } else {
            input.classList.remove('error');
            if (errorContainer && errorContainer.classList.contains('error-message')) {
                errorContainer.style.display = 'none';
            }
            return true;
        }
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            const field = input.getAttribute('name');
            if (!validateField(input, field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please correct the errors before submitting.', 'error');
            return;
        }

        isSubmitting = true;
        submitButton.disabled = true;
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';

        try {
            // Replace with your actual form submission logic
            const formData = new FormData(form);
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to send message');

            showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// Performance Optimization
function initPerformance() {
    // Lazy loading images
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

    // Debounce function
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

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance monitoring
    if (window.performance) {
        const perf = window.performance;
        const perfData = {
            dns: perf.timing.domainLookupEnd - perf.timing.domainLookupStart,
            tcp: perf.timing.connectEnd - perf.timing.connectStart,
            ttfb: perf.timing.responseStart - perf.timing.requestStart,
            domLoad: perf.timing.domContentLoadedEventEnd - perf.timing.navigationStart,
            windowLoad: perf.timing.loadEventEnd - perf.timing.navigationStart
        };

        console.log('Performance metrics:', perfData);
    }

    // Monitor FPS
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;

    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            if (fps < 30) {
                console.warn('Low FPS detected:', fps);
                document.body.classList.add('reduce-animations');
            } else {
                document.body.classList.remove('reduce-animations');
            }
        }
        
        requestAnimationFrame(checkFPS);
    }

    requestAnimationFrame(checkFPS);
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto close
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Footer Functionality
function initFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Newsletter form
    const newsletterForm = footer.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            try {
                // Replace with your newsletter subscription logic
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) throw new Error('Subscription failed');
                
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterForm.reset();
            } catch (error) {
                showNotification('Failed to subscribe. Please try again.', 'error');
            }
        });
    }

    // Scroll to top button
    const scrollTopBtn = footer.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('show', window.pageYOffset > 300);
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initPortfolio();
    initCarousels();
    initContactForm();
    initPerformance();
    initFooter();
});
