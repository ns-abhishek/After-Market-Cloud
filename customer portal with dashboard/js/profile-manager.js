/**
 * Profile Manager Module
 * Handles user profile data across all pages
 */

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load and display user profile data
    loadUserProfileData();
});

/**
 * Load user profile data from localStorage and update UI elements
 */
function loadUserProfileData() {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.warn('No user data found in localStorage');
        return;
    }
    
    // Update profile picture in header
    updateProfilePicture(currentUser);
    
    // Update user name in header
    updateUserName(currentUser);
    
    // Update user role in header
    updateUserRole(currentUser);
}

/**
 * Update profile picture across the site
 * @param {Object} user - User object from localStorage
 */
function updateProfilePicture(user) {
    // Get profile picture from localStorage
    const profilePicture = localStorage.getItem(`profilePicture_${user.id}`);
    
    // Update all profile picture elements
    const profileImgElements = document.querySelectorAll('.user-profile img, .account-profile-img img');
    
    if (profilePicture) {
        profileImgElements.forEach(img => {
            img.src = profilePicture;
        });
    } else if (user.profilePicture) {
        profileImgElements.forEach(img => {
            img.src = user.profilePicture;
        });
    }
}

/**
 * Update user name across the site
 * @param {Object} user - User object from localStorage
 */
function updateUserName(user) {
    // Update all user name elements
    const userNameElements = document.querySelectorAll('.user-name, .account-profile h3');
    
    userNameElements.forEach(element => {
        element.textContent = user.name;
    });
}

/**
 * Update user role across the site
 * @param {Object} user - User object from localStorage
 */
function updateUserRole(user) {
    // Update all user role elements
    const userRoleElements = document.querySelectorAll('.user-role, .account-profile p');
    
    userRoleElements.forEach(element => {
        element.textContent = user.role || 'User';
    });
}

/**
 * Global function to update profile picture
 * This can be called from any page after a profile picture update
 * @param {string} dataUrl - Data URL of the new profile picture
 */
window.updateGlobalProfilePicture = function(dataUrl) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Save profile picture to localStorage
    localStorage.setItem(`profilePicture_${currentUser.id}`, dataUrl);
    
    // Update user object
    currentUser.profilePicture = dataUrl;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    const profileImgElements = document.querySelectorAll('.user-profile img, .account-profile-img img');
    profileImgElements.forEach(img => {
        img.src = dataUrl;
    });
};

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        
        // Add styles if they don't exist
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                
                .notification {
                    background-color: white;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out forwards;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .notification.success {
                    border-left: 4px solid var(--success-color);
                }
                
                .notification.error {
                    border-left: 4px solid var(--danger-color);
                }
                
                .notification.info {
                    border-left: 4px solid var(--primary-color);
                }
                
                .notification-icon {
                    font-size: 20px;
                }
                
                .notification.success .notification-icon {
                    color: var(--success-color);
                }
                
                .notification.error .notification-icon {
                    color: var(--danger-color);
                }
                
                .notification.info .notification-icon {
                    color: var(--primary-color);
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--accent-color);
                    cursor: pointer;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        default:
            icon = 'fa-info-circle';
    }
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            ${message}
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', function() {
        container.removeChild(notification);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode === container) {
            container.removeChild(notification);
        }
    }, 5000);
}
