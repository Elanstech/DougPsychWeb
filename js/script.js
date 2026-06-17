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
