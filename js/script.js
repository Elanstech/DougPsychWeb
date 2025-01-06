// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        disable: window.innerWidth < 768
    });

    // Initialize Hero Slider
    const heroSwiper = new Swiper('.hero-slider', {
        slidesPerView: 1,
        effect: 'fade',
        speed: 1000,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: (index, className) => {
                return `<span class="${className}"></span>`;
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    // Enhanced Services Carousel
    const servicesSwiper = new Swiper('.services-carousel', {
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

    // Enhanced Team Carousel
    const teamSwiper = new Swiper('.team-carousel', {
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

    // Enhanced Mobile Navigation
    const initMobileNav = () => {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const body = document.body;
        const header = document.querySelector('.header');

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                hamburgerBtn.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                body.classList.toggle('menu-open');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-menu') && 
                !e.target.closest('.hamburger-btn') && 
                mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburgerBtn?.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });

        // Enhanced Scroll Behavior
        let lastScroll = 0;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Clear the timeout if it exists
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Add/remove scrolled class
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (!body.classList.contains('menu-open')) {
                if (currentScroll > lastScroll && currentScroll > 500) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }

            lastScroll = currentScroll;

            // Set a timeout to remove the transform after scrolling stops
            scrollTimeout = setTimeout(() => {
                header.style.transform = 'translateY(0)';
            }, 1000);
        });
    };

    // Enhanced Smooth Scroll
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    const hamburgerBtn = document.querySelector('.hamburger-btn');
                    if (mobileMenu?.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        hamburgerBtn?.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }

                    // Calculate offset based on header height
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Enhanced Back to Top Button
    const initBackToTop = () => {
        const backToTopButton = document.getElementById('backToTop');
        
        if (backToTopButton) {
            const toggleBackToTop = () => {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            };

            window.addEventListener('scroll', toggleBackToTop);

            backToTopButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // Enhanced Form Handling
    const initForms = () => {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Handle floating labels
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Check initial state
                if (input.value.trim()) {
                    input.closest('.form-group')?.classList.add('filled');
                }

                // Handle focus events
                input.addEventListener('focus', () => {
                    input.closest('.form-group')?.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    input.closest('.form-group')?.classList.remove('focused');
                    if (input.value.trim()) {
                        input.closest('.form-group')?.classList.add('filled');
                    } else {
                        input.closest('.form-group')?.classList.remove('filled');
                    }
                });

                // Handle change events for select elements
                if (input.tagName.toLowerCase() === 'select') {
                    input.addEventListener('change', () => {
                        if (input.value) {
                            input.closest('.form-group')?.classList.add('filled');
                        } else {
                            input.closest('.form-group')?.classList.remove('filled');
                        }
                    });
                }
            });

            // Enhanced form submission
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
                            input.closest('.form-group')?.classList.remove('filled', 'focused');
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
    };

    // Form Validation
    const validateForm = (form) => {
        let isValid = true;
        const inputs = form.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            removeError(input);
            
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    };

    const validateField = (field) => {
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
    };

    // Enhanced Error Handling
    const showError = (parent, message) => {
        parent.classList.add('error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        parent.appendChild(error);
    };

    const removeError = (input) => {
        const parent = input.closest('.form-group');
        parent.classList.remove('error');
        const error = parent.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    };

    // Validation Helpers
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPhone = (phone) => {
        return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
    };

    // Enhanced Notification System
    window.showNotification = (message, type = 'success') => {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
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
    };

    // Enhanced Book Cover Effect
    const initBookCover = () => {
        const bookCover = document.querySelector('.book-cover');
        if (bookCover) {
            bookCover.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = bookCover.getBoundingClientRect();
                const x = (e.clientX - left) / width;
                const y = (e.clientY - top) / height;
                
                const rotateY = (x - 0.5) * 30;
                const rotateX = (y - 0.5) * -30;
                
                bookCover.style.transform = `
                    perspective(1000px)
                    rotateY(${rotateY}deg)
                    rotateX(${rotateX}deg)
                    scale3d(1.05, 1.05, 1.05)
                `;
            });

            bookCover.addEventListener('mouseleave', () => {
                bookCover.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
            });
        }
    };

    // Enhanced Lazy Loading
    const initLazyLoading = () => {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => lazyLoadObserver.observe(img));
        }
    };

    // Initialize all features
    initMobileNav();
    initSmoothScroll();
    initBackToTop();
    initForms();
    initBookCover();
    initLazyLoading();

    // Enhance performance with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Update any scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle resize events efficiently
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update any size-dependent layouts here
            AOS.refresh();
        }, 250);
    });
});
