// ===================== PRODUCT FILTERING =====================
document.addEventListener('DOMContentLoaded', function() {
    // Product filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter products
                productCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 10);
                    } else {
                        const category = card.getAttribute('data-category');
                        if (category === filterValue) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                            }, 10);
                        } else {
                            card.style.opacity = '0';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    }
                });
            });
        });

        // Set initial active button
        if (filterButtons.length > 0) {
            filterButtons[0].classList.add('active');
        }
    }

    // ===================== CONTACT FORM HANDLING =====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

                    // Email validation
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Send form data to backend
            showFormMessage('Sending your message...', 'success');

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, subject, message })
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Unable to send message');
                }

                showFormMessage(result.message || 'Thank you! Your message has been received.', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Contact form submit error:', error);
                showFormMessage('Sorry, something went wrong. Please try again later.', 'error');
            }
        });
    }

    // ===================== ADD TO CART FUNCTIONALITY =====================
    const addToCartButtons = document.querySelectorAll('.btn-small');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-info').querySelector('h3').textContent;
            
            // Change button text temporarily
            const originalText = this.textContent;
            this.textContent = '✓ Added to Cart';
            this.style.background = '#27ae60';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        });
    });

    // ===================== SMOOTH SCROLL FOR ANCHOR LINKS =====================
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===================== ACTIVE NAV LINK ON SCROLL =====================
    window.addEventListener('scroll', function() {
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });

    // Trigger on page load
    window.dispatchEvent(new Event('scroll'));
});

// ===================== HELPER FUNCTIONS =====================

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form message function
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        
        if (type === 'error') {
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
}

// Add animation to elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInDown 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations
animateOnScroll();

// Log page load
console.log('Jeff Clothings website loaded successfully!');
