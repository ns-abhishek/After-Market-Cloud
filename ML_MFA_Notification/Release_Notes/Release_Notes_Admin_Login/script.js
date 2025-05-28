document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const themeToggle = document.getElementById('themeToggle');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    // Add login-page class to body for specific styling
    document.body.classList.add('login-page');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Update button text and icon based on saved theme
        if (savedTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="theme-toggle-text">Light Mode</span>';
        }
    }

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle theme (dark/light mode)
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button text and icon
        if (newTheme === 'dark') {
            this.innerHTML = '<i class="fas fa-sun"></i><span class="theme-toggle-text">Light Mode</span>';
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i><span class="theme-toggle-text">Dark Mode</span>';
        }
    });

    // Sample admin credentials (in a real app, this would be handled server-side)
    const validCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    // Show notification
    function showNotification(message, type = 'error') {
        notificationMessage.textContent = message;
        notification.style.background = type === 'error' ? 'var(--error-color)' : 
                                        type === 'success' ? 'var(--success-color)' : 
                                        type === 'warning' ? 'var(--warning-color)' : 
                                        'var(--info-color)';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const loginBtn = document.querySelector('.login-btn');
        
        // Disable button and show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Logging in...</span>';
        
        // Simulate network delay
        setTimeout(() => {
            // Basic validation (in a real app, this would be more secure)
            if (username === validCredentials.username && password === validCredentials.password) {
                // Show success notification
                showNotification('Login successful! Redirecting to dashboard...', 'success');
                
                // Store login state
                sessionStorage.setItem('adminLoggedIn', 'true');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Show error notification
                showNotification('Invalid username or password. Please try again.', 'error');
                
                // Reset button
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span>Admin Login</span><i class="fas fa-arrow-right"></i>';
            }
        }, 1500);
    });

    // Add focus effects to input fields
    const inputIcons = document.querySelectorAll('.input-icon');
    
    inputIcons.forEach(icon => {
        const input = icon.querySelector('input');
        
        input.addEventListener('focus', () => {
            icon.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            icon.classList.remove('focused');
        });
    });
});
