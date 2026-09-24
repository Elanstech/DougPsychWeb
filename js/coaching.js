document.addEventListener('DOMContentLoaded', function () {
    initCoachingPage();
});
 
function initCoachingPage() {
    initMeccBar();
    initCoachingHeroAnimations();
    initCoachingCounters();
    initCoachingCardEffects();
    initCoachingParallax();
    initStruggleTabs();
    initCoachingLocations();
}
 
/* ==========================================================================
   1. HERO ANIMATIONS
   ========================================================================== */
function initCoachingHeroAnimations() {
    const heroPhoto = document.querySelector('.coaching-photo');
    const badge = document.querySelector('.coaching-credential-badge');
 
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
   2. ANIMATED COUNTERS (coaching hero stats — these are NOT [data-count],
      so they are handled here and won't collide with main script.js)
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
    /* Doug's feedback: several cards "looked like buttons but did nothing."
       The hover LIFT (translateY) reads as a pressable/clickable affordance,
       so it's now reserved for cards that actually have an action.
       Pricing cards keep the lift because each contains a clear CTA button.
       Decorative content cards (bio, clients, timeline, credentials, approach,
       fit, testimonials) no longer lift — they're read-only content. */
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function () {
            if (window.innerWidth < 992) return;
            card.style.transform = 'translateY(0)';
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
 
        const hero = document.querySelector('.coaching-hero');
        if (hero) {
            const heroHeight = hero.offsetHeight + hero.offsetTop;
            if (scrolled < heroHeight) {
                hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
            }
        }
 
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
   5. FOCUS AREAS — "If You're Struggling With…" TAB SWITCHING
   ========================================================================== */
function initStruggleTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.struggle-btn'));
    var panels = document.querySelectorAll('.struggle-panel');
    if (!tabs.length) return;
 
    function activate(tab) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
        });
 
        var target = tab.getAttribute('data-target');
        panels.forEach(function (p) {
            var on = p.id === 'panel-' + target;
            p.classList.toggle('active', on);
            if (on) {
                p.removeAttribute('hidden');
            } else {
                p.setAttribute('hidden', '');
            }
        });
    }
 
    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
            activate(tab);
        });
 
        tab.addEventListener('keydown', function (e) {
            var next;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                next = tabs[(i + 1) % tabs.length];
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                next = tabs[(i - 1 + tabs.length) % tabs.length];
            } else if (e.key === 'Home') {
                next = tabs[0];
            } else if (e.key === 'End') {
                next = tabs[tabs.length - 1];
            }
            if (next) {
                e.preventDefault();
                activate(next);
                next.focus();
            }
        });
    });
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
   MECC HEADER — active section, scroll progress, mobile sheet
   ========================================================================== */
function initMeccBar() {
    var bar = document.getElementById('header');
    if (!bar || !bar.classList.contains('mecc-bar')) return;

    /* Anyone on this page has picked coaching — skip the gate if they switch to therapy */
    try { sessionStorage.setItem('duGateSeen', '1'); } catch (err) { /* private mode */ }

    /* Active section in the nav */
    var steps = Array.prototype.slice.call(bar.querySelectorAll('.mecc-step'));
    var sections = steps.map(function (s) { return document.querySelector(s.getAttribute('href')); }).filter(Boolean);

    function setActive(id) {
        steps.forEach(function (s) {
            var on = s.getAttribute('href') === '#' + id;
            s.classList.toggle('is-active', on);
            if (on) { s.setAttribute('aria-current', 'location'); } else { s.removeAttribute('aria-current'); }
        });
    }

    if ('IntersectionObserver' in window && sections.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target.id); });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(function (sec) { io.observe(sec); });
    }

    /* Clear the highlight when back in the hero */
    var progress = document.getElementById('meccProgressBar');
    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            if (progress) progress.style.width = (max > 0 ? (window.pageYOffset / max) * 100 : 0) + '%';
            if (sections[0] && window.pageYOffset < sections[0].offsetTop - window.innerHeight * 0.4) setActive('');
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile sheet */
    var burger = document.getElementById('meccBurger');
    var sheet = document.getElementById('meccSheet');
    if (!burger || !sheet) return;

    function setOpen(open) {
        sheet.hidden = !open;
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        bar.classList.toggle('sheet-open', open);
        document.body.classList.toggle('menu-open', open);
    }
    burger.addEventListener('click', function () { setOpen(sheet.hidden); });
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !sheet.hidden) { setOpen(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1060 && !sheet.hidden) setOpen(false); });
}
