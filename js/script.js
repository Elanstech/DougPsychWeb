document.addEventListener('DOMContentLoaded', () => {
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
});

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
    
    mobileMenuToggle.addEventListener('click', () => {
        navContainer.classList.toggle('mobile-menu-open');
        mobileMenuToggle.classList.toggle('active');
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

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

    statsObserver.observe(document.querySelector('.hero-stats'));

    // Team Carousel
    const teamCarousel = document.querySelector('.team-carousel .carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    const updateCarousel = () => {
        const cardWidth = document.querySelector('.team-card').offsetWidth;
        const gap = 30; // Should match CSS grid gap
        teamCarousel.style.transform = `translateX(-${(cardWidth + gap) * currentIndex}px)`;
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            const maxIndex = teamCarousel.children.length - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
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
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                alert('Please fill out all fields.');
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

    // Particle Network Background (simplified)
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
});

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
    // Optional: Send error to a logging service
});
