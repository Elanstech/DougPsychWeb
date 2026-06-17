/**
 * about.js — page-specific behavior for the About page
 * Global behaviors (header, nav, reveal, counters, back-to-top, smooth scroll)
 * are handled by script.js. This file only manages the video hero.
 *
 * Wrapped in an IIFE so it never collides with script.js globals.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initHeroVideo();
    });

    /* ------------------------------------------------------------------
       Hero video: graceful fallback + battery/motion friendliness
    ------------------------------------------------------------------ */
    function initHeroVideo() {
        const wrap = document.querySelector('.about-hero-video');
        const video = wrap ? wrap.querySelector('video') : null;
        if (!wrap || !video) return;

        // If the user prefers reduced motion, don't autoplay — show the poster.
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            video.removeAttribute('autoplay');
            video.pause();
            wrap.classList.add('video-static');
            return;
        }

        // If the video errors out (missing file, codec), fall back to the poster image.
        video.addEventListener('error', applyFallback);
        const source = video.querySelector('source');
        if (source) source.addEventListener('error', applyFallback);

        // Some browsers block autoplay; attempt play and fall back to poster if rejected.
        const playAttempt = video.play();
        if (playAttempt && typeof playAttempt.then === 'function') {
            playAttempt.catch(function () {
                // Autoplay blocked — poster stays visible, which is fine.
                wrap.classList.add('video-static');
            });
        }

        // Pause the video when the hero scrolls out of view (saves resources).
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (wrap.classList.contains('video-static')) return;
                    if (entry.isIntersecting) {
                        video.play().catch(function () {});
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.1 });
            io.observe(wrap);
        }

        function applyFallback() {
            const poster = video.getAttribute('poster');
            if (poster) {
                wrap.style.backgroundImage = 'url("' + poster + '")';
                wrap.style.backgroundSize = 'cover';
                wrap.style.backgroundPosition = 'center';
            }
            video.style.display = 'none';
            wrap.classList.add('video-static');
        }
    }
})();
