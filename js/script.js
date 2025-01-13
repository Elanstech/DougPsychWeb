// Main JavaScript for DougPsychWeb
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteManager();
});

class WebsiteManager {
    constructor() {
        this.initHeroSection();
        this.initNavigation();
        this.initCarousel();
        this.initTeamCards();
        this.initContactForm();
        this.initMagneticButtons();
        this.initBackToTop();
        this.initAnimations();
    }

    // Hero Section
    initHeroSection() {
        const texts = document.querySelectorAll('.changing-text');
        let currentIndex = 0;

        const animateText = () => {
            texts.forEach(text => text.style.opacity = '0');
            texts[currentIndex].style.opacity = '1';
            currentIndex = (currentIndex + 1) % texts.length;
        };

        setInterval(animateText, 3000);
        animateText();

        // Hero images parallax effect
        const heroImages = document.querySelectorAll('.hero-image');
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xAxis = (window.innerWidth / 2 - clientX) / 50;
            const yAxis = (window.innerHeight / 2 - clientY) / 50;

            heroImages.forEach((image, index) => {
                const factor = (3 - index) * 0.2;
                image.style.transform = `translate(${xAxis * factor}px, ${yAxis * factor}px)`;
            });
        });
    }

    // Navigation
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Mobile menu toggle
        menuToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Navbar scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
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
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }

    // Services Carousel
    initCarousel() {
        const track = document.querySelector('.carousel-track');
        const cards = document.querySelectorAll('.service-card');
        const prevButton = document.querySelector('.carousel-button.left');
        const nextButton = document.querySelector('.carousel-button.right');
        
        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth + 32; // Including gap
        const maxIndex = cards.length - 3; // Show 3 cards at a time

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === maxIndex;
        };

        prevButton?.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextButton?.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    // Team Cards
    initTeamCards() {
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

    // Contact Form
    initContactForm() {
        const form = document.querySelector('.contact-form');
        const inputs = form?.querySelectorAll('input, textarea, select');

        inputs?.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            try {
                // Add your form submission logic here
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
            } catch (error) {
                this.showNotification('Error sending message. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    // Magnetic Buttons
    initMagneticButtons() {
        const buttons = document.querySelectorAll('.magnetic');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Animations
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

        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
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

        notification.querySelector('.notification-close').addEventListener('click', close);
        setTimeout(close, 5000);
    }
}
