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

    // Enhanced Mobile Navigation
    const initMobileNav = () => {
        const hamburgerBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        const header = document.querySelector('.header');

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                hamburgerBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                body.classList.toggle('menu-open');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburgerBtn.contains(e.target) && 
                    !navMenu.contains(e.target) && 
                    navMenu.classList.contains('active')) {
                    hamburgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            });

            // Close mobile menu when clicking a link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                });
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

    // Interactive Gradient Background
    const initInteractiveGradients = () => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const background = section.querySelector('.section-background');
            const mesh = section.querySelector('.gradient-mesh');
            const orbs = section.querySelectorAll('.gradient-orb');
            
            if (background && mesh) {
                section.addEventListener('mousemove', (e) => {
                    const rect = section.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    
                    mesh.style.setProperty('--mouse-x', `${x}%`);
                    mesh.style.setProperty('--mouse-y', `${y}%`);

                    // Move orbs slightly based on mouse position
                    orbs.forEach((orb, index) => {
                        const factor = (index + 1) * 0.1;
                        const orbX = (x - 50) * factor;
                        const orbY = (y - 50) * factor;
                        orb.style.transform = `translate(${orbX}px, ${orbY}px)`;
                    });
                });

                // Reset orbs position on mouse leave
                section.addEventListener('mouseleave', () => {
                    orbs.forEach(orb => {
                        orb.style.transform = 'translate(0, 0)';
                    });
                });
            }
        });
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

    // Error Handling
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

    // Notification System
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

    // Team Card Flip Effect
    const initTeamCards = () => {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            const flipBtns = card.querySelectorAll('.flip-btn');
            
            flipBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    card.classList.toggle('flipped');
                });
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

    // Smooth Scroll
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
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

    // Initialize all features
    initMobileNav();
    initInteractiveGradients();
    initForms();
    initTeamCards();
    initBackToTop();
    initSmoothScroll();

    // Handle resize events efficiently
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            AOS.refresh();
        }, 250);
    });

    // Error Boundary
    window.onerror = (msg, url, lineNo, columnNo, error) => {
        console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo, '\nColumn: ', columnNo, '\nError object: ', error);
        showNotification('Something went wrong. Please refresh the page.', 'error');
        return false;
    };
});
