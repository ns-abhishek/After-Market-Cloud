/**
 * Collapsible Sidebar JavaScript for ERP User Manual
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeCollapsibleSidebar();
});

/**
 * Initialize the collapsible sidebar functionality
 */
function initializeCollapsibleSidebar() {
    // Create sidebar tab
    createSidebarTab();

    // Create hover area
    createSidebarHoverArea();

    // Set up event listeners
    setupSidebarEventListeners();

    // Check if sidebar state is stored in localStorage
    checkSavedSidebarState();

    // Handle window resize events
    handleWindowResize();
}

/**
 * Create the sidebar tab indicator
 */
function createSidebarTab() {
    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) return;

    const sidebarTab = document.createElement('div');
    sidebarTab.className = 'sidebar-tab';
    sidebarTab.innerHTML = '<i class="fas fa-chevron-right"></i><span class="sidebar-tab-label">Menu</span>';
    sidebarTab.setAttribute('aria-label', 'Toggle sidebar menu');
    sidebarTab.setAttribute('role', 'button');
    sidebarTab.setAttribute('tabindex', '0');

    document.body.appendChild(sidebarTab);
}

/**
 * Create the sidebar hover area
 */
function createSidebarHoverArea() {
    const hoverArea = document.createElement('div');
    hoverArea.className = 'sidebar-hover-area';
    document.body.appendChild(hoverArea);
}

/**
 * Set up event listeners for the sidebar
 */
function setupSidebarEventListeners() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarTab = document.querySelector('.sidebar-tab');
    const hoverArea = document.querySelector('.sidebar-hover-area');

    if (!sidebar || !sidebarTab || !hoverArea) return;

    // Tab click event
    sidebarTab.addEventListener('click', function() {
        toggleSidebar();
    });

    // Tab keyboard event (for accessibility)
    sidebarTab.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSidebar();
        }
    });

    // Hover area events
    hoverArea.addEventListener('mouseenter', function() {
        showSidebar();
    });

    // Tab hover events
    sidebarTab.addEventListener('mouseenter', function() {
        showSidebar();
    });

    // Sidebar events
    sidebar.addEventListener('mouseleave', function(e) {
        // Only hide if we're not hovering over the tab or hover area
        if (!e.relatedTarget ||
            (!e.relatedTarget.classList.contains('sidebar-tab') &&
             !e.relatedTarget.classList.contains('sidebar-hover-area'))) {
            hideSidebar();
        }
    });

    // Keep sidebar visible when interacting with it
    sidebar.addEventListener('mouseenter', function() {
        showSidebar();
    });

    // Prevent hiding when interacting with sidebar content
    sidebar.addEventListener('click', function(e) {
        // If clicking a link, allow hiding after navigation
        if (!e.target.closest('a')) {
            e.stopPropagation();
        }
    });

    // Document click event to hide sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('visible') &&
            !e.target.closest('.sidebar') &&
            !e.target.closest('.sidebar-tab') &&
            !e.target.closest('.sidebar-hover-area')) {
            hideSidebar();
        }
    });

    // Add focus/blur events for accessibility
    sidebar.addEventListener('focusin', function() {
        showSidebar();
    });

    sidebar.addEventListener('focusout', function(e) {
        if (!sidebar.contains(e.relatedTarget) &&
            e.relatedTarget !== sidebarTab) {
            hideSidebar();
        }
    });
}

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarTab = document.querySelector('.sidebar-tab');

    if (!sidebar || !sidebarTab) return;

    if (sidebar.classList.contains('visible')) {
        hideSidebar();
    } else {
        showSidebar();
    }
}

/**
 * Show the sidebar
 */
function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarTab = document.querySelector('.sidebar-tab');

    if (!sidebar || !sidebarTab) return;

    sidebar.classList.add('visible');
    sidebarTab.classList.add('sidebar-visible');

    // Save state to localStorage
    localStorage.setItem('sidebar-visible', 'true');
}

/**
 * Hide the sidebar
 */
function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarTab = document.querySelector('.sidebar-tab');

    if (!sidebar || !sidebarTab) return;

    sidebar.classList.remove('visible');
    sidebarTab.classList.remove('sidebar-visible');

    // Save state to localStorage
    localStorage.setItem('sidebar-visible', 'false');
}

/**
 * Check if sidebar state is saved in localStorage
 */
function checkSavedSidebarState() {
    // Always default to hidden regardless of localStorage
    hideSidebar();

    // Clear any previous saved state
    localStorage.removeItem('sidebar-visible');
}

/**
 * Handle window resize events
 */
function handleWindowResize() {
    window.addEventListener('resize', function() {
        // Adjust sidebar behavior based on screen size if needed
        const width = window.innerWidth;

        // On very small screens, always hide sidebar
        if (width < 576) {
            hideSidebar();
        }
    });
}
