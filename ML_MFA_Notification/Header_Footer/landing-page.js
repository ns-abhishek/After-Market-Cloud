document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const typeReportRadio = document.getElementById('typeReport');
    const typePageRadio = document.getElementById('typePage');
    const reportOptions = document.getElementById('reportOptions');
    const pageOptions = document.getElementById('pageOptions');
    const submitBtn = document.getElementById('submitBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closeBtn = document.querySelector('.modal .close');

    // Validation message container
    const validationContainer = document.createElement('div');
    validationContainer.className = 'validation-message';
    validationContainer.style.display = 'none';
    document.querySelector('.buttons-container').appendChild(validationContainer);

    // Preview elements
    const firstPagePreview = document.querySelector('.preview-page.first-page');
    const lastPagePreview = document.querySelector('.preview-page.last-page');
    const previewReportHeader = document.querySelector('.preview-report-header');
    const previewPageHeader = document.querySelector('.preview-page-header');
    const previewReportFooter = document.querySelector('.preview-report-footer');
    const previewPageFooter = document.querySelectorAll('.preview-page-footer');

    // First and Last page selects
    const firstPageSelect = document.getElementById('firstPageSelect');
    const lastPageSelect = document.getElementById('lastPageSelect');

    // Page options checkboxes
    const headerCheckbox = document.getElementById('headerCheckbox');
    const footerCheckbox = document.getElementById('footerCheckbox');

    // Select All checkboxes
    const selectAllRegions = document.getElementById('selectAllRegions');
    const selectAllCompanies = document.getElementById('selectAllCompanies');
    const selectAllBranches = document.getElementById('selectAllBranches');
    const selectAllSubBranches = document.getElementById('selectAllSubBranches');
    const selectAllLanguages = document.getElementById('selectAllLanguages');

    // Toggle between report and page options
    typeReportRadio.addEventListener('change', function() {
        if (this.checked) {
            reportOptions.style.display = 'block';
            pageOptions.style.display = 'none';
            updatePreview();
        }
    });

    typePageRadio.addEventListener('change', function() {
        if (this.checked) {
            reportOptions.style.display = 'none';
            pageOptions.style.display = 'block';
            updatePreview();
        }
    });

    // Validation function
    function validateSelections() {
        let isValid = true;
        let errorMessage = '';

        // Check if at least one region is selected
        const regionSelected = document.querySelectorAll('.region-checkbox:checked').length > 0;
        if (!regionSelected) {
            isValid = false;
            errorMessage += 'Please select at least one Region. ';
        }

        // Check if at least one company is selected
        const companySelected = document.querySelectorAll('.company-checkbox:checked').length > 0;
        if (!companySelected) {
            isValid = false;
            errorMessage += 'Please select at least one Company. ';
        }

        // Check if at least one branch is selected
        const branchSelected = document.querySelectorAll('.branch-checkbox:checked').length > 0;
        if (!branchSelected) {
            isValid = false;
            errorMessage += 'Please select at least one Branch. ';
        }

        // Check if at least one sub-branch is selected
        const subBranchSelected = document.querySelectorAll('.subbranch-checkbox:checked').length > 0;
        if (!subBranchSelected) {
            isValid = false;
            errorMessage += 'Please select at least one Sub-Branch. ';
        }

        // Check if at least one language is selected
        const languageSelected = document.querySelectorAll('.language-checkbox:checked').length > 0;
        if (!languageSelected) {
            isValid = false;
            errorMessage += 'Please select at least one Language. ';
        }

        // For Page document type, check if header or footer is selected
        if (typePageRadio.checked) {
            const headerSelected = document.getElementById('headerCheckbox').checked;
            const footerSelected = document.getElementById('footerCheckbox').checked;
            if (!headerSelected && !footerSelected) {
                isValid = false;
                errorMessage += 'For Page document type, please select Header or Footer or both. ';
            }
        }

        // Display validation message if not valid
        if (!isValid) {
            validationContainer.textContent = errorMessage;
            validationContainer.style.display = 'block';
        } else {
            validationContainer.style.display = 'none';
        }

        return isValid;
    }

    // Preview button functionality
    previewBtn.addEventListener('click', function() {
        if (validateSelections()) {
            previewModal.style.display = 'block';
            updatePreview();
        }
    });

    // Close button functionality
    closeBtn.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });

    // Update preview based on selected options
    function updatePreview() {
        const isReportType = typeReportRadio.checked;
        const firstPage = document.querySelector('.preview-page.first-page .a4-preview');
        const lastPage = document.querySelector('.preview-page.last-page .a4-preview');

        // Hide all layouts first
        firstPage.querySelectorAll('div[class$="-layout"]').forEach(layout => {
            layout.style.display = 'none';
        });

        if (lastPage) {
            lastPage.querySelectorAll('div[class$="-layout"]').forEach(layout => {
                layout.style.display = 'none';
            });
        }

        if (isReportType) {
            // Show/hide last page based on report type
            lastPagePreview.style.display = 'flex';

            // Update first page based on selection
            const firstPageValue = firstPageSelect.value;
            if (firstPageValue === 'report-header') {
                // Show full page report header
                firstPage.querySelector('.report-header-layout').style.display = 'block';
                // Make sure the report header takes the full page
                const reportHeader = firstPage.querySelector('.report-header-layout .preview-report-header');
                if (reportHeader) {
                    reportHeader.style.height = '100%';
                    reportHeader.style.display = 'flex';
                }
            } else if (firstPageValue === 'page-header') {
                // Show full page page header
                firstPage.querySelector('.page-header-layout').style.display = 'block';
                // Make sure the page header takes the full page
                const pageHeader = firstPage.querySelector('.page-header-layout .preview-page-header');
                if (pageHeader) {
                    pageHeader.style.height = '100%';
                    pageHeader.style.display = 'flex';
                }
            } else if (firstPageValue === 'report-page-header') {
                firstPage.querySelector('.split-header-layout').style.display = 'flex';
            } else if (firstPageValue === 'none') {
                firstPage.querySelector('.standard-layout').style.display = 'flex';
                firstPage.querySelector('.standard-layout .preview-page-header').style.display = 'none';
                firstPage.querySelector('.standard-layout .preview-page-footer').style.display = 'none';
            }

            // Update last page based on selection
            const lastPageValue = lastPageSelect.value;
            if (lastPageValue === 'report-footer') {
                // Show full page report footer
                lastPage.querySelector('.report-footer-layout').style.display = 'flex';
                // Make sure the report footer takes the full page
                const reportFooter = lastPage.querySelector('.report-footer-layout .preview-report-footer');
                if (reportFooter) {
                    reportFooter.style.height = '100%';
                    reportFooter.style.display = 'flex';
                }
            } else if (lastPageValue === 'page-footer') {
                // Show full page page footer
                lastPage.querySelector('.page-footer-layout').style.display = 'flex';
                // Make sure the page footer takes the full page
                const pageFooter = lastPage.querySelector('.page-footer-layout .preview-page-footer');
                if (pageFooter) {
                    pageFooter.style.height = '100%';
                    pageFooter.style.display = 'flex';
                }
            } else if (lastPageValue === 'report-page-footer') {
                lastPage.querySelector('.split-footer-layout').style.display = 'flex';
            } else if (lastPageValue === 'none') {
                lastPage.querySelector('.standard-layout').style.display = 'flex';
            }
        } else {
            // Page type - only show first page
            lastPagePreview.style.display = 'none';

            // Always show standard layout for page type
            firstPage.querySelector('.standard-layout').style.display = 'flex';

            // Update based on header/footer checkboxes
            const pageHeader = firstPage.querySelector('.standard-layout .preview-page-header');
            const pageFooter = firstPage.querySelector('.standard-layout .preview-page-footer');

            if (headerCheckbox.checked) {
                pageHeader.style.display = 'block';
            } else {
                pageHeader.style.display = 'none';
            }

            if (footerCheckbox.checked) {
                pageFooter.style.display = 'block';
            } else {
                pageFooter.style.display = 'none';
            }
        }
    }

    // Add event listeners for preview updates
    firstPageSelect.addEventListener('change', updatePreview);
    lastPageSelect.addEventListener('change', updatePreview);
    headerCheckbox.addEventListener('change', updatePreview);
    footerCheckbox.addEventListener('change', updatePreview);

    // Handle "Select All" functionality
    function setupSelectAll(selectAllCheckbox, checkboxClass) {
        if (!selectAllCheckbox) return;

        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            const checkboxes = document.querySelectorAll('.' + checkboxClass);

            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                if (isChecked) {
                    checkbox.parentElement.classList.add('is-checked');
                } else {
                    checkbox.parentElement.classList.remove('is-checked');
                }
            });
        });

        // Update "Select All" when individual checkboxes change
        document.querySelectorAll('.' + checkboxClass).forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectAllState(selectAllCheckbox, checkboxClass);
            });
        });
    }

    // Update the state of a "Select All" checkbox based on individual checkboxes
    function updateSelectAllState(selectAllCheckbox, checkboxClass) {
        const checkboxes = document.querySelectorAll('.' + checkboxClass);
        const checkedCount = document.querySelectorAll('.' + checkboxClass + ':checked').length;

        if (checkedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.parentElement.classList.remove('is-checked');
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === checkboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.parentElement.classList.add('is-checked');
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.indeterminate = true;
            selectAllCheckbox.checked = false;
            selectAllCheckbox.parentElement.classList.remove('is-checked');
        }
    }

    // Set up "Select All" for each section
    setupSelectAll(selectAllRegions, 'region-checkbox');
    setupSelectAll(selectAllCompanies, 'company-checkbox');
    setupSelectAll(selectAllBranches, 'branch-checkbox');
    setupSelectAll(selectAllSubBranches, 'subbranch-checkbox');
    setupSelectAll(selectAllLanguages, 'language-checkbox');

    // Set default selections
    function setDefaultSelections() {
        // Select all regions by default
        selectAllRegions.checked = true;
        selectAllRegions.parentElement.classList.add('is-checked');
        document.querySelectorAll('.region-checkbox').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('is-checked');
        });

        // Select all companies by default
        selectAllCompanies.checked = true;
        selectAllCompanies.parentElement.classList.add('is-checked');
        document.querySelectorAll('.company-checkbox').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('is-checked');
        });

        // Select one branch by default (Headquarters)
        document.getElementById('branch1').checked = true;
        document.getElementById('branch1').parentElement.classList.add('is-checked');
        updateSelectAllState(selectAllBranches, 'branch-checkbox');

        // Select one sub-branch by default (Team Alpha)
        document.getElementById('subbranch1').checked = true;
        document.getElementById('subbranch1').parentElement.classList.add('is-checked');
        updateSelectAllState(selectAllSubBranches, 'subbranch-checkbox');

        // English is already selected by default in the HTML
        updateSelectAllState(selectAllLanguages, 'language-checkbox');
    }

    // Call the function to set default selections
    setDefaultSelections();

    // Clear filters button
    clearFiltersBtn.addEventListener('click', function() {
        // Clear all checkboxes first
        document.querySelectorAll('.mdl-checkbox__input').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove('is-checked');

            // Reset indeterminate state for "Select All" checkboxes
            if (checkbox.classList.contains('select-all')) {
                checkbox.indeterminate = false;
            }
        });

        // Set Report type as default
        document.getElementById('typeReport').checked = true;
        document.getElementById('typeReport').parentElement.classList.add('is-checked');
        document.getElementById('typePage').checked = false;
        document.getElementById('typePage').parentElement.classList.remove('is-checked');

        // Reset dropdowns
        document.getElementById('firstPageSelect').selectedIndex = 0;
        document.getElementById('lastPageSelect').selectedIndex = 0;

        // Reset page options
        document.getElementById('headerCheckbox').checked = false;
        document.getElementById('headerCheckbox').parentElement.classList.remove('is-checked');
        document.getElementById('footerCheckbox').checked = false;
        document.getElementById('footerCheckbox').parentElement.classList.remove('is-checked');

        // Show report options, hide page options
        reportOptions.style.display = 'block';
        pageOptions.style.display = 'none';

        // Hide preview modal
        previewModal.style.display = 'none';

        // Clear search boxes
        document.querySelectorAll('.search-box input').forEach(input => {
            input.value = '';
        });

        // Reset to default selections (all regions, all companies, one branch, one sub-branch, English)
        setDefaultSelections();

        // Hide any validation messages
        validationContainer.style.display = 'none';
    });

    // Filter functionality for search boxes
    document.querySelectorAll('.search-box input').forEach(searchInput => {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filterSection = this.closest('.filter-section');
            const checkboxes = filterSection.querySelectorAll('.mdl-checkbox');

            checkboxes.forEach(checkbox => {
                const label = checkbox.querySelector('.mdl-checkbox__label').textContent.toLowerCase();
                if (label.includes(searchTerm)) {
                    checkbox.style.display = 'block';
                } else {
                    checkbox.style.display = 'none';
                }
            });
        });
    });

    // Submit button functionality
    submitBtn.addEventListener('click', function() {
        // Validate selections before proceeding
        if (!validateSelections()) {
            return; // Stop if validation fails
        }

        // Collect selected options
        const selectedOptions = {
            regions: [],
            companies: [],
            branches: [],
            subBranches: [],
            languages: [],
            documentType: document.querySelector('input[name="docType"]:checked').value
        };

        // Collect selected regions
        document.querySelectorAll('.region-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                selectedOptions.regions.push(checkbox.parentElement.querySelector('.mdl-checkbox__label').textContent);
            }
        });

        // Collect selected companies
        document.querySelectorAll('.company-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                selectedOptions.companies.push(checkbox.parentElement.querySelector('.mdl-checkbox__label').textContent);
            }
        });

        // Collect selected branches
        document.querySelectorAll('.branch-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                selectedOptions.branches.push(checkbox.parentElement.querySelector('.mdl-checkbox__label').textContent);
            }
        });

        // Collect selected sub-branches
        document.querySelectorAll('.subbranch-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                selectedOptions.subBranches.push(checkbox.parentElement.querySelector('.mdl-checkbox__label').textContent);
            }
        });

        // Collect selected languages
        document.querySelectorAll('.language-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                selectedOptions.languages.push(checkbox.parentElement.querySelector('.mdl-checkbox__label').textContent);
            }
        });

        // Collect document type specific options
        if (selectedOptions.documentType === 'report') {
            selectedOptions.firstPage = document.getElementById('firstPageSelect').value;
            selectedOptions.lastPage = document.getElementById('lastPageSelect').value;
        } else {
            selectedOptions.header = document.getElementById('headerCheckbox').checked;
            selectedOptions.footer = document.getElementById('footerCheckbox').checked;
        }

        // Construct URL with parameters
        let url = 'word-editor.html?';
        const params = [];

        if (selectedOptions.regions.length > 0) {
            params.push('regions=' + encodeURIComponent(selectedOptions.regions.join(',')));
        }

        if (selectedOptions.companies.length > 0) {
            params.push('companies=' + encodeURIComponent(selectedOptions.companies.join(',')));
        }

        if (selectedOptions.branches.length > 0) {
            params.push('branches=' + encodeURIComponent(selectedOptions.branches.join(',')));
        }

        if (selectedOptions.subBranches.length > 0) {
            params.push('subBranches=' + encodeURIComponent(selectedOptions.subBranches.join(',')));
        }

        if (selectedOptions.languages.length > 0) {
            params.push('languages=' + encodeURIComponent(selectedOptions.languages.join(',')));
        } else {
            // Default to English if no language selected
            params.push('languages=English');
        }

        params.push('docType=' + encodeURIComponent(selectedOptions.documentType));

        if (selectedOptions.documentType === 'report') {
            params.push('firstPage=' + encodeURIComponent(selectedOptions.firstPage));
            params.push('lastPage=' + encodeURIComponent(selectedOptions.lastPage));
        } else {
            params.push('header=' + encodeURIComponent(selectedOptions.header));
            params.push('footer=' + encodeURIComponent(selectedOptions.footer));
        }

        url += params.join('&');

        // Redirect to word editor with parameters
        window.location.href = url;
    });
});
