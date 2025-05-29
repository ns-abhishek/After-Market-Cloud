/**
 * Admin Menu - New Design
 * JavaScript for the modern tab-based horizontal menu
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the menu
    initMenu();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        adjustMenuForScreenSize();
    });
    
    // Initial adjustment
    adjustMenuForScreenSize();
});

/**
 * Initialize the menu functionality
 */
function initMenu() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.admin-menu-toggle');
    const menuNav = document.querySelector('.admin-menu-nav');
    
    if (menuToggle && menuNav) {
        menuToggle.addEventListener('click', function() {
            menuNav.classList.toggle('mobile-open');
            
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = menuNav.classList.contains('mobile-open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Toggle icon
            const toggleIcon = menuToggle.querySelector('i');
            if (toggleIcon) {
                if (isExpanded) {
                    toggleIcon.classList.remove('fa-bars');
                    toggleIcon.classList.add('fa-times');
                } else {
                    toggleIcon.classList.remove('fa-times');
                    toggleIcon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Handle dropdown toggles
    const dropdownItems = document.querySelectorAll('.admin-menu-nav li.has-dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close other open dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('open')) {
                        otherItem.classList.remove('open');
                    }
                });
                
                // Toggle current dropdown
                item.classList.toggle('open');
            });
        }
    });
    
    // Handle "More" menu toggle
    const moreMenu = document.querySelector('.admin-menu-nav .more-menu');
    if (moreMenu) {
        const moreLink = moreMenu.querySelector('a');
        
        if (moreLink) {
            moreLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close open dropdowns
                dropdownItems.forEach(item => {
                    if (item.classList.contains('open')) {
                        item.classList.remove('open');
                    }
                });
                
                // Toggle more menu
                moreMenu.classList.toggle('open');
            });
        }
    }
    
    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.admin-menu-nav li.has-dropdown') && 
            !e.target.closest('.admin-menu-nav .more-menu')) {
            
            // Close all open menus
            document.querySelectorAll('.admin-menu-nav li.open').forEach(item => {
                item.classList.remove('open');
            });
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close dropdowns on Escape key
        if (e.key === 'Escape') {
            document.querySelectorAll('.admin-menu-nav li.open').forEach(item => {
                item.classList.remove('open');
            });
            
            // Also close mobile menu if open
            if (menuNav && menuNav.classList.contains('mobile-open')) {
                menuNav.classList.remove('mobile-open');
                
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    
                    const toggleIcon = menuToggle.querySelector('i');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-times');
                        toggleIcon.classList.add('fa-bars');
                    }
                }
            }
        }
    });
}

/**
 * Adjust menu based on screen size
 */
function adjustMenuForScreenSize() {
    const menuContainer = document.querySelector('.admin-menu');
    const primaryMenu = document.querySelector('.admin-menu-nav .primary-menu');
    const moreMenu = document.querySelector('.admin-menu-nav .more-menu');
    const moreDropdown = document.querySelector('.admin-menu-nav .more-menu .dropdown');
    
    if (!menuContainer || !primaryMenu || !moreMenu || !moreDropdown) return;
    
    // Only run this on larger screens
    if (window.innerWidth <= 768) return;
    
    // Reset visibility of optional items
    const optionalItems = document.querySelectorAll('.admin-menu-nav .primary-menu > li.optional');
    optionalItems.forEach(item => {
        item.style.display = '';
    });
    
    // Clear more menu
    while (moreDropdown.firstChild) {
        moreDropdown.removeChild(moreDropdown.firstChild);
    }
    
    // Hide more menu initially
    moreMenu.style.display = 'none';
    
    // Check if we need to show the more menu
    if (isMenuOverflowing()) {
        moreMenu.style.display = 'flex';
        
        // Move overflowing optional items to more menu
        let i = optionalItems.length - 1;
        while (i >= 0 && isMenuOverflowing()) {
            const item = optionalItems[i];
            
            // Skip already hidden items
            if (item.style.display === 'none') {
                i--;
                continue;
            }
            
            // Clone the item for the more menu
            const clone = item.cloneNode(true);
            clone.classList.remove('has-dropdown', 'open', 'optional');
            
            // If it has a dropdown, convert it to a regular item
            const dropdown = clone.querySelector('.dropdown');
            if (dropdown) {
                dropdown.remove();
            }
            
            // Add to more menu
            moreDropdown.prepend(clone);
            
            // Hide original item
            item.style.display = 'none';
            
            i--;
        }
    }
}

/**
 * Check if the menu is overflowing
 */
function isMenuOverflowing() {
    const menuContainer = document.querySelector('.admin-menu');
    const primaryMenu = document.querySelector('.admin-menu-nav .primary-menu');
    
    if (!menuContainer || !primaryMenu) return false;
    
    // Get the total width of all visible menu items
    let totalWidth = 0;
    const menuItems = primaryMenu.querySelectorAll('li');
    
    menuItems.forEach(item => {
        if (item.style.display !== 'none') {
            totalWidth += item.offsetWidth;
        }
    });
    
    // Add some padding
    totalWidth += 50;
    
    // Check if it overflows
    return totalWidth > menuContainer.clientWidth;
}
