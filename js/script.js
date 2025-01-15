// Main Website Management Class
class WebsiteManager {
    constructor() {
        this.heroSlideshow = null;
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeComponents() {
        // Initialize all components
        this.initLoader();
        this.initCursor();
        this.initNavigation();
        this.heroSlideshow = new HeroSlideshow(); // Initialize hero slideshow
        this.initAnimations();
        this.initCarousels();
        this.initBook3D();
        this.initContactForm();
        this.initCounters();
        this.initParticles();
    }

    setupEventListeners() {
        // Global event listeners
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('load', () => this.handleLoad());
    }

    // Loader Animation
    initLoader() {
        window.addEventListener('load', () => {
            const loader = document.querySelector('.loader-wrapper');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 1000);
            }
        });
    }

    // Custom Cursor
    initCursor() {
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorCircle = document.querySelector('.cursor-circle');

        if (!cursor || !cursorDot || !cursorCircle) return;

        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            cursorDot.style.transform = `translate(${x}px, ${y}px)`;
            cursorCircle.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Add magnetic effect to buttons
        document.querySelectorAll('.magnetic').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = button.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                
                const centerX = width / 2;
                const centerY = height / 2;
                
                const deltaX = x - centerX;
                const deltaY = y - centerY;
                
                button.style.transform = `translate(${deltaX * 0.2}px, ${deltaY * 0.2}px)`;
                cursorCircle.classList.add('magnetic-hover');
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
                cursorCircle.classList.remove('magnetic-hover');
            });
        });
    }

    // Navigation
    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    if (navMenu?.classList.contains('active')) {
                        menuToggle.click();
                    }
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
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
    }

    // Hero Slideshow Class
    initAnimations() {
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Reveal text animation
        const revealText = (element) => {
            const text = element.textContent;
            element.textContent = '';
            
            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.animationDelay = `${index * 0.1}s`;
                element.appendChild(span);
            });
        };

        document.querySelectorAll('.reveal-text').forEach(revealText);

        // Split lines animation
        document.querySelectorAll('.split-lines').forEach(element => {
            const lines = element.innerHTML.split('<br>');
            element.innerHTML = lines
                .map(line => `<span class="line"><span class="line-inner">${line}</span></span>`)
                .join('');
        });
    }

    // Team Carousel
    initCarousels() {
        const carouselContainer = document.querySelector('.team-carousel');
        if (!carouselContainer) return;

        const slides = carouselContainer.querySelectorAll('.team-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        let currentSlide = 0;
        const slidesPerView = window.innerWidth <= 768 ? 1 : 
                            window.innerWidth <= 1024 ? 2 : 3;
        
        // Create dots
        if (dotsContainer) {
            const numberOfDots = Math.ceil(slides.length / slidesPerView);
            dotsContainer.innerHTML = Array.from(
                { length: numberOfDots },
                (_, i) => `<button class="dot" data-slide="${i}"></button>`
            ).join('');
        }

        // Navigation functions
        const goToSlide = (slide) => {
            const offset = -slide * (100 / slidesPerView);
            carouselContainer.style.transform = `translateX(${offset}%)`;
            currentSlide = slide;
            
            // Update dots
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === Math.floor(slide / slidesPerView));
            });
        };

        // Event listeners
        prevBtn?.addEventListener('click', () => {
            if (currentSlide > 0) goToSlide(currentSlide - 1);
        });

        nextBtn?.addEventListener('click', () => {
            if (currentSlide < slides.length - slidesPerView) {
                goToSlide(currentSlide + 1);
            }
        });

        dotsContainer?.addEventListener('click', e => {
            if (e.target.classList.contains('dot')) {
                const slide = parseInt(e.target.dataset.slide) * slidesPerView;
                goToSlide(slide);
            }
        });

        // Initialize
        goToSlide(0);
    }

    // 3D Book Effect
    initBook3D() {
        const book = document.querySelector('.book-3d');
        if (!book) return;

        book.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = book.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            book.style.transform = `
                rotateY(${30 + x * 20}deg)
                rotateX(${-y * 20}deg)
                translateZ(50px)
            `;
        });

        book.addEventListener('mouseleave', () => {
            book.style.transform = 'rotateY(30deg) rotateX(0) translateZ(0)';
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Form validation and submission logic
            const formData = new FormData(form);
            // Add your form submission logic here
        });
    }

    // Counter Animation
    initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const startCounter = (counter) => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                counter.textContent = Math.round(current);

                if (current < target) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        // Start counters when they come into view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => observer.observe(counter));
    }

    // Particle Effects
    initParticles() {
        particlesJS('particles-js', {
            // Your particles configuration
            particles: {
                number: { value: 80 },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: false,
                    animation: {
                        enable: true,
                        speed: 1
                    }
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2
                }
            }
        });
    }

    // Scroll Handling
    handleScroll() {
        // Add your scroll handling logic here
    }

    // Resize Handling
    handleResize() {
        if (this.heroSlideshow) {
            this.heroSlideshow.handleResize();
        }
    }

    // Load Handling
    handleLoad() {
        document.body.classList.add('page-loaded');
    }
}
