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
