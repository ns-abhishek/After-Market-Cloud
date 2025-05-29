/**
 * Evenly Distributed Navigation Menu JavaScript for ERP User Manual
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeResponsiveNavigation();
    handleWindowResize();
});

/**
 * Initialize responsive navigation functionality
 */
function initializeResponsiveNavigation() {
    // Add click event for dropdown toggles on mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only handle click on small screens
            if (window.innerWidth <= 576) {
                e.preventDefault();
                const parent = this.closest('.dropdown');
                
                // Toggle active class
                parent.classList.toggle('active');
                
                // Update aria-expanded attribute
                const isExpanded = parent.classList.contains('active');
                this.setAttribute('aria-expanded', isExpanded);
            }
        });
    });
}

/**
 * Handle window resize events
 */
function handleWindowResize() {
    window.addEventListener('resize', function() {
        // Reset dropdown states on larger screens
        if (window.innerWidth > 576) {
            const activeDropdowns = document.querySelectorAll('.dropdown.active');
            activeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}

/**
 * Adjust navigation items based on available space
 * This ensures the menu items are evenly distributed
 */
function adjustNavigationItems() {
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!navMenu || navItems.length === 0) return;
    
    // Get available width
    const availableWidth = navMenu.offsetWidth;
    const itemCount = navItems.length;
    
    // Calculate ideal item width
    const idealItemWidth = Math.floor(availableWidth / itemCount);
    
    // Apply width to each item
    navItems.forEach(item => {
        item.style.maxWidth = `${idealItemWidth}px`;
    });
}

// Call adjustNavigationItems on load and resize
window.addEventListener('load', adjustNavigationItems);
window.addEventListener('resize', adjustNavigationItems);
