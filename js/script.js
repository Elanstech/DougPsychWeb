/**
 * DougPsychWeb Main JavaScript
 * @version 1.0.0
 * @lastUpdated 2025-02-07
 */

// ===============================
// INITIALIZATION & UTILITIES
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    initializeAllComponents();
});

function initializeAllComponents() {
    // Core components
    initHeader();
    initMobileNav();
    initHeroSlider();
    
    // Main sections
    initServices();
    initAboutSection();
    initTeamSection();
    initBookSection();
    initLocationsSection();
    initContactSection();
    
    // Utilities
    initSmoothScroll();
    initIntersectionObservers();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease',
            once: true,
            mirror: false
        });
    }
}

// Global Utilities
function debounce(func, wait = 250) {
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

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

function initIntersectionObservers() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });
}

// ===============================
// HEADER & NAVIGATION
// ===============================
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let isScrollingDown = false;
    const scrollThreshold = 100;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Handle header visibility
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
    };

    window.addEventListener('scroll', debounce(handleScroll, 10));
}

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    // Event Listeners
    navToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}
// ===============================
// HERO SECTION
// ===============================
function initHeroSlider() {
    const state = {
        slides: document.querySelectorAll('.hero-slider .slide'),
        dots: document.querySelectorAll('.nav-dot'),
        progress: document.querySelector('.progress'),
        currentSlide: 0,
        slideInterval: null,
        slideDuration: 5000,
        startTime: null,
        isHovered: false
    };

    function updateProgress(timestamp) {
        if (!state.startTime) state.startTime = timestamp;
        const elapsed = timestamp - state.startTime;
        const progressPercent = (elapsed / state.slideDuration) * 100;

        if (state.progress) {
            state.progress.style.height = `${Math.min(progressPercent, 100)}%`;
        }

        if (elapsed < state.slideDuration) {
            requestAnimationFrame(updateProgress);
        }
    }

    function showSlide(index) {
        // Reset progress
        if (state.progress) state.progress.style.height = '0%';
        state.startTime = null;
        requestAnimationFrame(updateProgress);

        // Update slides
        state.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.zIndex = 1;
        });
        state.dots.forEach(dot => dot.classList.remove('active'));

        state.slides[index].classList.add('active');
        state.slides[index].style.zIndex = 2;
        state.dots[index].classList.add('active');

        state.currentSlide = index;
    }

    function nextSlide() {
        if (!state.isHovered) {
            showSlide((state.currentSlide + 1) % state.slides.length);
        }
    }

    function startSlideshow() {
        if (state.slideInterval) clearInterval(state.slideInterval);
        state.slideInterval = setInterval(nextSlide, state.slideDuration);
    }

    function stopSlideshow() {
        if (state.slideInterval) {
            clearInterval(state.slideInterval);
            state.slideInterval = null;
        }
    }

    // Initialize event listeners
    state.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });

    // Handle service items interactions
    const serviceItems = document.querySelectorAll('.services-list li');
    serviceItems.forEach((item, index) => {
        // Initial state and animation
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 200 + (index * 100));

        // Hover effects
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px)';
            item.querySelector('.service-item').style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
            item.querySelector('.service-item').style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        });
    });

    // Handle visibility and focus changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            showSlide(state.currentSlide);
            startSlideshow();
        }
    });

    window.addEventListener('focus', () => {
        showSlide(state.currentSlide);
        startSlideshow();
    });

    window.addEventListener('blur', () => {
        stopSlideshow();
    });

    // Handle slider hover
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            state.isHovered = true;
        });
        sliderContainer.addEventListener('mouseleave', () => {
            state.isHovered = false;
        });
    }

    // Initialize slider
    showSlide(0);
    startSlideshow();
}

// ===============================
// SERVICES SECTION
// ===============================
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
            prevEl: '.swiper-button-prev'
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
                if (typeof AOS !== 'undefined') AOS.refresh();
            },
            slideChange: function() {
                if (typeof AOS !== 'undefined') AOS.refresh();
            }
        }
    });

    // Handle window resize
    const handleResize = debounce(() => {
        servicesSwiper.update();
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    return servicesSwiper;
}
// ===============================
// ABOUT SECTION
// ===============================
function initAboutSection() {
    const state = {
        contentBlocks: document.querySelectorAll('.content-block'),
        navigationDots: document.querySelectorAll('.navigation-dots .dot'),
        currentBlockIndex: 0,
        autoplayInterval: null,
        isHovered: false,
        autoplayDuration: 5000
    };

    function showBlock(index) {
        state.contentBlocks.forEach(block => {
            block.classList.remove('active');
            block.style.opacity = '0';
            block.style.visibility = 'hidden';
        });
        state.navigationDots.forEach(dot => dot.classList.remove('active'));

        state.contentBlocks[index].classList.add('active');
        state.contentBlocks[index].style.opacity = '1';
        state.contentBlocks[index].style.visibility = 'visible';
        state.navigationDots[index].classList.add('active');

        state.currentBlockIndex = index;
    }

    function autoplayControls() {
        function showNextBlock() {
            if (!state.isHovered) {
                const nextIndex = (state.currentBlockIndex + 1) % state.contentBlocks.length;
                showBlock(nextIndex);
            }
        }

        function startAutoplay() {
            if (state.autoplayInterval) clearInterval(state.autoplayInterval);
            state.autoplayInterval = setInterval(showNextBlock, state.autoplayDuration);
        }

        function stopAutoplay() {
            if (state.autoplayInterval) {
                clearInterval(state.autoplayInterval);
                state.autoplayInterval = null;
            }
        }

        return { showNextBlock, startAutoplay, stopAutoplay };
    }

    // Initialize navigation dots
    state.navigationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const { startAutoplay } = autoplayControls();
            showBlock(index);
            startAutoplay();
        });
    });

    // Initialize hover effects
    const aboutContent = document.querySelector('.about-content-blocks');
    if (aboutContent) {
        aboutContent.addEventListener('mouseenter', () => {
            state.isHovered = true;
            autoplayControls().stopAutoplay();
        });
        aboutContent.addEventListener('mouseleave', () => {
            state.isHovered = false;
            autoplayControls().startAutoplay();
        });
    }

    // Initialize credential effects
    initCredentialEffects();

    // Initialize feature item effects
    initFeatureItemEffects();

    // Initialize "View More" button
    initViewMoreButton();

    // Start autoplay
    showBlock(0);
    autoplayControls().startAutoplay();
}

function initCredentialEffects() {
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
}

function initFeatureItemEffects() {
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.feature-icon i');
            if (icon) icon.style.transform = 'scale(1.2)';
            item.style.transform = 'translateY(-5px)';
        });
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.feature-icon i');
            if (icon) icon.style.transform = 'scale(1)';
            item.style.transform = 'translateY(0)';
        });
    });
}

function initViewMoreButton() {
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

        const handleArrowAnimation = (e) => {
            const arrow = viewMoreBtn.querySelector('i');
            if (arrow) {
                arrow.style.transform = e.type === 'mouseenter' ? 
                    'translateX(5px)' : 'translateX(0)';
            }
        };

        viewMoreBtn.addEventListener('mouseenter', handleArrowAnimation);
        viewMoreBtn.addEventListener('mouseleave', handleArrowAnimation);
    }
}

// ===============================
// TEAM SECTION
// ===============================
function initTeamSection() {
    const teamSwiper = new Swiper('.team-carousel', {
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 3
        },
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        on: {
            init: function() {
                handleTeamCardsAnimation();
                initializeTeamCardInteractions();
            },
            slideChangeTransitionStart: function() {
                handleTeamCardsAnimation();
            }
        }
    });

    initTeamComponents();
    
    return teamSwiper;
}

function initTeamComponents() {
    initializeImageLoading();
    initializeSectionTransitions();
    handleWindowResize();
    setupVisibilityHandlers();
}
// ===============================
// BOOK SECTION
// ===============================
function initBookSection() {
    const state = {
        previewSlides: document.querySelectorAll('.preview-slide'),
        navigationDots: document.querySelectorAll('.preview-nav .nav-dot'),
        currentSlide: 0,
        previewInterval: null,
        isPreviewHovered: false,
        autoplayDuration: 5000
    };

    function showSlide(index) {
        state.previewSlides.forEach(slide => slide.classList.remove('active'));
        state.navigationDots.forEach(dot => dot.classList.remove('active'));
        state.previewSlides[index].classList.add('active');
        state.navigationDots[index].classList.add('active');
        state.currentSlide = index;
    }

    function initBookPreview() {
        function nextSlide() {
            if (!state.isPreviewHovered) {
                showSlide((state.currentSlide + 1) % state.previewSlides.length);
            }
        }

        function startPreviewAutoplay() {
            if (state.previewInterval) clearInterval(state.previewInterval);
            state.previewInterval = setInterval(nextSlide, state.autoplayDuration);
        }

        // Navigation dots
        state.navigationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startPreviewAutoplay();
            });
        });

        return { startPreviewAutoplay };
    }

    function init3DBookEffect() {
        const book = document.querySelector('.book');
        const bookWrapper = document.querySelector('.book-wrapper');
        
        if (book && bookWrapper) {
            const handleBookInteraction = (isHovered) => {
                bookWrapper.style.animationPlayState = isHovered ? 'paused' : 'running';
                book.style.transform = `rotateY(${isHovered ? '-15deg' : '-30deg'})`;
            };

            book.addEventListener('mouseenter', () => handleBookInteraction(true));
            book.addEventListener('mouseleave', () => handleBookInteraction(false));
            book.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleBookInteraction(true);
            });
            book.addEventListener('touchend', () => handleBookInteraction(false));
        }
    }

    function initPurchaseButtons() {
        const purchaseButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        purchaseButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    // Initialize all book section components
    const { startPreviewAutoplay } = initBookPreview();
    init3DBookEffect();
    initPurchaseButtons();
    showSlide(0);
    startPreviewAutoplay();
}

// ===============================
// LOCATIONS SECTION
// ===============================
function initLocationsSection() {
    const state = {
        locationCards: document.querySelectorAll('.location-card'),
        images: document.querySelectorAll('.location-image img'),
        directionButtons: document.querySelectorAll('.btn-directions')
    };

    function initLocationCards() {
        state.locationCards.forEach(card => {
            const handleHover = (isHovered) => {
                card.style.transform = isHovered ? 'translateY(-10px)' : 'translateY(0)';
                const image = card.querySelector('.location-image img');
                if (image) {
                    image.style.transform = isHovered ? 'scale(1.1)' : 'scale(1)';
                }
            };

            card.addEventListener('mouseenter', () => handleHover(true));
            card.addEventListener('mouseleave', () => handleHover(false));
            card.addEventListener('touchstart', () => handleHover(true));
            card.addEventListener('touchend', () => handleHover(false));
        });
    }

    function initDirectionButtons() {
        state.directionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'get_directions', {
                        'location': button.closest('.location-card').querySelector('h3').textContent
                    });
                }
            });
        });
    }

    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.onload = () => {
                                img.classList.add('loaded');
                                observer.unobserve(img);
                            };
                        }
                    }
                });
            });

            state.images.forEach(img => imageObserver.observe(img));
        }
    }

    // Initialize components
    initLocationCards();
    initDirectionButtons();
    initLazyLoading();
}

// ===============================
// CONTACT SECTION
// ===============================
function initContactSection() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        initFormHandling(contactForm);
        initFormLabels(contactForm);
    }

    initBackToTop();
    initFooterInteractions();
}

function initFormHandling(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showToast('Message sent successfully! We will get back to you soon.');
            form.reset();
        } catch (error) {
            showToast('An error occurred. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function initFormLabels(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            if (input.value) label.classList.add('active');
            
            input.addEventListener('focus', () => label.classList.add('active'));
            input.addEventListener('blur', () => {
                if (!input.value) label.classList.remove('active');
            });
        }
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', debounce(() => {
            backToTop.classList.toggle('visible', window.pageYOffset > 500);
        }, 100));

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Export modules if using a module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAllComponents,
        initHeader,
        initHeroSlider,
        initServices,
        initAboutSection,
        initTeamSection,
        initBookSection,
        initLocationsSection,
        initContactSection
    };
}
