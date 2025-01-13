// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ===============================
    // Navbar Functionality
    // ===============================
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // ===============================
    // Services Carousel
    // ===============================
    const track = document.querySelector('.carousel-track');
    if (track) {
        const cards = Array.from(document.querySelectorAll('.service-card'));
        const leftButton = document.querySelector('.carousel-button.left');
        const rightButton = document.querySelector('.carousel-button.right');
        
        let currentIndex = 0;
        let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        let autoScrollInterval;

        function updateButtons() {
            leftButton.disabled = currentIndex === 0;
            rightButton.disabled = currentIndex >= cards.length - getVisibleCards();
        }

        function getVisibleCards() {
            const viewportWidth = window.innerWidth;
            if (viewportWidth < 768) return 1;
            if (viewportWidth < 1200) return 2;
            return 3;
        }

        function moveCarousel(direction) {
            if (direction === 'right' && currentIndex < cards.length - getVisibleCards()) {
                currentIndex++;
            } else if (direction === 'left' && currentIndex > 0) {
                currentIndex--;
            }
            
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updateButtons();
        }

        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                if (currentIndex >= cards.length - getVisibleCards()) {
                    currentIndex = -1;
                }
                moveCarousel('right');
            }, 5000);
        }

        leftButton.addEventListener('click', () => {
            moveCarousel('left');
            clearInterval(autoScrollInterval);
            startAutoScroll();
        });

        rightButton.addEventListener('click', () => {
            moveCarousel('right');
            clearInterval(autoScrollInterval);
            startAutoScroll();
        });

        track.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        track.addEventListener('mouseleave', () => {
            startAutoScroll();
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                updateButtons();
            }, 250);
        });

        updateButtons();
        startAutoScroll();
    }

    // ===============================
    // Contact Form Validation
    // ===============================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // If validation passes, you can submit the form
            // Add your form submission logic here
            alert('Thank you for your message. We will get back to you soon!');
            contactForm.reset();
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===============================
    // Testimonials Slider (if needed)
    // ===============================
    const testimonialsTrack = document.querySelector('.testimonials-track');
    if (testimonialsTrack) {
        let testimonialIndex = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        
        function showTestimonial(index) {
            testimonialsTrack.style.transform = `translateX(-${index * 100}%)`;
        }

        setInterval(() => {
            testimonialIndex = (testimonialIndex + 1) % testimonials.length;
            showTestimonial(testimonialIndex);
        }, 6000);
    }

    // ===============================
    // Animation on Scroll
    // ===============================
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // ===============================
    // Back to Top Button
    // ===============================
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
