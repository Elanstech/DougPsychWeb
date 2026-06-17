/**
 * services.js — page-specific behavior for the Services page
 * Global behaviors (header, nav, reveal, counters, back-to-top, smooth scroll)
 * are handled by script.js. This file only manages the process accordion.
 *
 * Wrapped in an IIFE so it never collides with script.js globals.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initAccordion();
    });

    function initAccordion() {
        const items = document.querySelectorAll('.acc-item');
        if (!items.length) return;

        // Open the first item by default and set its panel height.
        items.forEach(function (item) {
            const head = item.querySelector('.acc-head');
            const panel = item.querySelector('.acc-panel');
            if (!head || !panel) return;

            // Initialize: expanded item gets its natural height.
            if (item.classList.contains('active')) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }

            head.addEventListener('click', function () {
                const isActive = item.classList.contains('active');

                // Close all (single-open accordion).
                items.forEach(function (other) {
                    other.classList.remove('active');
                    const op = other.querySelector('.acc-panel');
                    if (op) op.style.maxHeight = null;
                });

                // Open the clicked one if it wasn't already open.
                if (!isActive) {
                    item.classList.add('active');
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            });
        });

        // Recalculate the open panel's height on resize (content reflow).
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                const active = document.querySelector('.acc-item.active .acc-panel');
                if (active) active.style.maxHeight = active.scrollHeight + 'px';
            }, 150);
        });
    }
})();
