document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing Fremburg Tires scripts');

    // Function to show modal with custom message
    function showAlertModal(message) {
        try {
            const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
            const modalBody = document.getElementById('alertModalMessage');
            if (!modalBody || !alertModal) {
                console.error('Alert modal elements not found');
                return;
            }
            modalBody.textContent = message;
            alertModal.show();
            console.log('Alert modal shown with message:', message);
        } catch (error) {
            console.error('Error showing alert modal:', error);
        }
    }

    // Smooth scrolling for navigation links and buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                console.log('Smooth scrolling to:', href);
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                    console.log('Mobile menu closed');
                }
            } else {
                console.warn('Target element not found:', href);
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const navbarLogo = document.querySelector('.navbar-brand img');
    if (navbar && navbarLogo) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                navbarLogo.style.height = '35px';
                console.log('Navbar scrolled class added, logo resized');
            } else {
                navbar.classList.remove('scrolled');
                navbarLogo.style.height = '40px';
                console.log('Navbar scrolled class removed, logo restored');
            }
        });
    } else {
        console.warn('Navbar or logo not found');
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
                console.log('Back-to-top button shown');
            } else {
                backToTopButton.classList.remove('active');
                console.log('Back-to-top button hidden');
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('Back-to-top clicked');
        });
    } else {
        console.warn('Back-to-top button not found');
    }

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in, .slide-up');
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.8;

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            if (elementPosition < triggerPoint) {
                element.classList.add('visible');
                console.log('Animation triggered for element:', element.className);
            }
        });
    }

    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    console.log('Scroll animation listeners initialized');

    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                showAlertModal('Please fill in all required fields (Name, Email, Subject, Message).');
                console.log('Contact form validation failed: missing required fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlertModal('Please enter a valid email address.');
                console.log('Contact form validation failed: invalid email');
                return;
            }

            if (phone && !/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
                showAlertModal('Please enter a valid phone number (if provided).');
                console.log('Contact form validation failed: invalid phone');
                return;
            }

            showAlertModal(`Thank you, ${name}! Your message about "${subject}" has been received. We'll contact you at ${email} soon.`);
            contactForm.reset();
            console.log('Contact form submitted successfully');
        });
    } else {
        console.warn('Contact form not found');
    }

    // Newsletter form validation and submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Newsletter form submitted');

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showAlertModal('Please enter an email address.');
                console.log('Newsletter form validation failed: missing email');
                return;
            }

            if (!emailRegex.test(email)) {
                showAlertModal('Please enter a valid email address.');
                console.log('Newsletter form validation failed: invalid email');
                return;
            }

            showAlertModal('Thank you for subscribing to our newsletter! Expect updates soon.');
            emailInput.value = '';
            console.log('Newsletter subscription successful');
        });
    } else {
        console.warn('Newsletter form not found');
    }

    // Product card hover effect and view details
    const tireCards = document.querySelectorAll('.tire-card');
    if (tireCards.length) {
        tireCards.forEach(card => {
            // Hover effect
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1.05)';
                    console.log('Tire card hover: scale image');
                }
            });
            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)';
                    console.log('Tire card hover off: reset image');
                }
            });

            // View Details button
            const viewDetailsBtn = card.querySelector('.btn-outline-primary');
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', () => {
                    const tireName = card.querySelector('.card-title').textContent;
                    const tirePrice = card.querySelector('.price').textContent;
                    showAlertModal(`Viewing details for ${tireName} - Price: ${tirePrice}. Contact us for more information!`);
                    console.log('View Details clicked for:', tireName);
                });
            }
        });
    } else {
        console.warn('Tire cards not found');
    }
});

// Add alert modal HTML
const alertModalHTML = `
<div class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="alertModalLabel">Notification</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p id="alertModalMessage"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>
`;

// Inject the modal HTML into the document
try {
    document.body.insertAdjacentHTML('beforeend', alertModalHTML);
    console.log('Alert modal HTML injected');
} catch (error) {
    console.error('Error injecting alert modal HTML:', error);
}