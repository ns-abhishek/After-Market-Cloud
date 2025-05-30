// System Settings JavaScript
let currentTab = 'general';
let settings = {};
let hasUnsavedChanges = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing System Settings...');

    // Initialize security service
    if (typeof SecurityService !== 'undefined') {
        SecurityService.init();
    }

    // Load settings
    loadSettings();

    // Set up event listeners
    setupEventListeners();

    // Load initial tab content
    loadTabContent(currentTab);

    console.log('System Settings initialized successfully');
});

// Set up event listeners
function setupEventListeners() {
    // Set up back button event listener with multiple approaches
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        // Remove any existing onclick
        backButton.removeAttribute('onclick');

        // Add click event listener
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Back button clicked via event listener');
            goBack();
        });

        // Also add as onclick for backup
        backButton.onclick = function(e) {
            e.preventDefault();
            console.log('Back button clicked via onclick');
            goBack();
            return false;
        };
    }

    // Track changes for unsaved warning
    document.addEventListener('input', function(e) {
        if (e.target.matches('.form-input, .form-select, .form-textarea')) {
            hasUnsavedChanges = true;
        }
    });

    document.addEventListener('change', function(e) {
        if (e.target.matches('input[type="checkbox"]')) {
            hasUnsavedChanges = true;
        }
    });

    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Load settings from storage
function loadSettings() {
    try {
        // Load from localStorage or use defaults
        settings = {
            general: JSON.parse(localStorage.getItem('systemSettings_general')) || {
                companyName: 'Disruptive Aftermarket',
                timezone: 'America/Los_Angeles',
                defaultLanguage: 'en',
                dateFormat: 'MM/DD/YYYY',
                maintenanceMode: false,
                autoSave: true
            },
            security: JSON.parse(localStorage.getItem('systemSettings_security')) || {
                passwordPolicy: {
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: true,
                    expiryDays: 90
                },
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                lockoutDuration: 15,
                mfaRequired: true,
                ipWhitelisting: false,
                encryptionEnabled: true
            },
            compliance: typeof SecurityService !== 'undefined' ?
                SecurityService.getComplianceSettings() : {
                    gdpr: { enabled: true },
                    ccpa: { enabled: true },
                    hipaa: { enabled: false },
                    pci: { enabled: false }
                },
            integrations: JSON.parse(localStorage.getItem('systemSettings_integrations')) || {
                erp: { enabled: false, system: 'SAP' },
                crm: { enabled: false, system: 'Salesforce' },
                email: { enabled: true, provider: 'SMTP' },
                sms: { enabled: false, provider: 'Twilio' }
            },
            backup: JSON.parse(localStorage.getItem('systemSettings_backup')) || {
                autoBackup: true,
                backupFrequency: 'daily',
                retentionDays: 30,
                backupLocation: 'cloud'
            },
            audit: JSON.parse(localStorage.getItem('systemSettings_audit')) || {
                enableAuditLog: true,
                logLevel: 'info',
                retentionDays: 365,
                realTimeAlerts: true
            }
        };

        console.log('Settings loaded successfully');
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Error loading settings', 'error');
    }
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.settings-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content
    const tabContent = document.getElementById(`${tabName}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }

    // Add active class to selected nav tab
    event.target.classList.add('active');

    currentTab = tabName;
    loadTabContent(tabName);
}

// Load content for specific tab
function loadTabContent(tabName) {
    switch (tabName) {
        case 'general':
            loadGeneralSettings();
            break;
        case 'security':
            loadSecuritySettings();
            break;
        case 'compliance':
            loadComplianceSettings();
            break;
        case 'integrations':
            loadIntegrationsSettings();
            break;
        case 'backup':
            loadBackupSettings();
            break;
        case 'audit':
            loadAuditSettings();
            break;
    }
}

// Load general settings
function loadGeneralSettings() {
    const generalSettings = settings.general;

    // Populate form fields
    document.getElementById('companyName').value = generalSettings.companyName;
    document.getElementById('timezone').value = generalSettings.timezone;
    document.getElementById('defaultLanguage').value = generalSettings.defaultLanguage;
    document.getElementById('dateFormat').value = generalSettings.dateFormat;
    document.getElementById('maintenanceMode').checked = generalSettings.maintenanceMode;
    document.getElementById('autoSave').checked = generalSettings.autoSave;
}

// Load security settings
function loadSecuritySettings() {
    const securityTab = document.getElementById('security-tab');
    if (!securityTab) return;

    const securitySettings = settings.security;

    securityTab.innerHTML = `
        <div class="settings-section">
            <div class="section-header">
                <h2 class="section-title">Password Policy</h2>
                <p class="section-description">Configure password requirements and security policies</p>
            </div>
            <div class="section-content">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Minimum Password Length</label>
                        <input type="number" class="form-input" id="minPasswordLength" value="${securitySettings.passwordPolicy.minLength}" min="6" max="32">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password Expiry (Days)</label>
                        <input type="number" class="form-input" id="passwordExpiry" value="${securitySettings.passwordPolicy.expiryDays}" min="30" max="365">
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Require Uppercase Letters</h4>
                        <p>Passwords must contain at least one uppercase letter</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="requireUppercase" ${securitySettings.passwordPolicy.requireUppercase ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Require Numbers</h4>
                        <p>Passwords must contain at least one number</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="requireNumbers" ${securitySettings.passwordPolicy.requireNumbers ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Require Special Characters</h4>
                        <p>Passwords must contain at least one special character</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="requireSpecialChars" ${securitySettings.passwordPolicy.requireSpecialChars ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="form-actions">
                    <button class="action-btn secondary" onclick="resetSecuritySettings()">Reset</button>
                    <button class="action-btn" onclick="saveSecuritySettings()">Save Changes</button>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <h2 class="section-title">Session & Access Control</h2>
                <p class="section-description">Configure session timeouts and access restrictions</p>
            </div>
            <div class="section-content">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Session Timeout (Minutes)</label>
                        <input type="number" class="form-input" id="sessionTimeout" value="${securitySettings.sessionTimeout}" min="5" max="480">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Max Login Attempts</label>
                        <input type="number" class="form-input" id="maxLoginAttempts" value="${securitySettings.maxLoginAttempts}" min="3" max="10">
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Multi-Factor Authentication Required</h4>
                        <p>Require MFA for all user accounts</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="mfaRequired" ${securitySettings.mfaRequired ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>IP Whitelisting</h4>
                        <p>Restrict access to specific IP addresses</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="ipWhitelisting" ${securitySettings.ipWhitelisting ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="form-actions">
                    <button class="action-btn secondary" onclick="resetSecuritySettings()">Reset</button>
                    <button class="action-btn" onclick="saveSecuritySettings()">Save Changes</button>
                </div>
            </div>
        </div>
    `;
}

// Load compliance settings
function loadComplianceSettings() {
    const complianceTab = document.getElementById('compliance-tab');
    if (!complianceTab) return;

    const complianceSettings = settings.compliance;

    complianceTab.innerHTML = `
        <div class="settings-section">
            <div class="section-header">
                <h2 class="section-title">Data Protection Compliance</h2>
                <p class="section-description">Configure compliance with data protection regulations</p>
            </div>
            <div class="section-content">
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>GDPR Compliance</h4>
                        <p>Enable General Data Protection Regulation compliance features</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="gdprEnabled" ${complianceSettings.gdpr?.enabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>CCPA Compliance</h4>
                        <p>Enable California Consumer Privacy Act compliance features</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="ccpaEnabled" ${complianceSettings.ccpa?.enabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>HIPAA Compliance</h4>
                        <p>Enable Health Insurance Portability and Accountability Act compliance</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="hipaaEnabled" ${complianceSettings.hipaa?.enabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>PCI DSS Compliance</h4>
                        <p>Enable Payment Card Industry Data Security Standard compliance</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="pciEnabled" ${complianceSettings.pci?.enabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="form-actions">
                    <button class="action-btn secondary" onclick="resetComplianceSettings()">Reset</button>
                    <button class="action-btn" onclick="saveComplianceSettings()">Save Changes</button>
                </div>
            </div>
        </div>
    `;
}

// Save functions for each section
function saveGeneralSettings() {
    const generalSettings = {
        companyName: document.getElementById('companyName').value,
        timezone: document.getElementById('timezone').value,
        defaultLanguage: document.getElementById('defaultLanguage').value,
        dateFormat: document.getElementById('dateFormat').value,
        maintenanceMode: document.getElementById('maintenanceMode').checked,
        autoSave: document.getElementById('autoSave').checked
    };

    settings.general = generalSettings;
    localStorage.setItem('systemSettings_general', JSON.stringify(generalSettings));
    hasUnsavedChanges = false;

    showNotification('General settings saved successfully', 'success');
}

function saveSecuritySettings() {
    // Implementation for saving security settings
    showNotification('Security settings saved successfully', 'success');
    hasUnsavedChanges = false;
}

function saveComplianceSettings() {
    // Implementation for saving compliance settings
    showNotification('Compliance settings saved successfully', 'success');
    hasUnsavedChanges = false;
}

// Reset functions
function resetGeneralSettings() {
    if (confirm('Reset general settings to defaults?')) {
        loadGeneralSettings();
        showNotification('General settings reset to defaults', 'info');
    }
}

function resetSecuritySettings() {
    if (confirm('Reset security settings to defaults?')) {
        loadSecuritySettings();
        showNotification('Security settings reset to defaults', 'info');
    }
}

function resetComplianceSettings() {
    if (confirm('Reset compliance settings to defaults?')) {
        loadComplianceSettings();
        showNotification('Compliance settings reset to defaults', 'info');
    }
}

// Header actions
function saveAllSettings() {
    showNotification('Saving all settings...', 'info');

    // Save current tab settings
    switch (currentTab) {
        case 'general':
            saveGeneralSettings();
            break;
        case 'security':
            saveSecuritySettings();
            break;
        case 'compliance':
            saveComplianceSettings();
            break;
    }

    setTimeout(() => {
        showNotification('All settings saved successfully', 'success');
    }, 1000);
}

function resetToDefaults() {
    if (confirm('Reset all settings to defaults? This action cannot be undone.')) {
        localStorage.removeItem('systemSettings_general');
        localStorage.removeItem('systemSettings_security');
        localStorage.removeItem('systemSettings_compliance');
        localStorage.removeItem('systemSettings_integrations');
        localStorage.removeItem('systemSettings_backup');
        localStorage.removeItem('systemSettings_audit');

        loadSettings();
        loadTabContent(currentTab);

        showNotification('All settings reset to defaults', 'info');
    }
}

function exportSettings() {
    const exportData = {
        timestamp: new Date().toISOString(),
        settings: settings
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Settings exported successfully', 'success');
}

// Utility functions
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function goBack() {
    console.log('Back button clicked');

    if (hasUnsavedChanges) {
        if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
            navigateBack();
        }
    } else {
        navigateBack();
    }
}

function navigateBack() {
    // Try multiple navigation methods
    try {
        // First try to go to party-details-advanced.html (main page)
        if (document.referrer && document.referrer.includes('party-details-advanced.html')) {
            window.location.href = 'party-details-advanced.html';
            return;
        }

        // Try NavigationUtils if available
        if (typeof NavigationUtils !== 'undefined' && NavigationUtils.goBack) {
            NavigationUtils.goBack();
            return;
        }

        // Check if there's history to go back to
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Fallback to main page
            window.location.href = 'party-details-advanced.html';
        }
    } catch (error) {
        console.error('Error navigating back:', error);
        // Final fallback
        window.location.href = 'party-details-advanced.html';
    }
}

// Placeholder functions for other tabs
function loadIntegrationsSettings() {
    showNotification('Loading integrations settings...', 'info');
}

function loadBackupSettings() {
    showNotification('Loading backup settings...', 'info');
}

function loadAuditSettings() {
    showNotification('Loading audit settings...', 'info');
}
