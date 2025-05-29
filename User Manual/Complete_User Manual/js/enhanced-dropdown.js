// Enhanced Dropdown Menu JavaScript for ERP User Manual

document.addEventListener('DOMContentLoaded', function() {
    // Get all dropdown toggles and dropdowns
    const dropdownToggles = document.querySelectorAll('.nav-link.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');

    // Handle dropdown toggle clicks for all screen sizes
    dropdownToggles.forEach((dropdownToggle, index) => {
        const dropdown = dropdowns[index];

        if (dropdownToggle && dropdown) {
            // Set initial ARIA attributes
            dropdownToggle.setAttribute('aria-haspopup', 'true');
            dropdownToggle.setAttribute('aria-expanded', 'false');

            // Add click event listener
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();

                // Close all other dropdowns first
                dropdowns.forEach((otherDropdown, otherIndex) => {
                    if (otherIndex !== index && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                        dropdownToggles[otherIndex].setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('active');

                // Toggle aria-expanded attribute for accessibility
                const isExpanded = dropdown.classList.contains('active');
                dropdownToggle.setAttribute('aria-expanded', isExpanded);
            });
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        dropdowns.forEach((dropdown, index) => {
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                if (dropdownToggles[index]) {
                    dropdownToggles[index].setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Handle keyboard navigation for accessibility
    const enhancedDropdowns = document.querySelectorAll('.enhanced-dropdown');

    enhancedDropdowns.forEach((enhancedDropdown, dropdownIndex) => {
        // Set ARIA attributes
        enhancedDropdown.setAttribute('aria-label', 'ERP Modules');
        enhancedDropdown.setAttribute('role', 'menu');

        const dropdownLinks = enhancedDropdown.querySelectorAll('.enhanced-dropdown-link');

        dropdownLinks.forEach((link, index) => {
            // Set role for accessibility
            link.setAttribute('role', 'menuitem');

            // Add keyboard navigation
            link.addEventListener('keydown', function(e) {
                // Handle arrow keys
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (index < dropdownLinks.length - 1) {
                        dropdownLinks[index + 1].focus();
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index > 0) {
                        dropdownLinks[index - 1].focus();
                    } else {
                        dropdownToggles[dropdownIndex].focus();
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    dropdowns[dropdownIndex].classList.remove('active');
                    dropdownToggles[dropdownIndex].setAttribute('aria-expanded', 'false');
                    dropdownToggles[dropdownIndex].focus();
                }
            });
        });
    });

    // Add hover functionality for desktop
    dropdowns.forEach((dropdown, index) => {
        // Add mouseenter event
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                dropdown.classList.add('hover-active');
                if (dropdownToggles[index]) {
                    dropdownToggles[index].setAttribute('aria-expanded', 'true');
                }
            }
        });

        // Add mouseleave event
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                dropdown.classList.remove('hover-active');
                if (dropdownToggles[index]) {
                    dropdownToggles[index].setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
});
