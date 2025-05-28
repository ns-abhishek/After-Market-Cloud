/**
 * Google Web Components Initialization
 * This file initializes all Google Web Components used in the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get references to key components
    const appBar = document.getElementById('app-bar');
    const drawer = document.getElementById('app-drawer');
    const uploadDialog = document.getElementById('upload-dialog');
    const fileViewerDialog = document.getElementById('file-viewer-dialog');
    const appSnackbar = document.getElementById('app-snackbar');
    const viewToggle = document.getElementById('view-toggle');
    const listTab = document.getElementById('list-tab');
    const gridTab = document.getElementById('grid-tab');
    const fileInput = document.getElementById('fileInput');

    // Initialize drawer toggle
    if (appBar && drawer) {
        // Get the menu button from the app bar
        const menuButton = appBar.querySelector('[icon="menu"]');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                drawer.open = !drawer.open;
            });
        }
    }

    // Initialize view toggle
    if (viewToggle) {
        viewToggle.addEventListener('MDCTabBar:activated', (e) => {
            const index = e.detail.index;
            if (index === 0) {
                switchView('list');
            } else if (index === 1) {
                switchView('grid');
            }
        });
    }

    // Function to switch between list and grid views
    function switchView(viewMode) {
        const listView = document.getElementById('list-view');
        const gridView = document.getElementById('grid-view');

        if (viewMode === 'list') {
            listView.classList.add('active');
            gridView.classList.remove('active');
            if (listTab) listTab.activated = true;
            if (gridTab) gridTab.activated = false;
        } else if (viewMode === 'grid') {
            gridView.classList.add('active');
            listView.classList.remove('active');
            if (gridTab) gridTab.activated = true;
            if (listTab) listTab.activated = false;
        }
    }

    // Initialize upload button - handled in app.js
    // We're not adding event listeners here to avoid duplicate handlers

    // Initialize dialog file chooser button - handled in app.js
    // We're not adding event listeners here to avoid duplicate handlers

    // Upload confirm button is handled in app.js
    // We're not adding event listeners here to avoid duplicate handlers

    // Dropzone handling is done in app.js
    // We're not adding event listeners here to avoid duplicate handlers

    // Helper function to show a snackbar message
    window.showSnackbar = function(message, actionText = 'OK', actionHandler = null) {
        if (!appSnackbar) return;

        appSnackbar.labelText = message;

        if (actionHandler) {
            appSnackbar.addEventListener('MDCSnackbar:closed', actionHandler, { once: true });
        }

        appSnackbar.show();
    };

    // Make dialogs available globally
    window.dialogs = {
        upload: uploadDialog,
        fileViewer: fileViewerDialog
    };

    // Initialize Google API if available
    if (window.gapi) {
        gapi.load('client:auth2', initGoogleAPI);
    }

    function initGoogleAPI() {
        // Google API initialization would go here
        console.log('Google API loaded');
    }
});
