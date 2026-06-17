/**
 * contact.js — page-specific behavior for the Contact page.
 * The contact form is handled by the Elfsight widget (loaded in <head>),
 * so this file only runs the FAQ accordion.
 * Global behaviors (header, nav, reveal, back-to-top, smooth scroll) come from script.js.
 * Wrapped in an IIFE so nothing collides with script.js globals.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initFaq();
    });

    function initFaq() {
        var items = document.querySelectorAll('.contact-faq .faq-item');
        if (!items.length) return;

        items.forEach(function (item) {
            var head = item.querySelector('.faq-head');
            var panel = item.querySelector('.faq-panel');
            if (!head || !panel) return;

            head.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                // Single-open behavior: close all first.
                items.forEach(function (other) {
                    other.classList.remove('active');
                    var op = other.querySelector('.faq-panel');
                    if (op) op.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            });
        });

        // Recalculate open panel height on resize (text reflow).
        var t;
        window.addEventListener('resize', function () {
            clearTimeout(t);
            t = setTimeout(function () {
                var active = document.querySelector('.contact-faq .faq-item.active .faq-panel');
                if (active) active.style.maxHeight = active.scrollHeight + 'px';
            }, 150);
        });
    }
})();
