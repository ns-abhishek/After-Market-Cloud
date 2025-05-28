document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // DOM Elements
    const menuLinks = document.querySelectorAll('.menu-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const logoutBtn = document.getElementById('logoutBtn');
    const themeToggle = document.getElementById('themeToggle');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const menuNav = document.querySelector('.menu-nav');
    const languageSelect = document.getElementById('languageSelect');
    const publishStatus = document.getElementById('publishStatus');
    const scheduledOptions = document.querySelector('.scheduled-options');
    const addFeatureBtn = document.getElementById('addFeatureBtn');
    const addImprovementBtn = document.getElementById('addImprovementBtn');
    const addBugfixBtn = document.getElementById('addBugfixBtn');
    const addIssueBtn = document.getElementById('addIssueBtn');
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const closeModalBtn = document.querySelector('.close-btn');
    const releaseForm = document.getElementById('releaseForm');
    const featuresContainer = document.getElementById('features-container');
    const improvementsContainer = document.getElementById('improvements-container');
    const bugfixesContainer = document.getElementById('bugfixes-container');
    const issuesContainer = document.getElementById('issues-container');

    // Initialize Quill editor
    const quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Write detailed description here...',
        theme: 'snow'
    });

    // Distribution Settings Functionality
    function initializeDistributionSettings() {
        // Distribution tabs for all sections
        const distributionTabs = document.querySelectorAll('.distribution-tab');

        distributionTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                const tabsContainer = this.closest('.distribution-tabs');

                // Find the parent container that holds all tab contents
                let contentContainer = tabsContainer.closest('.distribution-section').querySelector('.distribution-content');

                if (!contentContainer) {
                    console.error('Could not find content container for tab:', tabName);
                    showNotification('Error finding tab content. Please try again.', 'error');
                    return;
                }

                // Find all tab contents within this distribution section
                const distributionTabContents = contentContainer.querySelectorAll('.distribution-tab-content');

                // Update active tab
                const siblingTabs = tabsContainer.querySelectorAll('.distribution-tab');
                siblingTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding tab content
                distributionTabContents.forEach(content => {
                    content.style.display = 'none';
                });

                // Find the specific tab content to show
                const targetContent = contentContainer.querySelector(`#${tabName}-tab`);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    showNotification(`Switched to ${tabName} tab`, 'info');
                } else {
                    console.error('Could not find tab content for:', tabName);
                    showNotification(`Could not find content for ${tabName} tab`, 'error');
                }
            });
        });

        // Scope selection for all sections
        const scopeRadios = document.querySelectorAll('input[name="scope"]');
        const scopeSummary = document.getElementById('scopeSummary');
        const tourScopeSummary = document.getElementById('tourScopeSummary');
        const downtimeScopeSummary = document.getElementById('downtimeScopeSummary');

        if (scopeRadios.length > 0) {
            // Initialize the display based on the currently selected radio button
            scopeRadios.forEach(radio => {
                if (radio.checked) {
                    const scope = radio.value;
                    const section = radio.closest('.distribution-section');

                    if (section) {
                        const productSel = section.querySelector('.product-selector');
                        const groupSel = section.querySelector('.group-selector');

                        if (productSel && groupSel) {
                            if (scope === 'product') {
                                productSel.style.display = 'block';
                                groupSel.style.display = 'none';
                            } else if (scope === 'group') {
                                productSel.style.display = 'none';
                                groupSel.style.display = 'block';
                            } else {
                                productSel.style.display = 'none';
                                groupSel.style.display = 'none';
                            }
                        }
                    }
                }
            });

            // Add event listeners to the radio buttons
            scopeRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const scope = this.value;
                    const section = this.closest('.distribution-section');

                    if (section) {
                        const productSel = section.querySelector('.product-selector');
                        const groupSel = section.querySelector('.group-selector');

                        // Show/hide selectors based on scope
                        if (productSel && groupSel) {
                            if (scope === 'product') {
                                productSel.style.display = 'block';
                                groupSel.style.display = 'none';
                            } else if (scope === 'group') {
                                productSel.style.display = 'none';
                                groupSel.style.display = 'block';
                            } else {
                                productSel.style.display = 'none';
                                groupSel.style.display = 'none';
                            }
                        }

                        // Update summary
                        const scopeText = scope === 'all' ? 'All Companies' :
                                         scope === 'product' ? 'Product-specific' :
                                         'Company Group';

                        // Determine which section we're in and update the appropriate summary
                        if (section.closest('#manage-release')) {
                            if (scopeSummary) {
                                scopeSummary.textContent = scopeText;
                            }
                        } else if (section.closest('#feature-tours')) {
                            if (tourScopeSummary) {
                                tourScopeSummary.textContent = scopeText;
                            }
                        } else if (section.closest('#downtime')) {
                            if (downtimeScopeSummary) {
                                downtimeScopeSummary.textContent = scopeText;
                            }
                        }

                        showNotification(`Distribution scope set to: ${scope}`, 'info');
                    } else {
                        console.warn('Could not find parent section for scope selection');
                    }
                });
            });
        } else {
            console.warn('No scope radio buttons found');
        }

        // Company selection for all sections
        const companyRadios = document.querySelectorAll('input[name="companySelection"]');
        const companiesSummary = document.getElementById('companiesSummary');
        const tourCompaniesSummary = document.getElementById('tourCompaniesSummary');
        const downtimeCompaniesSummary = document.getElementById('downtimeCompaniesSummary');

        if (companyRadios.length > 0) {
            // Initialize the display based on the currently selected radio button
            companyRadios.forEach(radio => {
                if (radio.checked) {
                    const selection = radio.value;
                    const section = radio.closest('.distribution-section');

                    if (section) {
                        const companiesSelector = section.querySelector('.companies-selector');
                        if (companiesSelector) {
                            companiesSelector.style.display = selection === 'specific' ? 'block' : 'none';
                        }
                    }
                }
            });

            // Add event listeners to the radio buttons
            companyRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const selection = this.value;

                    // Find the closest companies selector to this radio button
                    const section = this.closest('.distribution-section');

                    if (section) {
                        const companiesSelector = section.querySelector('.companies-selector');

                        // Show/hide companies selector
                        if (companiesSelector) {
                            if (selection === 'specific') {
                                companiesSelector.style.display = 'block';
                            } else {
                                companiesSelector.style.display = 'none';
                            }
                        }

                        // Update summary based on which section we're in
                        const companyText = selection === 'all' ? 'All Companies' : 'Specific Companies';

                        if (section.closest('#manage-release')) {
                            if (companiesSummary) {
                                companiesSummary.textContent = companyText;
                            }
                        } else if (section.closest('#feature-tours')) {
                            if (tourCompaniesSummary) {
                                tourCompaniesSummary.textContent = companyText;
                            }
                        } else if (section.closest('#downtime')) {
                            if (downtimeCompaniesSummary) {
                                downtimeCompaniesSummary.textContent = companyText;
                            }
                        }

                        showNotification(`Company selection set to: ${selection}`, 'info');
                    } else {
                        console.warn('Could not find parent section for company selection');
                    }
                });
            });
        } else {
            console.warn('No company selection radio buttons found');
        }

        // Branch selection for all sections
        const branchRadios = document.querySelectorAll('input[name="branchSelection"]');
        const branchesSummary = document.getElementById('branchesSummary');
        const tourBranchesSummary = document.getElementById('tourBranchesSummary');
        const downtimeBranchesSummary = document.getElementById('downtimeBranchesSummary');

        if (branchRadios.length > 0) {
            // Initialize the display based on the currently selected radio button
            branchRadios.forEach(radio => {
                if (radio.checked) {
                    const selection = radio.value;
                    const section = radio.closest('.distribution-section');

                    if (section) {
                        const branchesSelector = section.querySelector('.branches-selector');
                        if (branchesSelector) {
                            branchesSelector.style.display = (selection === 'ho-selected' || selection === 'selected') ? 'block' : 'none';
                        }
                    }
                }
            });

            // Add event listeners to the radio buttons
            branchRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const selection = this.value;

                    // Find the closest branches selector to this radio button
                    const section = this.closest('.distribution-section');

                    if (section) {
                        const branchesSelector = section.querySelector('.branches-selector');

                        // Show/hide branches selector
                        if (branchesSelector) {
                            if (selection === 'ho-selected' || selection === 'selected') {
                                branchesSelector.style.display = 'block';
                            } else {
                                branchesSelector.style.display = 'none';
                            }
                        }

                        // Update summary
                        const branchText = selection === 'all' ? 'All Branches' :
                                         selection === 'ho' ? 'Head Office Only' :
                                         selection === 'ho-all' ? 'HO and All Branches' :
                                         selection === 'ho-selected' ? 'HO and Selected Branches' :
                                         'Selected Branches Only';

                        // Update the appropriate summary based on which section we're in
                        if (section.closest('#manage-release')) {
                            if (branchesSummary) {
                                branchesSummary.textContent = branchText;
                            }
                        } else if (section.closest('#feature-tours')) {
                            if (tourBranchesSummary) {
                                tourBranchesSummary.textContent = branchText;
                            }
                        } else if (section.closest('#downtime')) {
                            if (downtimeBranchesSummary) {
                                downtimeBranchesSummary.textContent = branchText;
                            }
                        }

                        showNotification(`Branch selection set to: ${selection}`, 'info');
                    } else {
                        console.warn('Could not find parent section for branch selection');
                    }
                });
            });
        } else {
            console.warn('No branch selection radio buttons found');
        }

        // User selection for all sections
        const userRadios = document.querySelectorAll('input[name="userSelection"]');
        const usersSummary = document.getElementById('usersSummary');
        const tourUsersSummary = document.getElementById('tourUsersSummary');
        const downtimeUsersSummary = document.getElementById('downtimeUsersSummary');

        if (userRadios.length > 0) {
            // Initialize the display based on the currently selected radio button
            userRadios.forEach(radio => {
                if (radio.checked) {
                    const selection = radio.value;
                    const section = radio.closest('.distribution-section');

                    if (section) {
                        const usersSelector = section.querySelector('.users-selector');
                        if (usersSelector) {
                            usersSelector.style.display = selection === 'specific' ? 'block' : 'none';
                        }
                    }
                }
            });

            // Add event listeners to the radio buttons
            userRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const selection = this.value;

                    // Find the closest users selector to this radio button
                    const section = this.closest('.distribution-section');

                    if (section) {
                        const usersSelector = section.querySelector('.users-selector');

                        // Show/hide users selector
                        if (usersSelector) {
                            if (selection === 'specific') {
                                usersSelector.style.display = 'block';
                            } else {
                                usersSelector.style.display = 'none';
                            }
                        }

                        // Update summary
                        const userText = selection === 'all' ? 'All Users' :
                                       selection === 'premium' ? 'Premium Users Only' :
                                       selection === 'beta' ? 'Beta Testers' :
                                       'Specific Users';

                        // Update the appropriate summary based on which section we're in
                        if (section.closest('#manage-release')) {
                            if (usersSummary) {
                                usersSummary.textContent = userText;
                            }
                        } else if (section.closest('#feature-tours')) {
                            if (tourUsersSummary) {
                                tourUsersSummary.textContent = userText;
                            }
                        } else if (section.closest('#downtime')) {
                            if (downtimeUsersSummary) {
                                downtimeUsersSummary.textContent = userText;
                            }
                        }

                        showNotification(`User selection set to: ${selection}`, 'info');
                    } else {
                        console.warn('Could not find parent section for user selection');
                    }
                });
            });
        } else {
            console.warn('No user selection radio buttons found');
        }
    }

    // Initialize distribution settings
    initializeDistributionSettings();

    // The distribution summary updates are now handled in the main event listeners above

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Update button text and icon based on saved theme
        if (savedTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="theme-toggle-text">Light Mode</span>';
        }
    }

    // Toggle theme (dark/light mode)
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update button text and icon
        if (newTheme === 'dark') {
            this.innerHTML = '<i class="fas fa-sun"></i><span class="theme-toggle-text">Light Mode</span>';
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i><span class="theme-toggle-text">Dark Mode</span>';
        }

        // Load saved colors for the new theme
        loadSavedColors();
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            menuNav.classList.toggle('active');
            this.innerHTML = menuNav.classList.contains('active') ?
                '<i class="fas fa-times"></i>' :
                '<i class="fas fa-bars"></i>';
        });
    }

    // Hamburger menu toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerDropdown = document.querySelector('.hamburger-dropdown');

    if (hamburgerBtn && hamburgerDropdown) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburgerDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburgerDropdown.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerDropdown.classList.remove('show');
            }
        });

        // Add click event to dropdown items
        const dropdownLinks = hamburgerDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerDropdown.classList.remove('show');
            });
        });
    }

    // Language selection
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // In a real app, this would update the UI language
            showNotification(`Language changed to ${selectedLanguage.toUpperCase()}`, 'info');

            // Store language preference
            localStorage.setItem('adminLanguage', selectedLanguage);
        });

        // Set initial language from localStorage if available
        const savedLanguage = localStorage.getItem('adminLanguage');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
        }
    }

    // Navigation between sections
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetSection = this.getAttribute('data-section');

            // Update active link
            menuLinks.forEach(link => link.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Close mobile menu if open
            if (window.innerWidth < 992) {
                menuNav.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    });

    // Show notification
    function showNotification(message, type = 'error') {
        notificationMessage.textContent = message;
        notification.style.background = type === 'error' ? 'var(--error-color)' :
                                        type === 'success' ? 'var(--success-color)' :
                                        type === 'warning' ? 'var(--warning-color)' :
                                        'var(--info-color)';
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Toggle scheduled options based on publish status
    if (publishStatus) {
        publishStatus.addEventListener('change', function() {
            if (this.value === 'scheduled') {
                scheduledOptions.style.display = 'block';
            } else {
                scheduledOptions.style.display = 'none';
            }
        });
    }

    // Add feature functionality
    if (addFeatureBtn) {
        addFeatureBtn.addEventListener('click', function() {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Feature Title*</label>
                        <input type="text" name="featureTitle[]" placeholder="e.g., New User Interface" required>
                    </div>

                    <div class="form-group">
                        <label>Feature Image</label>
                        <div class="file-input-container">
                            <input type="file" name="featureImage[]" accept="image/*">
                            <button type="button" class="select-from-library-btn">
                                <i class="fas fa-photo-film"></i> Select from Library
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Feature Description*</label>
                    <textarea name="featureDescription[]" placeholder="Describe the feature" required></textarea>
                </div>

                <div class="form-group">
                    <label>User Benefit</label>
                    <textarea name="featureBenefit[]" placeholder="How does this feature benefit the user?"></textarea>
                </div>

                <button type="button" class="remove-item-btn secondary-btn">
                    <i class="fas fa-trash-alt"></i> Remove Feature
                </button>
            `;

            featuresContainer.appendChild(featureItem);

            // Add event listener to the remove button
            const removeBtn = featureItem.querySelector('.remove-item-btn');
            removeBtn.addEventListener('click', function() {
                featuresContainer.removeChild(featureItem);
            });
        });
    }

    // Add improvement functionality
    if (addImprovementBtn) {
        addImprovementBtn.addEventListener('click', function() {
            const improvementItem = document.createElement('div');
            improvementItem.className = 'improvement-item';
            improvementItem.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Area*</label>
                        <input type="text" name="improvementArea[]" placeholder="e.g., Performance" required>
                    </div>

                    <div class="form-group">
                        <label>Details*</label>
                        <textarea name="improvementDetails[]" placeholder="Describe the improvement" required></textarea>
                    </div>
                </div>

                <button type="button" class="remove-item-btn secondary-btn">
                    <i class="fas fa-trash-alt"></i> Remove Improvement
                </button>
            `;

            improvementsContainer.appendChild(improvementItem);

            // Add event listener to the remove button
            const removeBtn = improvementItem.querySelector('.remove-item-btn');
            removeBtn.addEventListener('click', function() {
                improvementsContainer.removeChild(improvementItem);
            });
        });
    }

    // Add bug fix functionality
    if (addBugfixBtn) {
        addBugfixBtn.addEventListener('click', function() {
            const bugfixItem = document.createElement('div');
            bugfixItem.className = 'bugfix-item';
            bugfixItem.innerHTML = `
                <div class="form-group">
                    <label>Bug Fix Description*</label>
                    <textarea name="bugFix[]" placeholder="Describe the bug fix" required></textarea>
                </div>

                <button type="button" class="remove-item-btn secondary-btn">
                    <i class="fas fa-trash-alt"></i> Remove Bug Fix
                </button>
            `;

            bugfixesContainer.appendChild(bugfixItem);

            // Add event listener to the remove button
            const removeBtn = bugfixItem.querySelector('.remove-item-btn');
            removeBtn.addEventListener('click', function() {
                bugfixesContainer.removeChild(bugfixItem);
            });
        });
    }

    // Add known issue functionality
    if (addIssueBtn) {
        addIssueBtn.addEventListener('click', function() {
            const issueItem = document.createElement('div');
            issueItem.className = 'issue-item';
            issueItem.innerHTML = `
                <div class="form-group">
                    <label>Issue Description*</label>
                    <textarea name="issue[]" placeholder="Describe the known issue" required></textarea>
                </div>

                <div class="form-group">
                    <label>Workaround</label>
                    <textarea name="workaround[]" placeholder="Describe any workaround for this issue"></textarea>
                </div>

                <div class="form-group">
                    <label>Fix Planned</label>
                    <input type="text" name="fixPlanned[]" placeholder="e.g., Version 3.0.1 (June 2025)">
                </div>

                <button type="button" class="remove-item-btn secondary-btn">
                    <i class="fas fa-trash-alt"></i> Remove Issue
                </button>
            `;

            issuesContainer.appendChild(issueItem);

            // Add event listener to the remove button
            const removeBtn = issueItem.querySelector('.remove-item-btn');
            removeBtn.addEventListener('click', function() {
                issuesContainer.removeChild(issueItem);
            });
        });
    }

    // Preview functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            // Get form data
            const version = document.getElementById('releaseVersion').value || '3.0.0';
            const codename = document.getElementById('releaseCodename').value || 'Phoenix';
            const releaseDate = document.getElementById('releaseDate').value ? new Date(document.getElementById('releaseDate').value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'May 15, 2025';
            const title = document.getElementById('releaseTitle').value || 'Version 3.0 "Phoenix" is Here!';
            const tldr = document.getElementById('releaseTLDR').value || 'A complete UI redesign with dark mode, 50% faster performance, new mobile app integration, enhanced security, and improved reporting tools.';
            const description = quill.root.innerHTML || "We're excited to announce our biggest update yet! Version 3.0 'Phoenix' represents a complete rebirth of our platform with a focus on speed, security, and user experience.";

            // Generate preview HTML
            const previewHTML = `
                <div class="release-note">
                    <!-- Header Section -->
                    <div class="release-header">
                        <div class="release-title">${title}</div>
                        <div class="release-version">v${version} (${codename})</div>
                        <div class="release-date">Released on ${releaseDate}</div>
                    </div>

                    <!-- TL;DR Summary Section -->
                    <div class="tldr-section">
                        <h3>Summary</h3>
                        <p>${tldr}</p>
                    </div>

                    <!-- Main Description -->
                    <div class="release-description">
                        ${description}
                    </div>

                    <!-- Features Section -->
                    <h3><i class="fas fa-star"></i> New Features</h3>
                    <div class="features-container">
                        <!-- Feature items would be dynamically generated here -->
                        <div class="feature-item">
                            <div class="feature-header">
                                <h4 class="feature-title">Sleek New User Interface</h4>
                                <div class="feature-image">
                                    <img src="../Release_Notes_User_Login/images/ui-redesign.svg" alt="UI Redesign" />
                                </div>
                            </div>
                            <p class="feature-description">Completely redesigned interface with intuitive navigation and customizable dashboard.</p>
                            <p class="feature-benefit"><strong>Benefit:</strong> Find what you need faster and personalize your workspace for maximum productivity.</p>
                        </div>
                    </div>

                    <!-- More sections would be added dynamically -->
                </div>
            `;

            // Display preview
            document.getElementById('previewContent').innerHTML = previewHTML;
            previewModal.style.display = 'block';
        });
    }

    // Close preview modal
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    }

    // Export PDF functionality
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            const { jsPDF } = window.jspdf;

            // Get the preview content
            const content = document.getElementById('previewContent');

            // Create a new PDF
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Use html2canvas to convert the HTML to an image
            html2canvas(content).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 295; // A4 height in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Add new pages if the content is longer than one page
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Save the PDF
                pdf.save(`Release_Notes_Preview.pdf`);

                // Show success notification
                showNotification('PDF exported successfully!', 'success');
            });
        });
    }

    // Deployment verification checkbox functionality
    const deploymentVerifiedCheckbox = document.getElementById('deploymentVerified');
    const approveReleaseBtn = document.getElementById('approveReleaseBtn');

    if (deploymentVerifiedCheckbox && approveReleaseBtn) {
        deploymentVerifiedCheckbox.addEventListener('change', function() {
            // Enable or disable the Approve button based on checkbox state
            approveReleaseBtn.disabled = !this.checked;

            if (this.checked) {
                showNotification('Deployment verification confirmed. You can now approve the release.', 'success');
            } else {
                showNotification('Deployment verification required before approval.', 'warning');
            }
        });

        approveReleaseBtn.addEventListener('click', function() {
            if (deploymentVerifiedCheckbox.checked) {
                // In a real app, this would submit the approval to the server
                showNotification('Release approved and ready for publishing!', 'success');

                // Update the status in the UI
                const validationStatus = document.querySelector('.validation-status .status-badge');
                if (validationStatus) {
                    validationStatus.className = 'status-badge published';
                    validationStatus.textContent = 'Approved';
                }

                // Disable the approve button after approval
                this.disabled = true;

                // Add a timestamp to the approval
                const now = new Date();
                const formattedDate = now.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Add approval note
                const validationContent = document.querySelector('.validation-content');
                if (validationContent) {
                    const approvalNote = document.createElement('div');
                    approvalNote.className = 'approval-note';
                    approvalNote.innerHTML = `
                        <div class="note-header">
                            <i class="fas fa-check-circle"></i>
                            <span>Approved for Publishing</span>
                        </div>
                        <div class="note-content">
                            <p>This release has been approved for publishing on ${formattedDate}.</p>
                            <p>Deployment verification completed by the hosting team.</p>
                        </div>
                    `;

                    validationContent.appendChild(approvalNote);
                }
            } else {
                showNotification('Please verify deployment before approving.', 'error');
            }
        });
    }

    // Feature Tours - Create New Tour button
    const createTourBtn = document.getElementById('createTourBtn');
    if (createTourBtn) {
        createTourBtn.addEventListener('click', function() {
            // Show the tour form and hide the table
            const featureToursSection = document.getElementById('feature-tours');
            const releasesTable = document.querySelector('#feature-tours .releases-table-container');
            const manageControls = document.querySelector('#feature-tours .manage-controls');
            const tourForm = document.getElementById('tourForm');

            // Hide the table and controls
            if (releasesTable) releasesTable.style.display = 'none';
            if (manageControls) manageControls.style.display = 'none';

            // Show the form
            if (tourForm) {
                tourForm.style.display = 'block';

                // Add a back button if it doesn't exist
                let backButton = document.querySelector('#feature-tours .back-to-tours-btn');
                if (!backButton) {
                    backButton = document.createElement('button');
                    backButton.className = 'secondary-btn back-to-tours-btn';
                    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Tours';
                    backButton.style.marginBottom = '20px';

                    backButton.addEventListener('click', function() {
                        // Hide the form
                        if (tourForm) tourForm.style.display = 'none';

                        // Show the table and controls again
                        if (releasesTable) releasesTable.style.display = 'block';
                        if (manageControls) manageControls.style.display = 'flex';

                        // Remove the back button
                        this.remove();
                    });

                    // Insert the back button before the form
                    featureToursSection.insertBefore(backButton, tourForm);
                }
            }
        });
    }

    // Feature Tours - Cancel button
    const cancelTourBtn = document.getElementById('cancelTourBtn');
    if (cancelTourBtn) {
        cancelTourBtn.addEventListener('click', function() {
            // Hide the form and show the table
            const tourForm = document.getElementById('tourForm');
            const releasesTable = document.querySelector('#feature-tours .releases-table-container');
            const manageControls = document.querySelector('#feature-tours .manage-controls');

            // Hide the form
            if (tourForm) tourForm.style.display = 'none';

            // Show the table and controls again
            if (releasesTable) releasesTable.style.display = 'block';
            if (manageControls) manageControls.style.display = 'flex';

            // Remove the back button
            const backButton = document.querySelector('#feature-tours .back-to-tours-btn');
            if (backButton) backButton.remove();
        });
    }

    // Feature Tours - Edit buttons
    document.querySelectorAll('#feature-tours .icon-btn .fa-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the tour data from the row
            const row = this.closest('tr');
            const tourName = row.cells[0].textContent;
            const feature = row.cells[1].textContent;
            const product = row.cells[2].textContent;
            const steps = row.cells[3].textContent;
            const status = row.cells[4].querySelector('.status-badge').textContent;

            // Trigger the create tour button to show the form
            const createTourBtn = document.getElementById('createTourBtn');
            if (createTourBtn) {
                createTourBtn.click();

                // After the form is shown, populate it with data
                setTimeout(() => {
                    // Find the form inputs
                    const nameInput = document.getElementById('tourName');
                    const featureInput = document.getElementById('tourFeature');
                    const productSelect = document.getElementById('tourProduct');
                    const statusSelect = document.getElementById('tourStatus');

                    // Populate the form
                    if (nameInput) nameInput.value = tourName;
                    if (featureInput) featureInput.value = feature;

                    // Set the product dropdown
                    if (productSelect) {
                        for (let i = 0; i < productSelect.options.length; i++) {
                            if (productSelect.options[i].text.includes(product)) {
                                productSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }

                    // Set the status dropdown
                    if (statusSelect) {
                        const statusValue = status.toLowerCase();
                        for (let i = 0; i < statusSelect.options.length; i++) {
                            if (statusSelect.options[i].value === statusValue) {
                                statusSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }

                    // Show notification
                    showNotification(`Editing tour: ${tourName}`, 'info');
                }, 100);
            }
        });
    });

    // Downtime Notices - Create Downtime Notice button
    const createDowntimeBtn = document.getElementById('createDowntimeBtn');
    if (createDowntimeBtn) {
        createDowntimeBtn.addEventListener('click', function() {
            // Show the downtime form and hide the table
            const downtimeSection = document.getElementById('downtime');
            const releasesTable = document.querySelector('#downtime .releases-table-container');
            const manageControls = document.querySelector('#downtime .manage-controls');
            const downtimeForm = document.getElementById('downtimeForm');

            // Hide the table and controls
            if (releasesTable) releasesTable.style.display = 'none';
            if (manageControls) manageControls.style.display = 'none';

            // Show the form
            if (downtimeForm) {
                downtimeForm.style.display = 'block';

                // Add a back button if it doesn't exist
                let backButton = document.querySelector('#downtime .back-to-downtime-btn');
                if (!backButton) {
                    backButton = document.createElement('button');
                    backButton.className = 'secondary-btn back-to-downtime-btn';
                    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Downtime Notices';
                    backButton.style.marginBottom = '20px';

                    backButton.addEventListener('click', function() {
                        // Hide the form
                        if (downtimeForm) downtimeForm.style.display = 'none';

                        // Show the table and controls again
                        if (releasesTable) releasesTable.style.display = 'block';
                        if (manageControls) manageControls.style.display = 'flex';

                        // Remove the back button
                        this.remove();
                    });

                    // Insert the back button before the form
                    downtimeSection.insertBefore(backButton, downtimeForm);
                }
            }
        });
    }

    // Downtime Notices - Cancel button
    const cancelDowntimeBtn = document.getElementById('cancelDowntimeBtn');
    if (cancelDowntimeBtn) {
        cancelDowntimeBtn.addEventListener('click', function() {
            // Hide the form and show the table
            const downtimeForm = document.getElementById('downtimeForm');
            const releasesTable = document.querySelector('#downtime .releases-table-container');
            const manageControls = document.querySelector('#downtime .manage-controls');

            // Hide the form
            if (downtimeForm) downtimeForm.style.display = 'none';

            // Show the table and controls again
            if (releasesTable) releasesTable.style.display = 'block';
            if (manageControls) manageControls.style.display = 'flex';

            // Remove the back button
            const backButton = document.querySelector('#downtime .back-to-downtime-btn');
            if (backButton) backButton.remove();
        });
    }

    // Downtime Notices - Edit buttons
    document.querySelectorAll('#downtime .icon-btn .fa-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the downtime data from the row
            const row = this.closest('tr');
            const title = row.cells[0].textContent;
            const system = row.cells[1].textContent;
            const startTime = row.cells[2].textContent;
            const endTime = row.cells[3].textContent;
            const status = row.cells[5].querySelector('.status-badge').textContent;

            // Trigger the create downtime button to show the form
            const createDowntimeBtn = document.getElementById('createDowntimeBtn');
            if (createDowntimeBtn) {
                createDowntimeBtn.click();

                // After the form is shown, populate it with data
                setTimeout(() => {
                    // Find the form inputs
                    const titleInput = document.getElementById('downtimeTitle');
                    const systemSelect = document.getElementById('downtimeSystem');
                    const statusSelect = document.getElementById('downtimeStatus');
                    const startInput = document.getElementById('downtimeStart');
                    const endInput = document.getElementById('downtimeEnd');

                    // Populate the form
                    if (titleInput) titleInput.value = title;

                    // Set the system dropdown
                    if (systemSelect) {
                        for (let i = 0; i < systemSelect.options.length; i++) {
                            if (systemSelect.options[i].text === system) {
                                systemSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }

                    // Set the status dropdown
                    if (statusSelect) {
                        const statusValue = status.toLowerCase();
                        for (let i = 0; i < statusSelect.options.length; i++) {
                            if (statusSelect.options[i].value === statusValue) {
                                statusSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }

                    // Format the datetime for the input fields
                    // This is a simplified version - in a real app, you'd need more robust datetime handling
                    if (startInput && startTime) {
                        const startDate = new Date(startTime);
                        if (!isNaN(startDate.getTime())) {
                            const formattedStart = startDate.toISOString().slice(0, 16);
                            startInput.value = formattedStart;
                        }
                    }

                    if (endInput && endTime) {
                        const endDate = new Date(endTime);
                        if (!isNaN(endDate.getTime())) {
                            const formattedEnd = endDate.toISOString().slice(0, 16);
                            endInput.value = formattedEnd;
                        }
                    }

                    // Show notification
                    showNotification(`Editing downtime notice: ${title}`, 'info');
                }, 100);
            }
        });
    });

    // Release Validation - View/Edit buttons
    document.querySelectorAll('#validation .icon-btn .fa-eye, #validation .icon-btn .fa-check-double, #validation .icon-btn .fa-comments').forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the release data from the row
            const row = this.closest('tr');
            const release = row.cells[0].textContent;
            const product = row.cells[1].textContent;
            const submittedBy = row.cells[2].textContent;
            const submittedOn = row.cells[3].textContent;
            const status = row.cells[5].querySelector('.status-badge').textContent;

            // Show the validation details and hide the table
            const validationSection = document.getElementById('validation');
            const releasesTable = document.querySelector('#validation .releases-table-container');
            const manageControls = document.querySelector('#validation .manage-controls');
            const validationDetails = document.getElementById('validationDetails');

            // Hide the table and controls
            if (releasesTable) releasesTable.style.display = 'none';
            if (manageControls) manageControls.style.display = 'none';

            // Show the validation details
            if (validationDetails) {
                validationDetails.style.display = 'block';

                // Update the validation details with the release data
                const titleElement = document.getElementById('validationReleaseTitle');
                if (titleElement) titleElement.textContent = release;

                // Update the status badge
                const statusBadge = document.querySelector('.validation-status .status-badge');
                if (statusBadge) {
                    statusBadge.textContent = status;
                    statusBadge.className = 'status-badge';

                    // Add the appropriate class based on the status
                    if (status.toLowerCase().includes('review')) {
                        statusBadge.classList.add('scheduled');
                    } else if (status.toLowerCase().includes('approved')) {
                        statusBadge.classList.add('published');
                    } else if (status.toLowerCase().includes('rejected')) {
                        statusBadge.classList.add('draft');
                    }
                }

                // Add event listeners to the back buttons
                const backButtons = document.querySelectorAll('#validation .back-to-list');
                backButtons.forEach(backButton => {
                    // Remove any existing event listeners
                    const newBackButton = backButton.cloneNode(true);
                    backButton.parentNode.replaceChild(newBackButton, backButton);

                    // Add new event listener
                    newBackButton.addEventListener('click', function() {
                        // Hide the validation details
                        validationDetails.style.display = 'none';

                        // Show the table and controls again
                        if (releasesTable) releasesTable.style.display = 'block';
                        if (manageControls) manageControls.style.display = 'flex';

                        showNotification('Returned to validation list', 'info');
                    });
                });

                // Show notification based on which button was clicked
                if (this.classList.contains('fa-eye')) {
                    showNotification(`Viewing release: ${release}`, 'info');
                } else if (this.classList.contains('fa-check-double')) {
                    showNotification(`Validating release: ${release}`, 'info');
                } else if (this.classList.contains('fa-comments')) {
                    showNotification(`Viewing comments for release: ${release}`, 'info');
                }
            }
        });
    });

    // Create Release button in Manage Releases section
    const createReleaseBtn = document.getElementById('createReleaseBtn');
    if (createReleaseBtn) {
        createReleaseBtn.addEventListener('click', function() {
            // Show the create form within the manage section
            const manageSection = document.getElementById('manage');
            const releasesTable = document.querySelector('#manage .releases-table-container');
            const pagination = document.querySelector('#manage .pagination');
            const manageControls = document.querySelector('#manage .manage-controls');

            // Hide the table, pagination, and controls
            if (releasesTable) releasesTable.style.display = 'none';
            if (pagination) pagination.style.display = 'none';
            if (manageControls) manageControls.style.display = 'none';

            // Check if the create form already exists in the manage section
            let createForm = document.querySelector('#manage .create-form');

            if (!createForm) {
                // Clone the create form from the create section
                const originalForm = document.querySelector('#create .create-form');
                if (originalForm) {
                    createForm = originalForm.cloneNode(true);
                    manageSection.appendChild(createForm);
                } else {
                    // Create a new form if original doesn't exist
                    createForm = document.createElement('div');
                    createForm.className = 'create-form';
                    createForm.innerHTML = `
                        <h2>Create New Release</h2>
                        <form id="releaseFormInManage">
                            <!-- Form content would go here -->
                            <div class="form-group">
                                <label for="releaseVersion">Version Number*</label>
                                <input type="text" id="releaseVersionInManage" name="version" placeholder="e.g., 3.0.0" required>
                            </div>

                            <div class="form-group">
                                <label for="releaseTitle">Release Title*</label>
                                <input type="text" id="releaseTitleInManage" name="title" placeholder="e.g., Major Update with New Features" required>
                            </div>

                            <div class="form-actions">
                                <button type="button" id="cancelCreateBtn" class="secondary-btn">Cancel</button>
                                <button type="submit" class="primary-btn">Save Release</button>
                            </div>
                        </form>
                    `;
                    manageSection.appendChild(createForm);
                }
            } else {
                // If it exists, just show it
                createForm.style.display = 'block';
            }

            // Add a back button if it doesn't exist
            let backButton = document.querySelector('#manage .back-to-releases-btn');
            if (!backButton) {
                backButton = document.createElement('button');
                backButton.className = 'secondary-btn back-to-releases-btn';
                backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Releases';
                backButton.style.marginBottom = '20px';

                backButton.addEventListener('click', function() {
                    // Hide the form
                    if (createForm) createForm.style.display = 'none';

                    // Show the table, pagination, and controls again
                    if (releasesTable) releasesTable.style.display = 'block';
                    if (pagination) pagination.style.display = 'flex';
                    if (manageControls) manageControls.style.display = 'flex';

                    // Remove the back button
                    this.remove();
                });

                // Insert the back button before the form
                manageSection.insertBefore(backButton, createForm);
            }

            // Add event listener to the cancel button
            const cancelBtn = document.querySelector('#manage #cancelCreateBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    // Hide the form
                    if (createForm) createForm.style.display = 'none';

                    // Show the table, pagination, and controls again
                    if (releasesTable) releasesTable.style.display = 'block';
                    if (pagination) pagination.style.display = 'flex';
                    if (manageControls) manageControls.style.display = 'flex';

                    // Remove the back button
                    if (backButton) backButton.remove();
                });
            }
        });
    }

    // Action buttons in Manage Releases table
    // Edit buttons
    document.querySelectorAll('.edit-release-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const version = this.getAttribute('data-version');

            // Trigger the create release button to show the form
            const createReleaseBtn = document.getElementById('createReleaseBtn');
            if (createReleaseBtn) {
                createReleaseBtn.click();

                // After the form is shown, populate it with data
                setTimeout(() => {
                    // Find the form in the manage section
                    const versionInput = document.querySelector('#manage .create-form input[name="version"]');
                    const titleInput = document.querySelector('#manage .create-form input[name="title"]');

                    if (versionInput) versionInput.value = version;
                    if (titleInput) titleInput.value = `Version ${version} "Phoenix" is Here!`;

                    // Show notification
                    showNotification(`Editing release ${version}`, 'info');
                }, 100);
            }
        });
    });

    // Preview buttons
    document.querySelectorAll('.preview-release-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const version = this.getAttribute('data-version');

            // Show preview modal with sample data
            const previewHTML = `
                <div class="release-note">
                    <!-- Header Section -->
                    <div class="release-header">
                        <div class="release-title">Version ${version} "Phoenix" is Here!</div>
                        <div class="release-version">v${version} (Phoenix)</div>
                        <div class="release-date">Released on May 15, 2025</div>
                    </div>

                    <!-- TL;DR Summary Section -->
                    <div class="tldr-section">
                        <h3>Summary</h3>
                        <p>A complete UI redesign with dark mode, 50% faster performance, new mobile app integration, enhanced security, and improved reporting tools.</p>
                    </div>

                    <!-- Main Description -->
                    <div class="release-description">
                        <p>We're excited to announce our biggest update yet! Version ${version} 'Phoenix' represents a complete rebirth of our platform with a focus on speed, security, and user experience.</p>
                    </div>

                    <!-- Features Section -->
                    <h3><i class="fas fa-star"></i> New Features</h3>
                    <div class="features-container">
                        <div class="feature-item">
                            <div class="feature-header">
                                <h4 class="feature-title">Sleek New User Interface</h4>
                                <div class="feature-image">
                                    <img src="../Release_Notes_User_Login/images/ui-redesign.svg" alt="UI Redesign" />
                                </div>
                            </div>
                            <p class="feature-description">Completely redesigned interface with intuitive navigation and customizable dashboard.</p>
                            <p class="feature-benefit"><strong>Benefit:</strong> Find what you need faster and personalize your workspace for maximum productivity.</p>
                        </div>
                    </div>
                </div>
            `;

            // Display preview
            document.getElementById('previewContent').innerHTML = previewHTML;
            previewModal.style.display = 'block';

            // Show notification
            showNotification(`Previewing release ${version}`, 'info');
        });
    });

    // Duplicate buttons
    document.querySelectorAll('.duplicate-release-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const version = this.getAttribute('data-version');

            // Navigate to Create New section and populate with data
            headerLinks.forEach(link => {
                if (link.getAttribute('data-section') === 'create') {
                    // Trigger click on the Create New link
                    link.click();

                    // Populate form with data but increment version
                    const newVersion = incrementVersion(version);
                    document.getElementById('releaseVersion').value = newVersion;
                    document.getElementById('releaseTitle').value = `Version ${newVersion} "Phoenix" is Here!`;
                    document.getElementById('releaseTLDR').value = 'A complete UI redesign with dark mode, 50% faster performance, new mobile app integration, enhanced security, and improved reporting tools.';

                    // Show notification
                    showNotification(`Created duplicate of release ${version} as ${newVersion}`, 'success');
                }
            });
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-release-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const version = this.getAttribute('data-version');

            // Ask for confirmation
            if (confirm(`Are you sure you want to delete release ${version}? This action cannot be undone.`)) {
                // In a real app, this would send a delete request to the server
                // For demo purposes, we'll just remove the row from the table
                const row = this.closest('tr');
                row.parentElement.removeChild(row);

                // Show notification
                showNotification(`Release ${version} deleted successfully`, 'success');
            }
        });
    });

    // Helper function to increment version number
    function incrementVersion(version) {
        const parts = version.split('.');
        if (parts.length === 3) {
            // Increment minor version
            parts[1] = parseInt(parts[1]) + 1;
            parts[2] = 0; // Reset patch version
            return parts.join('.');
        }
        return version;
    }

    // Form submission
    if (releaseForm) {
        releaseForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // In a real app, this would send the data to a server
            // For demo purposes, we'll just show a success message
            showNotification('Release note saved successfully!', 'success');

            // Reset form or redirect as needed
            // releaseForm.reset();
        });
    }

    // Add event listeners to existing remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.feature-item, .improvement-item, .bugfix-item, .issue-item');
            item.parentElement.removeChild(item);
        });
    });

    // Settings tabs functionality
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-tab-content');

    if (settingsTabs.length > 0) {
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');

                // Update active tab
                settingsTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding content
                settingsContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // Table search functionality
    const tableSearch = document.getElementById('tableSearch');
    if (tableSearch) {
        tableSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const table = document.querySelector('.releases-table');
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Media search functionality
    const searchMedia = document.getElementById('searchMedia');
    if (searchMedia) {
        searchMedia.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const mediaItems = document.querySelectorAll('.media-item:not(.upload-item)');

            mediaItems.forEach(item => {
                const mediaInfo = item.querySelector('.media-info');
                const text = mediaInfo.textContent.toLowerCase();

                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Add color change functionality
    const primaryColorInput = document.getElementById('primaryColor');
    const accentColorInput = document.getElementById('accentColor');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const textColorInput = document.getElementById('textColor');

    // Function to update CSS variables
    function updateColorVariable(variable, value) {
        document.documentElement.style.setProperty(variable, value);
        // Save to localStorage
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        let savedColors = JSON.parse(localStorage.getItem(`${theme}Colors`) || '{}');
        savedColors[variable] = value;
        localStorage.setItem(`${theme}Colors`, JSON.stringify(savedColors));
    }

    // Add event listeners to color inputs
    if (primaryColorInput) {
        primaryColorInput.addEventListener('input', function() {
            const value = this.value;
            updateColorVariable('--primary-color', value);
            this.nextElementSibling.value = value;
        });

        primaryColorInput.nextElementSibling.addEventListener('input', function() {
            const value = this.value;
            primaryColorInput.value = value;
            updateColorVariable('--primary-color', value);
        });
    }

    if (accentColorInput) {
        accentColorInput.addEventListener('input', function() {
            const value = this.value;
            updateColorVariable('--accent-color', value);
            this.nextElementSibling.value = value;
        });

        accentColorInput.nextElementSibling.addEventListener('input', function() {
            const value = this.value;
            accentColorInput.value = value;
            updateColorVariable('--accent-color', value);
        });
    }

    if (backgroundColorInput) {
        backgroundColorInput.addEventListener('input', function() {
            const value = this.value;
            updateColorVariable('--background', value);
            this.nextElementSibling.value = value;
        });

        backgroundColorInput.nextElementSibling.addEventListener('input', function() {
            const value = this.value;
            backgroundColorInput.value = value;
            updateColorVariable('--background', value);
        });
    }

    if (textColorInput) {
        textColorInput.addEventListener('input', function() {
            const value = this.value;
            updateColorVariable('--text-color', value);
            this.nextElementSibling.value = value;
        });

        textColorInput.nextElementSibling.addEventListener('input', function() {
            const value = this.value;
            textColorInput.value = value;
            updateColorVariable('--text-color', value);
        });
    }

    // Load saved colors on page load
    function loadSavedColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const savedColors = JSON.parse(localStorage.getItem(`${theme}Colors`) || '{}');

        for (const [variable, value] of Object.entries(savedColors)) {
            document.documentElement.style.setProperty(variable, value);

            // Update input fields if they exist
            if (variable === '--primary-color' && primaryColorInput) {
                primaryColorInput.value = value;
                primaryColorInput.nextElementSibling.value = value;
            } else if (variable === '--accent-color' && accentColorInput) {
                accentColorInput.value = value;
                accentColorInput.nextElementSibling.value = value;
            } else if (variable === '--background' && backgroundColorInput) {
                backgroundColorInput.value = value;
                backgroundColorInput.nextElementSibling.value = value;
            } else if (variable === '--text-color' && textColorInput) {
                textColorInput.value = value;
                textColorInput.nextElementSibling.value = value;
            }
        }
    }

    // Reset colors to default
    const resetColorsBtn = document.getElementById('resetColorsBtn');
    if (resetColorsBtn) {
        resetColorsBtn.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';

            // Default colors for light theme
            let defaultColors = {
                '--primary-color': '#000000',
                '--accent-color': '#ffffff',
                '--background': '#f5f5f5',
                '--text-color': '#000000'
            };

            // Default colors for dark theme
            if (theme === 'dark') {
                defaultColors = {
                    '--primary-color': '#ffffff',
                    '--accent-color': '#000000',
                    '--background': '#121212',
                    '--text-color': '#ffffff'
                };
            }

            // Apply default colors
            for (const [variable, value] of Object.entries(defaultColors)) {
                document.documentElement.style.setProperty(variable, value);

                // Update input fields
                if (variable === '--primary-color' && primaryColorInput) {
                    primaryColorInput.value = value;
                    primaryColorInput.nextElementSibling.value = value;
                } else if (variable === '--accent-color' && accentColorInput) {
                    accentColorInput.value = value;
                    accentColorInput.nextElementSibling.value = value;
                } else if (variable === '--background' && backgroundColorInput) {
                    backgroundColorInput.value = value;
                    backgroundColorInput.nextElementSibling.value = value;
                } else if (variable === '--text-color' && textColorInput) {
                    textColorInput.value = value;
                    textColorInput.nextElementSibling.value = value;
                }
            }

            // Clear saved colors
            localStorage.removeItem(`${theme}Colors`);

            // Show notification
            showNotification('Colors reset to default', 'success');
        });
    }

    // Save colors button
    const saveColorsBtn = document.getElementById('saveColorsBtn');
    if (saveColorsBtn) {
        saveColorsBtn.addEventListener('click', function() {
            // Colors are already saved in real-time, just show a notification
            showNotification('Color settings saved', 'success');
        });
    }

    // Call on page load
    loadSavedColors();

    // Distribution settings functionality
    const distributionTabs = document.querySelectorAll('.distribution-tab');
    if (distributionTabs.length > 0) {
        distributionTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                distributionTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');

                // Hide all tab content
                document.querySelectorAll('.distribution-tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Show the corresponding tab content
                const tabId = this.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Release scope selection
    const releaseScopeRadios = document.querySelectorAll('input[name="releaseScope"]');
    if (releaseScopeRadios.length > 0) {
        releaseScopeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Hide all scope-specific selectors
                document.querySelector('.product-selector').style.display = 'none';
                document.querySelector('.group-selector').style.display = 'none';

                // Show the relevant selector based on selection
                if (this.value === 'product') {
                    document.querySelector('.product-selector').style.display = 'block';
                } else if (this.value === 'group') {
                    document.querySelector('.group-selector').style.display = 'block';
                }

                // Update summary
                updateDistributionSummary();
            });
        });
    }

    // Company selection
    const companySelectionRadios = document.querySelectorAll('input[name="companySelection"]');
    if (companySelectionRadios.length > 0) {
        companySelectionRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Toggle companies selector visibility
                document.querySelector('.companies-selector').style.display =
                    this.value === 'specific' ? 'block' : 'none';

                // Update summary
                updateDistributionSummary();
            });
        });
    }

    // Branch selection
    const branchSelectionRadios = document.querySelectorAll('input[name="branchSelection"]');
    if (branchSelectionRadios.length > 0) {
        branchSelectionRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Toggle branches selector visibility
                document.querySelector('.branches-selector').style.display =
                    (this.value === 'ho-selected' || this.value === 'selected') ? 'block' : 'none';

                // Update summary
                updateDistributionSummary();
            });
        });
    }

    // User selection
    const userSelectionRadios = document.querySelectorAll('input[name="userSelection"]');
    if (userSelectionRadios.length > 0) {
        userSelectionRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Toggle users selector visibility
                document.querySelector('.users-selector').style.display =
                    this.value === 'specific' ? 'block' : 'none';

                // Update summary
                updateDistributionSummary();
            });
        });
    }

    // Search functionality for selectors
    const searchInputs = document.querySelectorAll('.search-select-container .search-box input');
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keyup', function() {
                const searchTerm = this.value.toLowerCase();
                const container = this.closest('.search-select-container');
                const items = container.querySelectorAll('.select-item');

                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Update distribution summary
    function updateDistributionSummary() {
        // Scope summary
        const scopeValue = document.querySelector('input[name="releaseScope"]:checked').value;
        let scopeSummary = 'All Companies';

        if (scopeValue === 'product') {
            const productSelect = document.getElementById('productSelector');
            scopeSummary = productSelect.value ?
                `Product: ${productSelect.options[productSelect.selectedIndex].text}` :
                'Product-specific';
        } else if (scopeValue === 'group') {
            const groupSelect = document.getElementById('groupSelector');
            scopeSummary = groupSelect.value ?
                `Group: ${groupSelect.options[groupSelect.selectedIndex].text}` :
                'Company Group';
        } else if (scopeValue === 'company') {
            scopeSummary = 'Company-specific';
        }

        // Companies summary
        const companyValue = document.querySelector('input[name="companySelection"]:checked').value;
        let companiesSummary = 'All Companies';

        if (companyValue === 'specific') {
            const selectedCompanies = document.querySelectorAll('input[name="company"]:checked');
            if (selectedCompanies.length > 0) {
                companiesSummary = `${selectedCompanies.length} selected`;
            } else {
                companiesSummary = 'No companies selected';
            }
        }

        // Branches summary
        const branchValue = document.querySelector('input[name="branchSelection"]:checked').value;
        let branchesSummary = 'All Branches';

        if (branchValue === 'ho') {
            branchesSummary = 'Head Office Only';
        } else if (branchValue === 'ho-all') {
            branchesSummary = 'HO and All Branches';
        } else if (branchValue === 'ho-selected') {
            const selectedBranches = document.querySelectorAll('input[name="branch"]:checked');
            branchesSummary = `HO and ${selectedBranches.length} branches`;
        } else if (branchValue === 'selected') {
            const selectedBranches = document.querySelectorAll('input[name="branch"]:checked');
            branchesSummary = `${selectedBranches.length} selected branches`;
        }

        // Users summary
        const userValue = document.querySelector('input[name="userSelection"]:checked').value;
        let usersSummary = 'All Users';

        if (userValue === 'premium') {
            usersSummary = 'Premium Users Only';
        } else if (userValue === 'beta') {
            usersSummary = 'Beta Testers Only';
        } else if (userValue === 'specific') {
            const selectedUsers = document.querySelectorAll('input[name="user"]:checked');
            usersSummary = `${selectedUsers.length} selected users`;
        }

        // Update summary elements
        document.getElementById('scopeSummary').textContent = scopeSummary;
        document.getElementById('companiesSummary').textContent = companiesSummary;
        document.getElementById('branchesSummary').textContent = branchesSummary;
        document.getElementById('usersSummary').textContent = usersSummary;
    }

    // Initialize distribution summary
    if (document.querySelector('.distribution-section')) {
        updateDistributionSummary();

        // Add change event listeners to selectors
        document.getElementById('productSelector').addEventListener('change', updateDistributionSummary);
        document.getElementById('groupSelector').addEventListener('change', updateDistributionSummary);

        // Add change event listeners to checkboxes
        document.querySelectorAll('input[name="company"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateDistributionSummary);
        });

        document.querySelectorAll('input[name="branch"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateDistributionSummary);
        });

        document.querySelectorAll('input[name="user"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateDistributionSummary);
        });
    }

    // Language tabs functionality in Create New Release
    const languageTabs = document.querySelectorAll('.language-tab:not(.add-language)');
    if (languageTabs.length > 0) {
        languageTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Don't allow deactivating English tab
                if (this.getAttribute('data-lang') === 'en' && this.classList.contains('active')) {
                    return;
                }

                // Toggle active state for non-English tabs
                if (this.getAttribute('data-lang') !== 'en') {
                    this.classList.toggle('active');
                } else {
                    // For English tab, always keep it active
                    languageTabs.forEach(t => {
                        if (t.getAttribute('data-lang') === 'en') {
                            t.classList.add('active');
                        }
                    });
                }

                // Show notification about language change
                const lang = this.getAttribute('data-lang');
                const langName = this.textContent;

                if (this.classList.contains('active')) {
                    showNotification(`Now editing content in ${langName}`, 'info');
                } else {
                    showNotification(`Stopped editing content in ${langName}`, 'info');
                }
            });
        });

        // Add language button functionality
        const addLanguageBtn = document.querySelector('.language-tab.add-language');
        if (addLanguageBtn) {
            addLanguageBtn.addEventListener('click', function() {
                // In a real app, this would open a modal to select additional languages
                showNotification('Add more languages from Settings > Language', 'info');
            });
        }
    }
});
