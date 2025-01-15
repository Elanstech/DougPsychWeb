document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Function to hide preloader
    const hidePreloader = () => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.pointerEvents = 'none';
    };

    // If everything loads immediately
    window.addEventListener('load', () => {
        hidePreloader();
    });

    // Fallback timeout in case load event doesn't fire
    setTimeout(hidePreloader, 3000);

    // Floating Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            e.currentTarget.classList.add('active');
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navContainer.classList.toggle('mobile-menu-open');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hero Slider
    const heroSlider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    // Slide Transition Function
    function goToSlide(n) {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = (n + slides.length) % slides.length;

        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Next Slide Function
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Previous Slide Function
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Dot Navigation
    if (dots) {
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToSlide(slideIndex);
                resetSlideInterval();
            });
        });
    }

    // Next Button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideInterval();
        });
    }

    // Previous Button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideInterval();
        });
    }

    // Auto Slide Interval
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Reset Slide Interval
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }

    // Only start interval if slider exists
    if (heroSlider) {
        startSlideInterval();
    }

    // Number Counting Animation
    const animateCounters = (elements) => {
        elements.forEach(el => {
            const target = parseInt(el.dataset.value);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 16ms is roughly one frame

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    el.textContent = Math.round(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target;
                }
            };

            updateCounter();
        });
    };

    // Animate counters in hero and social proof sections
    const heroStats = document.querySelectorAll('.hero-stats .stat-number');
    const socialProofStats = document.querySelectorAll('.social-proof .proof-number');
    
    const observerOptions = {
        threshold: 0.1
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters([...heroStats, ...socialProofStats]);
                statsObserver.disconnect();
            }
        });
    }, observerOptions);

    if (document.querySelector('.hero-stats')) {
        statsObserver.observe(document.querySelector('.hero-stats'));
    }

    // Particle Network Background
    const particleNetwork = document.querySelector('.particle-network');
    if (particleNetwork) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particleNetwork.appendChild(particle);
        };

        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    }

    // Floating Card Animations
    const floatingCards = document.querySelectorAll('.floating-elements .float-card');
    floatingCards.forEach(card => {
        const speed = card.dataset.speed || 2;
        card.style.transform = `translateY(${Math.random() * 50}px)`;
        
        const animate = () => {
            const yPos = parseFloat(card.style.transform.replace('translateY(', ''));
            const newYPos = yPos + Math.sin(Date.now() * 0.001) * speed;
            card.style.transform = `translateY(${newYPos}px)`;
            requestAnimationFrame(animate);
        };
        
        animate();
    });

    // Team Carousel
    const teamCarousel = document.querySelector('.team-carousel .carousel-track');
    const teamPrevBtn = document.querySelector('.prev-review');
    const teamNextBtn = document.querySelector('.next-review');
    let currentTeamIndex = 0;

    const updateTeamCarousel = () => {
        if (teamCarousel) {
            const cardWidth = document.querySelector('.team-card').offsetWidth;
            const gap = 30; // Should match CSS grid gap
            teamCarousel.style.transform = `translateX(-${(cardWidth + gap) * currentTeamIndex}px)`;
        }
    };

    if (teamPrevBtn) {
        teamPrevBtn.addEventListener('click', () => {
            if (currentTeamIndex > 0) {
                currentTeamIndex--;
                updateTeamCarousel();
            }
        });
    }

    if (teamNextBtn) {
        teamNextBtn.addEventListener('click', () => {
            if (teamCarousel && currentTeamIndex < teamCarousel.children.length - 1) {
                currentTeamIndex++;
                updateTeamCarousel();
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            const isValid = Object.values(data).every(value => value.trim() !== '');
            
            if (isValid) {
                // TODO: Replace with actual form submission logic
                const notification = createNotification('Message sent successfully!', 'success');
                document.querySelector('.notification-container').appendChild(notification);
                contactForm.reset();
            } else {
                const notification = createNotification('Please fill out all fields.', 'error');
                document.querySelector('.notification-container').appendChild(notification);
            }
        });
    }

    // Notification System
    function createNotification(message, type) {
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.textContent = message;
        
        // Auto-remove notification
        setTimeout(() => {
            notification.classList.add('notification-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);

        return notification;
    }

    // Book 3D Effect
    const book3d = document.querySelector('.book-3d');
    if (book3d) {
        book3d.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = book3d.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            book3d.style.transform = `
                perspective(1000px) 
                rotateX(${y * 15}deg) 
                rotateY(${-x * 15}deg)
            `;
        });

        book3d.addEventListener('mouseleave', () => {
            book3d.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // Google Maps Initialization (placeholder)
    function initMap() {
        const location = { lat: 40.5885, lng: -73.9538 }; // Brooklyn coordinates
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: location,
            styles: [
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        { "color": "#e9e9e9" },
                        { "lightness": 17 }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        { "color": "#f5f5f5" },
                        { "lightness": 20 }
                    ]
                }
            ]
        });

        new google.maps.Marker({
            position: location,
            map: map,
            title: 'Dr. Doug Uhlig Psychology Office'
        });
    }

    // Error Handling
    window.addEventListener('error', (event) => {
        console.error('Unhandled error:', event.error);
        const notification = createNotification('An unexpected error occurred.', 'error');
        document.querySelector('.notification-container').appendChild(notification);
    });
});

// Expose initMap globally for Google Maps callback
window.initMap = initMap;
