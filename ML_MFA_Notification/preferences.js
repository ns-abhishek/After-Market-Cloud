/**
 * User Preferences Module
 *
 * This module handles user preferences for notifications, including:
 * - Sound settings (on/off, volume, sound type)
 * - Display settings (banner position, auto-dismiss duration)
 * - Priority settings (which priority levels to show)
 *
 * Preferences are persisted across sessions using localStorage.
 */

class NotificationPreferences {
  constructor() {
    // Default preferences
    this.defaults = {
      // Global notification setting
      notificationsEnabled: true, // Master toggle for all notifications

      // Display settings
      bannerPosition: 'top-right',
      autoDismissDuration: 5000, // 5 seconds (always auto-dismiss)
      maxBanners: 5, // Maximum number of banners to show at once

      // Theme settings
      darkMode: false,
      fontSize: 'medium',
      fontFamily: 'inter',

      // Sound settings
      soundEnabled: false,
      volume: 50, // 0-100
      soundType: 'default',

      // Priority settings
      showHighPriority: true,
      showNormalPriority: true,
      showLowPriority: true
    };

    // Current preferences (initialize with defaults)
    this.preferences = { ...this.defaults };

    // Load saved preferences
    this.loadPreferences();

    // Initialize UI elements
    this.initUI();
  }

  /**
   * Initialize UI elements
   */
  initUI() {
    // Modal elements
    this.preferencesModal = document.getElementById('preferencesModal');
    this.preferencesBtn = document.getElementById('preferencesBtn');
    this.closePreferencesBtn = document.getElementById('closePreferencesBtn');
    this.savePreferencesBtn = document.getElementById('savePreferencesBtn');
    this.resetPreferencesBtn = document.getElementById('resetPreferencesBtn');

    // Global notification setting
    this.enableNotificationsToggle = document.getElementById('enableNotificationsToggle');

    // Display settings
    this.bannerPositionSelect = document.getElementById('bannerPositionSelect');
    this.autoDismissDurationSelect = document.getElementById('autoDismissDurationSelect');

    // Theme settings
    this.darkModeToggle = document.getElementById('darkModeToggle');
    this.fontSizeSelect = document.getElementById('fontSizeSelect');
    this.fontFamilySelect = document.getElementById('fontFamilySelect');

    // Sound settings
    this.soundToggle = document.getElementById('soundToggle');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.volumeValue = document.getElementById('volumeValue');
    this.soundTypeSelect = document.getElementById('soundTypeSelect');
    this.testSoundBtn = document.getElementById('testSoundBtn');

    // Priority settings
    this.highPriorityToggle = document.getElementById('highPriorityToggle');
    this.normalPriorityToggle = document.getElementById('normalPriorityToggle');
    this.lowPriorityToggle = document.getElementById('lowPriorityToggle');

    // Set up event listeners
    this.setupEventListeners();

    // Update UI with current preferences
    this.updateUI();
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Open preferences modal
    if (this.preferencesBtn) {
      this.preferencesBtn.addEventListener('click', () => {
        this.openPreferencesModal();
      });
    }

    // Close preferences modal
    if (this.closePreferencesBtn) {
      this.closePreferencesBtn.addEventListener('click', () => {
        this.closePreferencesModal();
      });
    }

    // Save preferences
    if (this.savePreferencesBtn) {
      this.savePreferencesBtn.addEventListener('click', () => {
        this.savePreferences();
        this.closePreferencesModal();
      });
    }

    // Reset preferences
    if (this.resetPreferencesBtn) {
      this.resetPreferencesBtn.addEventListener('click', () => {
        this.resetPreferences();
      });
    }

    // Enable/disable notifications toggle
    if (this.enableNotificationsToggle) {
      this.enableNotificationsToggle.addEventListener('change', () => {
        // Update priority toggles based on master toggle
        this.updatePriorityTogglesState();
      });
    }

    // Volume slider
    if (this.volumeSlider && this.volumeValue) {
      this.volumeSlider.addEventListener('input', () => {
        const volume = this.volumeSlider.value;
        this.volumeValue.textContent = `${volume}%`;
      });
    }

    // Test sound button
    if (this.testSoundBtn) {
      this.testSoundBtn.addEventListener('click', () => {
        this.playTestSound();
      });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === this.preferencesModal) {
        this.closePreferencesModal();
      }
    });
  }

  /**
   * Open preferences modal
   */
  openPreferencesModal() {
    if (this.preferencesModal) {
      this.preferencesModal.classList.add('show');
      this.updateUI(); // Ensure UI reflects current preferences
    }
  }

  /**
   * Close preferences modal
   */
  closePreferencesModal() {
    if (this.preferencesModal) {
      this.preferencesModal.classList.remove('show');
    }
  }

  /**
   * Update UI with current preferences
   */
  updateUI() {
    // Global notification setting
    if (this.enableNotificationsToggle) {
      this.enableNotificationsToggle.checked = this.preferences.notificationsEnabled;
    }

    // Display settings
    if (this.bannerPositionSelect) {
      this.bannerPositionSelect.value = this.preferences.bannerPosition;
    }

    if (this.autoDismissDurationSelect) {
      this.autoDismissDurationSelect.value = this.preferences.autoDismissDuration;
    }

    // Theme settings
    if (this.darkModeToggle) {
      this.darkModeToggle.checked = this.preferences.darkMode;
    }

    if (this.fontSizeSelect) {
      this.fontSizeSelect.value = this.preferences.fontSize;
    }

    if (this.fontFamilySelect) {
      this.fontFamilySelect.value = this.preferences.fontFamily;
    }

    // Sound settings
    if (this.soundToggle) {
      this.soundToggle.checked = this.preferences.soundEnabled;
    }

    if (this.volumeSlider) {
      this.volumeSlider.value = this.preferences.volume;
    }

    if (this.volumeValue) {
      this.volumeValue.textContent = `${this.preferences.volume}%`;
    }

    if (this.soundTypeSelect) {
      this.soundTypeSelect.value = this.preferences.soundType;
    }

    // Priority settings
    if (this.highPriorityToggle) {
      this.highPriorityToggle.checked = this.preferences.showHighPriority;
      this.highPriorityToggle.disabled = !this.preferences.notificationsEnabled;
    }

    if (this.normalPriorityToggle) {
      this.normalPriorityToggle.checked = this.preferences.showNormalPriority;
      this.normalPriorityToggle.disabled = !this.preferences.notificationsEnabled;
    }

    if (this.lowPriorityToggle) {
      this.lowPriorityToggle.checked = this.preferences.showLowPriority;
      this.lowPriorityToggle.disabled = !this.preferences.notificationsEnabled;
    }
  }

  /**
   * Update priority toggles state based on master toggle
   */
  updatePriorityTogglesState() {
    const notificationsEnabled = this.enableNotificationsToggle ?
      this.enableNotificationsToggle.checked : this.preferences.notificationsEnabled;

    // Disable/enable priority toggles based on master toggle
    if (this.highPriorityToggle) {
      this.highPriorityToggle.disabled = !notificationsEnabled;
    }

    if (this.normalPriorityToggle) {
      this.normalPriorityToggle.disabled = !notificationsEnabled;
    }

    if (this.lowPriorityToggle) {
      this.lowPriorityToggle.disabled = !notificationsEnabled;
    }
  }

  /**
   * Get preferences from UI
   */
  getPreferencesFromUI() {
    const preferences = { ...this.preferences };

    // Global notification setting
    if (this.enableNotificationsToggle) {
      preferences.notificationsEnabled = this.enableNotificationsToggle.checked;
    }

    // Display settings
    if (this.bannerPositionSelect) {
      preferences.bannerPosition = this.bannerPositionSelect.value;
    }

    if (this.autoDismissDurationSelect) {
      preferences.autoDismissDuration = parseInt(this.autoDismissDurationSelect.value);
    }

    // Theme settings
    if (this.darkModeToggle) {
      preferences.darkMode = this.darkModeToggle.checked;
    }

    if (this.fontSizeSelect) {
      preferences.fontSize = this.fontSizeSelect.value;
    }

    if (this.fontFamilySelect) {
      preferences.fontFamily = this.fontFamilySelect.value;
    }

    // Sound settings
    if (this.soundToggle) {
      preferences.soundEnabled = this.soundToggle.checked;
    }

    if (this.volumeSlider) {
      preferences.volume = parseInt(this.volumeSlider.value);
    }

    if (this.soundTypeSelect) {
      preferences.soundType = this.soundTypeSelect.value;
    }

    // Priority settings
    if (this.highPriorityToggle) {
      preferences.showHighPriority = this.highPriorityToggle.checked;
    }

    if (this.normalPriorityToggle) {
      preferences.showNormalPriority = this.normalPriorityToggle.checked;
    }

    if (this.lowPriorityToggle) {
      preferences.showLowPriority = this.lowPriorityToggle.checked;
    }

    return preferences;
  }

  /**
   * Save preferences
   */
  savePreferences() {
    // Get preferences from UI
    this.preferences = this.getPreferencesFromUI();

    // Save to localStorage
    localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));

    // Apply theme settings if they exist
    if (window.themeManager) {
      window.themeManager.updateThemeSettings({
        darkMode: this.preferences.darkMode,
        fontSize: this.preferences.fontSize,
        fontFamily: this.preferences.fontFamily
      });
    }

    // Notify that preferences have changed
    this.notifyPreferencesChanged();
  }

  /**
   * Load preferences from localStorage
   */
  loadPreferences() {
    try {
      const savedPreferences = localStorage.getItem('notificationPreferences');

      if (savedPreferences) {
        // Parse saved preferences
        const parsedPreferences = JSON.parse(savedPreferences);

        // Merge with defaults (in case new preferences were added)
        this.preferences = { ...this.defaults, ...parsedPreferences };

        // Initialize theme settings if they exist
        if (window.themeManager) {
          window.themeManager.updateThemeSettings({
            darkMode: this.preferences.darkMode,
            fontSize: this.preferences.fontSize,
            fontFamily: this.preferences.fontFamily
          });
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      // Use defaults if there was an error
      this.preferences = { ...this.defaults };
    }
  }

  /**
   * Reset preferences to defaults
   */
  resetPreferences() {
    // Reset to defaults
    this.preferences = { ...this.defaults };

    // Update UI
    this.updateUI();

    // Save to localStorage
    localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));

    // Notify that preferences have changed
    this.notifyPreferencesChanged();
  }

  /**
   * Notify that preferences have changed
   */
  notifyPreferencesChanged() {
    // Dispatch an event to notify other components
    const event = new CustomEvent('preferencesChanged', {
      detail: { preferences: this.preferences }
    });
    document.dispatchEvent(event);
  }

  /**
   * Play test sound
   */
  playTestSound() {
    // Get current sound settings
    const soundEnabled = this.soundToggle ? this.soundToggle.checked : this.preferences.soundEnabled;
    const volume = this.volumeSlider ? parseInt(this.volumeSlider.value) / 100 : this.preferences.volume / 100;
    const soundType = this.soundTypeSelect ? this.soundTypeSelect.value : this.preferences.soundType;

    if (!soundEnabled) {
      alert('Sound is disabled. Enable sound to test.');
      return;
    }

    // Determine sound file based on type
    let soundFile;
    switch (soundType) {
      case 'subtle':
        soundFile = 'subtle-notification.mp3';
        break;
      case 'chime':
        soundFile = 'chime-notification.mp3';
        break;
      case 'bell':
        soundFile = 'bell-notification.mp3';
        break;
      default:
        soundFile = 'default-notification.mp3';
    }

    // For demo purposes, we'll just use a beep sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set volume
      gainNode.gain.value = volume;

      // Set frequency based on sound type
      switch (soundType) {
        case 'subtle':
          oscillator.frequency.value = 440; // A4
          break;
        case 'chime':
          oscillator.frequency.value = 523.25; // C5
          break;
        case 'bell':
          oscillator.frequency.value = 587.33; // D5
          break;
        default:
          oscillator.frequency.value = 493.88; // B4
      }

      // Start and stop the sound
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 500); // 0.5 seconds
    } catch (error) {
      console.error('Error playing test sound:', error);
      alert('Could not play test sound. Your browser may not support the Web Audio API.');
    }
  }

  /**
   * Get a specific preference
   * @param {string} key - The preference key
   * @returns {any} The preference value
   */
  getPreference(key) {
    return this.preferences[key];
  }

  /**
   * Set a specific preference
   * @param {string} key - The preference key
   * @param {any} value - The preference value
   */
  setPreference(key, value) {
    this.preferences[key] = value;

    // Save to localStorage
    localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));

    // Notify that preferences have changed
    this.notifyPreferencesChanged();
  }
}

// Initialize preferences when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create global preferences instance
  window.notificationPreferences = new NotificationPreferences();
});
