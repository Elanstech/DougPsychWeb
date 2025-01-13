// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initCustomCursor();
    initSmoothScroll();
    initNavigation();
    initParallax();
    initCarousel();
    initAnimations();
    initForm();
    initBackToTop();
    initMagneticButtons();
    init3DCards();
});

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .team-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navbar || !menuToggle || !navMenu) return;
    
    let lastScroll = 0;

 // Handle scroll
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    navbar.classList.add('scrolled'); // Always keep the scrolled class

    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
    });

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const rect = element.getBoundingClientRect();
                const visible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (visible) {
                    const yOffset = window.pageYOffset;
                    element.style.transform = `translateY(${yOffset * speed}px)`;
                }
            });
        });
    });
}

// Carousel Initialization
function initCarousel() {
    // Image Carousel
    const carousel = document.querySelector('.image-carousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        let imageIndex = 0;

        function showSlide(index) {
            items.forEach(item => {
                item.classList.remove('active');
                item.style.transform = 'translateX(100px)';
                item.style.opacity = '0';
            });

            items[index].classList.add('active');
            items[index].style.transform = 'translateX(0)';
            items[index].style.opacity = '1';
        }

        // Auto advance slides
        setInterval(() => {
            imageIndex = (imageIndex + 1) % items.length;
            showSlide(imageIndex);
        }, 5000);
    }

    // Services Carousel
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const cards = Array.from(document.querySelectorAll('.service-card'));
    const prevButton = document.querySelector('.carousel-button.left');
    const nextButton = document.querySelector('.carousel-button.right');
    
    if (!cards.length) return;

    let serviceIndex = 0;
    const cardsToShow = window.innerWidth < 768 ? 1 : 3;
    const cardWidth = cards[0].offsetWidth + 32; // Including gap
    let autoScrollInterval;
    let isHovered = false;

    function updateCarousel() {
        const offset = -serviceIndex * cardWidth;
        track.style.transform = `translateX(${offset}px)`;
        
        // Update active states
        cards.forEach((card, index) => {
            if (index >= serviceIndex && index < serviceIndex + cardsToShow) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0.5';
                card.style.transform = 'scale(0.95)';
            }
        });

        // Update button states
        if (prevButton && nextButton) {
            prevButton.style.display = serviceIndex === 0 ? 'none' : 'flex';
            nextButton.style.display = serviceIndex >= cards.length - cardsToShow ? 'none' : 'flex';
        }
    }

    function moveNext() {
        if (serviceIndex < cards.length - cardsToShow) {
            serviceIndex++;
        } else {
            serviceIndex = 0;
            track.style.transition = 'none';
            updateCarousel();
            track.offsetHeight; // Force reflow
            track.style.transition = 'transform 0.5s ease';
        }
        updateCarousel();
    }

    function movePrev() {
        if (serviceIndex > 0) {
            serviceIndex--;
        } else {
            serviceIndex = cards.length - cardsToShow;
            track.style.transition = 'none';
            updateCarousel();
            track.offsetHeight; // Force reflow
            track.style.transition = 'transform 0.5s ease';
        }
        updateCarousel();
    }

    // Auto scroll function
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (!isHovered) {
                moveNext();
            }
        }, 3000); // Scroll every 3 seconds
    }

    // Initialize auto scroll
    startAutoScroll();

    // Pause on hover
    track.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    track.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // Event Listeners
    if (prevButton && nextButton) {
        nextButton.addEventListener('click', () => {
            moveNext();
            startAutoScroll(); // Reset timer after manual navigation
        });
        prevButton.addEventListener('click', () => {
            movePrev();
            startAutoScroll(); // Reset timer after manual navigation
        });
    }

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        isHovered = true; // Pause auto-scroll on touch
    }, false);

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            moveNext();
        } else if (touchEndX - touchStartX > 50) {
            movePrev();
        }
        isHovered = false; // Resume auto-scroll after touch
        startAutoScroll(); // Reset timer after touch navigation
    }, false);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            serviceIndex = 0;
            updateCarousel();
        }, 250);
    });

    // Initial update
    updateCarousel();
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.reveal-text, .service-card, .team-card, .book-3d').forEach(el => {
        observer.observe(el);
    });
}

// Form Handling
function initForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('Message sent successfully!', 'success');
            form.reset();
            
        } catch (error) {
            showNotification('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

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

// Magnetic Buttons
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic');
    if (!buttons.length) return;
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// 3D Card Effect
function init3DCards() {
    const cards = document.querySelectorAll('.service-card, .team-card');
    if (!cards.length) return;
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}
// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Book Preview Effect
function initBookPreview() {
    const books = document.querySelectorAll('.book-3d');
    
    books.forEach(book => {
        book.addEventListener('mousemove', (e) => {
            const rect = book.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            book.style.transform = `
                perspective(1000px)
                rotateX(${angleX}deg)
                rotateY(${angleY}deg)
                scale3d(1.1, 1.1, 1.1)
            `;
            
            const glare = book.querySelector('.book-glare');
            if (glare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `
                    radial-gradient(
                        circle at ${glareX}% ${glareY}%,
                        rgba(255, 255, 255, 0.3) 0%,
                        rgba(255, 255, 255, 0) 80%
                    )
                `;
            }
        });

        book.addEventListener('mouseleave', () => {
            book.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            const glare = book.querySelector('.book-glare');
            if (glare) {
                glare.style.background = 'none';
            }
        });
    });
}

// Text Scramble Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-scramble-effect">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize text scramble effect
function initTextScramble() {
    const elements = document.querySelectorAll('.text-scramble');
    elements.forEach(el => {
        const fx = new TextScramble(el);
        const text = el.dataset.text;
        fx.setText(text);
        
        el.addEventListener('mouseenter', () => {
            fx.setText(text);
        });
    });
}

// Mouse trail effect
function initMouseTrail() {
    const trail = document.querySelector('.mouse-trail');
    if (!trail) return;

    const points = [];
    const trailLength = 20;
    const trailFade = 0.1;
    
    for (let i = 0; i < trailLength; i++) {
        const point = document.createElement('div');
        point.className = 'trail-point';
        trail.appendChild(point);
        points.push({
            element: point,
            x: 0,
            y: 0,
            age: i * trailFade
        });
    }
    
    document.addEventListener('mousemove', e => {
        points.forEach(point => {
            point.x = e.clientX;
            point.y = e.clientY;
            point.element.style.transform = `translate(${point.x}px, ${point.y}px)`;
            point.element.style.opacity = 1 - point.age;
            point.age = Math.min(point.age + trailFade, 1);
        });
    });
    
    function animate() {
        points.forEach(point => {
            point.element.style.opacity = 1 - point.age;
            point.age = Math.min(point.age + trailFade, 1);
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Performance Monitoring
function initPerformanceMonitoring() {
    if (!window.performance) return;
    
    let fps = 60;
    let frameCount = 0;
    let lastTime = performance.now();
    
    const fpsThreshold = 30;
    const heavyAnimationClass = 'heavy-animation';
    
    function checkPerformance() {
        const now = performance.now();
        frameCount++;
        
        if (now > lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (now - lastTime));
            frameCount = 0;
            lastTime = now;
            
            // If FPS drops below threshold, optimize animations
            if (fps < fpsThreshold) {
                document.body.classList.add(heavyAnimationClass);
                console.warn(`Low FPS detected: ${fps}. Optimizing animations.`);
            } else {
                document.body.classList.remove(heavyAnimationClass);
            }
        }
        
        requestAnimationFrame(checkPerformance);
    }
    
    requestAnimationFrame(checkPerformance);
}

// Load optimization
function initLoadOptimization() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const prefetch = document.createElement('link');
            prefetch.rel = 'prefetch';
            prefetch.href = href;
            document.head.appendChild(prefetch);
        }
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initSmoothScroll();
    initNavigation();
    initParallax();
    initCarousel();
    initAnimations();
    initForm();
    initBackToTop();
    initMagneticButtons();
    init3DCards();
    initBookPreview();
    initTextScramble();
    initMouseTrail();
    initPerformanceMonitoring();
    initLoadOptimization();
});
