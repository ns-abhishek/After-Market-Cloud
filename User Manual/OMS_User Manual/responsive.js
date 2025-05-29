/**
 * Responsive JavaScript for OMS User Manual
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
        const header = document.querySelector('.header');
        const nav = document.querySelector('.horizontal-nav');
        
        if (!header || !nav) return;
        
        // Check if mobile toggle already exists
        if (!document.querySelector('.mobile-menu-toggle')) {
            // Create mobile menu toggle button
            const mobileMenuToggle = document.createElement('button');
            mobileMenuToggle.className = 'icon-btn mobile-menu-toggle';
            mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Insert at the beginning of header
            header.insertBefore(mobileMenuToggle, header.firstChild);
            
            // Add click event listener
            mobileMenuToggle.addEventListener('click', function() {
                nav.classList.toggle('mobile-nav-open');
                
                // Toggle icon
                const icon = mobileMenuToggle.querySelector('i');
                if (nav.classList.contains('mobile-nav-open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
        }
    }
    
    /**
     * Initialize responsive tables
     */
    function initResponsiveTables() {
        const tables = document.querySelectorAll('table');
        
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
            modalContent.style.height = '95%';
        } else if (width < 768) {
            modalContent.style.width = '90%';
            modalContent.style.height = '90%';
        } else {
            modalContent.style.width = '90%';
            modalContent.style.height = '90%';
        }
    }
    
    /**
     * Handle window resize event
     */
    function handleWindowResize() {
        const width = window.innerWidth;
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.horizontal-nav');
        
        // Show/hide mobile menu toggle based on screen width
        if (width < 768 && mobileMenuToggle) {
            mobileMenuToggle.style.display = 'flex';
            
            // Close mobile menu when resizing to mobile
            if (nav && nav.classList.contains('mobile-nav-open')) {
                nav.classList.remove('mobile-nav-open');
                const icon = document.querySelector('.mobile-menu-toggle i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        } else if (mobileMenuToggle) {
            mobileMenuToggle.style.display = 'none';
            
            // Reset mobile menu when resizing to desktop
            if (nav) {
                nav.classList.remove('mobile-nav-open');
            }
        }
        
        // Adjust modals based on screen width
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            adjustModalSize(modal);
        });
    }
});
