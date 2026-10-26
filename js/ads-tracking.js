// Google Ads conversion events for dougpsychassociates.com
// Requires the base Google tag (AW-16789894941) already loaded in <head> on every page.
// 1) "Site call click"  - any tap/click on a tel: link
// 2) "Website lead"     - Elfsight contact form sent successfully (contact page)
// No personal data is sent: only the event name and the Google conversion label.
(function () {
  var CALL_LABEL = 'AW-16789894941/4nYpCMCcx6odEJ3uhcY-';
  var FORM_LABEL = 'AW-16789894941/T4NZCLjF6NocEJ3uhcY-';

  function report(label) {
    if (typeof window.gtag !== 'function') return;
    try { window.gtag('event', 'conversion', { send_to: label }); } catch (e) {}
  }

  // 1) Phone taps - fires once per page view (one person tapping twice is one call)
  var callSent = false;
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="tel:"]') : null;
    if (!a || callSent) return;
    callSent = true;
    report(CALL_LABEL);
  }, true);

  // 2) Elfsight form - the widget renders a success message in place of the form after sending.
  //    Watch the widget container; fire once when a thank-you / sent message appears.
  var formSent = false;
  var box = document.querySelector('[class*="elfsight-app-"]');
  if (!box || !window.MutationObserver) return;
  var SUCCESS = /thank you|thanks for|has been sent|successfully|we'll be in touch|we will be in touch|message sent|received your/i;
  var sawForm = false, prevMatch = false;
  var obs = new MutationObserver(function () {
    if (formSent) return;
    if (box.querySelector('input, textarea')) sawForm = true;   // the form has rendered
    var nowMatch = SUCCESS.test(box.innerText || '');
    if (sawForm && nowMatch && !prevMatch) {                     // success text just appeared
      formSent = true;
      report(FORM_LABEL);
      obs.disconnect();
    }
    prevMatch = nowMatch;
  });
  obs.observe(box, { childList: true, subtree: true, characterData: true });
})();
