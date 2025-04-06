document.addEventListener('DOMContentLoaded', function() {
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            backToTopButton.classList.remove('active');
            if (window.pageYOffset < 50) {
                document.querySelector('.navbar').classList.remove('scrolled');
            }
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Property card hover effect
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });
    
    // Job application form handling
    const jobApplyButtons = document.querySelectorAll('.job-apply-btn');
    jobApplyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.closest('.accordion-body').querySelector('h6').textContent;
            console.log(`Applying for: ${jobTitle}`);
            // In a real implementation, this would open an application form
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Search form submission
    const searchForms = document.querySelectorAll('.search-box form');
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle search submission
            console.log('Search submitted');
        });
    });
});