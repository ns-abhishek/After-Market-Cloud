/**
 * Theme toggle functionality
 */
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
});

/**
 * Initialize the theme toggle functionality
 * This function can be called at any time to ensure the theme toggle is working
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const floatingThemeToggle = document.querySelector('.floating-theme-toggle');

    if (!themeToggle || !floatingThemeToggle) {
        console.error('Theme toggle elements not found');
        return;
    }

    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on saved preference or device preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
        updateThemeLabel('Dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
        updateThemeLabel('Light');
    }

    // Remove existing event listeners to prevent duplicates
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);

    // Toggle theme when the checkbox is clicked
    newThemeToggle.addEventListener('change', () => {
        if (newThemeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeLabel('Dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateThemeLabel('Light');
        }
    });

    // Function to update the theme label
    function updateThemeLabel(mode) {
        const themeLabel = floatingThemeToggle.querySelector('.theme-label');
        if (themeLabel) {
            themeLabel.textContent = `${mode} Mode`;
        }
    }

    // Add animation to the floating toggle button
    floatingThemeToggle.addEventListener('mouseenter', () => {
        floatingThemeToggle.style.transform = 'translateY(-50%) scale(1.05)';
    });

    floatingThemeToggle.addEventListener('mouseleave', () => {
        floatingThemeToggle.style.transform = 'translateY(-50%)';
    });
}

// Make the function globally available
window.initThemeToggle = initThemeToggle;
