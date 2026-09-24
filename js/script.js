/**
 * Doug Uhlig Psychology — Main JavaScript
 * v3.0 — modern motion, scroll reveal, counters, carousels
 * All initializers are guarded so shared pages (about/services/contact) won't error.
 */

document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileNav();
    initScrollProgress();
    initReveal();
    initCounters();
    initServicesCarousel();
    initTeamCarousel();
    initBackToTop();
    initSmoothScroll();
});

/* ----------------------------------------------------------------------
   Utility: throttle via requestAnimationFrame
---------------------------------------------------------------------- */
function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
        if (!ticking) {
            window.requestAnimationFrame(() => { fn.apply(this, args); ticking = false; });
            ticking = true;
        }
    };
}

/* ----------------------------------------------------------------------
   1. HEADER — shrink on scroll + hide on scroll-down / show on scroll-up
---------------------------------------------------------------------- */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    const onScroll = rafThrottle(() => {
        const y = window.pageYOffset;

        // Shrink/frost
        header.classList.toggle('scrolled', y > 40);

        // Hide on down, show on up (don't hide while mobile menu is open)
        if (!document.body.classList.contains('menu-open')) {
            if (y > lastScroll && y > 300) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }
        }
        lastScroll = y <= 0 ? 0 : y;
    });

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------------------------
   2. MOBILE NAV
---------------------------------------------------------------------- */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    const links = menu.querySelectorAll('a');

    function close() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
        const open = menu.classList.toggle('active');
        toggle.classList.toggle('active', open);
        document.body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', toggleMenu);
    links.forEach(link => link.addEventListener('click', close));

    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
            close();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) close();
    });
}

/* ----------------------------------------------------------------------
   3. SCROLL PROGRESS BAR
---------------------------------------------------------------------- */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    const update = rafThrottle(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const pct = scrollable > 0 ? (window.pageYOffset / scrollable) * 100 : 0;
        bar.style.width = pct + '%';
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ----------------------------------------------------------------------
   4. SCROLL REVEAL — adds .in-view when elements enter viewport
---------------------------------------------------------------------- */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Reduced motion: show everything immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach(el => el.classList.add('in-view'));
        return;
    }

    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------------
   5. COUNTERS — animate [data-count] when the trust strip enters view
---------------------------------------------------------------------- */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate(el) {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';

        if (reduce) { el.textContent = target + suffix; return; }

        const duration = 1600;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
        counters.forEach(animate);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------------
   6. SERVICES CAROUSEL (Swiper)
---------------------------------------------------------------------- */
function initServicesCarousel() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.services-carousel')) return;

    const swiper = new Swiper('.services-carousel', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        speed: 700,
        grabCursor: true,
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: '.services-carousel .swiper-pagination', clickable: true, dynamicBullets: true },
        navigation: {
            nextEl: '.services-carousel .swiper-button-next',
            prevEl: '.services-carousel .swiper-button-prev'
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 }
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (!swiper.autoplay) return;
        document.hidden ? swiper.autoplay.stop() : swiper.autoplay.start();
    });
}

/* ----------------------------------------------------------------------
   7. TEAM CAROUSEL (Swiper)
---------------------------------------------------------------------- */
function initTeamCarousel() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.team-carousel')) return;

    const swiper = new Swiper('.team-carousel', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        speed: 700,
        grabCursor: true,
        autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
        keyboard: { enabled: true, onlyInViewport: true },
        pagination: { el: '.team-carousel .swiper-pagination', clickable: true, dynamicBullets: true },
        navigation: {
            nextEl: '.team-carousel .swiper-button-next',
            prevEl: '.team-carousel .swiper-button-prev'
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 22 },
            900: { slidesPerView: 3, spaceBetween: 26 },
            1200: { slidesPerView: 4, spaceBetween: 28 }
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (!swiper.autoplay) return;
        document.hidden ? swiper.autoplay.stop() : swiper.autoplay.start();
    });
}

/* ----------------------------------------------------------------------
   8. BACK TO TOP
---------------------------------------------------------------------- */
function initBackToTop() {
    const btn = document.getElementById('toTop');
    if (!btn) return;

    const toggle = rafThrottle(() => {
        btn.classList.toggle('show', window.pageYOffset > 600);
    });

    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ----------------------------------------------------------------------
   9. SMOOTH SCROLL for in-page anchors
---------------------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerH = document.getElementById('header')?.offsetHeight || 0;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}


/* ==========================================================================
   SPLIT-SCREEN GATE (index.html) — acts as the preloader
   Shows every time index.html loads. Doug's photo/name appear first, the two
   photos fade in once they've downloaded (max 1.8s wait), then the visitor
   picks Coaching (goes to coaching.html) or Therapy (reveals this page).
   Skipped only for section links (index.html#services) and the Therapy
   switch on the coaching page (index.html?site=therapy).
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const gate = document.getElementById('gate');
    if (!gate) return;

    const panels = Array.from(gate.querySelectorAll('.gate-panel'));
    const track = gate.querySelector('.gate-panels');
    const coaching = document.getElementById('gateCoaching');
    const therapy = document.getElementById('gateTherapy');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hash = window.location.hash;
    const sectionLink = hash && hash !== '#home';
    const choseTherapy = new URLSearchParams(window.location.search).get('site') === 'therapy';

    if (sectionLink || choseTherapy) {
        gate.remove();
        return;
    }

    /* Lock the page behind the gate */
    document.body.classList.add('gate-open');
    window.scrollTo(0, 0);

    /* Preload: show identity now, reveal panels when both photos are ready */
    requestAnimationFrame(function () { gate.classList.add('is-intro'); });

    let revealed = false;
    function reveal() {
        if (revealed) return;
        revealed = true;
        gate.classList.add('is-ready');
    }

    const urls = Array.from(gate.querySelectorAll('.gate-bg')).map(function (el) {
        const m = getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
        return m ? m[1] : null;
    }).filter(Boolean);

    let pending = urls.length;
    if (!pending || reduced) {
        reveal();
    } else {
        urls.forEach(function (src) {
            const img = new Image();
            img.onload = img.onerror = function () { if (--pending === 0) setTimeout(reveal, 250); };
            img.src = src;
        });
        setTimeout(reveal, 1800);
    }

    function dismiss() {
        gate.classList.add('is-dismissed');
        document.body.classList.remove('gate-open');
    }

    /* Therapy: stay on this page */
    if (therapy) {
        therapy.addEventListener('click', function () {
            dismiss();
            window.scrollTo({ top: 0, behavior: 'auto' });
        });
    }

    /* Coaching: leave for the coaching site */
    if (coaching) {
        coaching.addEventListener('click', function () {
            if (reduced) { window.location.href = 'coaching.html'; return; }
            gate.classList.add('is-dismissed');
            setTimeout(function () { window.location.href = 'coaching.html'; }, 420);
        });
    }

    /* Back button (page restored from cache): show the gate again */
    window.addEventListener('pageshow', function (e) {
        if (!e.persisted) return;
        gate.classList.remove('is-dismissed');
        document.body.classList.add('gate-open');
        window.scrollTo(0, 0);
    });

    /* Hover focus on desktop */
    if (track && window.matchMedia('(hover: hover) and (min-width: 900px)').matches) {
        panels.forEach(function (panel) {
            panel.addEventListener('mouseenter', function () {
                track.classList.add('is-hovering');
                panels.forEach(function (p) { p.classList.toggle('is-hovered', p === panel); });
            });
        });
        track.addEventListener('mouseleave', function () {
            track.classList.remove('is-hovering');
            panels.forEach(function (p) { p.classList.remove('is-hovered'); });
        });
    }

    /* Keyboard: left = coaching, right = therapy */
    document.addEventListener('keydown', function (e) {
        if (gate.classList.contains('is-dismissed')) return;
        if (e.key === 'ArrowLeft' && coaching) coaching.click();
        if (e.key === 'ArrowRight' && therapy) therapy.click();
    });
});
