// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
});

function initAboutPage() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease',
        once: true,
        mirror: false
    });

    // Initialize all components
    initHeader();
    initHeroParallax();
    initSmoothScrolling();
    initContentAnimations();
}

// Header Functionality
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let isScrollingDown = false;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove header background on scroll
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Hide/show header on scroll direction
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

    // Mobile menu functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu on menu item click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Parallax Effect for Hero Section
function initHeroParallax() {
    const heroSection = document.querySelector('.about-hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
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

// Content Animations
function initContentAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Animate hero quote
    const heroQuote = document.querySelector('.hero-quote');
    if (heroQuote) {
        setTimeout(() => {
            heroQuote.style.opacity = '1';
            heroQuote.style.transform = 'translateY(0)';
        }, 500);
    }

    // Initialize hover effects for content boxes
    initHoverEffects();
}

// Hover Effects for Content Boxes
function initHoverEffects() {
    const contentBoxes = document.querySelectorAll('.philosophy-text, .uniqueness-content, .biography-content');
    
    contentBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'translateY(-5px)';
            box.style.boxShadow = 'var(--shadow-lg)';
        });

        box.addEventListener('mouseleave', () => {
            box.style.transform = 'translateY(0)';
            box.style.boxShadow = 'var(--shadow-md)';
        });
    });

    // CTA Buttons hover effect
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh AOS animations when page becomes visible
        AOS.refresh();
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Refresh animations and layout on resize
        AOS.refresh();
        adjustMobileLayout();
    }, 250);
});

// Adjust layout for mobile devices
function adjustMobileLayout() {
    const isMobile = window.innerWidth <= 768;
    const heroQuote = document.querySelector('.hero-quote');
    
    if (heroQuote) {
        heroQuote.style.fontSize = isMobile ? '1.75rem' : '2.5rem';
    }
}

// Add loading state for images
function handleImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        if (img.complete) {
            img.classList.add('loaded');
        }
    });
}

// Initialize image loading handling
handleImageLoading();

// Export functions for potential use in other scripts
export {
    initAboutPage,
    initHeader,
    initHeroParallax,
    initSmoothScrolling,
    initContentAnimations
};
