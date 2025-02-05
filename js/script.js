// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeAllComponents();
});

// Main initialization function
function initializeAllComponents() {
  initHeader();
  initHeroSlider();
  initMobileNav();
  initServices();
  initAboutSection();
  initTeamSection();
  initBookSection();
  initLocationsNew();
  initContactSection();
}

/* ======================================
   HEADER FUNCTIONALITY
====================================== */
function initHeader() {
  const header = document.querySelector('.header');
  let lastScroll = 0;
  let isScrollingDown = false;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    if (!document.body.classList.contains('menu-open')) {
      if (currentScroll > lastScroll && !isScrollingDown && currentScroll > 200) {
        isScrollingDown = true;
        header.style.transform = 'translateY(-100%)';
      } else if (currentScroll < lastScroll && isScrollingDown) {
        isScrollingDown = false;
        header.style.transform = 'translateY(0)';
      }
    }

    lastScroll = currentScroll;
  });
}

/* ======================================
   MOBILE NAVIGATION
====================================== */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Toggle menu on button click
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
}

/* ======================================
   HERO SLIDER
====================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.nav-dot');
  const progress = document.querySelector('.progress');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5000; // 5 seconds per slide
  let startTime;

  function updateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progressPercent = (elapsed / slideDuration) * 100;

    if (progress) {
      progress.style.height = `${Math.min(progressPercent, 100)}%`;
    }

    if (elapsed < slideDuration) {
      requestAnimationFrame(updateProgress);
    }
  }

  function showSlide(index) {
    // Reset progress
    if (progress) progress.style.height = '0%';
    startTime = null;
    requestAnimationFrame(updateProgress);

    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.style.zIndex = 1;
    });
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    slides[index].style.zIndex = 2;
    dots[index].classList.add('active');

    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startSlideshow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopSlideshow() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  // Navigation dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlideshow();
      showSlide(index);
      startSlideshow();
    });
  });

  // Handle visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSlideshow();
    } else {
      showSlide(currentSlide);
      startSlideshow();
    }
  });

  window.addEventListener('focus', () => {
    showSlide(currentSlide);
    startSlideshow();
  });

  window.addEventListener('blur', () => {
    stopSlideshow();
  });

  // Initialize hero slider
  showSlide(0);
  startSlideshow();

  // Simple hover effects for service items (if any)
  const serviceItems = document.querySelectorAll('.services-list li');
  serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(10px)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0)';
    });
  });
}

/* ======================================
   SERVICES SECTION
====================================== */
function initServices() {
  const servicesSwiper = new Swiper('.services-carousel', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    },
    on: {
      init: function() {
        if (typeof AOS !== 'undefined') AOS.refresh();
      },
      slideChange: function() {
        if (typeof AOS !== 'undefined') AOS.refresh();
      }
    }
  });

  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease',
      once: true,
      mirror: false
    });
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      servicesSwiper.update();
    }, 250);
  });
}

/* ======================================
   ABOUT SECTION
====================================== */
function initAboutSection() {
  const contentBlocks = document.querySelectorAll('.content-block');
  const navigationDots = document.querySelectorAll('.navigation-dots .dot');
  let currentBlockIndex = 0;
  let autoplayInterval;
  let isHovered = false;

  function showBlock(index) {
    contentBlocks.forEach(block => {
      block.classList.remove('active');
      block.style.opacity = '0';
      block.style.visibility = 'hidden';
    });
    navigationDots.forEach(dot => dot.classList.remove('active'));

    contentBlocks[index].classList.add('active');
    contentBlocks[index].style.opacity = '1';
    contentBlocks[index].style.visibility = 'visible';
    navigationDots[index].classList.add('active');

    currentBlockIndex = index;
  }

  function showNextBlock() {
    if (!isHovered) {
      const nextIndex = (currentBlockIndex + 1) % contentBlocks.length;
      showBlock(nextIndex);
    }
  }

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(showNextBlock, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  navigationDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showBlock(index);
      stopAutoplay();
      startAutoplay();
    });
  });

  const aboutContent = document.querySelector('.about-content-blocks');
  if (aboutContent) {
    aboutContent.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoplay();
    });
    aboutContent.addEventListener('mouseleave', () => {
      isHovered = false;
      startAutoplay();
    });
  }

  // Credential hover effects
  const credentials = document.querySelectorAll('.credential');
  credentials.forEach(credential => {
    credential.addEventListener('mouseenter', () => {
      credential.style.backgroundColor = 'rgba(26, 35, 126, 0.05)';
      credential.style.transform = 'translateX(10px)';
    });
    credential.addEventListener('mouseleave', () => {
      credential.style.backgroundColor = 'transparent';
      credential.style.transform = 'translateX(0)';
    });
  });

  // Feature items hover effects
  const featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('.feature-icon i');
      if (icon) {
        icon.style.transform = 'scale(1.2)';
      }
      item.style.transform = 'translateY(-5px)';
    });
    item.addEventListener('mouseleave', () => {
      const icon = item.querySelector('.feature-icon i');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
      item.style.transform = 'translateY(0)';
    });
  });

  // "View More" button
  const viewMoreBtn = document.querySelector('.btn-view-more');
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = document.querySelector(viewMoreBtn.getAttribute('href'));
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
    viewMoreBtn.addEventListener('mouseenter', () => {
      const arrow = viewMoreBtn.querySelector('i');
      if (arrow) {
        arrow.style.transform = 'translateX(5px)';
      }
    });
    viewMoreBtn.addEventListener('mouseleave', () => {
      const arrow = viewMoreBtn.querySelector('i');
      if (arrow) {
        arrow.style.transform = 'translateX(0)';
      }
    });
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.feature-item, .credential').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.5s ease';
    observer.observe(element);
  });

  // Autoplay pause/resume based on visibility/focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
  window.addEventListener('focus', startAutoplay);
  window.addEventListener('blur', stopAutoplay);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 250);
  });

  // Initialize
  showBlock(0);
  startAutoplay();
}

/* ======================================
   TEAM SECTION
====================================== */
function initTeamSection() {
  // Initialize Swiper for the team carousel
  const teamSwiper = new Swiper('.team-carousel', {
    slidesPerView: 2, // Default: 2 slides (so more than one practitioner shows)
    spaceBetween: 30,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      1400: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  });

  // Initialize additional team-related animations and image loading
  initTeamCardsAnimation();
  initTeamImages();
  initTeamStatsAnimation();
  initTeamSocialLinks();

  // Autoplay pause/resume on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      teamSwiper.autoplay.stop();
    } else {
      teamSwiper.autoplay.start();
    }
  });

  return teamSwiper;
}

function initTeamCardsAnimation() {
  const cards = document.querySelectorAll('.team-member-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function initTeamImages() {
  const teamImages = document.querySelectorAll('.member-image img');
  teamImages.forEach(img => {
    img.loading = 'lazy';
    if (img.complete) {
      handleImageLoad(img);
    } else {
      img.addEventListener('load', () => handleImageLoad(img));
    }
    img.addEventListener('error', handleImageError);
  });
}

function handleImageLoad(img) {
  img.style.opacity = '1';
  const card = img.closest('.team-member-card');
  if (card) {
    card.classList.add('image-loaded');
  }
}

function handleImageError(e) {
  const img = e.target;
  img.src = 'placeholder.jpg'; // Fallback image
  console.error('Error loading team member image:', e);
}

function initTeamStatsAnimation() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 50;
    const updateCount = () => {
      if (current < target) {
        current += increment;
        stat.textContent = Math.ceil(current);
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target;
      }
    };
    updateCount();
  });
}

function initTeamSocialLinks() {
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.2)';
      }
    });
    link.addEventListener('mouseleave', () => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
    if (link.href.includes('mailto:')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.href.replace('mailto:', '');
        navigator.clipboard.writeText(email)
          .then(() => showToast('Email copied to clipboard!'))
          .catch(err => console.error('Failed to copy email:', err));
      });
    }
  });
}

/* ======================================
   BOOK SECTION
====================================== */
function initBookSection() {
  const previewSlides = document.querySelectorAll('.preview-slide');
  const navigationDots = document.querySelectorAll('.preview-nav .nav-dot');
  let currentSlide = 0;
  let previewInterval;
  let isPreviewHovered = false;

  function showSlide(index) {
    previewSlides.forEach(slide => slide.classList.remove('active'));
    navigationDots.forEach(dot => dot.classList.remove('active'));
    previewSlides[index].classList.add('active');
    navigationDots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    if (!isPreviewHovered) {
      showSlide((currentSlide + 1) % previewSlides.length);
    }
  }

  function startPreviewAutoplay() {
    if (previewInterval) clearInterval(previewInterval);
    previewInterval = setInterval(nextSlide, 5000);
  }

  navigationDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startPreviewAutoplay();
    });
  });

  const previewCarousel = document.querySelector('.preview-carousel');
  if (previewCarousel) {
    previewCarousel.addEventListener('mouseenter', () => {
      isPreviewHovered = true;
    });
    previewCarousel.addEventListener('mouseleave', () => {
      isPreviewHovered = false;
    });
  }

  const book = document.querySelector('.book');
  const bookWrapper = document.querySelector('.book-wrapper');
  let isBookHovered = false;
  if (book && bookWrapper) {
    book.addEventListener('mouseenter', () => {
      isBookHovered = true;
      bookWrapper.style.animationPlayState = 'paused';
      book.style.transform = 'rotateY(-15deg)';
    });
    book.addEventListener('mouseleave', () => {
      isBookHovered = false;
      bookWrapper.style.animationPlayState = 'running';
      book.style.transform = 'rotateY(-30deg)';
    });
    book.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isBookHovered = true;
      bookWrapper.style.animationPlayState = 'paused';
      book.style.transform = 'rotateY(-15deg)';
    });
    book.addEventListener('touchend', () => {
      isBookHovered = false;
      bookWrapper.style.animationPlayState = 'running';
      book.style.transform = 'rotateY(-30deg)';
    });
  }

  const platforms = document.querySelectorAll('.platform');
  platforms.forEach(platform => {
    platform.addEventListener('mouseenter', () => {
      platform.style.transform = 'translateY(-5px)';
      const icon = platform.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.1)';
      }
    });
    platform.addEventListener('mouseleave', () => {
      platform.style.transform = 'translateY(0)';
      const icon = platform.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
  });

  const purchaseButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
  purchaseButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });
  });

  const badges = document.querySelectorAll('.badge');
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'translateY(-3px)';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = 'translateY(0)';
    });
  });

  const floatBadges = document.querySelectorAll('.float-badge');
  floatBadges.forEach((badge, index) => {
    badge.style.animationDelay = `${-index * 2}s`;
  });

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.platform, .badge, .preview-slide').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.5s ease';
    observer.observe(element);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (previewInterval) clearInterval(previewInterval);
    } else {
      startPreviewAutoplay();
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 250);
  });

  showSlide(0);
  startPreviewAutoplay();
}

/* ======================================
   LOCATIONS SECTION
====================================== */
function initLocationsNew() {
  const locationCards = document.querySelectorAll('.location-card-new');
  locationCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const image = card.querySelector('.location-image img');
      if (image) {
        image.style.transform = 'scale(1.1)';
      }
      card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
      const image = card.querySelector('.location-image img');
      if (image) {
        image.style.transform = 'scale(1)';
      }
      card.style.transform = 'translateY(0)';
    });
    card.addEventListener('touchstart', () => {
      card.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('touchend', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.feature-icon-new i');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
      }
      card.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.feature-icon-new i');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0)';
      }
      card.style.transform = 'translateY(0)';
    });
  });

  const tourButtons = document.querySelectorAll('.btn-tour-new');
  tourButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Virtual tour feature coming soon!');
    });
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });
  });

  const directionButtons = document.querySelectorAll('.btn-directions-new');
  directionButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });
  });

  if (typeof AOS !== 'undefined') {
    locationCards.forEach((card, index) => {
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (index * 100).toString());
    });
    featureCards.forEach((card, index) => {
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (index * 100).toString());
    });
    AOS.refresh();
  }

  function handleResponsiveLayout() {
    const windowWidth = window.innerWidth;
    const locationCards = document.querySelectorAll('.location-card-new');
    locationCards.forEach(card => {
      const content = card.querySelector('.location-content-new');
      if (windowWidth <= 768) {
        content.style.padding = '1.5rem';
      } else {
        content.style.padding = '2rem';
      }
    });
  }
  handleResponsiveLayout();
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleResponsiveLayout();
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 250);
  });

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.location-card-new, .feature-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
  });

  const locationImages = document.querySelectorAll('.location-image img');
  locationImages.forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
}

/* ======================================
   CONTACT SECTION
====================================== */
function initContactSection() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Message sent successfully! We will get back to you soon.');
        contactForm.reset();
      } catch (error) {
        alert('An error occurred. Please try again.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });

    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      const input = group.querySelector('input, select, textarea');
      const label = group.querySelector('label');
      if (input && label) {
        if (input.value) {
          label.classList.add('active');
        }
        input.addEventListener('focus', () => {
          label.classList.add('active');
        });
        input.addEventListener('blur', () => {
          if (!input.value) {
            label.classList.remove('active');
          }
        });
      }
    });
  }

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  const footerLinks = document.querySelectorAll('.footer-links a, .footer-services a');
  footerLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const arrow = link.querySelector('.arrow');
      if (arrow) {
        arrow.style.transform = 'translateX(5px)';
      }
    });
    link.addEventListener('mouseleave', () => {
      const arrow = link.querySelector('.arrow');
      if (arrow) {
        arrow.style.transform = 'translateX(0)';
      }
    });
  });

  const socialLinks = document.querySelectorAll('.footer-social a');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.2)';
      }
    });
    link.addEventListener('mouseleave', () => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
  });

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.footer-info, .footer-links, .footer-services, .footer-contact')
    .forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.5s ease';
      observer.observe(element);
    });
}

/* ======================================
   TOAST NOTIFICATION HELPER
====================================== */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
