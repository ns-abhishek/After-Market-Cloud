/**
 * Responsive Behavior for User Manual Admin
 * This file contains JavaScript functions to enhance responsive behavior
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize responsive features
    initResponsiveFeatures();

    // Add window resize event listener
    window.addEventListener('resize', handleWindowResize);

    /**
     * Initialize responsive features
     */
    function initResponsiveFeatures() {
        // Add mobile menu toggle button if it doesn't exist
        addMobileMenuToggle();

        // Initialize responsive tables
        initResponsiveTables();

        // Initialize responsive modals
        initResponsiveModals();

        // Check initial window size
        handleWindowResize();
    }

    /**
     * Add mobile menu toggle button
     */
    function addMobileMenuToggle() {
        // Check if mobile menu toggle already exists
        if (document.querySelector('.mobile-menu-toggle')) {
            return;
        }

        // Get the admin header
        const adminHeader = document.querySelector('.admin-header');
        if (!adminHeader) {
            return;
        }

        // Create mobile menu toggle button
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'icon-btn mobile-menu-toggle';
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileMenuToggle.style.display = 'none'; // Hide by default

        // Add to header actions
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.prepend(mobileMenuToggle);

            // Add event listener
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        const adminNav = document.querySelector('.admin-nav');
        if (adminNav) {
            adminNav.classList.toggle('mobile-nav-open');

            // Toggle icon
            const icon = document.querySelector('.mobile-menu-toggle i');
            if (icon) {
                if (adminNav.classList.contains('mobile-nav-open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        }
    }

    /**
     * Initialize responsive tables
     */
    function initResponsiveTables() {
        const tables = document.querySelectorAll('.admin-content-table');

        tables.forEach(table => {
            // Add responsive class
            table.classList.add('responsive-table');

            // Get headers
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

            // Add data attributes to cells for mobile view
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (headers[index]) {
                        cell.setAttribute('data-label', headers[index]);
                    }
                });
            });
        });
    }

    /**
     * Initialize responsive modals
     */
    function initResponsiveModals() {
        const modals = document.querySelectorAll('.modal');

        modals.forEach(modal => {
            // Adjust modal content based on screen size
            adjustModalSize(modal);
        });
    }

    /**
     * Adjust modal size based on screen width
     * @param {HTMLElement} modal - The modal element
     */
    function adjustModalSize(modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) return;

        const width = window.innerWidth;

        if (width < 576) {
            modalContent.style.width = '95%';
            modalContent.style.maxHeight = '95%';
        } else if (width < 768) {
            modalContent.style.width = '90%';
            modalContent.style.maxHeight = '90%';
        } else {
            modalContent.style.width = '80%';
            modalContent.style.maxHeight = '80%';
        }
    }

    /**
     * Handle window resize
     */
    function handleWindowResize() {
        const width = window.innerWidth;
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const adminNav = document.querySelector('.admin-nav');

        // Show/hide mobile menu toggle based on screen width
        if (width < 768 && mobileMenuToggle) {
            mobileMenuToggle.style.display = 'flex';

            // Close mobile menu when resizing to mobile
            if (adminNav && adminNav.classList.contains('mobile-nav-open')) {
                adminNav.classList.remove('mobile-nav-open');
                const icon = document.querySelector('.mobile-menu-toggle i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        } else if (mobileMenuToggle) {
            mobileMenuToggle.style.display = 'none';

            // Reset mobile menu when resizing to desktop
            if (adminNav) {
                adminNav.classList.remove('mobile-nav-open');
            }
        }

        // Adjust modals based on screen width
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            adjustModalSize(modal);
        });

        // Adjust chart heights based on screen width
        adjustChartHeights(width);
    }

    /**
     * Adjust chart heights based on screen width
     * @param {number} width - Window width
     */
    function adjustChartHeights(width) {
        const chartContainers = document.querySelectorAll('.chart-container');

        chartContainers.forEach(container => {
            if (width < 576) {
                container.style.height = '250px';
            } else if (width < 992) {
                container.style.height = '300px';
            } else {
                container.style.height = '350px';
            }
        });
    }
});
