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
// About Section Initialization
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
        autoplayInterval = setInterval(showNextBlock, 5000); // Change block every 5 seconds
    }

    // Stop autoplay functionality
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Initialize click events for navigation dots
    navigationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showBlock(index);
            stopAutoplay();
            startAutoplay(); // Reset the timer when manually changing
        });
    });

    // Handle hover states for content area
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

    // Initialize credential items
    const credentials = document.querySelectorAll('.credential');
    credentials.forEach(credential => {
        credential.addEventListener('mouseenter', () => {
            credential.style.backgroundColor = 'rgba(26, 35, 126, 0.05)';
            credential.style.transform = 'translateX(10px)';
        });

        credential.addEventListener('mouseleave', () => {
            credential.style.backgroundColor = 'transparent';
            credential.style.transform = 'translateX(0)';
        });
    });

    // Initialize feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
            }
            item.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
            item.style.transform = 'translateY(0)';
        });
    });

    // View More Button Functionality
    const viewMoreBtn = document.querySelector('.btn-view-more');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(viewMoreBtn.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Hover animation for the button arrow
        viewMoreBtn.addEventListener('mouseenter', () => {
            const arrow = viewMoreBtn.querySelector('i');
            if (arrow) {
                arrow.style.transform = 'translateX(5px)';
            }
        });

        viewMoreBtn.addEventListener('mouseleave', () => {
            const arrow = viewMoreBtn.querySelector('i');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    }

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

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // Handle window focus/blur
    window.addEventListener('focus', () => {
        startAutoplay();
    });

    window.addEventListener('blur', () => {
        stopAutoplay();
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Refresh AOS animations if available
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 250);
    });

    // Initialize the section
    showBlock(0);
    startAutoplay();
}

// Call the initialization function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAboutSection();
});

// Team Section Implementation
function initTeamSection() {
    // Initialize Swiper for team carousel
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
        },
        on: {
            init: function() {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
                initTeamCardsAnimation();
            },
            slideChange: function() {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }
        }
    });

    // Team Cards Animation
    function initTeamCardsAnimation() {
        const cards = document.querySelectorAll('.team-member-card');
        cards.forEach((card, index) => {
            // Set initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Add animation with delay based on index
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Image Loading Optimization
    const teamImages = document.querySelectorAll('.member-image img');
    teamImages.forEach(img => {
        img.loading = 'lazy';
        
        if (img.complete) {
            handleImageLoad(img);
        } else {
            img.addEventListener('load', () => handleImageLoad(img));
        }

        img.addEventListener('error', handleImageError);
    });

    function handleImageLoad(img) {
        img.style.opacity = '1';
        const card = img.closest('.team-member-card');
        if (card) {
            card.classList.add('image-loaded');
        }
    }

    function handleImageError(e) {
        const img = e.target;
        img.src = 'placeholder.jpg'; // Fallback image
        console.error('Error loading team member image:', e);
    }

    // Team Stats Animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50; // Adjust for animation speed
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

    // Social Links Interaction
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        // Hover effects
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

        // Email copy functionality
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

    // View More Button
    const viewMoreBtn = document.querySelector('.btn-view-team');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(viewMoreBtn.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Hover effect for button icon
        viewMoreBtn.addEventListener('mouseenter', () => {
            const icon = viewMoreBtn.querySelector('i');
            if (icon) icon.style.transform = 'translateX(5px)';
        });

        viewMoreBtn.addEventListener('mouseleave', () => {
            const icon = viewMoreBtn.querySelector('i');
            if (icon) icon.style.transform = 'translateX(0)';
        });
    }

    // Toast notification function
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

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            teamSwiper.autoplay.stop();
        } else {
            if (!prefersReducedMotion.matches) {
                teamSwiper.autoplay.start();
            }
        }
    });

    return teamSwiper;
}
// Handle dynamic loading of team member images
window.addEventListener('load', () => {
    document.querySelectorAll('.member-image img').forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
});

   function initBookSection() {
    const book = document.querySelector('.book-3d');
    const wrapper = document.querySelector('.book-wrapper');
    let isHovered = false;

    if (book && wrapper) {
        wrapper.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (x - centerX) / 20;

            book.style.transform = `
                rotateY(${-30 + angleY}deg)
                rotateX(${-angleX}deg)
                translateZ(50px)
            `;
        });

        wrapper.addEventListener('mouseenter', () => {
            isHovered = true;
            book.style.transition = 'transform 0.3s ease';
        });

        wrapper.addEventListener('mouseleave', () => {
            isHovered = false;
            book.style.transition = 'transform 0.8s ease';
            book.style.transform = 'rotateY(-30deg) rotateX(5deg)';
        });

        // Add parallax effect to highlights
        const highlights = document.querySelectorAll('.highlight-card');
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            highlights.forEach((card) => {
                const offsetX = (mouseX - 0.5) * 20;
                const offsetY = (mouseY - 0.5) * 20;
                card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }
}

// Initialize particles.js for background effects
document.addEventListener('DOMContentLoaded', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: '#b49b57' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    out_mode: 'out'
                }
            }
        });
    }
    initBookSection();
});
    
// Locations Section Implementation
function initLocationsNew() {
    // Location Cards Animation
    const locationCards = document.querySelectorAll('.location-card-new');
    locationCards.forEach(card => {
        // Add hover effects
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

        // Handle touch events for mobile
        card.addEventListener('touchstart', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('touchend', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Feature Cards Animation
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

    // Virtual Tour Button Functionality
    const tourButtons = document.querySelectorAll('.btn-tour-new');
    tourButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Placeholder for virtual tour functionality
            alert('Virtual tour feature coming soon!');
        });

        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Direction Button Hover Effects
    const directionButtons = document.querySelectorAll('.btn-directions-new');
    directionButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Initialize AOS animations if AOS is available
    if (typeof AOS !== 'undefined') {
        // Location cards animation
        locationCards.forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
        });

        // Feature cards animation
        featureCards.forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
        });

        // Refresh AOS
        AOS.refresh();
    }

    // Handle Responsive Layout
    function handleResponsiveLayout() {
        const windowWidth = window.innerWidth;
        const locationCards = document.querySelectorAll('.location-card-new');
        
        locationCards.forEach(card => {
            const content = card.querySelector('.location-content-new');
            if (windowWidth <= 768) {
                content.style.padding = '1.5rem';
            } else {
                content.style.padding = '2rem';
            }
        });
    }

    // Initialize responsive layout
    handleResponsiveLayout();

    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResponsiveLayout();
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 250);
    });

    // Add intersection observer for scroll animations
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
    document.querySelectorAll('.location-card-new, .feature-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });

    // Handle image loading
    const locationImages = document.querySelectorAll('.location-image img');
    locationImages.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
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
