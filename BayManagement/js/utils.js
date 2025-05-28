// Utility functions for Bay Management System

class Utils {
    // Show toast notification
    static showToast(message, type = 'info') {
        const toastElement = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        const toastHeader = toastElement.querySelector('.toast-header i');

        // Set message
        toastMessage.textContent = message;

        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle text-success',
            error: 'fas fa-exclamation-circle text-danger',
            warning: 'fas fa-exclamation-triangle text-warning',
            info: 'fas fa-info-circle text-primary'
        };

        toastHeader.className = icons[type] || icons.info;

        // Show toast
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    // Generate unique ID
    static generateId() {
        return 'id_' + Math.random().toString(36).substring(2, 11);
    }

    // Format time duration
    static formatDuration(hours) {
        if (hours < 1) {
            return `${Math.round(hours * 60)} min`;
        }
        return `${hours}h`;
    }

    // Get random color for bay types
    static getBayTypeColor(type) {
        const colors = {
            'general': '#6c757d',
            'alignment': '#0dcaf0',
            'painting': '#fd7e14',
            'heavy-duty': '#dc3545',
            'inspection': '#198754'
        };
        return colors[type] || colors.general;
    }

    // Debounce function
    static debounce(func, wait) {
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

    // Local storage helpers
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }

    // Touch gesture detection
    static addSwipeGesture(element, callbacks) {
        let startX, startY, startTime;

        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        });

        element.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // Check if it's a swipe (fast movement)
            if (deltaTime < 300 && Math.abs(deltaX) > 50) {
                if (deltaX > 0 && callbacks.swipeRight) {
                    callbacks.swipeRight();
                } else if (deltaX < 0 && callbacks.swipeLeft) {
                    callbacks.swipeLeft();
                }
            }

            if (deltaTime < 300 && Math.abs(deltaY) > 50) {
                if (deltaY > 0 && callbacks.swipeDown) {
                    callbacks.swipeDown();
                } else if (deltaY < 0 && callbacks.swipeUp) {
                    callbacks.swipeUp();
                }
            }

            // Reset
            startX = startY = null;
        });
    }

    // Animate element
    static animateElement(element, animation, duration = 500) {
        element.style.animation = `${animation} ${duration}ms ease-out`;

        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scroll to element
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Format date for display
    static formatDate(date, format = 'short') {
        const options = {
            short: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
            long: {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        };

        return new Intl.DateTimeFormat('en-US', options[format]).format(date);
    }

    // Close all open modals to prevent conflicts
    static closeAllModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
        return modals.length > 0;
    }

    // Show modal with conflict prevention
    static showModalSafely(modalElement, delay = 300) {
        const hasOpenModals = this.closeAllModals();

        const showModal = () => {
            const bsModal = new bootstrap.Modal(modalElement);
            bsModal.show();
            return bsModal;
        };

        if (hasOpenModals) {
            // Wait for existing modals to close
            setTimeout(showModal, delay);
        } else {
            return showModal();
        }
    }

    // Calculate bay efficiency
    static calculateEfficiency(totalTime, activeTime) {
        if (totalTime === 0) return 0;
        return Math.round((activeTime / totalTime) * 100);
    }

    // Generate progress ring SVG
    static createProgressRing(progress, size = 40) {
        const radius = (size - 6) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

        return `
            <svg class="progress-ring" width="${size}" height="${size}">
                <circle class="background" cx="${size/2}" cy="${size/2}" r="${radius}"></circle>
                <circle class="progress" cx="${size/2}" cy="${size/2}" r="${radius}"
                        style="stroke-dasharray: ${strokeDasharray}"></circle>
            </svg>
        `;
    }

    // Validate form data
    static validateForm(formData, rules) {
        const errors = [];

        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];

            // Convert value to string for string operations, but preserve original for numeric checks
            const stringValue = value != null ? String(value) : '';

            if (rule.required && (!value || stringValue.trim() === '')) {
                errors.push(`${field} is required`);
                continue;
            }

            if (rule.minLength && stringValue.length < rule.minLength) {
                errors.push(`${field} must be at least ${rule.minLength} characters`);
            }

            if (rule.maxLength && stringValue.length > rule.maxLength) {
                errors.push(`${field} must be no more than ${rule.maxLength} characters`);
            }

            if (rule.pattern && !rule.pattern.test(stringValue)) {
                errors.push(`${field} format is invalid`);
            }

            if (rule.min && parseFloat(value) < rule.min) {
                errors.push(`${field} must be at least ${rule.min}`);
            }

            if (rule.max && parseFloat(value) > rule.max) {
                errors.push(`${field} must be no more than ${rule.max}`);
            }
        }

        return errors;
    }

    // Create context menu
    static createContextMenu(items, x, y) {
        // Remove existing context menu
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'context-menu';

        // Create menu items first to calculate menu dimensions
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.innerHTML = `<i class="${item.icon}"></i>${item.text}`;
            menuItem.addEventListener('click', () => {
                item.action();
                menu.remove();
            });
            menu.appendChild(menuItem);
        });

        // Temporarily position menu off-screen to measure dimensions
        menu.style.visibility = 'hidden';
        menu.style.left = '0px';
        menu.style.top = '0px';
        document.body.appendChild(menu);

        // Get menu dimensions and viewport dimensions
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate optimal position
        let finalX = x;
        let finalY = y;

        // Adjust horizontal position if menu would go off-screen
        if (x + menuRect.width > viewportWidth) {
            finalX = x - menuRect.width; // Position to the left of cursor
            // Ensure it doesn't go off the left edge
            if (finalX < 0) {
                finalX = Math.max(0, viewportWidth - menuRect.width);
            }
        }

        // Adjust vertical position if menu would go off-screen
        if (y + menuRect.height > viewportHeight) {
            finalY = y - menuRect.height; // Position above cursor
            // Ensure it doesn't go off the top edge
            if (finalY < 0) {
                finalY = Math.max(0, viewportHeight - menuRect.height);
            }
        }

        // Apply final position and make visible
        menu.style.left = `${finalX}px`;
        menu.style.top = `${finalY}px`;
        menu.style.visibility = 'visible';

        // Show menu with animation
        setTimeout(() => menu.classList.add('show'), 10);

        // Remove menu when clicking outside
        const removeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', removeMenu);
        }, 100);

        return menu;
    }

    // Theme management
    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Utils.saveToStorage('theme', theme);

        // Update theme toggle icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    static getTheme() {
        return Utils.loadFromStorage('theme', 'light');
    }

    static toggleTheme() {
        const currentTheme = Utils.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        Utils.setTheme(newTheme);
        return newTheme;
    }
}

// Export for use in other modules
window.Utils = Utils;
