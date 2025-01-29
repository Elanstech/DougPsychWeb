/************************************************************
  about.js — minimal JS for the About page
*************************************************************/

/**
 * Toggles the mobile navigation menu on smaller screens.
 * Reuses the same .nav-toggle button and .nav-menu from the header.
 */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Toggle the nav menu when the toggle button is clicked
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Optional: close menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // If you need any additional about-page-specific JS, you can add it here.
});
