/**
 * Report Wizard - Utilities Module
 * 
 * This module provides utility functions used throughout the application.
 */

// Format a field name into a readable label
function formatFieldLabel(fieldName) {
    // Handle special cases
    if (fieldName === '_count') {
        return 'Count';
    }
    
    // Convert camelCase or snake_case to Title Case with spaces
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
        .trim();
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Deep clone an object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Check if a value is empty (null, undefined, empty string, empty array, empty object)
function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
        return true;
    }
    
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }
    
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }
    
    return false;
}

// Format a number with the specified options
function formatNumber(value, options = {}) {
    const {
        decimals = 2,
        decimalSeparator = '.',
        thousandsSeparator = ',',
        prefix = '',
        suffix = ''
    } = options;
    
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }
    
    // Convert to number if it's a string
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format the number
    const parts = num.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    
    return `${prefix}${parts.join(decimalSeparator)}${suffix}`;
}

// Format a date with the specified options
function formatDate(value, options = {}) {
    const {
        format = 'short', // 'short', 'medium', 'long', 'full', or custom format
        locale = 'en-US'
    } = options;
    
    if (!value) {
        return '';
    }
    
    // Convert to Date object if it's a string
    const date = typeof value === 'string' ? new Date(value) : value;
    
    // Check if it's a valid date
    if (isNaN(date.getTime())) {
        return '';
    }
    
    // Format the date
    if (format === 'short') {
        return date.toLocaleDateString(locale);
    } else if (format === 'medium') {
        return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (format === 'long') {
        return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    } else if (format === 'full') {
        return date.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else {
        // Custom format (simplified implementation)
        return date.toLocaleDateString(locale);
    }
}

// Debounce a function
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle a function
function throttle(func, limit) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Get the data type of a value
function getDataType(value) {
    if (value === null || value === undefined) {
        return 'null';
    }
    
    if (typeof value === 'number') {
        return 'number';
    }
    
    if (typeof value === 'boolean') {
        return 'boolean';
    }
    
    if (typeof value === 'string') {
        // Check if it's a date
        if (!isNaN(Date.parse(value))) {
            return 'date';
        }
        return 'string';
    }
    
    if (value instanceof Date) {
        return 'date';
    }
    
    if (Array.isArray(value)) {
        return 'array';
    }
    
    if (typeof value === 'object') {
        return 'object';
    }
    
    return 'unknown';
}

// Detect the data types of fields in a dataset
function detectDataTypes(data) {
    if (!data || data.length === 0) {
        return {};
    }
    
    const firstRow = data[0];
    const fields = Object.keys(firstRow);
    const types = {};
    
    fields.forEach(field => {
        types[field] = getDataType(firstRow[field]);
    });
    
    return types;
}

// Validate a value against a data type
function validateValue(value, type) {
    switch (type) {
        case 'number':
            return !isNaN(parseFloat(value));
        case 'boolean':
            return value === true || value === false || value === 'true' || value === 'false';
        case 'date':
            return !isNaN(Date.parse(value));
        case 'string':
            return typeof value === 'string';
        default:
            return true;
    }
}

// Convert a value to a specific data type
function convertValue(value, type) {
    switch (type) {
        case 'number':
            return parseFloat(value);
        case 'boolean':
            return value === true || value === 'true';
        case 'date':
            return new Date(value);
        case 'string':
            return String(value);
        default:
            return value;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

// Show a notification
function showNotification(message, type = 'info', duration = 3000) {
    // Create the notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add the icon based on the type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'info':
        default:
            icon = 'fas fa-info-circle';
    }
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icon}"></i>
        </div>
        <div class="notification-content">
            ${escapeHtml(message)}
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add the notification to the container
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Add the close button event listener
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
            
            // Remove the container if it's empty
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    });
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
    
    // Auto-hide after the specified duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('notification-hiding');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                        
                        // Remove the container if it's empty
                        if (container.children.length === 0) {
                            container.remove();
                        }
                    }
                }, 300);
            }
        }, duration);
    }
    
    return notification;
}

// Download a file
function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    URL.revokeObjectURL(url);
}
