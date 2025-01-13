// Main Website Manager Class
class WebsiteManager {
    constructor() {
        this.initNavigation();
        this.initHeroSection();
        this.initServices();
        this.initCertifications();
        this.initTestimonials();
        this.initTeamSection();
        this.initContactForm();
        this.initAnimations();
        this.initBackToTop();
    }

    // Navigation Management
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-links li');

        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.toggleMenu(menuToggle, navMenu);
            });

            // Close menu when clicking links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.toggleMenu(menuToggle, navMenu);
                });
            });
        }

        // Scroll effect for navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    toggleMenu(menuToggle, navMenu) {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', 
            menuToggle.classList.contains('active').toString());
    }

    // Hero Section Management
    initHeroSection() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });

        // Text animation for hero section
        const animateText = () => {
            const texts = document.querySelectorAll('.animate-text');
            texts.forEach((text, index) => {
                setTimeout(() => {
                    text.classList.add('visible');
                }, index * 200);
            });
        };

        // Trigger text animation on page load
        setTimeout(animateText, 500);
    }

    // Services Section Management
    initServices() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
            });
        });

        // Services carousel functionality
        const track = document.querySelector('.carousel-track');
        const prevButton = document.querySelector('.carousel-button.left');
        const nextButton = document.querySelector('.carousel-button.right');
        
        if (track && prevButton && nextButton) {
            let currentIndex = 0;
            const cardWidth = track.firstElementChild?.offsetWidth || 0;
            const maxIndex = track.children.length - 1;

            const updateCarousel = () => {
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex === maxIndex;
            };

            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            nextButton.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }
    }

    // Certifications Section Management
    initCertifications() {
        const certificationSection = document.querySelector('.certifications-section');
        if (!certificationSection) return;

        const cards = document.querySelectorAll('.certification-card');
        const membershipItems = document.querySelectorAll('.membership-item');
        const expertiseItems = document.querySelectorAll('.expertise-list li');

        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElements(cards, 200);
                    this.animateElements(membershipItems, 200, 500);
                    this.animateElements(expertiseItems, 150, 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(certificationSection);
    }

    // Testimonials Section Management
    initTestimonials() {
        const testimonialTrack = document.querySelector('.testimonials-track');
        const testimonials = document.querySelectorAll('.testimonial');
        if (!testimonialTrack || !testimonials.length) return;

        let currentSlide = 0;
        const slideWidth = testimonials[0].offsetWidth;

        const updateSlide = () => {
            testimonialTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        };

        // Auto-advance testimonials
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateSlide();
        }, 5000);
    }

    // Team Section Management
    initTeamSection() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('flipped');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('flipped');
            });
        });
    }

    // Contact Form Management
    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            submitBtn.disabled = true;
            
            try {
                // Add your form submission logic here
                await this.submitForm(form);
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
            } catch (error) {
                this.showNotification('Error sending message. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
            }
        });

        // Floating labels
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement?.classList.remove('focused');
                }
            });
        });
    }

    async submitForm(form) {
        // Implement your form submission logic here
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Animation Management
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    animateElements(elements, delay, initialDelay = 0) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, initialDelay + (index * delay));
        });
    }

    // Back to Top Button Management
    initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.id = 'backToTop';
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
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

    // Notification System
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);

        const close = () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        };

        notification.querySelector('.notification-close')?.addEventListener('click', close);
        setTimeout(close, 5000);
    }
}

// Initialize the website manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteManager();
});
