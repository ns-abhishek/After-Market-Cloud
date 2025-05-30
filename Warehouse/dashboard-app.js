// Dashboard - Modern Google Material Design JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    initializeMaterialize();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize animations
    initializeAnimations();
    
    console.log('Dashboard application initialized');
});

function initializeMaterialize() {
    // Initialize tooltips
    var tooltips = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltips);
    
    // Initialize modals if any
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    
    // Initialize floating action buttons
    var fabs = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(fabs);
}

function initializeEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotifications();
        });
    }
    
    // Module card hover effects
    initializeModuleCardEffects();
    
    // Quick action buttons
    initializeQuickActions();
}

function initializeAnimations() {
    // Stagger animation for cards
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach((btn, index) => {
        btn.style.animationDelay = `${(index * 0.1) + 0.3}s`;
    });
}

function initializeModuleCardEffects() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializeQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add ripple effect
            createRippleEffect(this);
        });
    });
}

function openModule(moduleName) {
    console.log(`Opening module: ${moduleName}`);
    
    // Show loading toast
    showToast(`Loading ${getModuleDisplayName(moduleName)}...`, 'info');
    
    // Simulate loading delay
    setTimeout(() => {
        // Open the module in a new window
        const moduleUrls = {
            'service-invoice-return': 'service-invoice-exact.html',
            'service-type': 'service-type.html',
            'movement-type': 'movement-type.html'
        };
        
        const url = moduleUrls[moduleName];
        if (url) {
            // Open in new window as per user preference
            const newWindow = window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
            if (newWindow) {
                showToast(`${getModuleDisplayName(moduleName)} opened in new window`, 'success');
            } else {
                showToast('Please allow popups for this site', 'warning');
                // Fallback: navigate in same window
                window.location.href = url;
            }
        } else {
            showToast(`Module ${moduleName} not found`, 'error');
        }
    }, 800);
}

function getModuleDisplayName(moduleName) {
    const displayNames = {
        'service-invoice-return': 'Service Invoice Return',
        'service-type': 'Service Type',
        'movement-type': 'Movement Type'
    };
    return displayNames[moduleName] || moduleName;
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        showToast('Switched to light theme', 'info');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        showToast('Switched to dark theme', 'info');
    }
    
    // Update theme icon
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = isDark ? 'brightness_6' : 'brightness_2';
    }
}

function showNotifications() {
    showToast('You have 3 new notifications', 'info');
    
    // Simulate notification details
    setTimeout(() => {
        const notifications = [
            'New service return SR/17TN/26/2023 created',
            'Service type "1st Free Service" updated',
            'Movement type configuration saved'
        ];
        
        const notificationHtml = notifications.map(notif => 
            `<div style="padding: 8px 0; border-bottom: 1px solid #eee;">${notif}</div>`
        ).join('');
        
        // Create a simple notification modal
        const modalHtml = `
            <div id="notificationModal" class="modal">
                <div class="modal-content">
                    <h4><i class="material-icons">notifications</i> Notifications</h4>
                    <div>${notificationHtml}</div>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
        `;
        
        // Add modal to body if it doesn't exist
        if (!document.getElementById('notificationModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modal = document.getElementById('notificationModal');
            M.Modal.init(modal);
            M.Modal.getInstance(modal).open();
        }
    }, 500);
}

function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showToast(message, type = 'info') {
    // Use Materialize toast
    const colors = {
        'info': 'blue',
        'success': 'green',
        'error': 'red',
        'warning': 'orange'
    };
    
    M.toast({
        html: `<i class="material-icons left">${getToastIcon(type)}</i>${message}`,
        classes: `${colors[type]} darken-2`,
        displayLength: 3000
    });
}

function getToastIcon(type) {
    const icons = {
        'info': 'info',
        'success': 'check_circle',
        'error': 'error',
        'warning': 'warning'
    };
    return icons[type] || 'info';
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = 'brightness_2';
        }
    }
}

// Initialize theme on load
loadSavedTheme();

// Update stats periodically (simulation)
function updateStats() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        // Simulate small random changes
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.max(0, currentValue + change);
        
        if (newValue !== currentValue) {
            stat.style.transform = 'scale(1.1)';
            stat.textContent = newValue;
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

// Update stats every 30 seconds
setInterval(updateStats, 30000);

// Add CSS for ripple effect
const rippleCSS = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .quick-action-btn {
        position: relative;
        overflow: hidden;
    }
    
    /* Dark theme styles */
    .dark-theme {
        background: #121212;
        color: #ffffff;
    }
    
    .dark-theme .dashboard-container {
        background: #121212;
    }
    
    .dark-theme .stat-card,
    .dark-theme .module-card,
    .dark-theme .quick-action-btn {
        background: #1e1e1e;
        color: #ffffff;
    }
    
    .dark-theme .dashboard-footer {
        background: #1e1e1e;
        border-top-color: #333;
    }
    
    .dark-theme .feature-tag {
        background: #333;
        color: #ccc;
    }
`;

// Add the CSS to the document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Export functions for global access
window.openModule = openModule;
window.showToast = showToast;
