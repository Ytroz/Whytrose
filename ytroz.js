document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing scripts');

    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            console.log('Window loaded, fading out preloader');
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                console.log('Preloader hidden');
            }, 500);
        });
    } else {
        console.log('Preloader element not found');
    }

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

    // Smooth scrolling for nav links, back-to-top, and specific buttons
    document.querySelectorAll('.nav-link, .btn-nav, .back-to-top, .scroll-down, a[href="#about"], a[href="#companies"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    console.log('Smooth scrolling to:', targetId);
                } else {
                    console.warn('Target element not found:', targetId);
                }
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
                console.log('Navbar scrolled class added');
            } else {
                navbar.classList.remove('navbar-scrolled');
                console.log('Navbar scrolled class removed');
            }
        });
    } else {
        console.warn('Navbar element not found');
    }

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const counterSection = document.querySelector('.bg-dark');
    let countersAnimated = false;

    function animateCounters() {
        console.log('Animating counters');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    console.log('Counter reached target:', target);
                }
            };
            updateCounter();
        });
    }

    if (counterSection && counters.length) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
                console.log('Counter section in view, animation triggered');
            }
        }, { threshold: 0.5 });
        observer.observe(counterSection);
    } else {
        console.warn('Counter section or counters not found');
    }

    // Initialize Slick Slider for testimonials
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider && typeof jQuery !== 'undefined' && jQuery.fn.slick) {
        try {
            jQuery(testimonialSlider).slick({
                dots: true,
                arrows: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 5000,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            dots: true
                        }
                    }
                ]
            });
            console.log('Slick Slider initialized for testimonials');
        } catch (error) {
            console.error('Error initializing Slick Slider:', error);
        }
    } else {
        console.warn('Testimonial slider or jQuery/Slick not available');
    }

    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                showAlertModal('Please fill in all required fields.');
                console.log('Contact form validation failed: missing fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlertModal('Please enter a valid email address.');
                console.log('Contact form validation failed: invalid email');
                return;
            }

            showAlertModal('Message sent successfully! We will get back to you soon.');
            contactForm.reset();
            console.log('Contact form submitted successfully');
        });
    } else {
        console.warn('Contact form not found');
    }

    // Newsletter form submission
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

            showAlertModal('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
            console.log('Newsletter subscription successful');
        });
    } else {
        console.warn('Newsletter form not found');
    }

    // Back to top button visibility
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
                console.log('Back-to-top button shown');
            } else {
                backToTop.style.display = 'none';
                console.log('Back-to-top button hidden');
            }
        });
    } else {
        console.warn('Back-to-top button not found');
    }

    // Particles.js initialization
    if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
        try {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#ffffff' },
                    shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                    opacity: { value: 0.5, random: false },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                    modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
                },
                retina_detect: true
            });
            console.log('Particles.js initialized');
        } catch (error) {
            console.error('Error initializing Particles.js:', error);
        }
    } else {
        console.warn('Particles.js container or library not found');
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