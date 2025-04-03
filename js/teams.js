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
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Handle header on scroll
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200 && !document.body.classList.contains('menu-open')) {
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
    
    // Only run if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.innerText);
                    let count = 0;
                    const duration = 2000; // Animation duration in ms
                    const interval = 10;
                    const increment = Math.ceil(target / (duration / interval));
                    
                    const updateCount = () => {
                        if (count < target) {
                            count += increment;
                            counter.innerText = Math.min(count, target);
                            setTimeout(updateCount, interval);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        counters.forEach(counter => {
            counter.innerText = counter.innerText;
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
                
                // Focus on the modal for accessibility
                setTimeout(() => {
                    const closeButton = modal.querySelector('.close-modal');
                    if (closeButton) closeButton.focus();
                }, 100);
            }
        });
    });
    
    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.member-modal');
            document.body.style.overflow = '';
            modal.classList.remove('open');
            
            // Return focus to the button that opened the modal
            const buttonId = modal.id;
            const button = document.querySelector(`.view-profile-btn[data-modal="${buttonId}"]`);
            if (button) button.focus();
        });
    });
    
    // Close modal when clicking outside the content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                document.body.style.overflow = '';
                this.classList.remove('open');
                
                // Return focus to the button that opened the modal
                const buttonId = this.id;
                const button = document.querySelector(`.view-profile-btn[data-modal="${buttonId}"]`);
                if (button) button.focus();
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
                
                // Return focus to the button that opened the modal
                const buttonId = openModal.id;
                const button = document.querySelector(`.view-profile-btn[data-modal="${buttonId}"]`);
                if (button) button.focus();
            }
        }
    });
}

/**
 * Handle various scroll effects
 */
function handleScrollEffects() {
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
    
    // Parallax effect for the hero section
    const heroSection = document.querySelector('.team-hero');
    if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset;
            if (scrollY <= heroSection.offsetHeight) {
                heroSection.style.backgroundPositionY = `${scrollY * 0.5}px`;
            }
        });
    }
}

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

// Handle window resize events
window.addEventListener('resize', debounce(function() {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Fix card heights for consistency
    equalizeCardHeights();
}, 200));

/**
 * Equalize card heights in the team grid
 */
function equalizeCardHeights() {
    // Only run on larger screens
    if (window.innerWidth >= 768) {
        const memberCards = document.querySelectorAll('.member-card');
        
        // Reset heights first
        memberCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Get row groups
        const rows = {};
        memberCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const key = Math.round(rect.top);
            
            if (!rows[key]) {
                rows[key] = [];
            }
            
            rows[key].push(card);
        });
        
        // Set equal height for each row
        for (const key in rows) {
            const rowCards = rows[key];
            const maxHeight = Math.max(...rowCards.map(card => card.offsetHeight));
            
            rowCards.forEach(card => {
                card.style.height = `${maxHeight}px`;
            });
        }
    }
}

// Support for browsers without IntersectionObserver
if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.member-card, .stat-item, .join-content').forEach(el => {
        el.classList.add('in-view');
    });
    
    document.querySelectorAll('.counter').forEach(counter => {
        counter.innerText = counter.innerText;
    });
}
