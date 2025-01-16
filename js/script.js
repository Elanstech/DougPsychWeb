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
    initTeamSection(); // Added team section initialization
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

// Mobile Navigation Implementation
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu on button click
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
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

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Hero Slider Implementation
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.nav-dot');
    const progress = document.querySelector('.progress');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds per slide
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
        // Reset progress
        if (progress) progress.style.height = '0%';
        startTime = null;
        requestAnimationFrame(updateProgress);

        // Update slides
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

    // Event Listeners for Navigation Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            showSlide(currentSlide);
            startSlideshow();
        }
    });

    // Handle window focus/blur
    window.addEventListener('focus', () => {
        showSlide(currentSlide);
        startSlideshow();
    });

    window.addEventListener('blur', () => {
        stopSlideshow();
    });

    // Initialize
    showSlide(0);
    startSlideshow();

    // Add hover effects for service items
    const serviceItems = document.querySelectorAll('.services-list li');
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
}

// Services Section Implementation
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
        },
        on: {
            init: function() {
                AOS.refresh();
            },
            slideChange: function() {
                AOS.refresh();
            }
        }
    });

    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease',
        once: true,
        mirror: false
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            servicesSwiper.update();
        }, 250);
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
            }
        },
        on: {
            init: function() {
                AOS.refresh();
            },
            slideChange: function() {
                AOS.refresh();
            }
        }
    });

    // Handle team card interactions
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        // Add hover effect for team cards
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Handle social links click
        const socialLinks = card.querySelectorAll('.team-social a');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.classList.contains('copy-email')) {
                    e.preventDefault();
                    const email = this.getAttribute('href').replace('mailto:', '');
                    navigator.clipboard.writeText(email).then(() => {
                        // Could add a toast notification here if desired
                        console.log('Email copied to clipboard');
                    });
                }
            });
        });
    });

    // Handle window resize for team carousel
    let teamResizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(teamResizeTimeout);
        teamResizeTimeout = setTimeout(() => {
            teamSwiper.update();
        }, 250);
    });
}
