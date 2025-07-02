/**
 * Teams Page JavaScript - Enhanced & Modern
 * Handles team member filtering, modals, animations, and interactions
 * @version 2.0.0
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
    initializeScrollEffects();
    initializeResponsiveHandling();
    
    // Run after images are loaded
    window.addEventListener('load', function() {
        equalizeCardHeights();
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 100);
    });
}

/**
 * Initialize AOS animations library
 */
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 50,
            disable: function() {
                return window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });
    }
}

/**
 * Initialize the mobile navigation (same as index page)
 */
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    if (navToggle && navMenu) {
        let lastScroll = 0;
        
        // Mobile menu toggle
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link, .btn-consultation');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Handle header on scroll
        const handleScroll = debounce(() => {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            
            // Hide/show header on scroll (only if menu is closed)
            if (!document.body.classList.contains('menu-open')) {
                if (currentScroll > lastScroll && currentScroll > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }
            
            lastScroll = currentScroll;
        }, 10);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

/**
 * Initialize the animated counters in stats section
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    // Only run if IntersectionObserver is available
    if ('IntersectionObserver' in window && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count') || counter.innerText);
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count') || counter.innerText);
            counter.innerText = target + (target === 200 ? '+' : target === 20 ? '+' : '');
        });
    }
}

/**
 * Animate individual counter
 */
function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // Animation duration in ms
    const increment = Math.ceil(target / (duration / 16)); // 60fps
    const suffix = target === 200 ? '+' : target === 20 ? '+' : '';
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            if (current > target) current = target;
            element.innerText = current + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.innerText = target + suffix;
        }
    };
    
    // Add entrance animation
    element.style.animation = 'countUp 0.6s ease-out';
    updateCounter();
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
                
                // Filter members with staggered animation
                filterMembers(memberCards, filterValue);
                
                // Update card heights after animation
                setTimeout(() => {
                    equalizeCardHeights();
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }, 600);
            });
        });
    }
    
    // Initial state - show all cards
    memberCards.forEach((card, index) => {
        card.classList.add('show');
        // Staggered entrance animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
}

/**
 * Filter team members with smooth animations
 */
function filterMembers(memberCards, filterValue) {
    memberCards.forEach((card, index) => {
        const categories = card.getAttribute('data-category') || '';
        const shouldShow = filterValue === 'all' || categories.includes(filterValue);
        
        if (shouldShow) {
            // Show card with delay
            setTimeout(() => {
                card.classList.remove('hide');
                card.classList.add('show');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
                card.style.pointerEvents = 'auto';
            }, index * 50);
        } else {
            // Hide card immediately
            card.classList.remove('show');
            card.classList.add('hide');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.8)';
            card.style.pointerEvents = 'none';
        }
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
                openModal(modal, button);
            }
        });
    });
    
    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.member-modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside the content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.member-modal.open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

/**
 * Open modal with smooth animation
 */
function openModal(modal, triggerButton) {
    document.body.style.overflow = 'hidden';
    modal.classList.add('open');
    
    // Focus management for accessibility
    setTimeout(() => {
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.focus();
        }
    }, 100);
    
    // Store reference to trigger button for focus return
    modal.setAttribute('data-trigger', triggerButton.getAttribute('data-modal'));
}

/**
 * Close modal with smooth animation
 */
function closeModal(modal) {
    const modalContent = modal.querySelector('.modal-content');
    
    // Animate out
    if (modalContent) {
        modalContent.style.transform = 'translateY(30px) scale(0.95)';
        modalContent.style.opacity = '0';
    }
    
    setTimeout(() => {
        document.body.style.overflow = '';
        modal.classList.remove('open');
        
        // Return focus to trigger button
        const triggerModalId = modal.getAttribute('data-trigger');
        if (triggerModalId) {
            const triggerButton = document.querySelector(`[data-modal="${triggerModalId}"]`);
            if (triggerButton) {
                triggerButton.focus();
            }
        }
        
        // Reset modal content styles
        if (modalContent) {
            modalContent.style.transform = '';
            modalContent.style.opacity = '';
        }
    }, 300);
}

/**
 * Initialize scroll effects and animations
 */
function initializeScrollEffects() {
    // Parallax effect for hero section (desktop only)
    if (window.innerWidth >= 1024) {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Intersection Observer for element animations
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.stat-card, .member-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Update parallax effects
 */
function updateParallax() {
    const heroSection = document.querySelector('.teams-hero');
    if (!heroSection) return;
    
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    heroSection.style.transform = `translateY(${rate * 0.1}px)`;
}

/**
 * Initialize responsive handling
 */
function initializeResponsiveHandling() {
    let resizeTimeout;
    
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update card heights
            equalizeCardHeights();
            
            // Refresh AOS
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // Reset transforms on mobile
            if (window.innerWidth < 1024) {
                resetTransforms();
            }
            
            // Close mobile menu if open and screen gets larger
            if (window.innerWidth >= 992) {
                const navToggle = document.querySelector('.nav-toggle');
                const navMenu = document.querySelector('.nav-menu');
                
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
    });
}

/**
 * Equalize card heights for consistency
 */
function equalizeCardHeights() {
    // Only run on larger screens and if cards are visible
    if (window.innerWidth >= 768) {
        const visibleCards = document.querySelectorAll('.member-card.show');
        
        if (visibleCards.length === 0) return;
        
        // Reset heights first
        visibleCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Group cards by rows
        const rows = groupCardsByRows(visibleCards);
        
        // Set equal height for each row
        rows.forEach(rowCards => {
            const maxHeight = Math.max(...rowCards.map(card => card.offsetHeight));
            rowCards.forEach(card => {
                card.style.height = `${maxHeight}px`;
            });
        });
    } else {
        // Reset heights on mobile
        const allCards = document.querySelectorAll('.member-card');
        allCards.forEach(card => {
            card.style.height = 'auto';
        });
    }
}

/**
 * Group cards by their visual rows
 */
function groupCardsByRows(cards) {
    const rows = {};
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const key = Math.round(rect.top / 10) * 10; // Group by approximate row
        
        if (!rows[key]) {
            rows[key] = [];
        }
        
        rows[key].push(card);
    });
    
    return Object.values(rows);
}

/**
 * Reset transforms for mobile
 */
function resetTransforms() {
    const elements = document.querySelectorAll('.member-card, .stat-card, .teams-hero');
    elements.forEach(element => {
        element.style.transform = '';
    });
}

/**
 * Debounce helper function to limit function calls
 */
function debounce(func, wait = 20, immediate = false) {
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

/**
 * Handle visibility changes (tab focus/blur)
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when tab is not visible
        const animatedElements = document.querySelectorAll('.join-team::before');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab becomes visible
        const animatedElements = document.querySelectorAll('.join-team::before');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
        
        // Refresh AOS
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 100);
    }
});

/**
 * Handle page load completion
 */
window.addEventListener('load', function() {
    // Ensure all images are loaded before final adjustments
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    const checkAllImagesLoaded = () => {
        loadedImages++;
        if (loadedImages === images.length) {
            setTimeout(() => {
                equalizeCardHeights();
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 100);
        }
    };
    
    images.forEach(img => {
        if (img.complete) {
            checkAllImagesLoaded();
        } else {
            img.addEventListener('load', checkAllImagesLoaded);
            img.addEventListener('error', checkAllImagesLoaded);
        }
    });
    
    // Fallback if no images
    if (images.length === 0) {
        setTimeout(() => {
            equalizeCardHeights();
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 100);
    }
});

/**
 * Support for browsers without IntersectionObserver
 */
if (!('IntersectionObserver' in window)) {
    // Fallback: immediately show all elements
    document.querySelectorAll('.member-card, .stat-card').forEach(el => {
        el.classList.add('in-view', 'show');
    });
    
    // Fallback: immediately set counter values
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count') || counter.innerText);
        counter.innerText = target + (target === 200 ? '+' : target === 20 ? '+' : '');
    });
}

/**
 * Accessibility enhancements
 */
function initializeAccessibility() {
    // Add keyboard navigation for filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % filterButtons.length;
                filterButtons[nextIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = index === 0 ? filterButtons.length - 1 : index - 1;
                filterButtons[prevIndex].focus();
            }
        });
    });
    
    // Enhance modal accessibility
    const modals = document.querySelectorAll('.member-modal');
    modals.forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        const title = modal.querySelector('h2');
        if (title) {
            modal.setAttribute('aria-labelledby', title.id || 'modal-title');
        }
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTeamPage,
        initializeTeamFilter,
        initializeMemberModals,
        equalizeCardHeights
    };
}
