/**
 * Teams Page JavaScript
 * Handles team member filtering, modals, and animations
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTeamPage();
});

/**
 * Initialize all team page functionality
 */
function initializeTeamPage() {
    // Core functionality
    initializeAOS();
    initializeNavigation();
    initializeCounters();
    
    // Team specific features
    initializeTeamFilter();
    initializeMemberModals();
    handleScrollEffects();
}

/**
 * Initialize AOS animations library
 */
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 50,
            delay: 100,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }
}

/**
 * Initialize the mobile navigation
 */
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Handle header on scroll
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
}

/**
 * Initialize the number counters in stats section
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower number = faster animation
    
    // Only run if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.innerText);
                    let count = 0;
                    
                    const updateCount = () => {
                        const increment = target / speed;
                        
                        if (count < target) {
                            count += increment;
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.8 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        counters.forEach(counter => {
            const target = parseInt(counter.innerText);
            counter.innerText = target;
        });
    }
}

/**
 * Initialize the team member filtering
 */
function initializeTeamFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const memberCards = document.querySelectorAll('.member-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter members
                memberCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    
                    // Hide all cards first
                    card.classList.remove('show');
                    card.classList.add('hide');
                    
                    // Show appropriate cards based on filter
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        setTimeout(() => {
                            card.classList.remove('hide');
                            card.classList.add('show');
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Initial state - show all
    memberCards.forEach(card => {
        card.classList.add('show');
    });
}

/**
 * Initialize the member profile modals
 */
function initializeMemberModals() {
    const profileButtons = document.querySelectorAll('.view-profile-btn');
    const modals = document.querySelectorAll('.member-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open modal when clicking view profile button
    profileButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                document.body.style.overflow = 'hidden';
                modal.classList.add('open');
            }
        });
    });
    
    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.member-modal');
            document.body.style.overflow = '';
            modal.classList.remove('open');
        });
    });
    
    // Close modal when clicking outside the content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                document.body.style.overflow = '';
                this.classList.remove('open');
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.member-modal.open');
            if (openModal) {
                document.body.style.overflow = '';
                openModal.classList.remove('open');
            }
        }
    });
}

/**
 * Handle various scroll effects
 */
function handleScrollEffects() {
    // Image parallax effect on scroll
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero background
            const heroBackground = document.querySelector('.hero-bg-image');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        });
    }
    
    // Animate elements when they come into view
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.member-card, .stat-item, .join-content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    // Refresh AOS on window resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 200));

/**
 * Debounce helper function to limit function calls
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Support for browsers without IntersectionObserver
if (!('IntersectionObserver' in window)) {
    // Simple fallback to show all elements
    document.querySelectorAll('.member-card, .stat-item, .join-content').forEach(el => {
        el.classList.add('in-view');
    });
}
