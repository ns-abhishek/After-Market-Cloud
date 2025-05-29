/**
 * Admin Menu Redesign
 * JavaScript for the redesigned horizontal menu
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
    // Handle submenu toggles
    const menuItemsWithSubmenu = document.querySelectorAll('.admin-nav li.has-submenu');
    
    menuItemsWithSubmenu.forEach(item => {
        const link = item.querySelector('a');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close other open submenus
            menuItemsWithSubmenu.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                }
            });
            
            // Toggle current submenu
            item.classList.toggle('open');
        });
    });
    
    // Handle "More" menu toggle
    const moreMenu = document.querySelector('.admin-nav .menu-more');
    if (moreMenu) {
        const moreLink = moreMenu.querySelector('a');
        
        moreLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close open submenus
            menuItemsWithSubmenu.forEach(item => {
                if (item.classList.contains('open')) {
                    item.classList.remove('open');
                }
            });
            
            // Toggle more menu
            moreMenu.classList.toggle('open');
        });
    }
    
    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.admin-nav li.has-submenu') && 
            !e.target.closest('.admin-nav .menu-more')) {
            
            // Close all open menus
            document.querySelectorAll('.admin-nav li.open').forEach(item => {
                item.classList.remove('open');
            });
        }
    });
}

/**
 * Adjust menu based on screen size
 */
function adjustMenuForScreenSize() {
    const menuContainer = document.querySelector('.admin-horizontal-menu');
    const menuItems = document.querySelectorAll('.admin-nav > ul > li:not(.menu-more):not(.menu-divider)');
    const moreMenu = document.querySelector('.admin-nav .menu-more');
    const moreMenuDropdown = document.querySelector('.admin-nav .menu-more-dropdown');
    
    if (!menuContainer || !moreMenu || !moreMenuDropdown) return;
    
    // Reset visibility
    menuItems.forEach(item => {
        item.style.display = '';
    });
    
    // Clear more menu
    while (moreMenuDropdown.firstChild) {
        moreMenuDropdown.removeChild(moreMenuDropdown.firstChild);
    }
    
    // Hide more menu initially
    moreMenu.style.display = 'none';
    
    // Check if we need to show the more menu
    if (isMenuOverflowing()) {
        moreMenu.style.display = 'block';
        
        // Move overflowing items to more menu
        let i = menuItems.length - 1;
        while (i >= 0 && isMenuOverflowing()) {
            const item = menuItems[i];
            
            // Skip already hidden items
            if (item.style.display === 'none') {
                i--;
                continue;
            }
            
            // Clone the item for the more menu
            const clone = item.cloneNode(true);
            clone.classList.remove('has-submenu', 'open');
            
            // If it has a submenu, convert it to a regular item
            const submenu = clone.querySelector('.submenu');
            if (submenu) {
                submenu.remove();
            }
            
            // Add to more menu
            moreMenuDropdown.prepend(clone);
            
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
    const menuContainer = document.querySelector('.admin-horizontal-menu');
    const menuUl = document.querySelector('.admin-nav > ul');
    
    if (!menuContainer || !menuUl) return false;
    
    return menuUl.scrollWidth > menuContainer.clientWidth;
}
