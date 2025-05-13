document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing Fremgrik Farming scripts');

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
    document.querySelectorAll('.nav-link, .btn-success[href^="#"]').forEach(anchor => {
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

    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
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
    const newsletterForm = document.getElementById('newsletterForm');
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

    // Job search functionality
    const jobSearchForm = document.getElementById('jobSearchForm');
    const jobListings = document.getElementById('jobListings');

    // Sample job data
    const jobs = [
        {
            title: 'Agronomist',
            location: 'cocoa-farm',
            type: 'full-time',
            description: 'Oversee cocoa production and implement sustainable farming techniques.'
        },
        {
            title: 'Rubber Plantation Manager',
            location: 'rubber-plant',
            type: 'full-time',
            description: 'Manage rubber tree plantations and ensure quality latex production.'
        },
        {
            title: 'Palm Kernel Processor',
            location: 'palm-estate',
            type: 'seasonal',
            description: 'Operate machinery for palm kernel oil extraction.'
        },
        {
            title: 'Rice Field Technician',
            location: 'rice-fields',
            type: 'full-time',
            description: 'Monitor irrigation systems and maintain rice fields.'
        },
        {
            title: 'Agricultural Intern',
            location: 'headquarters',
            type: 'internship',
            description: 'Support various farming operations and research projects.'
        }
    ];

    function displayJobs(filteredJobs) {
        jobListings.innerHTML = '';
        if (filteredJobs.length === 0) {
            jobListings.innerHTML = '<p class="text-muted">No jobs found matching your criteria.</p>';
            console.log('No jobs found for current filters');
            return;
        }

        filteredJobs.forEach(job => {
            const jobItem = document.createElement('a');
            jobItem.className = 'list-group-item list-group-item-action';
            jobItem.innerHTML = `
                <h5 class="mb-1 text-success">${job.title}</h5>
                <p class="mb-1"><strong>Location:</strong> ${job.location.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                <p class="mb-1"><strong>Type:</strong> ${job.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                <p class="mb-0">${job.description}</p>
            `;
            jobListings.appendChild(jobItem);
        });
        console.log('Displayed jobs:', filteredJobs);
    }

    // Initial display of all jobs
    displayJobs(jobs);

    if (jobSearchForm && jobListings) {
        jobSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Job search form submitted');

            const keyword = document.getElementById('jobKeyword').value.toLowerCase();
            const location = document.getElementById('jobLocation').value;
            const jobType = document.getElementById('jobType').value;

            const filteredJobs = jobs.filter(job => {
                const matchesKeyword = !keyword || job.title.toLowerCase().includes(keyword) || job.description.toLowerCase().includes(keyword);
                const matchesLocation = !location || job.location === location;
                const matchesType = !jobType || job.type === jobType;
                return matchesKeyword && matchesLocation && matchesType;
            });

            displayJobs(filteredJobs);
            showAlertModal(filteredJobs.length > 0 ? `${filteredJobs.length} job(s) found!` : 'No jobs found matching your criteria.');
            console.log('Job search completed, results:', filteredJobs.length);
        });
    } else {
        console.warn('Job search form or listings container not found');
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
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
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