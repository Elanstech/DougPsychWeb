document.addEventListener('DOMContentLoaded', function () {
    initCoachingPage();
});
 
function initCoachingPage() {
    initMeccBar();
    initMeccQuiz();
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


/* ==========================================================================
   SELF-ASSESSMENT QUIZ — one part at a time, answers emailed to Doug
   Delivery: FormSubmit (free). The first real submission triggers a one-time
   "Activate Form" email to Doug; after he clicks it, every result arrives
   in his inbox as a table. Change ENDPOINT to send somewhere else.
   ========================================================================== */
function initMeccQuiz() {
    var form = document.getElementById('meccQuiz');
    if (!form) return;

    var ENDPOINT = 'https://formsubmit.co/ajax/duhlig2004@yahoo.com';
    var DRAFT_KEY = 'meccQuizDraft';

    var steps = Array.prototype.slice.call(form.querySelectorAll('.mq-step'));
    var total = steps.length;
    var parts = Array.prototype.slice.call(document.querySelectorAll('.mecc-assess-parts li'));
    var count = document.getElementById('mqCount');
    var barWrap = form.querySelector('.mq-bar');
    var bar = document.getElementById('mqBar');
    var back = document.getElementById('mqBack');
    var next = document.getElementById('mqNext');
    var errorBox = document.getElementById('mqError');
    var done = document.getElementById('mqDone');
    var otherToggle = document.getElementById('q5aOtherToggle');
    var otherText = document.getElementById('q5aOther');
    var current = 0;

    function showError(msg) { errorBox.textContent = msg; errorBox.hidden = !msg; }

    function show(i, moveFocus) {
        current = i;
        steps.forEach(function (st, n) { st.hidden = n !== i; });
        count.textContent = 'Part ' + (i + 1) + ' of ' + total;
        bar.style.width = ((i + 1) / total * 100) + '%';
        barWrap.setAttribute('aria-valuenow', String(i + 1));
        back.hidden = i === 0;
        next.textContent = i === total - 1 ? 'Send to Dr. Uhlig' : 'Continue';
        parts.forEach(function (li, n) {
            li.classList.toggle('is-current', n === i);
            li.classList.toggle('is-done', n < i);
            if (n === i) { li.setAttribute('aria-current', 'step'); } else { li.removeAttribute('aria-current'); }
        });
        showError('');
        if (moveFocus) {
            steps[i].focus({ preventScroll: true });
            var top = form.getBoundingClientRect().top;
            if (top < 90) window.scrollBy({ top: top - 110, behavior: 'smooth' });
        }
    }

    /* "Other" reveals a text box */
    function syncOther() {
        otherText.hidden = !otherToggle.checked;
        if (otherToggle.checked && document.activeElement === otherToggle) otherText.focus();
    }
    if (otherToggle && otherText) otherToggle.addEventListener('change', syncOther);

    /* Save progress on this device so nothing is lost */
    function saveDraft() {
        var data = {};
        Array.prototype.forEach.call(form.elements, function (el) {
            if (!el.name || el.name === '_honey') return;
            if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) (data[el.name] = data[el.name] || []).push(el.value);
            } else if (el.value) { data[el.name] = el.value; }
        });
        data._step = current;
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (err) { /* storage off */ }
    }
    function loadDraft() {
        var data;
        try { data = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (err) { data = null; }
        if (!data) return 0;
        Array.prototype.forEach.call(form.elements, function (el) {
            if (!el.name || !(el.name in data)) return;
            if (el.type === 'checkbox' || el.type === 'radio') { el.checked = data[el.name].indexOf(el.value) !== -1; }
            else { el.value = data[el.name]; }
        });
        syncOther();
        return Math.min(data._step || 0, total - 1);
    }
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);

    back.addEventListener('click', function () { if (current > 0) { show(current - 1, true); saveDraft(); } });

    function validContact() {
        var name = document.getElementById('qName');
        var email = document.getElementById('qEmail');
        if (!name.value.trim()) { showError('Please enter your name so Dr. Uhlig knows who the assessment is from.'); name.focus(); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError('Please enter a valid email address so Dr. Uhlig can reply.'); email.focus(); return false; }
        return true;
    }

    function payload() {
        var data = {}, order = [];
        Array.prototype.forEach.call(form.elements, function (el) {
            if (!el.name || el.name === '_honey' || el.type === 'submit' || el.type === 'button') return;
            if (order.indexOf(el.name) === -1) order.push(el.name);
            if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) data[el.name] = data[el.name] ? data[el.name] + ', ' + el.value : el.value;
            } else if (el.value.trim()) { data[el.name] = el.value.trim(); }
        });
        var name = data['Name'] || 'New client';
        var out = {
            _subject: 'MECC self-assessment: ' + name,
            _template: 'table',
            _captcha: 'false',
            _replyto: data['Email'] || '',
            _honey: form.elements['_honey'].value
        };
        ['Name', 'Email', 'Phone', 'Title and organization'].concat(order).forEach(function (k) {
            if (k in out) return;
            out[k] = data[k] || 'No answer';
        });
        return out;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (current < total - 1) { show(current + 1, true); saveDraft(); return; }
        if (!validContact()) return;

        next.disabled = true; back.disabled = true;
        next.textContent = 'Sending…';
        showError('');

        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload())
        })
        .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (r) {
            if (!r.ok || String(r.body.success) === 'false') throw new Error(r.body.message || 'Send failed');
            try { localStorage.removeItem(DRAFT_KEY); } catch (err) { /* ignore */ }
            if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_name: 'mecc_self_assessment' });
            form.hidden = true;
            parts.forEach(function (li) { li.classList.remove('is-current'); li.classList.add('is-done'); li.removeAttribute('aria-current'); });
            done.hidden = false;
            done.focus();
        })
        .catch(function () {
            showError('Your answers could not be sent. Please check your connection and try again, or call (347) 395-1759.');
            next.disabled = false; back.disabled = false;
            next.textContent = 'Send to Dr. Uhlig';
        });
    });

    show(loadDraft(), false);
}
