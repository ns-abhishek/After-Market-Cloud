/**
 * Themes Module
 * 
 * This module handles theme preferences for the application, including:
 * - Dark/light mode toggle
 * - Font size adjustment
 * - Font family selection
 * 
 * Preferences are persisted across sessions using localStorage.
 */

class ThemeManager {
  constructor() {
    // Initialize theme settings
    this.initThemeSettings();
    
    // Apply saved theme settings
    this.applyThemeSettings();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Initialize theme settings
   */
  initThemeSettings() {
    // Get saved theme settings from localStorage or use defaults
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.fontSize = localStorage.getItem('fontSize') || 'medium';
    this.fontFamily = localStorage.getItem('fontFamily') || 'inter';
  }
  
  /**
   * Apply theme settings to the document
   */
  applyThemeSettings() {
    // Apply dark mode
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Apply font size
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-x-large');
    document.body.classList.add(`font-size-${this.fontSize}`);
    
    // Apply font family
    document.body.classList.remove('font-family-inter', 'font-family-roboto', 'font-family-open-sans', 'font-family-montserrat', 'font-family-system');
    document.body.classList.add(`font-family-${this.fontFamily}`);
  }
  
  /**
   * Set up event listeners for theme settings
   */
  setupEventListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.checked = this.darkMode;
      darkModeToggle.addEventListener('change', () => {
        this.darkMode = darkModeToggle.checked;
        this.saveAndApplyThemeSettings();
      });
    }
    
    // Font size select
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) {
      fontSizeSelect.value = this.fontSize;
      fontSizeSelect.addEventListener('change', () => {
        this.fontSize = fontSizeSelect.value;
        this.saveAndApplyThemeSettings();
      });
    }
    
    // Font family select
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    if (fontFamilySelect) {
      fontFamilySelect.value = this.fontFamily;
      fontFamilySelect.addEventListener('change', () => {
        this.fontFamily = fontFamilySelect.value;
        this.saveAndApplyThemeSettings();
      });
    }
    
    // Listen for preference changes
    document.addEventListener('preferencesChanged', (event) => {
      if (event.detail && event.detail.preferences) {
        const { darkMode, fontSize, fontFamily } = event.detail.preferences;
        
        // Update theme settings if they exist in the preferences
        if (darkMode !== undefined) this.darkMode = darkMode;
        if (fontSize) this.fontSize = fontSize;
        if (fontFamily) this.fontFamily = fontFamily;
        
        // Apply the updated settings
        this.applyThemeSettings();
      }
    });
  }
  
  /**
   * Save theme settings to localStorage and apply them
   */
  saveAndApplyThemeSettings() {
    // Save settings to localStorage
    localStorage.setItem('darkMode', this.darkMode);
    localStorage.setItem('fontSize', this.fontSize);
    localStorage.setItem('fontFamily', this.fontFamily);
    
    // Apply settings
    this.applyThemeSettings();
    
    // Dispatch event for other components
    this.dispatchThemeChangedEvent();
  }
  
  /**
   * Dispatch theme changed event
   */
  dispatchThemeChangedEvent() {
    const event = new CustomEvent('themeChanged', {
      detail: {
        darkMode: this.darkMode,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily
      }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Get current theme settings
   * @returns {Object} Current theme settings
   */
  getThemeSettings() {
    return {
      darkMode: this.darkMode,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily
    };
  }
  
  /**
   * Update theme settings
   * @param {Object} settings - New theme settings
   */
  updateThemeSettings(settings) {
    if (settings.darkMode !== undefined) this.darkMode = settings.darkMode;
    if (settings.fontSize) this.fontSize = settings.fontSize;
    if (settings.fontFamily) this.fontFamily = settings.fontFamily;
    
    this.saveAndApplyThemeSettings();
  }
}

// Initialize theme manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create global theme manager instance
  window.themeManager = new ThemeManager();
});
