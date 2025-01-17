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
    initLocationsSection();
    initContactSection();
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

function initAboutSection() {
    const contentBlocks = document.querySelectorAll('.content-block');
    const navigationDots = document.querySelectorAll('.navigation-dots .dot');
    let currentBlockIndex = 0;
    let autoplayInterval;
    let isHovered = false;

    // Function to show specific content block
    function showBlock(index) {
        contentBlocks.forEach(block => {
            block.classList.remove('active');
        });
        navigationDots.forEach(dot => {
            dot.classList.remove('active');
        });

        contentBlocks[index].classList.add('active');
        navigationDots[index].classList.add('active');
        currentBlockIndex = index;
    }

    // Function to show next block
    function showNextBlock() {
        if (!isHovered) {
            const nextIndex = (currentBlockIndex + 1) % contentBlocks.length;
            showBlock(nextIndex);
        }
    }

    // Initialize autoplay
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(showNextBlock, 5000);
    }

    // Add click event listeners to navigation dots
    navigationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showBlock(index);
            startAutoplay(); // Reset autoplay timer when manually changing
        });
    });

    // Handle hover states
    const aboutContent = document.querySelector('.about-content-blocks');
    if (aboutContent) {
        aboutContent.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        aboutContent.addEventListener('mouseleave', () => {
            isHovered = false;
        });
    }

    // Initialize profile image hover effect
    const profileFrame = document.querySelector('.profile-frame');
    if (profileFrame) {
        profileFrame.addEventListener('mouseenter', () => {
            profileFrame.style.transform = 'perspective(1000px) rotateY(0deg)';
        });

        profileFrame.addEventListener('mouseleave', () => {
            profileFrame.style.transform = 'perspective(1000px) rotateY(-5deg)';
        });
    }

    // Initialize credential item hover effects
    const credentials = document.querySelectorAll('.credential');
    credentials.forEach(credential => {
        credential.addEventListener('mouseenter', () => {
            credential.style.transform = 'translateX(10px)';
            credential.style.background = 'rgba(26, 35, 126, 0.05)';
        });

        credential.addEventListener('mouseleave', () => {
            credential.style.transform = 'translateX(0)';
            credential.style.background = 'transparent';
        });
    });

    // Initialize feature item animations
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            item.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            item.style.transform = 'translateY(0)';
        });
    });

    // Initialize experience marker animation
    const experienceMarker = document.querySelector('.experience-marker');
    if (experienceMarker) {
        let isAnimating = false;

        experienceMarker.addEventListener('mouseenter', () => {
            if (!isAnimating) {
                isAnimating = true;
                experienceMarker.style.animation = 'none';
                experienceMarker.offsetHeight; // Trigger reflow
                experienceMarker.style.animation = 'float 6s ease-in-out infinite';
            }
        });

        experienceMarker.addEventListener('mouseleave', () => {
            isAnimating = false;
        });
    }

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (autoplayInterval) clearInterval(autoplayInterval);
        } else {
            startAutoplay();
        }
    });

    // Handle window focus/blur
    window.addEventListener('focus', () => {
        startAutoplay();
    });

    window.addEventListener('blur', () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
    });

    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.feature-item, .credential').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });

    // Start autoplay on init
    showBlock(0);
    startAutoplay();

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Refresh AOS
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
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
function initBookSection() {
    // Book Preview Carousel
    const previewSlides = document.querySelectorAll('.preview-slide');
    const navigationDots = document.querySelectorAll('.preview-nav .nav-dot');
    let currentSlide = 0;
    let previewInterval;
    let isPreviewHovered = false;

    function showSlide(index) {
        previewSlides.forEach(slide => slide.classList.remove('active'));
        navigationDots.forEach(dot => dot.classList.remove('active'));
        
        previewSlides[index].classList.add('active');
        navigationDots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        if (!isPreviewHovered) {
            showSlide((currentSlide + 1) % previewSlides.length);
        }
    }

    // Initialize preview carousel autoplay
    function startPreviewAutoplay() {
        if (previewInterval) clearInterval(previewInterval);
        previewInterval = setInterval(nextSlide, 5000);
    }

    // Add click events to navigation dots
    navigationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startPreviewAutoplay();
        });
    });

    // Handle preview hover states
    const previewCarousel = document.querySelector('.preview-carousel');
    if (previewCarousel) {
        previewCarousel.addEventListener('mouseenter', () => {
            isPreviewHovered = true;
        });

        previewCarousel.addEventListener('mouseleave', () => {
            isPreviewHovered = false;
        });
    }

    // 3D Book Interaction
    const book = document.querySelector('.book');
    const bookWrapper = document.querySelector('.book-wrapper');
    let isBookHovered = false;

    if (book && bookWrapper) {
        book.addEventListener('mouseenter', () => {
            isBookHovered = true;
            bookWrapper.style.animationPlayState = 'paused';
            book.style.transform = 'rotateY(-15deg)';
        });

        book.addEventListener('mouseleave', () => {
            isBookHovered = false;
            bookWrapper.style.animationPlayState = 'running';
            book.style.transform = 'rotateY(-30deg)';
        });

        // Add touch interaction for mobile
        book.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isBookHovered = true;
            bookWrapper.style.animationPlayState = 'paused';
            book.style.transform = 'rotateY(-15deg)';
        });

        book.addEventListener('touchend', () => {
            isBookHovered = false;
            bookWrapper.style.animationPlayState = 'running';
            book.style.transform = 'rotateY(-30deg)';
        });
    }

    // Platform Buttons Animation
    const platforms = document.querySelectorAll('.platform');
    platforms.forEach(platform => {
        platform.addEventListener('mouseenter', () => {
            platform.style.transform = 'translateY(-5px)';
            const icon = platform.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });

        platform.addEventListener('mouseleave', () => {
            platform.style.transform = 'translateY(0)';
            const icon = platform.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });

    // Purchase Buttons Animation
    const purchaseButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    purchaseButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Badges Animation
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-3px)';
        });

        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0)';
        });
    });

    // Floating Badges Animation
    const floatBadges = document.querySelectorAll('.float-badge');
    floatBadges.forEach((badge, index) => {
        badge.style.animationDelay = `${-index * 2}s`;
    });

    // Handle scroll-based animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.platform, .badge, .preview-slide').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (previewInterval) clearInterval(previewInterval);
        } else {
            startPreviewAutoplay();
        }
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 250);
    });

    // Initialize
    showSlide(0);
    startPreviewAutoplay();
}
function initLocationsSection() {
    // Location Cards Hover Effects
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        const map = card.querySelector('.location-map');
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            if (map) {
                map.style.opacity = '0.9';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            if (map) {
                map.style.opacity = '1';
            }
        });
    });

    // Info Cards Animation
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
            card.style.transform = 'translateY(0)';
        });
    });

    // Button Hover Effects
    const buttons = document.querySelectorAll('.btn-directions, .btn-virtual-tour');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Virtual Tour Button Click Handler
    const virtualTourButtons = document.querySelectorAll('.btn-virtual-tour');
    virtualTourButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Here you can implement virtual tour functionality
            alert('Virtual tour feature coming soon!');
        });
    });

    // Floating Elements Animation
    const floatItems = document.querySelectorAll('.float-item');
    floatItems.forEach((item, index) => {
        item.style.animationDelay = `${-index * 2}s`;
    });

    // Initialize Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.location-card, .info-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });

    // Handle map loading
    const maps = document.querySelectorAll('.location-map iframe');
    maps.forEach(map => {
        map.addEventListener('load', () => {
            map.style.opacity = '1';
        });
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Refresh AOS if available
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 250);
    });
}
function initContactSection() {
    // Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Add loading state to button
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual form submission)
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message (replace with your preferred notification system)
                alert('Message sent successfully! We will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                // Show error message
                alert('An error occurred. Please try again.');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        // Form Field Animations
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');

            if (input && label) {
                // Handle initial state
                if (input.value) {
                    label.classList.add('active');
                }

                // Handle focus events
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

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize footer link hover effects
    const footerLinks = document.querySelectorAll('.footer-links a, .footer-services a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const arrow = link.querySelector('.arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(5px)';
            }
        });

        link.addEventListener('mouseleave', () => {
            const arrow = link.querySelector('.arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    });

    // Social Media Icons Hover Effect
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

    // Handle intersection observer for animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.footer-info, .footer-links, .footer-services, .footer-contact').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });
}
