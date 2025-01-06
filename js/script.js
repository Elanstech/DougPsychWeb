// Modern JavaScript with Enhanced Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with enhanced settings
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        disable: window.innerWidth < 768
    });

    // Enhanced Hero Slider
    const heroSwiper = new Swiper('.hero-slider', {
        slidesPerView: 1,
        effect: 'fade',
        speed: 1500,
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
        },
        on: {
            slideChange: () => {
                // Reset and play animations for active slide
                const activeSlide = document.querySelector('.swiper-slide-active');
                if (activeSlide) {
                    const content = activeSlide.querySelector('.slide-content');
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }, 100);
                }
            }
        }
    });

    // Services Carousel with Coverflow Effect
    const servicesSwiper = new Swiper('.services-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
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

    // Team Carousel with Cube Effect
    const teamSwiper = new Swiper('.team-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        effect: 'cube',
        grabCursor: true,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
        },
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                effect: 'slide',
            },
            1024: {
                slidesPerView: 3,
                effect: 'slide',
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

            // Enhanced mobile menu animations
            const menuItems = mobileMenu.querySelectorAll('.nav-list li');
            menuItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
            });
        }

        // Smart Header Behavior
        let lastScroll = 0;
        let scrollTimeout;
        let ticking = false;

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Enhanced header behavior
                    if (currentScroll > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }

                    // Smart hide/show header
                    if (!body.classList.contains('menu-open')) {
                        if (currentScroll > lastScroll && currentScroll > 500) {
                            header.style.transform = 'translateY(-100%)';
                        } else {
                            header.style.transform = 'translateY(0)';
                        }
                    }

                    lastScroll = currentScroll;
                    ticking = false;
                });

                ticking = true;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                header.style.transform = 'translateY(0)';
            }, 1000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
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
                    const offsetPosition = targetPosition - headerHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Back to Top Button
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

            window.addEventListener('scroll', toggleBackToTop, { passive: true });

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
            // Enhanced floating labels
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                const checkValue = () => {
                    if (input.value.trim()) {
                        input.closest('.form-group')?.classList.add('filled');
                    } else {
                        input.closest('.form-group')?.classList.remove('filled');
                    }
                };

                // Check initial state
                checkValue();

                // Handle focus events
                input.addEventListener('focus', () => {
                    input.closest('.form-group')?.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    input.closest('.form-group')?.classList.remove('focused');
                    checkValue();
                });

                // Handle change events for select elements
                if (input.tagName.toLowerCase() === 'select') {
                    input.addEventListener('change', checkValue);
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

    // Enhanced Form Validation
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
        
        // Shake animation
        parent.style.animation = 'shake 0.5s ease';
        parent.addEventListener('animationend', () => {
            parent.style.animation = '';
        });
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
    const showNotification = (message, type = 'success') => {
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

    // Initialize all features
    initMobileNav();
    initSmoothScroll();
    initBackToTop();
    initForms();
    initBookCover();

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

    // Add CSS animations
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                    }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
    `);

    // Enhanced Parallax Effects
    const initParallax = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                parallaxElements.forEach(element => {
                    const speed = element.dataset.parallax || 0.5;
                    const rect = element.getBoundingClientRect();
                    const visible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (visible) {
                        const yOffset = window.pageYOffset;
                        element.style.transform = `translateY(${yOffset * speed}px)`;
                    }
                });
            });
        });
    };

    // Enhanced Service Card Interactions
    const initServiceCards = () => {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.service-icon i');
                if (icon) {
                    icon.style.animation = 'rotate 0.6s ease-in-out';
                }
                
                // Add hover effect to list items
                const listItems = card.querySelectorAll('.service-features li');
                listItems.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 0.1}s`;
                    item.style.transform = 'translateX(10px)';
                });
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon i');
                if (icon) {
                    icon.style.animation = 'none';
                }
                
                // Reset list items
                const listItems = card.querySelectorAll('.service-features li');
                listItems.forEach(item => {
                    item.style.transitionDelay = '0s';
                    item.style.transform = 'translateX(0)';
                });
            });
        });
    };

    // Enhanced Location Cards
    const initLocationCards = () => {
        const locationCards = document.querySelectorAll('.location-card');
        
        locationCards.forEach(card => {
            // Hover effects for detail items
            const detailItems = card.querySelectorAll('.detail-item');
            detailItems.forEach((item, index) => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateX(10px)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateX(0)';
                });
            });

            // Map interaction
            const map = card.querySelector('.location-map iframe');
            if (map) {
                map.addEventListener('load', () => {
                    map.style.opacity = '1';
                });
            }
        });
    };

    // Enhanced Team Card Interactions
    const initTeamCards = () => {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            const socialLinks = card.querySelectorAll('.team-social a');
            
            card.addEventListener('mouseenter', () => {
                socialLinks.forEach((link, index) => {
                    link.style.transitionDelay = `${index * 0.1}s`;
                    link.style.transform = 'translateY(-5px)';
                });
            });

            card.addEventListener('mouseleave', () => {
                socialLinks.forEach(link => {
                    link.style.transitionDelay = '0s';
                    link.style.transform = 'translateY(0)';
                });
            });
        });
    };

    // Performance Monitoring
    const initPerformanceMonitoring = () => {
        // Monitor load time
        window.addEventListener('load', () => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });

        // Monitor FPS
        let fps = 60;
        let frameCount = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            const now = performance.now();
            frameCount++;

            if (now > lastTime + 1000) {
                fps = Math.round((frameCount * 1000) / (now - lastTime));
                frameCount = 0;
                lastTime = now;
                
                if (fps < 30) {
                    console.warn(`Low FPS detected: ${fps}`);
                    // Disable intensive animations if needed
                }
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    };

    // Initialize enhanced features
    initParallax();
    initServiceCards();
    initLocationCards();
    initTeamCards();
    initPerformanceMonitoring();

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
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

    // Custom Event Handlers
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations and heavy calculations
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
            // Resume animations
            AOS.refresh();
        }
    });

    // Error Boundary
    window.onerror = (msg, url, lineNo, columnNo, error) => {
        console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo, '\nColumn: ', columnNo, '\nError object: ', error);
        showNotification('Something went wrong. Please refresh the page.', 'error');
        return false;
    };

    // Initialize widgets after delay for performance
    setTimeout(() => {
        // Add any additional widget initializations here
        console.log('Widgets initialized');
    }, 2000);
});
