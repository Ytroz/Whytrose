document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing Fremburg Real Estate scripts');

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

    // Smooth scrolling for nav links and buttons
    document.querySelectorAll('.nav-link[href^="#"], .btn-warning[href^="#"], .btn-outline-light[href^="#"], .back-to-top').forEach(anchor => {
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

    // Properties dropdown toggle (fallback if Bootstrap dropdown fails)
    const propertiesDropdown = document.getElementById('propertiesDropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (propertiesDropdown && dropdownMenu) {
        propertiesDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
            console.log('Properties dropdown toggled');
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!propertiesDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                console.log('Properties dropdown closed');
            }
        });
    } else {
        console.warn('Properties dropdown or menu not found');
    }

    // Property search form validation and submission
    const searchForms = document.querySelectorAll('.tab-pane form');
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Property search form submitted');

            const propertyType = form.querySelector('select:nth-child(1)').value;
            const location = form.querySelector('select:nth-child(2)').value;
            const bedrooms = form.querySelector('select:nth-child(3)').value;
            const priceRange = form.querySelector('select:nth-child(4)').value;

            if (!propertyType || !location || !bedrooms || !priceRange) {
                showAlertModal('Please select all search criteria.');
                console.log('Search form validation failed: missing fields');
                return;
            }

            // Simulate search results
            const sampleResults = [
                { title: 'Modern Luxury Villa', location: 'Beverly Hills, CA', price: '$1,250,000', beds: 4 },
                { title: 'Downtown Penthouse', location: 'Manhattan, NY', price: '$3,200/mo', beds: 2 },
                { title: 'Oceanfront Estate', location: 'Malibu, CA', price: '$2,950,000', beds: 5 }
            ];

            const resultsMessage = sampleResults
                .map(result => `${result.title} (${result.location}, ${result.beds} Beds, ${result.price})`)
                .join('\n');
            showAlertModal(`Found ${sampleResults.length} properties:\n${resultsMessage}`);
            console.log('Search form submitted successfully, results:', sampleResults);
        });
    });

    // Job application handling
    const applyButtons = document.querySelectorAll('#jobPortalModal .btn-warning');
    const generalApplyButton = document.querySelector('#jobPortalModal .btn-dark');

    if (applyButtons) {
        applyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobTitle = this.closest('.accordion-item').querySelector('h6').textContent;
                showAlertModal(`Application submitted for ${jobTitle}! We will contact you soon.`);
                console.log('Job application submitted for:', jobTitle);
            });
        });
    } else {
        console.warn('Job apply buttons not found');
    }

    if (generalApplyButton) {
        generalApplyButton.addEventListener('click', function() {
            showAlertModal('General application submitted! We will review and contact you if there’s a fit.');
            console.log('General job application submitted');
        });
    } else {
        console.warn('General apply button not found');
    }

    // Back to top button visibility
    const backToTop = document.getElementById('backToTop');
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
                <button type="button" class="btn btn-warning" data-bs-dismiss="modal">OK</button>
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