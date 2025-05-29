/**
 * Admin Session Module
 * Sets up default user session for the admin interface
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create default admin session
    setupDefaultSession();

    /**
     * Set up default admin session
     * Creates a persistent admin session without requiring login
     */
    function setupDefaultSession() {
        // Default admin user data
        const sessionData = {
            user: {
                username: 'admin',
                role: 'Administrator',
                name: 'Admin User'
            },
            token: 'default-token',
            // Set a far future expiration (1 year)
            expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
        };

        // Store session data in localStorage for persistence
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
    }
});
