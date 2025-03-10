// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// Main initialization function
function initializeContactPage() {
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initMapLinks();
    initFaqItems();
    initFormValidation();
    initBackToTop();
    initCardInteractions();
}

/* ======================================
   HEADER FUNCTIONALITY
====================================== */
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

/* ======================================
   MOBILE NAVIGATION
====================================== */
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
    }
}

/* ======================================
   SCROLL ANIMATIONS
====================================== */
function initScrollAnimations() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }

    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
}

/* ======================================
   MAP LINKS FUNCTIONALITY
====================================== */
function initMapLinks() {
    const mapLinks = document.querySelectorAll('.location-link');
    
    mapLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Get the office address from the previous paragraph
            const officeAddress = link.parentElement.querySelector('p').textContent.trim();
            
            // You can customize this to use specific map coordinates if needed
            const encodedAddress = encodeURIComponent(officeAddress);
            const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
            
            // Update the href attribute to ensure it opens with the correct address
            link.setAttribute('href', mapUrl);
        });
    });
}

/* ======================================
   FAQ ITEMS INTERACTION
====================================== */
function initFaqItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                item.style.transform = 'translateY(-5px)';
                item.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
                item.style.borderColor = 'var(--accent-gold-light)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = 'var(--shadow-md)';
                item.style.borderColor = 'var(--neutral-300)';
            }
        });
    });
}

/* ======================================
   FORM VALIDATION & INTERACTION
====================================== */
function initFormValidation() {
    // Most form validation will be handled by the Elfsight widget
    // This is a placeholder for any additional validation you might want to add
    
    // Check if Elfsight is loaded successfully
    const checkElfsightLoaded = setInterval(() => {
        const elfsightWidget = document.querySelector('.elfsight-app-7a063013-7327-45f2-8e58-f32816e4b9f2 .elfsight-app-widget');
        
        if (elfsightWidget) {
            clearInterval(checkElfsightLoaded);
            console.log('Elfsight form loaded successfully');
            
            // You can add additional interactions here if needed
        }
    }, 1000);
    
    // Stop checking after 10 seconds to avoid infinite loop
    setTimeout(() => {
        clearInterval(checkElfsightLoaded);
    }, 10000);
}

/* ======================================
   BACK TO TOP BUTTON
====================================== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ======================================
   CARD INTERACTIONS
====================================== */
function initCardInteractions() {
    const cards = document.querySelectorAll('.location-card, .contact-method-card, .hours-card, .insurance-card');
    
    cards.forEach(card => {
        // Add hover effects for desktop/mouse interactions
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = 'var(--shadow-xl)';
                
                // Change icon background if there's an icon
                const cardIcon = card.querySelector('.card-icon, .insurance-icon');
                if (cardIcon) {
                    cardIcon.style.background = 'var(--gold-gradient)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-lg)';
                
                // Reset icon background
                const cardIcon = card.querySelector('.card-icon, .insurance-icon');
                if (cardIcon && !cardIcon.classList.contains('method-icon')) {
                    cardIcon.style.background = 'var(--primary-blue)';
                }
            });
        }
    });
    
    // Add special handling for contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            method.addEventListener('mouseenter', () => {
                const methodIcon = method.querySelector('.method-icon');
                if (methodIcon) {
                    methodIcon.style.background = 'var(--gold-gradient)';
                    methodIcon.style.transform = 'scale(1.1)';
                }
            });
            
            method.addEventListener('mouseleave', () => {
                const methodIcon = method.querySelector('.method-icon');
                if (methodIcon) {
                    methodIcon.style.background = 'var(--primary-blue-light)';
                    methodIcon.style.transform = 'scale(1)';
                }
            });
        }
    });
}

/* ======================================
   PERFORMANCE OPTIMIZATION
====================================== */
// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        // Disable animations
        if (typeof AOS !== 'undefined') {
            AOS.init({ disable: true });
        }
    } else {
        // Re-enable animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: false,
                duration: 1000,
                easing: 'ease-out',
                once: true,
                offset: 100
            });
        }
    }
});

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeContactPage
    };
}
