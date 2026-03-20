/**
 * Executive Coaching Landing Page - JavaScript
 * Version: 1.0
 * Supplements main script.js (header, nav, smooth scroll already handled)
 */

document.addEventListener('DOMContentLoaded', function () {
    initCoachingPage();
});

function initCoachingPage() {
    initCoachingHeroAnimations();
    initCoachingCounters();
    initCoachingCardEffects();
    initCoachingParallax();
    initCoachingScrollReveal();
    initCoachingLocations();
}

/* ==========================================================================
   1. HERO ANIMATIONS
   ========================================================================== */
function initCoachingHeroAnimations() {
    const heroPhoto = document.querySelector('.coaching-photo');
    const badge = document.querySelector('.coaching-credential-badge');

    // Subtle parallax on hero image on mouse move (desktop only)
    if (heroPhoto && window.innerWidth >= 992) {
        const heroSection = document.querySelector('.coaching-hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', function (e) {
                const rect = heroSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                heroPhoto.style.transform = `translate(${x * 10}px, ${y * 10}px)`;

                if (badge) {
                    badge.style.transform = `translate(${x * -5}px, ${y * -5}px)`;
                }
            });

            heroSection.addEventListener('mouseleave', function () {
                heroPhoto.style.transform = 'translate(0, 0)';
                if (badge) {
                    badge.style.transform = 'translate(0, 0)';
                }
            });
        }
    }
}

/* ==========================================================================
   2. ANIMATED COUNTERS
   ========================================================================== */
function initCoachingCounters() {
    const stats = document.querySelectorAll('.hero-stat-number');
    if (!stats.length) return;

    let animated = false;

    function animateCounter(el) {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(\+?)$/);
        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = match[2] || '';
        const duration = 1800;
        const startTime = performance.now();

        el.textContent = '0' + suffix;

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    stats.forEach(function (stat) {
                        animateCounter(stat);
                    });
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsContainer = document.querySelector('.coaching-hero-stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

/* ==========================================================================
   3. CARD HOVER EFFECTS
   ========================================================================== */
function initCoachingCardEffects() {
    // Bio cards
    const bioCards = document.querySelectorAll('.coaching-bio-card');
    bioCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(0)';
        });
    });

    // Service cards
    const serviceCards = document.querySelectorAll('.coaching-service-card');
    serviceCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(0)';
        });
    });

    // Skill items - tilt effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(function (item) {
        item.addEventListener('mousemove', function (e) {
            if (window.innerWidth < 992) return;
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            item.style.transform =
                'translateY(-8px) perspective(600px) rotateX(' +
                y * -8 +
                'deg) rotateY(' +
                x * 8 +
                'deg)';
        });

        item.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            item.style.transform = 'translateY(0) perspective(600px) rotateX(0) rotateY(0)';
        });
    });

    // Client cards
    const clientCards = document.querySelectorAll('.client-card');
    clientCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(0)';
        });
    });

    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(function (item) {
        item.addEventListener('mouseenter', function () {
            if (window.innerWidth < 768) return;
            item.style.transform = 'translateY(-5px)';
        });
        item.addEventListener('mouseleave', function () {
            if (window.innerWidth < 768) return;
            item.style.transform = 'translateY(0)';
        });
    });

    // Credential columns
    const credCols = document.querySelectorAll('.credentials-column');
    credCols.forEach(function (col) {
        col.addEventListener('mouseenter', function () {
            if (window.innerWidth < 992) return;
            col.style.transform = 'translateY(-5px)';
        });
        col.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            col.style.transform = 'translateY(0)';
        });
    });
}

/* ==========================================================================
   4. PARALLAX SCROLL EFFECTS
   ========================================================================== */
function initCoachingParallax() {
    if (window.innerWidth < 992) return;

    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    function updateParallax() {
        const scrolled = window.pageYOffset;

        // Subtle parallax on coaching hero background
        const hero = document.querySelector('.coaching-hero');
        if (hero) {
            const heroHeight = hero.offsetHeight + hero.offsetTop;
            if (scrolled < heroHeight) {
                hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
            }
        }

        // CTA section background shift
        const cta = document.querySelector('.coaching-cta');
        if (cta) {
            const ctaRect = cta.getBoundingClientRect();
            if (ctaRect.top < window.innerHeight && ctaRect.bottom > 0) {
                const offset = (window.innerHeight - ctaRect.top) * 0.1;
                cta.style.backgroundPositionY = offset + 'px';
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   6. LOCATION CARD INTERACTIONS
   ========================================================================== */
function initCoachingLocations() {
    var locationCards = document.querySelectorAll('.coaching-location-card');
    locationCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(0)';
        });
    });

    var remoteBanner = document.querySelector('.coaching-remote-banner');
    if (remoteBanner) {
        remoteBanner.addEventListener('mouseenter', function () {
            if (window.innerWidth < 992) return;
            remoteBanner.style.transform = 'translateY(-3px)';
        });
        remoteBanner.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            remoteBanner.style.transform = 'translateY(0)';
        });
    }
}

/* ==========================================================================
   5. SCROLL REVEAL (fallback if AOS not loaded)
   ========================================================================== */
function initCoachingScrollReveal() {
    // Only run if AOS is not available
    if (typeof AOS !== 'undefined') return;

    var revealElements = document.querySelectorAll(
        '.coaching-bio-card, .coaching-service-card, .skill-item, .client-card, .credential-entry, .coaching-book-wrapper, .coaching-cta-content, .coaching-location-card, .coaching-remote-banner'
    );

    if (!revealElements.length) return;

    revealElements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach(function (el) {
        observer.observe(el);
    });
}
