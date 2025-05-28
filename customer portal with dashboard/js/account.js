/**
 * Account Management Module
 * Handles user account functionality including profile picture upload
 */

// Initialize account module
document.addEventListener('DOMContentLoaded', function() {
    // Set up profile picture upload
    setupProfilePictureUpload();

    // Set up account navigation
    setupAccountNavigation();

    // Load user profile data
    loadUserProfile();

    // Set up form submission
    setupFormSubmission();

    // Set up notification toggles
    setupNotificationToggles();

    // Set up preference settings
    setupPreferenceSettings();

    // Set up billing and subscription functionality
    setupBillingAndSubscription();

    // Set up activity log functionality
    setupActivityLog();

    // Initialize modals
    initializeModals();
});

// Set up profile picture upload
function setupProfilePictureUpload() {
    const profileImgContainer = document.querySelector('.account-profile-img');
    const profileImg = profileImgContainer?.querySelector('img');
    const editOverlay = profileImgContainer?.querySelector('.edit-overlay');

    if (!profileImgContainer || !profileImg || !editOverlay) return;

    // Load profile picture from localStorage if available
    loadProfilePicture();

    // Add click event to the edit overlay
    editOverlay.addEventListener('click', function() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        // Add change event
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];

                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Image size should be less than 5MB', 'error');
                    return;
                }

                // Check file type
                if (!file.type.match('image.*')) {
                    showNotification('Please select an image file', 'error');
                    return;
                }

                // Show upload progress
                showProfilePictureUploadProgress();

                // Read file as data URL
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Simulate upload delay
                    simulateProfilePictureUpload(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // Append to body and trigger click
        document.body.appendChild(fileInput);
        fileInput.click();

        // Remove input after selection
        setTimeout(() => {
            document.body.removeChild(fileInput);
        }, 1000);
    });
}

// Load profile picture from localStorage
function loadProfilePicture() {
    const profileImg = document.querySelector('.account-profile-img img');
    const headerProfileImg = document.querySelector('.user-profile img');

    if (!profileImg) return;

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get profile picture
    const profilePicture = localStorage.getItem(`profilePicture_${currentUser.id}`);
    if (profilePicture) {
        profileImg.src = profilePicture;

        // Update header profile image if it exists
        if (headerProfileImg) {
            headerProfileImg.src = profilePicture;
        }
    }
}

// Show profile picture upload progress
function showProfilePictureUploadProgress() {
    const profileImgContainer = document.querySelector('.account-profile-img');
    if (!profileImgContainer) return;

    // Create progress overlay
    const progressOverlay = document.createElement('div');
    progressOverlay.className = 'upload-progress-overlay';
    progressOverlay.innerHTML = `
        <div class="upload-progress">
            <div class="upload-progress-bar" style="width: 0%"></div>
        </div>
        <div class="upload-progress-text">Uploading... 0%</div>
    `;

    // Add to container
    profileImgContainer.appendChild(progressOverlay);
}

// Simulate profile picture upload
function simulateProfilePictureUpload(dataUrl) {
    const progressBar = document.querySelector('.upload-progress-bar');
    const progressText = document.querySelector('.upload-progress-text');
    const profileImg = document.querySelector('.account-profile-img img');
    const headerProfileImg = document.querySelector('.user-profile img');

    if (!progressBar || !progressText || !profileImg) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Uploading... ${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);

            // Update profile image
            profileImg.src = dataUrl;

            // Update header profile image if it exists
            if (headerProfileImg) {
                headerProfileImg.src = dataUrl;
            }

            // Save to localStorage
            saveProfilePicture(dataUrl);

            // Remove progress overlay after a delay
            setTimeout(() => {
                const progressOverlay = document.querySelector('.upload-progress-overlay');
                if (progressOverlay) {
                    progressOverlay.remove();
                }

                // Show success message
                showNotification('Profile picture updated successfully', 'success');
            }, 500);
        }
    }, 100);
}

// Save profile picture to localStorage
function saveProfilePicture(dataUrl) {
    // Use the global profile picture update function if available
    if (window.updateGlobalProfilePicture) {
        window.updateGlobalProfilePicture(dataUrl);
    } else {
        // Fallback to local implementation
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        // Save profile picture
        localStorage.setItem(`profilePicture_${currentUser.id}`, dataUrl);

        // Update user object
        currentUser.profilePicture = dataUrl;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Set up account navigation
function setupAccountNavigation() {
    const navItems = document.querySelectorAll('.account-nav li');
    const sections = document.querySelectorAll('.account-section');

    if (!navItems.length || !sections.length) return;

    // Initially hide all sections except the first one
    sections.forEach((section, index) => {
        if (index > 0) {
            section.style.display = 'none';
        }
    });

    // Add click event to each nav item
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior

            // Get section ID from href
            const sectionId = this.querySelector('a').getAttribute('href');

            // Remove active class from all nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));

            // Add active class to clicked nav item
            this.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.style.display = 'none');

            // Show selected section
            const selectedSection = document.querySelector(sectionId);
            if (selectedSection) {
                selectedSection.style.display = 'block';

                // Scroll to the section
                selectedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Update URL hash without scrolling
            history.pushState(null, null, sectionId);
        });
    });

    // Check URL hash
    const hash = window.location.hash;
    if (hash) {
        const navItem = document.querySelector(`.account-nav li a[href="${hash}"]`);
        if (navItem) {
            navItem.parentElement.click();
        }
    } else {
        // If no hash, activate the first nav item
        const firstNavItem = navItems[0];
        if (firstNavItem) {
            firstNavItem.classList.add('active');
        }
    }
}

// Load user profile data
function loadUserProfile() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Update profile name and role
    const profileName = document.querySelector('.account-profile h3');
    const profileRole = document.querySelector('.account-profile p');

    if (profileName) {
        profileName.textContent = currentUser.name;
    }

    if (profileRole) {
        profileRole.textContent = currentUser.role || 'User';
    }

    // Update form fields
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const companyInput = document.getElementById('company');
    const jobTitleInput = document.getElementById('job-title');

    if (firstNameInput && currentUser.firstName) {
        firstNameInput.value = currentUser.firstName;
    } else if (firstNameInput && currentUser.name) {
        // Split name into first and last name
        const nameParts = currentUser.name.split(' ');
        if (nameParts.length > 0) {
            firstNameInput.value = nameParts[0];
        }
    }

    if (lastNameInput && currentUser.lastName) {
        lastNameInput.value = currentUser.lastName;
    } else if (lastNameInput && currentUser.name) {
        // Split name into first and last name
        const nameParts = currentUser.name.split(' ');
        if (nameParts.length > 1) {
            lastNameInput.value = nameParts.slice(1).join(' ');
        }
    }

    if (emailInput) {
        emailInput.value = currentUser.email;
    }

    if (phoneInput && currentUser.phone) {
        phoneInput.value = currentUser.phone;
    }

    if (companyInput && currentUser.company) {
        companyInput.value = currentUser.company;
    }

    if (jobTitleInput && currentUser.jobTitle) {
        jobTitleInput.value = currentUser.jobTitle;
    }
}

// Set up form submission
function setupFormSubmission() {
    const profileForm = document.querySelector('#profile form');

    if (!profileForm) return;

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const company = document.getElementById('company').value;
        const jobTitle = document.getElementById('job-title').value;

        // Validate form
        if (!firstName || !lastName || !email) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        // Update user object
        currentUser.firstName = firstName;
        currentUser.lastName = lastName;
        currentUser.name = `${firstName} ${lastName}`;
        currentUser.email = email;
        currentUser.phone = phone;
        currentUser.company = company;
        currentUser.jobTitle = jobTitle;

        // Save user object
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update profile name
        const profileName = document.querySelector('.account-profile h3');
        if (profileName) {
            profileName.textContent = currentUser.name;
        }

        // Update header user name
        const headerUserName = document.querySelector('.user-name');
        if (headerUserName) {
            headerUserName.textContent = currentUser.name;
        }

        // Show success message
        showNotification('Profile updated successfully', 'success');

        // Log this activity
        logUserActivity('profile', 'Profile Updated', 'You updated your profile information');
    });
}

// Set up notification toggles
function setupNotificationToggles() {
    const notificationToggles = document.querySelectorAll('#notifications .toggle-switch input');

    if (!notificationToggles.length) return;

    // Load saved notification settings
    loadNotificationSettings();

    // Add change event to each toggle
    notificationToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // Get toggle info
            const toggleInfo = this.closest('.security-option').querySelector('.security-option-info h4').textContent;

            // Save notification settings
            saveNotificationSettings();

            // Show notification
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`${toggleInfo} ${status}`, 'success');

            // Log this activity
            logUserActivity('profile', 'Notification Setting Changed', `You ${status} ${toggleInfo.toLowerCase()}`);
        });
    });
}

// Load notification settings from localStorage
function loadNotificationSettings() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get notification settings
    const notificationSettings = JSON.parse(localStorage.getItem(`notificationSettings_${currentUser.id}`)) || {};

    // Update toggles
    const notificationToggles = document.querySelectorAll('#notifications .toggle-switch input');

    notificationToggles.forEach(toggle => {
        const toggleName = toggle.closest('.security-option').querySelector('.security-option-info h4').textContent;
        const normalizedName = toggleName.toLowerCase().replace(/\s+/g, '_');

        // Set toggle state
        if (notificationSettings[normalizedName] !== undefined) {
            toggle.checked = notificationSettings[normalizedName];
        }
    });
}

// Save notification settings to localStorage
function saveNotificationSettings() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get notification settings
    const notificationSettings = {};

    // Get toggle states
    const notificationToggles = document.querySelectorAll('#notifications .toggle-switch input');

    notificationToggles.forEach(toggle => {
        const toggleName = toggle.closest('.security-option').querySelector('.security-option-info h4').textContent;
        const normalizedName = toggleName.toLowerCase().replace(/\s+/g, '_');

        // Save toggle state
        notificationSettings[normalizedName] = toggle.checked;
    });

    // Save to localStorage
    localStorage.setItem(`notificationSettings_${currentUser.id}`, JSON.stringify(notificationSettings));
}

// Set up preference settings
function setupPreferenceSettings() {
    const preferenceForm = document.querySelector('#preferences');
    const preferenceToggles = document.querySelectorAll('#preferences .toggle-switch input');
    const preferenceSelects = document.querySelectorAll('#preferences select');
    const resetButton = document.querySelector('#preferences .btn-secondary');
    const saveButton = document.querySelector('#preferences .btn-primary');

    if (!preferenceForm || !saveButton) return;

    // Load saved preference settings
    loadPreferenceSettings();

    // Add change event to each toggle
    preferenceToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // Apply preference immediately for demo purposes
            applyPreference(toggle);
        });
    });

    // Add change event to each select
    preferenceSelects.forEach(select => {
        select.addEventListener('change', function() {
            // Apply preference immediately for demo purposes
            applyPreference(select);
        });
    });

    // Add click event to reset button
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetPreferenceSettings();
        });
    }

    // Add click event to save button
    saveButton.addEventListener('click', function(e) {
        e.preventDefault();

        // Save preference settings
        savePreferenceSettings();

        // Show success message
        showNotification('Preferences saved successfully', 'success');
    });
}

// Load preference settings from localStorage
function loadPreferenceSettings() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get preference settings
    const preferenceSettings = JSON.parse(localStorage.getItem(`preferenceSettings_${currentUser.id}`)) || {};

    // Update toggles
    const preferenceToggles = document.querySelectorAll('#preferences .toggle-switch input');

    preferenceToggles.forEach(toggle => {
        const toggleName = toggle.closest('.security-option').querySelector('.security-option-info h4').textContent;
        const normalizedName = toggleName.toLowerCase().replace(/\s+/g, '_');

        // For Dark Mode toggle, check global theme preference
        if (toggleName === 'Dark Mode' && typeof getUserPreference === 'function') {
            const currentTheme = getUserPreference('dashboardTheme', 'default');
            toggle.checked = currentTheme === 'dark';
        }
        // For other toggles, use local preference settings
        else if (preferenceSettings[normalizedName] !== undefined) {
            toggle.checked = preferenceSettings[normalizedName];
        }

        // Apply preference
        applyPreference(toggle);
    });

    // Update selects
    const preferenceSelects = document.querySelectorAll('#preferences select');

    preferenceSelects.forEach(select => {
        // Set select value
        if (preferenceSettings[select.id] !== undefined) {
            select.value = preferenceSettings[select.id];

            // Apply preference
            applyPreference(select);
        }
    });
}

// Save preference settings to localStorage
function savePreferenceSettings() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get preference settings
    const preferenceSettings = {};

    // Get toggle states
    const preferenceToggles = document.querySelectorAll('#preferences .toggle-switch input');

    preferenceToggles.forEach(toggle => {
        const toggleName = toggle.closest('.security-option').querySelector('.security-option-info h4').textContent;
        const normalizedName = toggleName.toLowerCase().replace(/\s+/g, '_');

        // For Dark Mode toggle, also save to global theme preference
        if (toggleName === 'Dark Mode' && typeof saveUserPreference === 'function') {
            const newTheme = toggle.checked ? 'dark' : 'default';
            saveUserPreference('dashboardTheme', newTheme);
        }

        // Save toggle state to local preferences
        preferenceSettings[normalizedName] = toggle.checked;
    });

    // Get select values
    const preferenceSelects = document.querySelectorAll('#preferences select');

    preferenceSelects.forEach(select => {
        // Save select value
        preferenceSettings[select.id] = select.value;
    });

    // Save to localStorage
    localStorage.setItem(`preferenceSettings_${currentUser.id}`, JSON.stringify(preferenceSettings));

    // Log this activity
    logUserActivity('profile', 'Preferences Updated', 'You updated your account preferences');
}

// Reset preference settings to default
function resetPreferenceSettings() {
    // Reset toggles
    const preferenceToggles = document.querySelectorAll('#preferences .toggle-switch input');

    preferenceToggles.forEach(toggle => {
        toggle.checked = false;

        // Apply preference
        applyPreference(toggle);
    });

    // Reset selects
    const preferenceSelects = document.querySelectorAll('#preferences select');

    preferenceSelects.forEach(select => {
        // Reset to first option
        select.selectedIndex = 0;

        // Apply preference
        applyPreference(select);
    });

    // Show success message
    showNotification('Preferences reset to default', 'success');

    // Log this activity
    logUserActivity('profile', 'Preferences Reset', 'You reset your account preferences to default');
}

// Apply preference
function applyPreference(element) {
    // For demo purposes, we'll just show what would happen
    if (element.type === 'checkbox') {
        const toggleName = element.closest('.security-option').querySelector('.security-option-info h4').textContent;

        if (toggleName === 'Dark Mode') {
            // Always use the global theme function from theme-utils.js
            const newTheme = element.checked ? 'dark' : 'default';
            // Use window.applyTheme to ensure we're calling the global function
            window.applyTheme(newTheme);

            // Show notification
            showNotification(element.checked ? 'Dark mode enabled' : 'Dark mode disabled', 'info');
        } else if (toggleName === 'Compact View') {
            // Apply compact view
            if (element.checked) {
                document.documentElement.classList.add('compact-view');
                showNotification('Compact view enabled', 'info');
            } else {
                document.documentElement.classList.remove('compact-view');
                showNotification('Compact view disabled', 'info');
            }
        }
    } else if (element.tagName === 'SELECT') {
        // For selects, just show a notification
        const label = element.previousElementSibling.textContent;
        showNotification(`${label} set to ${element.options[element.selectedIndex].text}`, 'info');
    }
}

/**
 * Set up billing and subscription functionality
 */
function setupBillingAndSubscription() {
    // Set up change plan button
    const changePlanBtn = document.getElementById('change-plan-btn');
    if (changePlanBtn) {
        changePlanBtn.addEventListener('click', function() {
            showModal('plan-change-modal');
        });
    }

    // Set up add payment method button
    const addPaymentBtn = document.querySelector('.add-payment-btn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            showModal('add-payment-modal');
        });
    }

    // Set up edit payment buttons
    const editPaymentBtns = document.querySelectorAll('.edit-payment-btn');
    editPaymentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get payment method details
            const paymentMethod = this.closest('.payment-method');
            const paymentNumber = paymentMethod.querySelector('.payment-details h4').textContent;

            // Show edit payment modal (reuse add payment modal)
            showModal('add-payment-modal');

            // Update modal title
            const modalTitle = document.querySelector('#add-payment-modal .modal-header h3');
            if (modalTitle) {
                modalTitle.textContent = 'Edit Payment Method';
            }

            // Update button text
            const saveBtn = document.querySelector('#add-payment-modal .save-payment-method');
            if (saveBtn) {
                saveBtn.textContent = 'Update Payment Method';
            }

            // Log this activity
            logUserActivity('billing', 'Payment Method Edit', `You edited a payment method (${paymentNumber})`);
        });
    });

    // Set up remove payment buttons
    const removePaymentBtns = document.querySelectorAll('.remove-payment-btn');
    removePaymentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get payment method details
            const paymentMethod = this.closest('.payment-method');
            const paymentNumber = paymentMethod.querySelector('.payment-details h4').textContent;

            // Confirm removal
            if (confirm(`Are you sure you want to remove ${paymentNumber}?`)) {
                // Remove payment method (for demo, just hide it)
                paymentMethod.style.display = 'none';

                // Show success message
                showNotification(`${paymentNumber} has been removed`, 'success');

                // Log this activity
                logUserActivity('billing', 'Payment Method Removed', `You removed a payment method (${paymentNumber})`);
            }
        });
    });

    // Set up set default buttons
    const setDefaultBtns = document.querySelectorAll('.set-default-btn');
    setDefaultBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get payment method details
            const paymentMethod = this.closest('.payment-method');
            const paymentNumber = paymentMethod.querySelector('.payment-details h4').textContent;

            // Remove default from all payment methods
            document.querySelectorAll('.payment-default').forEach(el => el.remove());

            // Add default to this payment method
            const paymentDetails = paymentMethod.querySelector('.payment-details');
            const defaultText = document.createElement('p');
            defaultText.className = 'payment-default';
            defaultText.textContent = 'Default payment method';
            paymentDetails.appendChild(defaultText);

            // Hide set default button on this payment method
            this.style.display = 'none';

            // Show set default button on other payment methods
            document.querySelectorAll('.payment-method').forEach(pm => {
                if (pm !== paymentMethod) {
                    const setDefaultBtn = pm.querySelector('.set-default-btn');
                    if (setDefaultBtn) {
                        setDefaultBtn.style.display = 'block';
                    } else {
                        // Create set default button if it doesn't exist
                        const actionsDiv = pm.querySelector('.payment-actions');
                        if (actionsDiv) {
                            const newSetDefaultBtn = document.createElement('button');
                            newSetDefaultBtn.className = 'btn-secondary set-default-btn';
                            newSetDefaultBtn.textContent = 'Set Default';
                            actionsDiv.prepend(newSetDefaultBtn);

                            // Add event listener to new button
                            newSetDefaultBtn.addEventListener('click', function() {
                                // Get payment method details
                                const paymentMethod = this.closest('.payment-method');
                                const paymentNumber = paymentMethod.querySelector('.payment-details h4').textContent;

                                // Remove default from all payment methods
                                document.querySelectorAll('.payment-default').forEach(el => el.remove());

                                // Add default to this payment method
                                const paymentDetails = paymentMethod.querySelector('.payment-details');
                                const defaultText = document.createElement('p');
                                defaultText.className = 'payment-default';
                                defaultText.textContent = 'Default payment method';
                                paymentDetails.appendChild(defaultText);

                                // Hide set default button on this payment method
                                this.style.display = 'none';

                                // Show success message
                                showNotification(`${paymentNumber} set as default payment method`, 'success');

                                // Log this activity
                                logUserActivity('billing', 'Default Payment Method Changed', `You set ${paymentNumber} as your default payment method`);
                            });
                        }
                    }
                }
            });

            // Show success message
            showNotification(`${paymentNumber} set as default payment method`, 'success');

            // Log this activity
            logUserActivity('billing', 'Default Payment Method Changed', `You set ${paymentNumber} as your default payment method`);
        });
    });

    // Set up view all invoices button
    const viewAllInvoicesBtn = document.querySelector('.view-all-invoices');
    if (viewAllInvoicesBtn) {
        viewAllInvoicesBtn.addEventListener('click', function() {
            // For demo purposes, just show a notification
            showNotification('Viewing all invoices...', 'info');

            // Log this activity
            logUserActivity('billing', 'Viewed All Invoices', 'You viewed your complete billing history');
        });
    }

    // Set up invoice links
    const invoiceLinks = document.querySelectorAll('.invoice-link');
    invoiceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Get invoice details
            const row = this.closest('tr');
            const date = row.querySelector('td:first-child').textContent;
            const description = row.querySelector('td:nth-child(2)').textContent;

            // For demo purposes, just show a notification
            showNotification(`Downloading invoice for ${description} (${date})`, 'info');

            // Log this activity
            logUserActivity('billing', 'Invoice Downloaded', `You downloaded an invoice for ${description} (${date})`);
        });
    });

    // Set up billing settings save button
    const saveBillingSettingsBtn = document.querySelector('.save-billing-settings');
    if (saveBillingSettingsBtn) {
        saveBillingSettingsBtn.addEventListener('click', function() {
            // Get billing settings
            const autoRenew = document.getElementById('auto-renew-toggle').checked;
            const emailReceipts = document.getElementById('email-receipts-toggle').checked;
            const billingEmail = document.getElementById('billing-email').value;

            // Save billing settings to localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                const billingSettings = {
                    autoRenew,
                    emailReceipts,
                    billingEmail
                };

                localStorage.setItem(`billingSettings_${currentUser.id}`, JSON.stringify(billingSettings));

                // Show success message
                showNotification('Billing settings saved successfully', 'success');

                // Log this activity
                logUserActivity('billing', 'Billing Settings Updated', 'You updated your billing settings');
            }
        });
    }

    // Load billing settings from localStorage
    loadBillingSettings();
}

/**
 * Load billing settings from localStorage
 */
function loadBillingSettings() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get billing settings
    const billingSettings = JSON.parse(localStorage.getItem(`billingSettings_${currentUser.id}`)) || {
        autoRenew: true,
        emailReceipts: true,
        billingEmail: 'finance@acmecorp.com'
    };

    // Update UI
    const autoRenewToggle = document.getElementById('auto-renew-toggle');
    const emailReceiptsToggle = document.getElementById('email-receipts-toggle');
    const billingEmailInput = document.getElementById('billing-email');

    if (autoRenewToggle) {
        autoRenewToggle.checked = billingSettings.autoRenew;
    }

    if (emailReceiptsToggle) {
        emailReceiptsToggle.checked = billingSettings.emailReceipts;
    }

    if (billingEmailInput) {
        billingEmailInput.value = billingSettings.billingEmail;
    }
}

/**
 * Set up activity log functionality
 */
function setupActivityLog() {
    // Set up activity type filter
    const activityTypeFilter = document.getElementById('activity-type');
    if (activityTypeFilter) {
        activityTypeFilter.addEventListener('change', function() {
            filterActivityLog();
        });
    }

    // Set up date range filter
    const dateRangeFilter = document.getElementById('activity-date-range');
    if (dateRangeFilter) {
        dateRangeFilter.addEventListener('change', function() {
            // Show/hide custom date range inputs
            const customDateRange = document.querySelector('.custom-date-range');
            if (customDateRange) {
                customDateRange.style.display = this.value === 'custom' ? 'flex' : 'none';
            }

            filterActivityLog();
        });
    }

    // Set up custom date range filter
    const applyDateFilterBtn = document.querySelector('.apply-date-filter');
    if (applyDateFilterBtn) {
        applyDateFilterBtn.addEventListener('click', function() {
            filterActivityLog();
        });
    }

    // Set up pagination
    const prevPageBtn = document.querySelector('.pagination-prev');
    const nextPageBtn = document.querySelector('.pagination-next');
    const paginationInfo = document.querySelector('.pagination-info');

    if (prevPageBtn && nextPageBtn && paginationInfo) {
        // Set up current page
        let currentPage = 1;
        const totalPages = 3; // For demo purposes

        // Update pagination info
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        // Set up previous page button
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;

                // Enable/disable buttons
                prevPageBtn.disabled = currentPage === 1;
                nextPageBtn.disabled = false;

                // For demo purposes, just show a notification
                showNotification(`Viewing page ${currentPage} of activity log`, 'info');
            }
        });

        // Set up next page button
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;

                // Enable/disable buttons
                prevPageBtn.disabled = false;
                nextPageBtn.disabled = currentPage === totalPages;

                // For demo purposes, just show a notification
                showNotification(`Viewing page ${currentPage} of activity log`, 'info');
            }
        });
    }

    // Set up export button
    const exportBtn = document.querySelector('.export-activity-log');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // For demo purposes, just show a notification
            showNotification('Exporting activity log...', 'info');

            // Log this activity
            logUserActivity('profile', 'Activity Log Exported', 'You exported your account activity log');
        });
    }

    // Load activity log from localStorage
    loadActivityLog();
}

/**
 * Filter activity log based on selected filters
 */
function filterActivityLog() {
    // Get filter values
    const activityType = document.getElementById('activity-type').value;
    const dateRange = document.getElementById('activity-date-range').value;

    // Get activity log items
    const activityItems = document.querySelectorAll('.activity-log-item');

    // Filter by activity type
    activityItems.forEach(item => {
        // Reset display
        item.style.display = 'flex';

        // Filter by activity type
        if (activityType !== 'all') {
            const itemType = Array.from(item.querySelector('.activity-log-icon').classList)
                .find(cls => cls.endsWith('-activity'))
                ?.replace('-activity', '');

            if (itemType !== activityType) {
                item.style.display = 'none';
            }
        }

        // Filter by date range (for demo purposes, just hide some items)
        if (dateRange !== 'all' && item.style.display !== 'none') {
            const date = new Date(item.querySelector('.activity-log-time').textContent);
            const now = new Date();
            const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

            if (dateRange === '7' && daysDiff > 7) {
                item.style.display = 'none';
            } else if (dateRange === '30' && daysDiff > 30) {
                item.style.display = 'none';
            } else if (dateRange === '90' && daysDiff > 90) {
                item.style.display = 'none';
            } else if (dateRange === 'custom') {
                const fromDate = new Date(document.getElementById('date-from').value);
                const toDate = new Date(document.getElementById('date-to').value);

                if (fromDate && toDate) {
                    if (date < fromDate || date > toDate) {
                        item.style.display = 'none';
                    }
                }
            }
        }
    });

    // Show message if no results
    const activityList = document.querySelector('.activity-log-list');
    const noResultsMsg = document.querySelector('.no-activity-results');

    if (activityList) {
        const visibleItems = Array.from(activityItems).filter(item => item.style.display !== 'none');

        if (visibleItems.length === 0) {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.className = 'no-activity-results';
                msg.textContent = 'No activity found matching your filters.';
                msg.style.textAlign = 'center';
                msg.style.padding = '20px';
                msg.style.color = 'var(--accent-color)';

                activityList.appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

/**
 * Load activity log from localStorage
 */
function loadActivityLog() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get activity log
    const activityLog = JSON.parse(localStorage.getItem(`activityLog_${currentUser.id}`)) || [];

    // If there are stored activities, add them to the UI
    if (activityLog.length > 0) {
        const activityList = document.querySelector('.activity-log-list');

        // Clear existing demo activities
        if (activityList) {
            activityList.innerHTML = '';

            // Add activities from localStorage
            activityLog.forEach(activity => {
                const activityItem = createActivityLogItem(activity);
                activityList.appendChild(activityItem);
            });
        }
    }
}

/**
 * Create activity log item element
 * @param {Object} activity - Activity object
 * @returns {HTMLElement} - Activity log item element
 */
function createActivityLogItem(activity) {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-log-item';

    // Get icon based on activity type
    let iconClass = 'fa-info-circle';
    switch (activity.type) {
        case 'login':
            iconClass = 'fa-sign-in-alt';
            break;
        case 'profile':
            iconClass = 'fa-user-edit';
            break;
        case 'security':
            iconClass = 'fa-shield-alt';
            break;
        case 'billing':
            iconClass = 'fa-credit-card';
            break;
        case 'subscription':
            iconClass = 'fa-exchange-alt';
            break;
    }

    activityItem.innerHTML = `
        <div class="activity-log-icon ${activity.type}-activity">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="activity-log-details">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
            <p class="activity-log-meta">
                <span class="activity-log-time">${formatDate(activity.timestamp)}</span>
                <span class="activity-log-ip">IP: ${activity.ip || '192.168.1.1'}</span>
                <span class="activity-log-location">${activity.location || 'New York, USA'}</span>
            </p>
        </div>
    `;

    return activityItem;
}

/**
 * Log user activity
 * @param {string} type - Activity type (login, profile, security, billing, subscription)
 * @param {string} title - Activity title
 * @param {string} description - Activity description
 */
function logUserActivity(type, title, description) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get activity log
    const activityLog = JSON.parse(localStorage.getItem(`activityLog_${currentUser.id}`)) || [];

    // Create new activity
    const newActivity = {
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1', // For demo purposes
        location: 'New York, USA' // For demo purposes
    };

    // Add to activity log
    activityLog.unshift(newActivity);

    // Limit to 100 activities
    if (activityLog.length > 100) {
        activityLog.pop();
    }

    // Save to localStorage
    localStorage.setItem(`activityLog_${currentUser.id}`, JSON.stringify(activityLog));

    // Update UI if activity log section is visible
    const activityLogSection = document.getElementById('activity-log');
    if (activityLogSection && window.getComputedStyle(activityLogSection).display !== 'none') {
        const activityList = activityLogSection.querySelector('.activity-log-list');
        if (activityList) {
            // Create new activity item
            const activityItem = createActivityLogItem(newActivity);

            // Add to the beginning of the list
            if (activityList.firstChild) {
                activityList.insertBefore(activityItem, activityList.firstChild);
            } else {
                activityList.appendChild(activityItem);
            }
        }
    }
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
}

/**
 * Initialize modals
 */
function initializeModals() {
    // Set up modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find closest modal overlay
            const modalOverlay = this.closest('.modal-overlay');
            if (modalOverlay) {
                // Hide modal
                modalOverlay.parentElement.style.display = 'none';
            }
        });
    });

    // Set up plan selection
    const selectPlanButtons = document.querySelectorAll('.select-plan-btn:not([disabled])');
    selectPlanButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get plan details
            const planOption = this.closest('.plan-option');
            const planName = planOption.querySelector('.plan-header h4').textContent;
            const planPrice = planOption.querySelector('.plan-price').textContent;

            // Confirm plan change
            if (confirm(`Are you sure you want to change to the ${planName} plan (${planPrice})?`)) {
                // Update current plan badge
                document.querySelectorAll('.plan-badge, .current-plan').forEach(el => {
                    if (el.classList.contains('plan-badge')) {
                        el.remove();
                    } else {
                        el.classList.remove('current-plan');
                    }
                });

                // Add current plan badge to selected plan
                planOption.classList.add('current-plan');
                const planBadge = document.createElement('div');
                planBadge.className = 'plan-badge';
                planBadge.textContent = 'Current Plan';
                planOption.appendChild(planBadge);

                // Update button text
                this.textContent = 'Current Plan';
                this.disabled = true;
                this.className = 'btn-primary select-plan-btn';

                // Enable other buttons
                selectPlanButtons.forEach(btn => {
                    if (btn !== this) {
                        btn.disabled = false;
                        btn.textContent = 'Select Plan';
                        btn.className = 'btn-secondary select-plan-btn';
                    }
                });

                // Update subscription info on the main page
                const subscriptionInfo = document.querySelector('.subscription-info');
                if (subscriptionInfo) {
                    const planInfo = subscriptionInfo.querySelector('h4');
                    if (planInfo) {
                        planInfo.textContent = `Current Plan: ${planName}`;
                    }
                }

                // Hide modal
                const modalOverlay = this.closest('.modal-overlay');
                if (modalOverlay) {
                    modalOverlay.parentElement.style.display = 'none';
                }

                // Show success message
                showNotification(`Your subscription has been changed to the ${planName} plan`, 'success');

                // Log this activity
                logUserActivity('subscription', 'Subscription Changed', `You changed your subscription to the ${planName} plan`);
            }
        });
    });

    // Set up payment method form
    const savePaymentMethodBtn = document.querySelector('.save-payment-method');
    if (savePaymentMethodBtn) {
        savePaymentMethodBtn.addEventListener('click', function() {
            // Get form values
            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCVC = document.getElementById('card-cvc').value;

            // Validate form
            if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // For demo purposes, just show a success message
            showNotification('Payment method added successfully', 'success');

            // Hide modal
            const modalOverlay = this.closest('.modal-overlay');
            if (modalOverlay) {
                modalOverlay.parentElement.style.display = 'none';
            }

            // Log this activity
            logUserActivity('billing', 'Payment Method Added', `You added a new payment method (${cardNumber.slice(-4)})`);
        });
    }
}

/**
 * Show modal by ID
 * @param {string} modalId - Modal ID
 */
function showModal(modalId) {
    // First, remove any existing modal with this ID from the DOM
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }

    // Close any existing modals first
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.remove();
    });

    // Get theme colors
    const isDarkMode = document.body.classList.contains('dark-theme');
    const bgColor = isDarkMode ? 'var(--widget-bg)' : 'white';
    const textColor = isDarkMode ? 'var(--text-color)' : '#333';
    const borderColor = isDarkMode ? 'var(--border-color)' : '#e0e0e0';
    const inputBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white';

    console.log('Creating modal with ID:', modalId);

    // Create new modal based on ID
    if (modalId === 'plan-change-modal') {
        createPlanChangeModal(bgColor, textColor, borderColor);
    } else if (modalId === 'add-payment-modal') {
        createAddPaymentModal(bgColor, textColor, borderColor, inputBgColor);
    }
}

/**
 * Create plan change modal with ticket-style container
 * @param {string} bgColor - Background color
 * @param {string} textColor - Text color
 * @param {string} borderColor - Border color
 */
function createPlanChangeModal(bgColor, textColor, borderColor) {
    console.log('Creating plan change modal');

    // Get theme colors
    const isDarkMode = document.body.classList.contains('dark-theme');

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="plan-change-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-container" style="background-color: ${bgColor}; color: ${textColor}; border-radius: 8px; width: 90%; max-width: 800px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); overflow: hidden; animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid ${borderColor};">
                    <h3 style="margin: 0; color: ${textColor};">Change Subscription Plan</h3>
                    <button class="modal-close" style="background: none; border: none; cursor: pointer; font-size: 16px; color: ${textColor};"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                    <div class="plan-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
                        <div class="plan-option" style="border: 1px solid ${borderColor}; border-radius: 8px; padding: 20px; position: relative; transition: all 0.3s ease;">
                            <div class="plan-header">
                                <h4 style="margin-top: 0; color: ${textColor};">Basic</h4>
                                <p class="plan-price" style="font-size: 24px; font-weight: 600; color: ${textColor};">$49.99<span style="font-size: 14px; font-weight: normal;">/month</span></p>
                            </div>
                            <ul class="plan-features" style="list-style: none; padding: 0; margin: 15px 0;">
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> 5 users</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Standard support</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Basic analytics</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> 50GB storage</li>
                                <li style="margin-bottom: 8px; opacity: 0.5;"><i class="fas fa-times" style="color: #F44336; margin-right: 8px;"></i> Custom branding</li>
                                <li style="margin-bottom: 8px; opacity: 0.5;"><i class="fas fa-times" style="color: #F44336; margin-right: 8px;"></i> API access</li>
                            </ul>
                            <button class="select-plan-btn btn-primary" style="width: 100%; padding: 10px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Select Plan</button>
                        </div>
                        <div class="plan-option" style="border: 1px solid ${borderColor}; border-radius: 8px; padding: 20px; position: relative; transition: all 0.3s ease;">
                            <div class="plan-header">
                                <h4 style="margin-top: 0; color: ${textColor};">Professional</h4>
                                <p class="plan-price" style="font-size: 24px; font-weight: 600; color: ${textColor};">$99.99<span style="font-size: 14px; font-weight: normal;">/month</span></p>
                            </div>
                            <ul class="plan-features" style="list-style: none; padding: 0; margin: 15px 0;">
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> 20 users</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Priority support</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Advanced analytics</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> 200GB storage</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Custom branding</li>
                                <li style="margin-bottom: 8px; opacity: 0.5;"><i class="fas fa-times" style="color: #F44336; margin-right: 8px;"></i> API access</li>
                            </ul>
                            <button class="select-plan-btn btn-primary" style="width: 100%; padding: 10px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Select Plan</button>
                        </div>
                        <div class="plan-option current-plan" style="border: 2px solid #000000; border-radius: 8px; padding: 20px; position: relative; transition: all 0.3s ease; background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9f9f9'};">
                            <div class="plan-badge" style="position: absolute; top: -10px; right: -10px; background-color: #000000; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">Current</div>
                            <div class="plan-header">
                                <h4 style="margin-top: 0; color: ${textColor};">Enterprise</h4>
                                <p class="plan-price" style="font-size: 24px; font-weight: 600; color: ${textColor};">$199.99<span style="font-size: 14px; font-weight: normal;">/month</span></p>
                            </div>
                            <ul class="plan-features" style="list-style: none; padding: 0; margin: 15px 0;">
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Unlimited users</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> 24/7 priority support</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Advanced analytics</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Custom branding</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> API access</li>
                                <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: #4CAF50; margin-right: 8px;"></i> Unlimited storage</li>
                            </ul>
                            <button class="select-plan-btn btn-primary" disabled style="width: 100%; padding: 10px; background-color: #cccccc; color: #666666; border: none; border-radius: 4px; cursor: not-allowed;">Current Plan</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: space-between; padding: 15px 20px; border-top: 1px solid ${borderColor};">
                    <p class="plan-change-note" style="margin: 0; font-size: 14px; color: ${textColor}; opacity: 0.8;">Note: Plan changes take effect immediately. You will be charged or credited the prorated difference.</p>
                    <button class="btn-secondary modal-cancel" style="padding: 8px 15px; background-color: ${isDarkMode ? '#333' : '#e0e0e0'}; color: ${textColor}; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupPlanChangeModalListeners();

    // Add animation style if not already present
    addModalAnimationStyle();
}

/**
 * Create add payment modal with ticket-style container
 * @param {string} bgColor - Background color
 * @param {string} textColor - Text color
 * @param {string} borderColor - Border color
 * @param {string} inputBgColor - Input background color
 */
function createAddPaymentModal(bgColor, textColor, borderColor, inputBgColor) {
    console.log('Creating add payment modal');

    // Get theme colors
    const isDarkMode = document.body.classList.contains('dark-theme');

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="add-payment-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-container" style="background-color: ${bgColor}; color: ${textColor}; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); overflow: hidden; animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid ${borderColor};">
                    <h3 style="margin: 0; color: ${textColor};">Add Payment Method</h3>
                    <button class="modal-close" style="background: none; border: none; cursor: pointer; font-size: 16px; color: ${textColor};"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                    <form id="payment-form">
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="card-name" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Name on Card</label>
                            <input type="text" id="card-name" placeholder="John Doe" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="card-number" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Card Number</label>
                            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group" style="flex: 1;">
                                <label for="card-expiry" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Expiration Date</label>
                                <input type="text" id="card-expiry" placeholder="MM/YY" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label for="card-cvc" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">CVC</label>
                                <input type="text" id="card-cvc" placeholder="123" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="billing-address" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Billing Address</label>
                            <input type="text" id="billing-address" placeholder="123 Main St" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group" style="flex: 1;">
                                <label for="billing-city" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">City</label>
                                <input type="text" id="billing-city" placeholder="New York" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label for="billing-zip" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">ZIP Code</label>
                                <input type="text" id="billing-zip" placeholder="10001" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="billing-country" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Country</label>
                            <select id="billing-country" required style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="UK">United Kingdom</option>
                                <option value="AU">Australia</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label class="checkbox-label" style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="save-card" checked style="margin-right: 10px;">
                                <span style="color: ${textColor};">Save this card for future payments</span>
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px; padding: 15px 20px; border-top: 1px solid ${borderColor};">
                    <button class="btn-secondary modal-cancel" style="padding: 8px 15px; background-color: ${isDarkMode ? '#333' : '#e0e0e0'}; color: ${textColor}; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button class="btn-primary" id="save-payment-btn" style="padding: 8px 15px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Payment Method</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupAddPaymentModalListeners();

    // Add animation style if not already present
    addModalAnimationStyle();
}

/**
 * Add modal animation style if not already present
 */
function addModalAnimationStyle() {
    if (!document.getElementById('modal-animations')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'modal-animations';
        styleElement.textContent = `
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.96);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}

/**
 * Set up plan change modal event listeners
 */
function setupPlanChangeModalListeners() {
    const modal = document.getElementById('plan-change-modal');

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Cancel button
    const cancelBtn = modal.querySelector('.modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Set up plan selection
    const selectPlanButtons = modal.querySelectorAll('.select-plan-btn:not([disabled])');
    selectPlanButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get plan details
            const planOption = this.closest('.plan-option');
            const planName = planOption.querySelector('.plan-header h4').textContent;
            const planPrice = planOption.querySelector('.plan-price').textContent;

            // Confirm plan change
            if (confirm(`Are you sure you want to change to the ${planName} plan (${planPrice})?`)) {
                // Update current plan badge
                document.querySelectorAll('.plan-badge, .current-plan').forEach(el => {
                    if (el.classList.contains('plan-badge')) {
                        el.remove();
                    } else {
                        el.classList.remove('current-plan');
                    }
                });

                // Add badge to selected plan
                planOption.classList.add('current-plan');
                const badge = document.createElement('div');
                badge.classList.add('plan-badge');
                badge.textContent = 'Current';
                planOption.appendChild(badge);

                // Update subscription info on the main page
                const subscriptionInfo = document.querySelector('.subscription-info');
                if (subscriptionInfo) {
                    const planInfo = subscriptionInfo.querySelector('h4');
                    if (planInfo) {
                        planInfo.textContent = `Current Plan: ${planName}`;
                    }
                }

                // Show success message
                showNotification(`Your subscription has been changed to the ${planName} plan`, 'success');

                // Log this activity
                logUserActivity('subscription', 'Subscription Changed', `You changed your subscription to the ${planName} plan`);

                // Close modal
                modal.remove();
            }
        });
    });
}

/**
 * Set up add payment modal event listeners
 */
function setupAddPaymentModalListeners() {
    const modal = document.getElementById('add-payment-modal');

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Cancel button
    const cancelBtn = modal.querySelector('.modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Save payment button
    const saveBtn = document.getElementById('save-payment-btn');
    if (saveBtn) {
        console.log('Found save payment button');
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Save payment button clicked');

            // Get form values
            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCVC = document.getElementById('card-cvc').value;
            const billingAddress = document.getElementById('billing-address').value;
            const billingCity = document.getElementById('billing-city').value;
            const billingZip = document.getElementById('billing-zip').value;
            const billingCountry = document.getElementById('billing-country').value;
            const saveCardOption = document.getElementById('save-card').checked;

            // Validate form
            if (!cardName || !cardNumber || !cardExpiry || !cardCVC || !billingAddress || !billingCity || !billingZip || !billingCountry) {
                alert('Please fill in all required fields');
                return;
            }

            // For demo purposes, just show a success message
            const saveMessage = saveCardOption ? 'Payment method added and saved for future payments' : 'Payment method added successfully';
            showNotification(saveMessage, 'success');

            // Log this activity
            logUserActivity('billing', 'Payment Method Added', `You added a new payment method (${cardNumber.slice(-4)})`);

            // Close modal
            modal.remove();
        });
    } else {
        console.error('Save payment button not found');
    }
}
