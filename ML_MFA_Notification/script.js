document.addEventListener('DOMContentLoaded', function() {
    // Create toast notification element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);

    // Get language elements
    const languageToggle = document.getElementById('language-toggle');
    const languageMenu = document.getElementById('language-menu');
    const languageOptions = document.querySelectorAll('.language-option');
    const dimmingOverlay = document.getElementById('dimming-overlay');

    // Set default language
    let currentLanguage = 'en';
    updateLanguageUI(currentLanguage);

    // Calculate positions for language menu
    function positionLanguageMenu() {
        // Get the position of the language toggle button
        const toggleRect = languageToggle.getBoundingClientRect();
        const toggleCenterX = toggleRect.left + toggleRect.width / 2;
        const toggleCenterY = toggleRect.top + toggleRect.height / 2;

        // Set the menu position to be centered on the toggle button
        languageMenu.style.left = toggleCenterX + 'px';
        languageMenu.style.top = toggleCenterY + 'px';

        // Position each language option in a semi-circle
        const radius = 80; // Distance from center
        const totalOptions = languageOptions.length;

        // Start from bottom-right and go counter-clockwise
        const startAngle = -45; // degrees
        const endAngle = 180; // degrees - extended to accommodate the additional language
        const angleStep = (endAngle - startAngle) / (totalOptions - 1);

        languageOptions.forEach((option, index) => {
            const angle = (startAngle + index * angleStep) * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            option.style.transform = 'translate(-50%, -50%)';
            option.style.left = x + 'px';
            option.style.top = y + 'px';

            // Mark active language
            if (option.getAttribute('data-lang') === currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Toggle language menu
    languageToggle.addEventListener('click', function() {
        // Position the menu before showing it
        positionLanguageMenu();

        // Show the menu and dimming overlay
        languageMenu.classList.add('active');
        dimmingOverlay.classList.add('active');

        // Animate the language options appearing
        languageOptions.forEach((option, index) => {
            setTimeout(() => {
                option.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50 * index);
        });
    });

    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            currentLanguage = lang;

            // Update UI with selected language
            updateLanguageUI(lang);

            // Add a visual feedback for selection
            this.classList.add('pulse-animation');
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 500);

            // Close the language menu with a slight delay for better UX
            closeLanguageMenu();
        });
    });

    // Close language menu
    function closeLanguageMenu() {
        // Animate the language options disappearing
        languageOptions.forEach((option, index) => {
            setTimeout(() => {
                option.style.transform = 'translate(-50%, -50%) scale(0)';
            }, 50 * index);
        });

        // Hide the menu and dimming overlay after animation completes
        setTimeout(() => {
            languageMenu.classList.remove('active');
            dimmingOverlay.classList.remove('active');
        }, 300);
    }

    // Close language menu when clicking on the dimming overlay
    dimmingOverlay.addEventListener('click', closeLanguageMenu);

    // Function to update UI with selected language
    function updateLanguageUI(lang) {
        // Update all text elements with translations
        for (const [elementId, translatedText] of Object.entries(translations[lang])) {
            const element = document.getElementById(elementId);
            if (element) {
                // Add a subtle fade transition effect
                element.style.opacity = '0';
                setTimeout(() => {
                    element.textContent = translatedText;
                    element.style.opacity = '1';
                }, 150);
            }
        }

        // Update the document language attribute
        document.documentElement.lang = lang;

        // Show a toast notification for language change
        showToast(`Language changed to ${getLanguageName(lang)}`);
    }

    // Helper function to get full language name
    function getLanguageName(langCode) {
        const languageNames = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'hi': 'हिन्दी'
        };
        return languageNames[langCode] || langCode;
    }

    // Function to show toast notification
    function showToast(message) {
        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Add entrance animation for the language toggle button
    languageToggle.style.transform = 'scale(0)';
    languageToggle.style.opacity = '0';

    setTimeout(() => {
        languageToggle.style.transform = 'scale(1)';
        languageToggle.style.opacity = '1';
    }, 500);

    // Handle window resize to reposition the language menu
    window.addEventListener('resize', function() {
        if (languageMenu.classList.contains('active')) {
            positionLanguageMenu();
        }
    });
});
