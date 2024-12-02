// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for Animations
const animateElements = document.querySelectorAll('.animate-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach(element => observer.observe(element));

// Form Validation and Submission
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                isValid = /^\d{10}$/.test(value.replace(/\D/g, ''));
                errorMessage = 'Please enter a valid phone number';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'This field is required';
        }

        this.updateFieldStatus(field, isValid, errorMessage);
        return isValid;
    }

    updateFieldStatus(field, isValid, message) {
        const container = field.parentElement;
        const existingError = container.querySelector('.error-message');
        
        if (!isValid) {
            field.classList.add('error');
            if (!existingError) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                container.appendChild(errorDiv);
            }
        } else {
            field.classList.remove('error');
            if (existingError) {
                existingError.remove();
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        let isValid = true;
        
        this.form.querySelectorAll('input, textarea').forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });

        if (isValid) {
            try {
                const formData = new FormData(this.form);
                const response = await this.submitForm(formData);
                this.showSubmissionMessage(true);
            } catch (error) {
                this.showSubmissionMessage(false);
            }
        }
    }

    async submitForm(formData) {
        // Replace with your actual form submission endpoint
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Form submission failed');
        }
        
        return response.json();
    }

    showSubmissionMessage(success) {
        const message = document.createElement('div');
        message.className = `submission-message ${success ? 'success' : 'error'}`;
        message.textContent = success 
            ? 'Thank you for your message. We will contact you soon!'
            : 'There was an error submitting the form. Please try again.';
            
        this.form.parentElement.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }
}

// Initialize form handler
new FormHandler('contactForm');

// Mobile Navigation
const mobileNav = {
    init() {
        this.hamburger = document.querySelector('.hamburger');
        this.nav = document.querySelector('.nav-links');
        this.bindEvents();
    },

    bindEvents() {
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
    },

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.nav.classList.toggle('active');
    }
};

mobileNav.init();
