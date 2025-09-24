// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initTourTabs();
    initSmoothScrolling();
    initContactForm();
    initScrollEffects();
    initAnimations();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            });
        });
    }
}

// Tour Tabs Functionality
function initTourTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tourContents = document.querySelectorAll('.tour-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tourContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(category);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add animation effect
            const activeContent = document.querySelector('.tour-content.active');
            if (activeContent) {
                activeContent.style.opacity = '0';
                setTimeout(() => {
                    activeContent.style.opacity = '1';
                }, 100);
            }
        });
    });
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const tourInterest = formData.get('tour-interest');
            const message = formData.get('message');
            
            // Validate form
            if (!validateForm(name, email, message)) {
                return;
            }
            
            // Show success message
            showFormSubmissionMessage('Thank you! Your inquiry has been submitted. We will contact you soon.', 'success');
            
            // Reset form
            this.reset();
        });
        
        // Add real-time validation
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    }
}

// Form Validation Functions
function validateForm(name, email, message) {
    let isValid = true;
    
    // Validate name
    const nameInput = document.querySelector('input[name="name"]');
    if (!name || name.trim().length < 2) {
        showFieldError(nameInput, 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    } else {
        clearFieldError(nameInput);
    }
    
    // Validate email
    const emailInput = document.querySelector('input[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError(emailInput);
    }
    
    // Validate message
    const messageInput = document.querySelector('textarea[name="message"]');
    if (!message || message.trim().length < 10) {
        showFieldError(messageInput, 'Please enter a message (at least 10 characters)');
        isValid = false;
    } else {
        clearFieldError(messageInput);
    }
    
    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    const inputType = input.type;
    
    switch(inputType) {
        case 'text':
            if (input.name === 'name') {
                if (value.length < 2) {
                    showFieldError(input, 'Please enter a valid name (at least 2 characters)');
                    return false;
                }
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(input, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'tel':
            // Phone is optional, but if provided, should be valid
            if (value && value.length < 8) {
                showFieldError(input, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    // Check textarea
    if (input.tagName.toLowerCase() === 'textarea') {
        if (value.length < 10) {
            showFieldError(input, 'Please enter a message (at least 10 characters)');
            return false;
        }
    }
    
    clearFieldError(input);
    return true;
}

function showFieldError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--color-error)';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--space-4)';
    
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.classList.remove('error');
    
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showFormSubmissionMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.padding = 'var(--space-12) var(--space-16)';
    messageDiv.style.marginTop = 'var(--space-16)';
    messageDiv.style.borderRadius = 'var(--radius-base)';
    messageDiv.style.fontWeight = 'var(--font-weight-medium)';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.15)';
        messageDiv.style.color = 'var(--color-success)';
        messageDiv.style.border = '1px solid rgba(var(--color-success-rgb), 0.25)';
    } else {
        messageDiv.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.15)';
        messageDiv.style.color = 'var(--color-error)';
        messageDiv.style.border = '1px solid rgba(var(--color-error-rgb), 0.25)';
    }
    
    const contactForm = document.querySelector('.contact-form');
    contactForm.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Scroll Effects
function initScrollEffects() {
    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(var(--color-slate-900-rgb, 19, 52, 59), 0.98)';
        } else {
            header.style.background = 'rgba(var(--color-slate-900-rgb, 19, 52, 59), 0.95)';
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Animation Effects
function initAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(var(--color-slate-900-rgb, 19, 52, 59), 0.98);
            padding: var(--space-16);
            border-top: 1px solid var(--color-border);
            box-shadow: var(--shadow-lg);
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .form-control.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
        }
        
        .nav-link.active {
            color: var(--color-primary);
            background: var(--color-secondary);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
            
            .nav-menu.active {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.tour-card, .service-card, .about-card, .vehicle-card, .destination-card, .blog-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Tour Package Modal Functionality
function initTourModals() {
    const tourCards = document.querySelectorAll('.tour-card');
    
    tourCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.btn--primary');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get tour information
                const tourName = card.querySelector('h3').textContent;
                const tourPrice = card.querySelector('.tour-price').textContent;
                const duration = card.querySelector('.duration').textContent;
                const highlights = Array.from(card.querySelectorAll('.tour-highlights li')).map(li => li.textContent);
                
                // Create and show modal
                showTourModal(tourName, tourPrice, duration, highlights);
            });
        }
    });
}

function showTourModal(name, price, duration, highlights) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-info">
                        <p><strong>Price:</strong> ${price}</p>
                        <p><strong>Duration:</strong> ${duration}</p>
                    </div>
                    <h4>Tour Highlights:</h4>
                    <ul class="modal-highlights">
                        ${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                    <div class="modal-actions">
                        <a href="#contact" class="btn btn--primary" onclick="closeModal()">Book Now</a>
                        <button class="btn btn--outline" onclick="closeModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const modalStyles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: var(--space-16);
            }
            
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .modal-header {
                padding: var(--space-20);
                border-bottom: 1px solid var(--color-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--color-text-secondary);
            }
            
            .modal-body {
                padding: var(--space-20);
            }
            
            .modal-info {
                margin-bottom: var(--space-16);
            }
            
            .modal-highlights {
                list-style: none;
                padding: 0;
                margin: var(--space-12) 0 var(--space-20) 0;
            }
            
            .modal-highlights li {
                padding: var(--space-6) 0 var(--space-6) var(--space-20);
                position: relative;
            }
            
            .modal-highlights li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: var(--color-primary);
                font-weight: bold;
            }
            
            .modal-actions {
                display: flex;
                gap: var(--space-12);
                justify-content: flex-end;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    // Close modal on overlay click
    const overlay = document.querySelector('.modal-overlay');
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close modal on close button click
    const closeBtn = document.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Vehicle booking functionality
function initVehicleBooking() {
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    vehicleCards.forEach(card => {
        const bookBtn = card.querySelector('.btn--outline');
        if (bookBtn) {
            bookBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const vehicleType = card.querySelector('h3').textContent;
                const vehiclePrice = card.querySelector('.vehicle-price').textContent;
                
                // Fill contact form with vehicle info
                const tourInterestSelect = document.querySelector('select[name="tour-interest"]');
                const messageTextarea = document.querySelector('textarea[name="message"]');
                
                if (tourInterestSelect && messageTextarea) {
                    tourInterestSelect.value = 'custom';
                    messageTextarea.value = `I am interested in booking a ${vehicleType}. Price: ${vehiclePrice}. Please contact me with more details.`;
                    
                    // Scroll to contact form
                    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
}

// Initialize additional functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTourModals();
    initVehicleBooking();
    
    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Add smooth transitions for dynamic content
    const tourContents = document.querySelectorAll('.tour-content');
    tourContents.forEach(content => {
        content.style.transition = 'opacity 0.3s ease-in-out';
    });
});

// Utility function to handle errors
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
}

// Export functions for potential external use
window.TravelWebsite = {
    showTourModal,
    closeModal,
    validateForm,
    handleError
};