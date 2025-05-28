/**
 * Modern Select Dropdown
 * A custom select dropdown with improved UX and styling
 */
class ModernSelect {
    constructor(element, options = {}) {
        // Store the original select element
        this.originalSelect = element;
        
        // Default options
        this.options = {
            label: options.label || element.getAttribute('aria-label') || '',
            onChange: options.onChange || null,
            icons: options.icons || {}
        };
        
        // Create the modern select elements
        this.createElements();
        
        // Initialize the dropdown
        this.init();
    }
    
    createElements() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'modern-select-container';
        
        // Add label if provided
        if (this.options.label) {
            const label = document.createElement('label');
            label.className = 'modern-select-label';
            label.textContent = this.options.label;
            this.container.appendChild(label);
        }
        
        // Create the modern select
        this.select = document.createElement('div');
        this.select.className = 'modern-select';
        
        // Create header
        this.header = document.createElement('div');
        this.header.className = 'modern-select-header';
        this.header.setAttribute('tabindex', '0');
        this.header.setAttribute('role', 'combobox');
        this.header.setAttribute('aria-expanded', 'false');
        this.header.setAttribute('aria-haspopup', 'listbox');
        
        // Create current selection display
        this.currentSelection = document.createElement('div');
        this.currentSelection.className = 'modern-select-current';
        
        // Create dropdown arrow
        this.arrow = document.createElement('div');
        this.arrow.className = 'modern-select-arrow';
        this.arrow.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        // Add elements to header
        this.header.appendChild(this.currentSelection);
        this.header.appendChild(this.arrow);
        
        // Create dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'modern-select-dropdown';
        this.dropdown.setAttribute('role', 'listbox');
        
        // Add header and dropdown to select
        this.select.appendChild(this.header);
        this.select.appendChild(this.dropdown);
        
        // Add select to container
        this.container.appendChild(this.select);
        
        // Insert the modern select after the original
        this.originalSelect.parentNode.insertBefore(this.container, this.originalSelect.nextSibling);
        
        // Hide the original select
        this.originalSelect.style.display = 'none';
    }
    
    init() {
        // Populate options
        this.populateOptions();
        
        // Set initial selection
        this.updateSelection();
        
        // Add event listeners
        this.addEventListeners();
    }
    
    populateOptions() {
        // Clear existing options
        this.dropdown.innerHTML = '';
        
        // Get options from original select
        const options = this.originalSelect.querySelectorAll('option');
        
        // Create modern options
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'modern-select-option';
            optionElement.setAttribute('role', 'option');
            optionElement.setAttribute('data-value', option.value);
            
            if (option.selected) {
                optionElement.classList.add('selected');
                optionElement.setAttribute('aria-selected', 'true');
            } else {
                optionElement.setAttribute('aria-selected', 'false');
            }
            
            // Add icon if available
            const iconContainer = document.createElement('div');
            iconContainer.className = 'modern-select-option-icon';
            
            // Check if we have an icon for this option
            const iconClass = this.options.icons[option.value] || 'fas fa-credit-card';
            iconContainer.innerHTML = `<i class="${iconClass}"></i>`;
            
            // Add text
            const textContainer = document.createElement('div');
            textContainer.className = 'modern-select-option-text';
            textContainer.textContent = option.textContent;
            
            // Add to option
            optionElement.appendChild(iconContainer);
            optionElement.appendChild(textContainer);
            
            // Add to dropdown
            this.dropdown.appendChild(optionElement);
            
            // Add click event
            optionElement.addEventListener('click', () => {
                this.selectOption(option.value);
                this.closeDropdown();
            });
        });
    }
    
    updateSelection() {
        const selectedOption = this.originalSelect.options[this.originalSelect.selectedIndex];
        this.currentSelection.textContent = selectedOption.textContent;
        
        // Update selected class in dropdown
        const options = this.dropdown.querySelectorAll('.modern-select-option');
        options.forEach(option => {
            if (option.getAttribute('data-value') === selectedOption.value) {
                option.classList.add('selected');
                option.setAttribute('aria-selected', 'true');
            } else {
                option.classList.remove('selected');
                option.setAttribute('aria-selected', 'false');
            }
        });
    }
    
    selectOption(value) {
        // Update original select
        this.originalSelect.value = value;
        
        // Trigger change event on original select
        const event = new Event('change', { bubbles: true });
        this.originalSelect.dispatchEvent(event);
        
        // Update display
        this.updateSelection();
        
        // Call onChange callback if provided
        if (typeof this.options.onChange === 'function') {
            this.options.onChange(value);
        }
    }
    
    openDropdown() {
        this.select.classList.add('open');
        this.header.setAttribute('aria-expanded', 'true');
    }
    
    closeDropdown() {
        this.select.classList.remove('open');
        this.header.setAttribute('aria-expanded', 'false');
    }
    
    toggleDropdown() {
        if (this.select.classList.contains('open')) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    addEventListeners() {
        // Toggle dropdown on header click
        this.header.addEventListener('click', () => {
            this.toggleDropdown();
        });
        
        // Handle keyboard navigation
        this.header.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.toggleDropdown();
                    break;
                case 'Escape':
                    this.closeDropdown();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.openDropdown();
                    break;
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.closeDropdown();
            }
        });
        
        // Update when original select changes
        this.originalSelect.addEventListener('change', () => {
            this.updateSelection();
        });
    }
}
