// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAllComponents();
});

// Main initialization function
function initializeAllComponents() {
    initHeader();
    initHeroSlider();
    initMobileNav();
    initServices();
    initAboutSection();
    initTeamSection();
    initBookSection();
    initLocationsNew();
    initContactSection();
    initBackToTop();
    initAOS();
}

// Header Functionality
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let isScrollingDown = false;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        if (!document.body.classList.contains('menu-open')) {
            if (currentScroll > lastScroll && !isScrollingDown && currentScroll > 200) {
                isScrollingDown = true;
                header.style.transform = 'translateY(-100%)';
            } else if (currentScroll < lastScroll && isScrollingDown) {
                isScrollingDown = false;
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
    });
}

// Mobile Navigation
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Hero Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.nav-dot');
    const progress = document.querySelector('.progress');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000;
    let startTime;

    function updateProgress(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progressPercent = (elapsed / slideDuration) * 100;
        
        if (progress) {
            progress.style.height = `${Math.min(progressPercent, 100)}%`;
        }

        if (elapsed < slideDuration) {
            requestAnimationFrame(updateProgress);
        }
    }

    function showSlide(index) {
        if (progress) progress.style.height = '0%';
        startTime = null;
        requestAnimationFrame(updateProgress);

        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.zIndex = 1;
        });
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        slides[index].style.zIndex = 2;
        dots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            showSlide(currentSlide);
            startSlideshow();
        }
    });

    window.addEventListener('focus', () => {
        showSlide(currentSlide);
        startSlideshow();
    });

    window.addEventListener('blur', () => {
        stopSlideshow();
    });

    showSlide(0);
    startSlideshow();
}

// Services Section
function initServices() {
    const servicesSwiper = new Swiper('.services-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
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
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            servicesSwiper.update();
        }, 250);
    });
}
// About Section Implementation
function initAboutSection() {
    // Content Block Rotation
    const contentBlocks = document.querySelectorAll('.content-block');
    const navigationDots = document.querySelectorAll('.navigation-dots .dot');
    let currentBlockIndex = 0;
    let autoplayInterval;
    let isHovered = false;

    // Show specific content block
    function showBlock(index) {
        contentBlocks.forEach(block => {
            block.classList.remove('active');
            block.style.opacity = '0';
            block.style.visibility = 'hidden';
        });
        navigationDots.forEach(dot => {
            dot.classList.remove('active');
        });

        contentBlocks[index].classList.add('active');
        contentBlocks[index].style.opacity = '1';
        contentBlocks[index].style.visibility = 'visible';
        navigationDots[index].classList.add('active');
        currentBlockIndex = index;
    }

    // Automatically advance to next block
    function showNextBlock() {
        if (!isHovered) {
            const nextIndex = (currentBlockIndex + 1) % contentBlocks.length;
            showBlock(nextIndex);
        }
    }

    // Start autoplay functionality
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(showNextBlock, 5000);
    }

    // Stop autoplay functionality
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Initialize navigation dots
    navigationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showBlock(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Handle hover states
    const aboutContent = document.querySelector('.about-content-blocks');
    if (aboutContent) {
        aboutContent.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoplay();
        });

        aboutContent.addEventListener('mouseleave', () => {
            isHovered = false;
            startAutoplay();
        });
    }

    // Initialize credential hover effects
    initCredentials();

    // Initialize feature items
    initFeatureItems();

    // Start the rotation
    showBlock(0);
    startAutoplay();
}

function initCredentials() {
    const credentials = document.querySelectorAll('.credential');
    credentials.forEach(credential => {
        credential.addEventListener('mouseenter', () => {
            credential.style.transform = 'translateX(10px)';
            credential.style.backgroundColor = 'rgba(26, 35, 126, 0.05)';
        });

        credential.addEventListener('mouseleave', () => {
            credential.style.transform = 'translateX(0)';
            credential.style.backgroundColor = 'transparent';
        });
    });
}

function initFeatureItems() {
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.feature-icon i');
            if (icon) icon.style.transform = 'scale(1.2) rotate(10deg)';
            item.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.feature-icon i');
            if (icon) icon.style.transform = 'scale(1) rotate(0)';
            item.style.transform = 'translateY(0)';
        });
    });
}

// Team Section Implementation
function initTeamSection() {
    const teamSwiper = new Swiper('.team-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
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
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1400: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    });

    // Team member card animations
    const teamCards = document.querySelectorAll('.team-member-card');
    teamCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Team stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };
        updateCount();
    });

    // Social links interaction
    initSocialLinks();

    return teamSwiper;
}

function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('i');
            if (icon) icon.style.transform = 'scale(1.2)';
        });

        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('i');
            if (icon) icon.style.transform = 'scale(1)';
        });

        if (link.href.includes('mailto:')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const email = link.href.replace('mailto:', '');
                navigator.clipboard.writeText(email)
                    .then(() => showToast('Email copied to clipboard!'))
                    .catch(err => console.error('Failed to copy email:', err));
            });
        }
    });
}

// Book Section Implementation
[Previous book section code remains the same...]

// Locations Section Implementation
function initLocationsNew() {
    const locationCards = document.querySelectorAll('.location-card-new');
    locationCards.forEach(card => {
        // Card hover effects
        card.addEventListener('mouseenter', () => {
            const image = card.querySelector('.location-image img');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            const image = card.querySelector('.location-image img');
            if (image) {
                image.style.transform = 'scale(1.0)';
            }
            card.style.transform = 'translateY(0)';
        });
    });

    // Feature cards animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon-new i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.feature-icon-new i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
            card.style.transform = 'translateY(0)';
        });
    });

    // Virtual tour functionality
    const tourButtons = document.querySelectorAll('.btn-tour-new');
    tourButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Virtual tour feature coming soon!');
        });
    });

    // Direction buttons
    initDirectionButtons();
}

function initDirectionButtons() {
    const directionButtons = document.querySelectorAll('.btn-directions-new');
    directionButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
}

// Contact Section Implementation
function initContactSection() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        initFormFields();
    }

    initEmergencyInfo();
    initSocialIcons();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showToast('Message sent successfully! We will get back to you soon.');
        e.target.reset();
    } catch (error) {
        showToast('An error occurred. Please try again.');
        console.error('Form submission error:', error);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function initFormFields() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');

        if (input && label) {
            if (input.value) {
                label.classList.add('active');
            }

            input.addEventListener('focus', () => {
                label.classList.add('active');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
        }
    });
}

function initEmergencyInfo() {
    const emergencyNumbers = document.querySelectorAll('.emergency-info a');
    emergencyNumbers.forEach(number => {
        number.addEventListener('click', (e) => {
            if (!confirm('This will initiate a phone call. Continue?')) {
                e.preventDefault();
            }
        });
    });
}

function initSocialIcons() {
    const socialLinks = document.querySelectorAll('.footer-social a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
            }
        });

        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Utility Functions
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Book Section Implementation
function initBookSection() {
    const book = document.querySelector('.book');
    const bookWrapper = document.querySelector('.book-wrapper');
    
    if (book && bookWrapper) {
        let isAnimating = true;

        // Initial state
        book.style.animation = 'float 6s ease-in-out infinite';

        bookWrapper.addEventListener('mouseenter', () => {
            if (isAnimating) {
                book.style.animation = 'none';
                book.style.transform = 'rotateY(-15deg) translateY(0)';
                isAnimating = false;
            }
        });

        bookWrapper.addEventListener('mouseleave', () => {
            book.style.animation = 'float 6s ease-in-out infinite';
            book.style.transform = 'rotateY(-30deg) translateY(0)';
            isAnimating = true;
        });

        // Touch events for mobile
        bookWrapper.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isAnimating) {
                book.style.animation = 'none';
                book.style.transform = 'rotateY(-15deg) translateY(0)';
                isAnimating = false;
            }
        });

        bookWrapper.addEventListener('touchend', () => {
            book.style.animation = 'float 6s ease-in-out infinite';
            book.style.transform = 'rotateY(-30deg) translateY(0)';
            isAnimating = true;
        });
    }

    // Handle highlights hover effects
    const highlights = document.querySelectorAll('.highlight-item');
    highlights.forEach(item => {
        const icon = item.querySelector('.highlight-icon i');
        
        item.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'rotate(360deg)';
            }
            item.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'rotate(0)';
            }
            item.style.transform = 'translateY(0)';
        });
    });

    // Price tag animation
    const priceTag = document.querySelector('.price-tag');
    if (priceTag) {
        priceTag.addEventListener('mouseenter', () => {
            priceTag.style.transform = 'rotate(15deg) scale(1.05)';
        });

        priceTag.addEventListener('mouseleave', () => {
            priceTag.style.transform = 'rotate(15deg)';
        });
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// AOS (Animate on Scroll) Initialization
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease',
            once: true,
            mirror: false,
            disable: 'mobile'
        });
    }
}

// Handle smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Handle loading states
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

// Handle window resize events
let globalResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(globalResizeTimer);
    globalResizeTimer = setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
});
