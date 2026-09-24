document.addEventListener('DOMContentLoaded', function () {
    initCoachingPage();
});
 
function initCoachingPage() {
    initMeccBar();
    initCoachingParallax();
    initStruggleTabs();
    initCoachingLocations();
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
