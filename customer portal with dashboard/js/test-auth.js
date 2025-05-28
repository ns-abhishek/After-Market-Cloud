/**
 * Authentication Test Script
 * This script tests the login and logout functionality
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Authentication test script loaded');
    
    // Add test buttons to the page
    addTestButtons();
});

// Add test buttons to the page
function addTestButtons() {
    // Create test container
    const testContainer = document.createElement('div');
    testContainer.style.position = 'fixed';
    testContainer.style.bottom = '20px';
    testContainer.style.right = '20px';
    testContainer.style.zIndex = '1000';
    testContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    testContainer.style.padding = '10px';
    testContainer.style.borderRadius = '5px';
    testContainer.style.color = 'white';
    testContainer.style.fontSize = '12px';
    
    // Add title
    const title = document.createElement('div');
    title.textContent = 'Auth Test';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    testContainer.appendChild(title);
    
    // Add test login button
    const testLoginBtn = document.createElement('button');
    testLoginBtn.textContent = 'Test Login';
    testLoginBtn.style.backgroundColor = '#28a745';
    testLoginBtn.style.color = 'white';
    testLoginBtn.style.border = 'none';
    testLoginBtn.style.padding = '5px 10px';
    testLoginBtn.style.marginRight = '5px';
    testLoginBtn.style.borderRadius = '3px';
    testLoginBtn.style.cursor = 'pointer';
    testLoginBtn.addEventListener('click', testLogin);
    testContainer.appendChild(testLoginBtn);
    
    // Add test logout button
    const testLogoutBtn = document.createElement('button');
    testLogoutBtn.textContent = 'Test Logout';
    testLogoutBtn.style.backgroundColor = '#dc3545';
    testLogoutBtn.style.color = 'white';
    testLogoutBtn.style.border = 'none';
    testLogoutBtn.style.padding = '5px 10px';
    testLogoutBtn.style.borderRadius = '3px';
    testLogoutBtn.style.cursor = 'pointer';
    testLogoutBtn.addEventListener('click', testLogout);
    testContainer.appendChild(testLogoutBtn);
    
    // Add status display
    const statusDisplay = document.createElement('div');
    statusDisplay.id = 'auth-test-status';
    statusDisplay.style.marginTop = '5px';
    statusDisplay.style.fontSize = '10px';
    statusDisplay.textContent = 'Status: Ready';
    testContainer.appendChild(statusDisplay);
    
    // Add to page
    document.body.appendChild(testContainer);
    
    // Update status with current auth state
    updateAuthStatus();
}

// Test login functionality
function testLogin() {
    // Update status
    const statusDisplay = document.getElementById('auth-test-status');
    statusDisplay.textContent = 'Status: Testing login...';
    
    try {
        // Check if we're already logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            statusDisplay.textContent = 'Status: Already logged in as ' + currentUser.name;
            return;
        }
        
        // Get login form
        const loginForm = document.getElementById('login-form');
        if (!loginForm) {
            statusDisplay.textContent = 'Status: Error - Login form not found';
            return;
        }
        
        // Fill in login form
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!emailInput || !passwordInput) {
            statusDisplay.textContent = 'Status: Error - Login form inputs not found';
            return;
        }
        
        // Set test credentials
        emailInput.value = 'admin@example.com';
        passwordInput.value = 'admin123';
        
        // Submit form
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        loginForm.dispatchEvent(submitEvent);
        
        // Check if login was successful
        setTimeout(() => {
            const newUser = JSON.parse(localStorage.getItem('currentUser'));
            if (newUser) {
                statusDisplay.textContent = 'Status: Login successful - ' + newUser.name;
            } else {
                statusDisplay.textContent = 'Status: Login failed';
            }
        }, 500);
    } catch (error) {
        statusDisplay.textContent = 'Status: Error - ' + error.message;
    }
}

// Test logout functionality
function testLogout() {
    // Update status
    const statusDisplay = document.getElementById('auth-test-status');
    statusDisplay.textContent = 'Status: Testing logout...';
    
    try {
        // Check if we're logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            statusDisplay.textContent = 'Status: Not logged in';
            return;
        }
        
        // Find logout button
        const logoutBtn = document.querySelector('#logout-btn');
        if (!logoutBtn) {
            statusDisplay.textContent = 'Status: Error - Logout button not found';
            return;
        }
        
        // Click logout button
        logoutBtn.click();
        
        // Check if logout was successful
        setTimeout(() => {
            const newUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!newUser) {
                statusDisplay.textContent = 'Status: Logout successful';
            } else {
                statusDisplay.textContent = 'Status: Logout failed';
            }
        }, 500);
    } catch (error) {
        statusDisplay.textContent = 'Status: Error - ' + error.message;
    }
}

// Update auth status display
function updateAuthStatus() {
    const statusDisplay = document.getElementById('auth-test-status');
    if (!statusDisplay) return;
    
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            statusDisplay.textContent = 'Status: Logged in as ' + currentUser.name;
        } else {
            statusDisplay.textContent = 'Status: Not logged in';
        }
    } catch (error) {
        statusDisplay.textContent = 'Status: Error - ' + error.message;
    }
}
