document.addEventListener('DOMContentLoaded', function() {
    // Parse URL parameters
    function getUrlParameters() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');

        for (let i = 0; i < pairs.length; i++) {
            if (!pairs[i]) continue;

            const pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }

        return params;
    }

    // Apply settings based on URL parameters
    function applyUrlParameters() {
        const params = getUrlParameters();

        // Check if we have parameters
        if (Object.keys(params).length === 0) return;

        console.log('Applying parameters:', params);

        // Create a header with selected options
        createSelectionSummary(params);

        // Get references to navigation buttons
        const navFirstPageBtn = document.getElementById('navFirstPageBtn');
        const navLastPageBtn = document.getElementById('navLastPageBtn');

        // Apply document type settings
        if (params.docType === 'report') {
            // Check different combinations of first page and last page settings
            if (params.firstPage === 'none' && params.lastPage === 'none') {
                // Case 1: Both first page and last page are 'none'
                // Hide both navigation buttons when there's effectively a single page
                if (navFirstPageBtn) navFirstPageBtn.style.display = 'none';
                if (navLastPageBtn) navLastPageBtn.style.display = 'none';

                // Also hide the action buttons
                if (showLastPageBtn) showLastPageBtn.style.display = 'none';
                if (toggleLastPageBtn) toggleLastPageBtn.style.display = 'none';

                // Hide last page container completely
                if (lastPageContainer) lastPageContainer.style.display = 'none';
            } else if (params.firstPage === 'none' && params.lastPage !== 'none') {
                // Case 2: First page is 'none' but last page is not 'none'
                // This is a special case - we should show only the last page content
                // and hide navigation buttons since there's effectively only one page

                // Hide navigation buttons
                if (navFirstPageBtn) navFirstPageBtn.style.display = 'none';
                if (navLastPageBtn) navLastPageBtn.style.display = 'none';

                // Hide action buttons
                if (showLastPageBtn) showLastPageBtn.style.display = 'none';
                if (toggleLastPageBtn) toggleLastPageBtn.style.display = 'none';

                // Hide first page and show last page immediately
                document.querySelector('.document-page').style.display = 'none';
                if (lastPageContainer) {
                    lastPageContainer.style.display = 'flex';

                    // Apply the last page layout immediately
                    if (lastPageLayoutSelector) {
                        changeLastPageLayout(params.lastPage);
                    }
                }
            } else if (params.lastPage === 'none') {
                // Case 3: Only last page is 'none', first page is not 'none'
                // Hide both navigation buttons since there's only one page to navigate
                if (navFirstPageBtn) navFirstPageBtn.style.display = 'none';
                if (navLastPageBtn) navLastPageBtn.style.display = 'none';
                if (showLastPageBtn) showLastPageBtn.style.display = 'none';

                // Hide last page container completely
                if (lastPageContainer) lastPageContainer.style.display = 'none';
            } else {
                // Case 4: Both first page and last page are not 'none'
                // Show the last page navigation button for report type with last page
                if (showLastPageBtn) showLastPageBtn.style.display = 'inline-block';
            }

            // Handle first page layout
            if (params.firstPage) {
                // Set the layout value
                if (layoutSelector) {
                    layoutSelector.value = params.firstPage;
                }

                // Apply the layout
                changeLayout(params.firstPage);

                // Show appropriate sections based on first page selection
                if (params.firstPage === 'report-header') {
                    // Show only report header
                    reportHeaderSection.style.display = 'block';
                    reportHeaderSection.classList.add('active');
                    currentEditor = reportHeaderEditor;
                    // Set focus to the report header editor
                    setTimeout(() => reportHeaderEditor.focus(), 100);
                } else if (params.firstPage === 'page-header') {
                    // Show only page header
                    pageHeaderSection.style.display = 'block';
                    pageHeaderSection.classList.add('active');
                    currentEditor = pageHeaderEditor;
                    // Set focus to the page header editor
                    setTimeout(() => pageHeaderEditor.focus(), 100);
                } else if (params.firstPage === 'report-page-header') {
                    // Show both report and page headers
                    reportHeaderSection.style.display = 'block';
                    reportHeaderSection.classList.add('active');
                    pageHeaderSection.style.display = 'block';
                    pageHeaderSection.classList.add('active');
                    currentEditor = reportHeaderEditor;
                    // Set focus to the report header editor
                    setTimeout(() => reportHeaderEditor.focus(), 100);
                } else if (params.firstPage === 'none') {
                    // Show no headers or footers
                    currentEditor = mainEditor;
                    // Set focus to the main editor
                    setTimeout(() => mainEditor.focus(), 100);
                }
            }

            // Handle last page settings if present
            if (params.lastPage && params.lastPage !== 'none') {
                // Set the last page layout value
                if (lastPageLayoutSelector) {
                    lastPageLayoutSelector.value = params.lastPage;
                }

                // Prepare last page container but don't show it yet
                // (user will click the "Go to Last Page" button to see it)

                // Configure last page based on selection
                if (params.lastPage === 'report-footer') {
                    // Configure report footer
                    reportFooterSection.style.display = 'block';
                } else if (params.lastPage === 'page-footer') {
                    // Configure page footer
                    pageFooterSection.style.display = 'block';
                } else if (params.lastPage === 'report-page-footer') {
                    // Configure both footers
                    reportFooterSection.style.display = 'block';
                    pageFooterSection.style.display = 'block';
                } else if (params.lastPage === 'footer-only') {
                    // Configure footer only
                    // This will be handled by the last page layout system
                }
            } else {
                // Hide the last page button if no last page is selected
                if (showLastPageBtn) {
                    showLastPageBtn.style.display = 'none';
                }
            }
        } else if (params.docType === 'page') {
            // Handle page type - simpler with just header/footer options

            // Hide the last page navigation button for page type
            if (showLastPageBtn) {
                showLastPageBtn.style.display = 'none';
            }

            // For page document type, always hide the navigation buttons since it's a single page
            if (navFirstPageBtn) navFirstPageBtn.style.display = 'none';
            if (navLastPageBtn) navLastPageBtn.style.display = 'none';

            // Hide all sections first
            headerSection.style.display = 'none';
            headerSection.classList.remove('active');
            footerSection.style.display = 'none';
            footerSection.classList.remove('active');

            // Show header if selected
            if (params.header === 'true') {
                headerSection.style.display = 'block';
                headerSection.classList.add('active');
                currentEditor = headerEditor;
                // Set focus to the header editor
                setTimeout(() => headerEditor.focus(), 100);
            }

            // Show footer if selected
            if (params.footer === 'true') {
                footerSection.style.display = 'block';
                footerSection.classList.add('active');

                // If header is not selected, set footer as current editor
                if (params.header !== 'true') {
                    currentEditor = footerEditor;
                    // Set focus to the footer editor
                    setTimeout(() => footerEditor.focus(), 100);
                }
            }

            // If neither header nor footer is selected, default to main editor
            if (params.header !== 'true' && params.footer !== 'true') {
                currentEditor = mainEditor;
                // Set focus to the main editor
                setTimeout(() => mainEditor.focus(), 100);
            }
        }
    }

    // Create a summary of selected options
    function createSelectionSummary(params) {
        // Create a container for the selection summary
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'selection-summary';
        summaryContainer.style.padding = '10px';
        summaryContainer.style.marginBottom = '15px';
        summaryContainer.style.backgroundColor = '#f5f5f5';
        summaryContainer.style.borderRadius = '4px';

        // Add a title
        const title = document.createElement('h3');
        title.textContent = 'Selected Options';
        title.style.marginTop = '0';
        title.style.marginBottom = '10px';
        summaryContainer.appendChild(title);

        // Create a list of selected options
        const list = document.createElement('ul');
        list.style.paddingLeft = '20px';
        list.style.margin = '0';

        // Add document type
        if (params.docType) {
            const docTypeItem = document.createElement('li');
            docTypeItem.textContent = `Document Type: ${params.docType === 'report' ? 'Report' : 'Page'}`;
            list.appendChild(docTypeItem);
        }

        // Add regions
        if (params.regions) {
            const regionsItem = document.createElement('li');
            regionsItem.textContent = `Regions: ${params.regions}`;
            list.appendChild(regionsItem);
        }

        // Add companies
        if (params.companies) {
            const companiesItem = document.createElement('li');
            companiesItem.textContent = `Companies: ${params.companies}`;
            list.appendChild(companiesItem);
        }

        // Add branches
        if (params.branches) {
            const branchesItem = document.createElement('li');
            branchesItem.textContent = `Branches: ${params.branches}`;
            list.appendChild(branchesItem);
        }

        // Add sub-branches
        if (params.subBranches) {
            const subBranchesItem = document.createElement('li');
            subBranchesItem.textContent = `Sub-Branches: ${params.subBranches}`;
            list.appendChild(subBranchesItem);
        }

        // Add languages
        if (params.languages) {
            const languagesItem = document.createElement('li');
            languagesItem.textContent = `Languages: ${params.languages}`;
            list.appendChild(languagesItem);
        }

        // Add first page option for report type
        if (params.docType === 'report' && params.firstPage) {
            const firstPageItem = document.createElement('li');
            let firstPageText = 'First Page: ';

            switch (params.firstPage) {
                case 'report-header':
                    firstPageText += 'Report Header';
                    break;
                case 'page-header':
                    firstPageText += 'Page Header';
                    break;
                case 'report-page-header':
                    firstPageText += 'Report & Page Header';
                    break;
                case 'none':
                    firstPageText += 'None';
                    break;
                default:
                    firstPageText += params.firstPage;
            }

            firstPageItem.textContent = firstPageText;
            list.appendChild(firstPageItem);
        }

        // Add last page option for report type
        if (params.docType === 'report' && params.lastPage) {
            const lastPageItem = document.createElement('li');
            let lastPageText = 'Last Page: ';

            switch (params.lastPage) {
                case 'report-footer':
                    lastPageText += 'Report Footer';
                    break;
                case 'page-footer':
                    lastPageText += 'Page Footer';
                    break;
                case 'report-page-footer':
                    lastPageText += 'Report & Page Footer';
                    break;
                case 'footer-only':
                    lastPageText += 'Footer Only';
                    break;
                case 'none':
                    lastPageText += 'None';
                    break;
                default:
                    lastPageText += params.lastPage;
            }

            lastPageItem.textContent = lastPageText;
            list.appendChild(lastPageItem);
        }

        // Add header and footer options for page type
        if (params.docType === 'page') {
            if (params.header) {
                const headerItem = document.createElement('li');
                headerItem.textContent = `Header: ${params.header === 'true' ? 'Yes' : 'No'}`;
                list.appendChild(headerItem);
            }

            if (params.footer) {
                const footerItem = document.createElement('li');
                footerItem.textContent = `Footer: ${params.footer === 'true' ? 'Yes' : 'No'}`;
                list.appendChild(footerItem);
            }
        }

        // Add the list to the container
        summaryContainer.appendChild(list);

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.className = 'mdl-button mdl-js-button mdl-button--raised';
        closeButton.textContent = 'Hide Summary';
        closeButton.style.marginTop = '10px';
        closeButton.addEventListener('click', function() {
            summaryContainer.style.display = 'none';
        });
        summaryContainer.appendChild(closeButton);

        // Add the container to the page
        const editorContainer = document.querySelector('.editor-container');
        if (editorContainer) {
            editorContainer.insertBefore(summaryContainer, editorContainer.firstChild);
        }
    }

    // Initialize variables - First Page
    const headerEditor = document.getElementById('headerEditor');
    const footerEditor = document.getElementById('footerEditor');
    const reportHeaderEditor = document.getElementById('reportHeaderEditor');
    const pageHeaderEditor = document.getElementById('pageHeaderEditor');
    const mainEditor = document.getElementById('mainEditor');

    const headerSection = document.getElementById('headerSection');
    const footerSection = document.getElementById('footerSection');
    const reportHeaderSection = document.getElementById('reportHeaderSection');
    const pageHeaderSection = document.getElementById('pageHeaderSection');

    const editHeaderBtn = document.getElementById('editHeaderBtn');
    const editFooterBtn = document.getElementById('editFooterBtn');
    const editReportHeaderBtn = document.getElementById('editReportHeaderBtn');
    const editPageHeaderBtn = document.getElementById('editPageHeaderBtn');

    const closeHeaderBtn = document.getElementById('closeHeaderBtn');
    const closeFooterBtn = document.getElementById('closeFooterBtn');
    const closeReportHeaderBtn = document.getElementById('closeReportHeaderBtn');
    const closePageHeaderBtn = document.getElementById('closePageHeaderBtn');

    // Default layout settings
    const layoutSettings = {
        headerHeight: '30mm',
        footerHeight: '30mm',
        reportHeaderHeight: '30mm',
        pageHeaderHeight: '30mm',
        reportFooterHeight: '30mm',
        pageFooterHeight: '30mm'
    };

    // Initialize variables - Last Page
    const lastPageContainer = document.getElementById('lastPageContainer');
    const reportFooterSection = document.getElementById('reportFooterSection');
    const pageFooterSection = document.getElementById('pageFooterSection');

    const lastPageMainEditor = document.getElementById('lastPageMainEditor');
    const reportFooterEditor = document.getElementById('reportFooterEditor');
    const pageFooterEditor = document.getElementById('pageFooterEditor');

    const editReportFooterBtn = document.getElementById('editReportFooterBtn');
    const editPageFooterBtn = document.getElementById('editPageFooterBtn');

    const closeReportFooterBtn = document.getElementById('closeReportFooterBtn');
    const closePageFooterBtn = document.getElementById('closePageFooterBtn');

    // Page navigation buttons
    const showLastPageBtn = document.getElementById('showLastPageBtn');
    const toggleLastPageBtn = document.getElementById('toggleLastPageBtn');
    const firstPageButtons = document.getElementById('firstPageButtons');
    const lastPageButtons = document.getElementById('lastPageButtons');

    const layoutSelector = document.getElementById('layoutSelector');

    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const previewBtn = document.getElementById('previewBtn');
    const imageUpload = document.getElementById('imageUpload');
    const insertImageUrlBtn = document.getElementById('insertImageUrl');
    const insertTextBoxBtn = document.getElementById('insertTextBox');
    const insertTableBtn = document.getElementById('insertTable');
    const textColorBtn = document.getElementById('textColorBtn');
    const bgColorBtn = document.getElementById('bgColorBtn');

    // Initialize modals
    const imageUrlModal = document.getElementById('imageUrlModal');
    const tableModal = document.getElementById('tableModal');
    const previewModal = document.getElementById('previewModal');
    const hyperlinkModal = document.getElementById('hyperlinkModal');

    // Set up modal content
    initializeModals();

    // Current editor reference
    let currentEditor = mainEditor;

    // Table selection variables
    let selectedRows = 0;
    let selectedCols = 0;

    // Initialize color palettes
    initializeColorPalettes();

    // Initialize the editor
    function initEditor() {
        // Set up navigation buttons in the toolbar
        document.getElementById('navFirstPageBtn').addEventListener('click', function() {
            // Don't process click if button is disabled
            if (this.classList.contains('disabled')) {
                return;
            }

            // Get URL parameters to check document type and page settings
            const params = getUrlParameters();

            // Don't do anything if first page is 'none' and last page is not 'none'
            // In this case, we should only show the last page
            if (params.firstPage === 'none' && params.lastPage !== 'none') {
                return;
            }

            // Don't do anything if last page is 'none'
            // In this case, there's no last page to navigate from
            if (params.lastPage === 'none') {
                return;
            }

            // Only process click if button is visible (not hidden)
            if (this.style.display !== 'none' && toggleLastPageBtn) {
                // Use the existing functionality for returning to first page
                toggleLastPageBtn.click();
            }
        });

        document.getElementById('navLastPageBtn').addEventListener('click', function() {
            // Don't process click if button is disabled
            if (this.classList.contains('disabled')) {
                return;
            }

            // Get URL parameters to check document type and page settings
            const params = getUrlParameters();

            // Don't do anything if first page is 'none' and last page is not 'none'
            // In this case, we're already showing only the last page
            if (params.firstPage === 'none' && params.lastPage !== 'none') {
                return;
            }

            // Don't do anything if last page is 'none'
            // In this case, there's no last page to navigate to
            if (params.lastPage === 'none') {
                return;
            }

            // Only process click if button is visible (not hidden)
            if (this.style.display !== 'none' && showLastPageBtn) {
                // Use the existing functionality for going to last page
                showLastPageBtn.click();
            }
        });

        document.getElementById('navPreviewBtn').addEventListener('click', function() {
            if (previewBtn) {
                // Use the existing functionality for preview
                previewBtn.click();
            }
        });

        document.getElementById('navSaveBtn').addEventListener('click', function() {
            if (saveBtn) {
                // Use the existing functionality for save
                saveBtn.click();
            }
        });

        document.getElementById('navClearBtn').addEventListener('click', function() {
            if (clearBtn) {
                // Use the existing functionality for clear all
                clearBtn.click();
            }
        });

        document.getElementById('navExitBtn').addEventListener('click', function() {
            if (exitBtn) {
                // Use the existing functionality for exit
                exitBtn.click();
            }
        });

        // Set up toolbar buttons
        document.querySelectorAll('.tool-button').forEach(button => {
            button.addEventListener('click', function() {
                const command = this.dataset.command;

                if (command === 'insertImage') {
                    // Trigger file upload dialog
                    imageUpload.click();
                } else if (command) {
                    // Execute the command
                    document.execCommand(command, false, null);
                }

                // Update button states
                updateButtonStates();
            });
        });

        // Set up font size selector
        document.getElementById('fontSize').addEventListener('change', function() {
            document.execCommand('fontSize', false, this.value);
        });

        // Set up font family selector
        document.getElementById('fontFamily').addEventListener('change', function() {
            document.execCommand('fontName', false, this.value);
        });

        // Set up font format selector
        document.getElementById('fontFormat').addEventListener('change', function() {
            if (this.value) {
                applyFormatting(this.value, currentEditor);
                this.selectedIndex = 0; // Reset to default option after applying
            }
        });

        // Set up image upload
        imageUpload.addEventListener('change', handleImageUpload);

        // Set up color buttons
        textColorBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hideAllPalettes();

            // Store the current selection before showing the palette
            storeCurrentSelection();

            const palette = document.getElementById('textColorPalette');
            palette.style.top = (this.offsetTop + this.offsetHeight) + 'px';
            palette.style.left = this.offsetLeft + 'px';
            palette.classList.toggle('show');
        });

        bgColorBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hideAllPalettes();

            // Store the current selection before showing the palette
            storeCurrentSelection();

            const palette = document.getElementById('bgColorPalette');
            palette.style.top = (this.offsetTop + this.offsetHeight) + 'px';
            palette.style.left = this.offsetLeft + 'px';
            palette.classList.toggle('show');
        });

        // Function to store the current selection
        function storeCurrentSelection() {
            // Get the current selection
            const selection = window.getSelection();

            // Check if there is a selection
            if (selection.rangeCount > 0) {
                // Store the range in a global variable
                window.lastRange = selection.getRangeAt(0);
            }
        }

        // Set up header/footer buttons
        editHeaderBtn.addEventListener('click', function() {
            headerSection.classList.add('active');
            headerSection.style.display = 'block';
            currentEditor = headerEditor;
            headerEditor.focus();
        });

        editFooterBtn.addEventListener('click', function() {
            footerSection.classList.add('active');
            footerSection.style.display = 'block';
            currentEditor = footerEditor;
            footerEditor.focus();
        });

        editReportHeaderBtn.addEventListener('click', function() {
            reportHeaderSection.classList.add('active');
            reportHeaderSection.style.display = 'block';
            currentEditor = reportHeaderEditor;
            reportHeaderEditor.focus();
        });

        editPageHeaderBtn.addEventListener('click', function() {
            pageHeaderSection.classList.add('active');
            pageHeaderSection.style.display = 'block';
            currentEditor = pageHeaderEditor;
            pageHeaderEditor.focus();
        });

        closeHeaderBtn.addEventListener('click', function() {
            headerSection.classList.remove('active');
            headerSection.style.display = 'none';
            currentEditor = mainEditor;
            mainEditor.focus();
        });

        closeFooterBtn.addEventListener('click', function() {
            footerSection.classList.remove('active');
            footerSection.style.display = 'none';
            currentEditor = mainEditor;
            mainEditor.focus();
        });

        closeReportHeaderBtn.addEventListener('click', function() {
            reportHeaderSection.classList.remove('active');
            // Don't hide completely if in split mode
            if (!reportHeaderSection.classList.contains('split-page')) {
                reportHeaderSection.style.display = 'none';
            }
            currentEditor = mainEditor;
            mainEditor.focus();
        });

        closePageHeaderBtn.addEventListener('click', function() {
            pageHeaderSection.classList.remove('active');
            // Don't hide completely if in split mode
            if (!pageHeaderSection.classList.contains('split-page')) {
                pageHeaderSection.style.display = 'none';
            }
            currentEditor = mainEditor;
            mainEditor.focus();
        });

        // Set up editor focus events
        headerEditor.addEventListener('focus', function() {
            currentEditor = headerEditor;
        });

        footerEditor.addEventListener('focus', function() {
            currentEditor = footerEditor;
        });

        reportHeaderEditor.addEventListener('focus', function() {
            currentEditor = reportHeaderEditor;
        });

        pageHeaderEditor.addEventListener('focus', function() {
            currentEditor = pageHeaderEditor;
        });

        mainEditor.addEventListener('focus', function() {
            currentEditor = mainEditor;
        });

        // Set up last page editor focus events
        lastPageMainEditor.addEventListener('focus', function() {
            currentEditor = lastPageMainEditor;
        });

        reportFooterEditor.addEventListener('focus', function() {
            currentEditor = reportFooterEditor;
        });

        pageFooterEditor.addEventListener('focus', function() {
            currentEditor = pageFooterEditor;
        });

        // Set up layout selector
        layoutSelector.addEventListener('change', function() {
            changeLayout(this.value);
        });

        // Set up image URL insertion
        insertImageUrlBtn.addEventListener('click', function() {
            openImageUrlModal();
        });

        // Set up table insertion
        insertTableBtn.addEventListener('click', function() {
            openTableModal();
        });

        // Set up hyperlink insertion
        document.getElementById('insertHyperlink').addEventListener('click', function() {
            openHyperlinkModal();
        });

        // Set up preview button
        previewBtn.addEventListener('click', openPreviewModal);

        // Set up save button
        saveBtn.addEventListener('click', saveDocument);

        // Set up clear button
        clearBtn.addEventListener('click', clearAllContent);

        // Hide palettes when clicking elsewhere
        document.addEventListener('click', function() {
            hideAllPalettes();
        });

        // Initialize with main editor as active
        mainEditor.focus();
    }

    // Initialize modals
    function initializeModals() {
        // Image URL Modal
        imageUrlModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Insert Image from URL</h3>
                <div class="form-group">
                    <label for="imageUrl">Image URL:</label>
                    <input type="text" id="imageUrl" class="form-control" placeholder="https://example.com/image.jpg">
                </div>
                <div class="form-group">
                    <label for="imageAlt">Alt Text:</label>
                    <input type="text" id="imageAlt" class="form-control" placeholder="Image description">
                </div>
                <div class="form-group">
                    <label for="imageAlign">Alignment:</label>
                    <select id="imageAlign" class="form-control">
                        <option value="none">None</option>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div class="form-group">
                    <button id="insertUrlImageBtn" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                        Insert Image
                    </button>
                    <button id="cancelUrlImageBtn" class="mdl-button mdl-js-button mdl-button--raised">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Preview Modal
        previewModal.innerHTML = `
            <div class="modal-content preview-modal-content">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div>
                        <button id="printPreviewBtn" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" style="color:white;background-color: #000000;border-radius: 4px;width: 50px;margin-right: 10px;">
                            <i class="material-icons">print</i>
                        </button>
                        <span class="close" style="color:black">&times;</span>
                    </div>
                </div>
                <div class="preview-container">
                    <div class="a4-page">
                        <!-- Standard Header/Footer Layout -->
                        <div id="standardLayout">
                            <div class="page-header" id="previewHeader"></div>
                            <div class="page-content-placeholder">
                                <div id="previewMainContent"></div>
                            </div>
                            <div class="page-footer" id="previewFooter"></div>
                        </div>

                        <!-- Report Header Layout -->
                        <div id="reportHeaderLayout" style="display: none; position: relative; height: 100%;">
                            <div class="page-report-header" id="previewReportHeader"></div>
                        </div>

                        <!-- Page Header Layout -->
                        <div id="pageHeaderLayout" style="display: none; position: relative; height: 100%;">
                            <div class="page-page-header" id="previewPageHeader"></div>
                        </div>

                        <!-- Report Header & Page Header Layout -->
                        <div id="reportPageHeaderLayout" style="display: none; position: relative; height: 100%;">
                            <div class="page-report-header-split" id="previewReportHeaderSplit" style="position: absolute; top: 0; height: 148.5mm; width: 100%; border-bottom: 2px solid #999; padding: 10px; box-sizing: border-box; overflow: auto;"></div>
                            <div class="page-page-header-split" id="previewPageHeaderSplit" style="position: absolute; bottom: 0; height: 148.5mm; width: 100%; border-top: 2px solid #999; padding: 10px; box-sizing: border-box; overflow: auto;"></div>
                        </div>
                    </div>
                    <!-- Last page will be dynamically added here -->
                </div>
            </div>
        `;

        // Table Modal
        tableModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Insert Table</h3>

                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                    <p style="margin: 0; font-size: 14px;">Select rows and columns:</p>
                    <div class="table-dimensions" id="tableDimensions">0 × 0</div>
                </div>

                <div class="table-grid" id="tableGrid"></div>

                <div>
                    <div class="form-group" style="flex: 1; min-width: 120px;">
                        <label for="tableBorderStyle" style="font-size: 14px;">Border Style:</label>
                        <select id="tableBorderStyle" class="form-control">
                            <option value="full">Full Borders</option>
                            <option value="none">No Borders</option>
                            <option value="outer">Outer Border Only</option>
                            <option value="header">Header Border Only</option>
                        </select>
                    </div>

                    <div class="form-group" style="flex: 1; min-width: 120px;">
                        <label for="tableBorderWidth" style="font-size: 14px;">Border Width:</label>
                        <select id="tableBorderWidth" class="form-control">
                            <option value="1px">Thin</option>
                            <option value="2px">Medium</option>
                            <option value="3px">Thick</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="tableHeaderStyle" style="font-size: 14px;">Header Style:</label>
                    <select id="tableHeaderStyle" class="form-control">
                        <option value="default">Default (Gray Background)</option>
                        <option value="bold">Bold Text Only</option>
                        <option value="none">Same as Regular Cells</option>
                    </select>
                </div>

                <div class="form-group" style="margin-top: 15px; text-align: right;">
                    <button id="insertTableBtn" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" style="    color: white;
    background: black;
    padding: 5px;
    border-radius: 6px;
    font-family: var(--app-font-family);">
                        Insert Table
                    </button>
                    <button id="cancelTableBtn" class="mdl-button mdl-js-button mdl-button--raised"  style="    color: black;
    background: white;
    padding: 5px;
    border-radius: 6px;
    font-family: var(--app-font-family);">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Layout Customization Modal removed in favor of drag-to-resize functionality

        // Set up modal event listeners
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.style.display = 'none';
                modal.classList.remove('show');
            });
        });

        // Image URL modal buttons
        document.getElementById('insertUrlImageBtn').addEventListener('click', insertImageFromUrl);
        document.getElementById('cancelUrlImageBtn').addEventListener('click', function() {
            imageUrlModal.style.display = 'none';
        });

        // Preview modal buttons
        document.getElementById('printPreviewBtn').addEventListener('click', printPreview);

        // Table modal buttons
        document.getElementById('insertTableBtn').addEventListener('click', insertTable);
        document.getElementById('cancelTableBtn').addEventListener('click', function() {
            tableModal.style.display = 'none';
        });

        // Hyperlink modal
        hyperlinkModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Insert Hyperlink</h3>
                <div class="form-group">
                    <label for="hyperlinkUrl">URL:</label>
                    <input type="text" id="hyperlinkUrl" class="form-control" placeholder="https://example.com">
                </div>
                <div class="form-group">
                    <label for="hyperlinkText">Link Text:</label>
                    <input type="text" id="hyperlinkText" class="form-control" placeholder="Link text">
                </div>
                <div class="form-group">
                    <label for="hyperlinkTarget">Open in:</label>
                    <select id="hyperlinkTarget" class="form-control">
                        <option value="_self">Same Window</option>
                        <option value="_blank">New Window</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button id="insertHyperlinkBtn" class="mdc-button mdc-button--raised">Insert</button>
                    <button id="cancelHyperlinkBtn" class="mdc-button mdc-button--outlined">Cancel</button>
                </div>
            </div>
        `;

        // Hyperlink modal buttons
        document.getElementById('insertHyperlinkBtn').addEventListener('click', insertHyperlinkFromModal);
        document.getElementById('cancelHyperlinkBtn').addEventListener('click', function() {
            hyperlinkModal.style.display = 'none';
        });

        // Layout customization modal buttons removed in favor of drag-to-resize functionality

        // Initialize table grid
        initTableGrid();
    }

    // Initialize color palettes
    function initializeColorPalettes() {
        // Basic colors
        const basicColors = [
            '#000000', '#FFFFFF', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF'
        ];

        // Gray shades
        const grayShades = [
            '#808080', '#A9A9A9', '#D3D3D3', '#F5F5F5', '#E0E0E0', '#C0C0C0', '#696969', '#2F4F4F'
        ];

        // Red shades
        const redShades = [
            '#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#C71585', '#DB7093', '#DC143C', '#B22222',
            '#8B0000', '#800000', '#CD5C5C', '#F08080', '#FA8072', '#E9967A', '#FFA07A'
        ];

        // Blue shades
        const blueShades = [
            '#ADD8E6', '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#4169E1', '#0000FF', '#0000CD',
            '#00008B', '#000080', '#191970', '#7B68EE', '#6A5ACD', '#483D8B', '#4682B4'
        ];

        // Green shades
        const greenShades = [
            '#98FB98', '#90EE90', '#00FA9A', '#00FF7F', '#3CB371', '#2E8B57', '#228B22', '#008000',
            '#006400', '#9ACD32', '#6B8E23', '#808000', '#556B2F', '#66CDAA', '#8FBC8F'
        ];

        // Yellow/Orange shades
        const yellowOrangeShades = [
            '#FFFFE0', '#FFFACD', '#FAFAD2', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#EEE8AA', '#F0E68C',
            '#BDB76B', '#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500'
        ];

        // Purple/Pink shades
        const purplePinkShades = [
            '#E6E6FA', '#D8BFD8', '#DDA0DD', '#EE82EE', '#DA70D6', '#FF00FF', '#BA55D3', '#9370DB',
            '#8A2BE2', '#9400D3', '#9932CC', '#8B008B', '#800080', '#4B0082', '#6A5ACD'
        ];

        // Brown shades
        const brownShades = [
            '#FFF8DC', '#FFEBCD', '#FFE4C4', '#FFDEAD', '#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F',
            '#F4A460', '#DAA520', '#B8860B', '#CD853F', '#D2691E', '#8B4513', '#A0522D'
        ];

        // Combine all color groups
        const allColors = [
            { name: 'Basic Colors', colors: basicColors },
            { name: 'Gray Shades', colors: grayShades },
            { name: 'Red Shades', colors: redShades },
            { name: 'Blue Shades', colors: blueShades },
            { name: 'Green Shades', colors: greenShades },
            { name: 'Yellow/Orange', colors: yellowOrangeShades },
            { name: 'Purple/Pink', colors: purplePinkShades },
            { name: 'Brown Shades', colors: brownShades }
        ];

        const textPalette = document.getElementById('textColorPalette');
        const bgPalette = document.getElementById('bgColorPalette');

        // Clear existing content
        textPalette.innerHTML = '';
        bgPalette.innerHTML = '';

        // Add color groups to palettes
        allColors.forEach(group => {
            // Add group title to text palette
            const textGroupTitle = document.createElement('div');
            textGroupTitle.className = 'color-group-title';
            textGroupTitle.textContent = group.name;
            textGroupTitle.style.width = '100%';
            textGroupTitle.style.borderBottom = '1px solid #ddd';
            textGroupTitle.style.marginBottom = '5px';
            textGroupTitle.style.paddingBottom = '3px';
            textGroupTitle.style.fontSize = '12px';
            textGroupTitle.style.color = '#666';
            textPalette.appendChild(textGroupTitle);

            // Add group title to background palette
            const bgGroupTitle = document.createElement('div');
            bgGroupTitle.className = 'color-group-title';
            bgGroupTitle.textContent = group.name;
            bgGroupTitle.style.width = '100%';
            bgGroupTitle.style.borderBottom = '1px solid #ddd';
            bgGroupTitle.style.marginBottom = '5px';
            bgGroupTitle.style.paddingBottom = '3px';
            bgGroupTitle.style.fontSize = '12px';
            bgGroupTitle.style.color = '#666';
            bgPalette.appendChild(bgGroupTitle);

            // Add colors from this group
            group.colors.forEach(color => {
                // Text color option
                const textOption = document.createElement('div');
                textOption.className = 'color-option';
                textOption.dataset.color = color;
                textOption.style.backgroundColor = color;
                if (color === '#FFFFFF' || color.toLowerCase().includes('fff')) {
                    textOption.style.border = '1px solid #ddd';
                }
                textOption.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const colorValue = this.dataset.color;

                    // Use setTimeout to ensure the color is applied after the click event is fully processed
                    setTimeout(function() {
                        applyTextColor(colorValue);
                    }, 10);

                    hideAllPalettes();
                });
                textPalette.appendChild(textOption);

                // Background color option
                const bgOption = document.createElement('div');
                bgOption.className = 'color-option';
                bgOption.dataset.color = color;
                bgOption.style.backgroundColor = color;
                if (color === '#FFFFFF' || color.toLowerCase().includes('fff')) {
                    bgOption.style.border = '1px solid #ddd';
                }
                bgOption.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const colorValue = this.dataset.color;

                    // Use setTimeout to ensure the color is applied after the click event is fully processed
                    setTimeout(function() {
                        applyBackgroundColor(colorValue);
                    }, 10);

                    hideAllPalettes();
                });
                bgPalette.appendChild(bgOption);
            });

            // Add spacer after each group
            const textSpacer = document.createElement('div');
            textSpacer.style.width = '100%';
            textSpacer.style.height = '10px';
            textPalette.appendChild(textSpacer);

            const bgSpacer = document.createElement('div');
            bgSpacer.style.width = '100%';
            bgSpacer.style.height = '10px';
            bgPalette.appendChild(bgSpacer);
        });
    }

    // Initialize table grid
    function initTableGrid() {
        const tableGrid = document.getElementById('tableGrid');
        const tableDimensions = document.getElementById('tableDimensions');

        // Clear existing grid
        tableGrid.innerHTML = '';

        // Create 10x10 grid
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.className = 'table-cell';
                cell.dataset.row = row + 1;
                cell.dataset.col = col + 1;

                // Highlight cells on hover
                cell.addEventListener('mouseover', function() {
                    highlightCells(parseInt(this.dataset.row), parseInt(this.dataset.col));
                });

                // Select dimensions on click
                cell.addEventListener('click', function() {
                    selectedRows = parseInt(this.dataset.row);
                    selectedCols = parseInt(this.dataset.col);
                    tableDimensions.textContent = `${selectedRows} × ${selectedCols}`;
                });

                tableGrid.appendChild(cell);
            }
        }

        // Reset selection when mouse leaves the grid
        tableGrid.addEventListener('mouseleave', function() {
            if (selectedRows && selectedCols) {
                highlightCells(selectedRows, selectedCols);
            } else {
                clearHighlight();
            }
        });
    }

    // Highlight cells in the table grid
    function highlightCells(rows, cols) {
        // Clear previous highlight
        clearHighlight();

        // Highlight selected cells
        document.querySelectorAll('.table-cell').forEach(cell => {
            const cellRow = parseInt(cell.dataset.row);
            const cellCol = parseInt(cell.dataset.col);

            if (cellRow <= rows && cellCol <= cols) {
                cell.classList.add('selected');
            }
        });

        // Update dimensions text
        document.getElementById('tableDimensions').textContent = `${rows} × ${cols}`;
    }

    // Clear highlight from all cells
    function clearHighlight() {
        document.querySelectorAll('.table-cell').forEach(cell => {
            cell.classList.remove('selected');
        });

        // Reset dimensions text if no selection
        if (!selectedRows || !selectedCols) {
            document.getElementById('tableDimensions').textContent = '0 × 0';
        }
    }

    // Handle image upload
    function handleImageUpload(event) {
        const files = event.target.files;

        if (files && files.length > 0) {
            const file = files[0];

            if (file.type.match('image.*')) {
                // Make sure we have an editor selected
                if (!currentEditor) {
                    currentEditor = mainEditor;
                }

                // Focus the current editor to ensure insertion works
                currentEditor.focus();

                const reader = new FileReader();

                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'uploaded-image';
                    img.style.maxWidth = '100%';
                    img.style.position = 'relative';

                    // Set initial width and height to make resizing easier
                    img.style.width = '300px';
                    img.style.height = 'auto';

                    // Create a wrapper for the image with explicit styles
                    const wrapper = document.createElement('div');
                    wrapper.className = 'img-wrapper';
                    wrapper.style.position = 'relative';
                    wrapper.style.display = 'inline-block';
                    wrapper.style.margin = '0';
                    wrapper.style.padding = '0';
                    wrapper.style.border = '0';
                    wrapper.style.boxSizing = 'border-box';
                    wrapper.style.verticalAlign = 'middle';

                    // Ensure the image has an ID
                    if (!img.id) {
                        img.id = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
                    }

                    // Add the image to the wrapper
                    wrapper.appendChild(img);

                    // Create a container div to hold both the image and a line break
                    const container = document.createElement('div');
                    container.className = 'image-container';
                    container.style.display = 'block';
                    container.style.width = '100%';
                    container.style.position = 'relative';

                    // Create a paragraph for the image
                    const paragraph = document.createElement('p');
                    paragraph.appendChild(wrapper);
                    container.appendChild(paragraph);

                    // Create a clear paragraph after the image to ensure proper text flow
                    const clearParagraph = document.createElement('p');
                    clearParagraph.style.clear = 'both';
                    clearParagraph.innerHTML = '<br>';
                    container.appendChild(clearParagraph);

                    // Insert the container with the wrapped image and clear paragraph
                    document.execCommand('insertHTML', false, container.outerHTML);

                    // Make images interactive
                    makeImagesInteractive();

                    // Select the newly inserted image and position cursor
                    setTimeout(() => {
                        // Find the newly inserted clear paragraph
                        const clearP = currentEditor.querySelector('.image-container:last-of-type p:last-of-type');
                        if (clearP) {
                            // Set cursor position after the clear paragraph
                            const selection = window.getSelection();
                            const range = document.createRange();
                            range.setStartAfter(clearP);
                            range.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(range);

                            // Focus the editor
                            currentEditor.focus();
                        }

                        // Find and select the image to show resize handles
                        const newImage = currentEditor.querySelector('.image-container:last-of-type img');
                        if (newImage) {
                            // Trigger a click to select it and show resize handles
                            const clickEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            newImage.dispatchEvent(clickEvent);
                        }
                    }, 100);
                };

                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file.');
            }
        }

        // Reset the input
        event.target.value = '';
    }

    // Open image URL modal
    function openImageUrlModal() {
        document.getElementById('imageUrl').value = '';
        document.getElementById('imageAlt').value = '';
        document.getElementById('imageAlign').value = 'none';

        // Show modal
        document.getElementById('imageUrlModal').style.display = 'block';
    }

    // Insert image from URL
    function insertImageFromUrl() {
        const url = document.getElementById('imageUrl').value.trim();
        const alt = document.getElementById('imageAlt').value.trim();
        const align = document.getElementById('imageAlign').value;

        if (url) {
            // Make sure we have an editor selected
            if (!currentEditor) {
                currentEditor = mainEditor;
            }

            // Focus the current editor to ensure insertion works
            currentEditor.focus();

            // Create image element
            const img = document.createElement('img');
            img.src = url;
            img.alt = alt;
            img.className = 'uploaded-image';
            img.style.position = 'relative';

            // Set initial width and height to make resizing easier
            img.style.width = '300px';
            img.style.height = 'auto';

            // Set alignment
            if (align !== 'none') {
                img.style.display = 'block';
                if (align === 'left') {
                    img.style.float = 'left';
                    img.style.marginRight = '10px';
                } else if (align === 'right') {
                    img.style.float = 'right';
                    img.style.marginLeft = '10px';
                } else if (align === 'center') {
                    img.style.margin = '0 auto';
                }
            }

            // Create a wrapper for the image with explicit styles
            const wrapper = document.createElement('div');
            wrapper.className = 'img-wrapper';
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.margin = '0';
            wrapper.style.padding = '0';
            wrapper.style.border = '0';
            wrapper.style.boxSizing = 'border-box';
            wrapper.style.verticalAlign = 'middle';

            // Ensure the image has an ID
            if (!img.id) {
                img.id = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            }

            // Add the image to the wrapper
            wrapper.appendChild(img);

            // Create a container div to hold both the image and a line break
            const container = document.createElement('div');
            container.className = 'image-container';
            container.style.display = 'block';
            container.style.width = '100%';
            container.style.position = 'relative';

            // Create a paragraph for the image
            const paragraph = document.createElement('p');
            paragraph.appendChild(wrapper);
            container.appendChild(paragraph);

            // Create a clear paragraph after the image to ensure proper text flow
            const clearParagraph = document.createElement('p');
            clearParagraph.style.clear = 'both';
            clearParagraph.innerHTML = '<br>';
            container.appendChild(clearParagraph);

            // Insert the container with the wrapped image and clear paragraph
            document.execCommand('insertHTML', false, container.outerHTML);

            // Get the selection and move to after the inserted content
            setTimeout(() => {
                // Find the newly inserted clear paragraph
                const clearP = currentEditor.querySelector('.image-container:last-of-type p:last-of-type');
                if (clearP) {
                    // Set cursor position after the clear paragraph
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.setStartAfter(clearP);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // Focus the editor
                    currentEditor.focus();
                }
            }, 100);

            // Make images interactive
            makeImagesInteractive();

            // Select the newly inserted image
            setTimeout(() => {
                const newWrapper = currentEditor.querySelector('.img-wrapper:last-of-type');
                if (newWrapper) {
                    const newImage = newWrapper.querySelector('img');
                    if (newImage) {
                        // Trigger a click to select it and show resize handles
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        newImage.dispatchEvent(clickEvent);

                        // Move cursor after the image
                        const selection = window.getSelection();
                        const range = document.createRange();
                        const imgWrapper = newImage.closest('.img-wrapper');
                        if (imgWrapper && imgWrapper.parentNode) {
                            range.setStartAfter(imgWrapper.parentNode);
                            range.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }

                        // Force update of handle positions after a delay
                        setTimeout(() => {
                            // Find the handles for this image
                            const imgId = newImage.id;
                            if (imgId) {
                                // Update handle positions
                                const handles = document.querySelectorAll(`.resize-handle[data-for-image="${imgId}"]`);
                                handles.forEach(handle => {
                                    if (handle.classList.contains('nw')) {
                                        handle.style.top = '2px';
                                        handle.style.left = '2px';
                                    } else if (handle.classList.contains('ne')) {
                                        handle.style.top = '2px';
                                        handle.style.right = '2px';
                                        handle.style.left = 'auto';
                                    } else if (handle.classList.contains('sw')) {
                                        handle.style.bottom = '2px';
                                        handle.style.left = '2px';
                                        handle.style.top = 'auto';
                                    } else if (handle.classList.contains('se')) {
                                        handle.style.bottom = '2px';
                                        handle.style.right = '2px';
                                        handle.style.top = 'auto';
                                        handle.style.left = 'auto';
                                    }
                                });
                            }
                        }, 50);
                    }
                }
            }, 100);

            // Close modal
            document.getElementById('imageUrlModal').style.display = 'none';
        } else {
            alert('Please enter a valid image URL');
        }
    }

    // Make images interactive (selectable and resizable)
    function makeImagesInteractive() {
        // First, clean up any orphaned resize handles
        document.querySelectorAll('.resize-handle').forEach(handle => {
            // Check if this handle is associated with an image that still exists
            const imgId = handle.getAttribute('data-for-image');
            if (!imgId || !document.getElementById(imgId)) {
                handle.remove();
            }
        });

        document.querySelectorAll('.resize-handles-container').forEach(container => {
            // Check if this container is associated with an image that still exists
            const imgId = container.getAttribute('data-for-image');
            if (!imgId || !document.getElementById(imgId)) {
                container.remove();
            }
        });

        const images = document.querySelectorAll('.editable img');

        images.forEach(img => {
            if (!img.hasAttribute('data-interactive')) {
                // Assign a unique ID to the image if it doesn't have one
                if (!img.id) {
                    img.id = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
                }

                img.setAttribute('data-interactive', 'true');

                // Make the image position relative for resize handles
                img.style.position = 'relative';
                img.style.boxSizing = 'border-box';

                // Create a direct wrapper for the image with absolute positioning for handles
                let wrapper;
                if (img.parentNode.classList.contains('img-wrapper')) {
                    wrapper = img.parentNode;
                } else {
                    // Create a new wrapper
                    wrapper = document.createElement('div');
                    wrapper.className = 'img-wrapper';
                    wrapper.style.position = 'relative';
                    wrapper.style.display = 'inline-block';
                    wrapper.style.margin = '0';
                    wrapper.style.padding = '0';
                    wrapper.style.border = '0';
                    wrapper.style.boxSizing = 'border-box';

                    // Replace the image with the wrapper containing the image
                    img.parentNode.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                }

                // Remove any existing handle containers for this image
                document.querySelectorAll(`.resize-handles-container[data-for-image="${img.id}"]`).forEach(container => {
                    container.remove();
                });

                // Create a container for the handles that will be positioned absolutely over the image
                const handleContainer = document.createElement('div');
                handleContainer.className = 'resize-handles-container';
                handleContainer.style.position = 'absolute';
                handleContainer.style.top = '0';
                handleContainer.style.left = '0';
                handleContainer.style.right = '0';
                handleContainer.style.bottom = '0';
                handleContainer.style.pointerEvents = 'none';
                handleContainer.style.boxSizing = 'border-box';
                handleContainer.style.margin = '0';
                handleContainer.style.padding = '0';
                handleContainer.style.border = '0';
                handleContainer.style.zIndex = '999';
                handleContainer.setAttribute('data-for-image', img.id);

                // Add the container to the wrapper
                wrapper.appendChild(handleContainer);

                // Create resize handles
                const handles = {
                    nw: document.createElement('div'),
                    ne: document.createElement('div'),
                    sw: document.createElement('div'),
                    se: document.createElement('div')
                };

                // Set up each handle
                Object.keys(handles).forEach(pos => {
                    const handle = handles[pos];
                    handle.className = `resize-handle ${pos}`;
                    handle.setAttribute('data-for-image', img.id);
                    handle.style.display = 'none';
                    handle.style.pointerEvents = 'auto';
                    handleContainer.appendChild(handle);

                    // Add resize functionality to handle
                    handle.addEventListener('mousedown', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Mark image as resizing
                        img.classList.add('resizing');

                        // Get initial positions
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = img.offsetWidth;
                        const startHeight = img.offsetHeight;

                        // Function to handle resize
                        function handleResize(e) {
                            let newWidth, newHeight;

                            // Calculate new dimensions based on handle position
                            switch(pos) {
                                case 'se':
                                    newWidth = startWidth + (e.clientX - startX);
                                    newHeight = startHeight + (e.clientY - startY);
                                    break;
                                case 'sw':
                                    newWidth = startWidth - (e.clientX - startX);
                                    newHeight = startHeight + (e.clientY - startY);
                                    break;
                                case 'ne':
                                    newWidth = startWidth + (e.clientX - startX);
                                    newHeight = startHeight - (e.clientY - startY);
                                    break;
                                case 'nw':
                                    newWidth = startWidth - (e.clientX - startX);
                                    newHeight = startHeight - (e.clientY - startY);
                                    break;
                            }

                            // Apply new dimensions with minimum size
                            if (newWidth >= 30) {
                                img.style.width = `${newWidth}px`;
                            }

                            if (newHeight >= 30) {
                                img.style.height = `${newHeight}px`;
                            }

                            // Update handle positions
                            updateHandlePositions();
                        }

                        // Function to stop resizing
                        function stopResize() {
                            document.removeEventListener('mousemove', handleResize);
                            document.removeEventListener('mouseup', stopResize);
                            img.classList.remove('resizing');
                        }

                        // Add event listeners for resize
                        document.addEventListener('mousemove', handleResize);
                        document.addEventListener('mouseup', stopResize);
                    });
                });

                // Function to update all handle positions
                function updateHandlePositions() {
                    // Make sure the container covers the entire image
                    handleContainer.style.width = img.offsetWidth + 'px';
                    handleContainer.style.height = img.offsetHeight + 'px';

                    // Account for border when image is selected
                    const borderOffset = img.classList.contains('selected') ? 2 : 0;

                    // Set fixed pixel positions for the handles, accounting for border
                    // Northwest handle (top-left)
                    handles.nw.style.top = borderOffset + 'px';
                    handles.nw.style.left = borderOffset + 'px';
                    handles.nw.style.transform = 'translate(-50%, -50%)';

                    // Northeast handle (top-right)
                    handles.ne.style.top = borderOffset + 'px';
                    handles.ne.style.left = (img.offsetWidth - borderOffset) + 'px';
                    handles.ne.style.transform = 'translate(-50%, -50%)';

                    // Southwest handle (bottom-left)
                    handles.sw.style.top = (img.offsetHeight - borderOffset) + 'px';
                    handles.sw.style.left = borderOffset + 'px';
                    handles.sw.style.transform = 'translate(-50%, -50%)';

                    // Southeast handle (bottom-right)
                    handles.se.style.top = (img.offsetHeight - borderOffset) + 'px';
                    handles.se.style.left = (img.offsetWidth - borderOffset) + 'px';
                    handles.se.style.transform = 'translate(-50%, -50%)';

                    // Force a reflow to ensure the handles are positioned correctly
                    handleContainer.offsetHeight;
                }

                // Show/hide handles when selecting/deselecting image
                img.addEventListener('click', function(e) {
                    // Deselect all images and hide all handles
                    document.querySelectorAll('.editable img').forEach(i => {
                        i.classList.remove('selected');
                    });

                    document.querySelectorAll('.resize-handle').forEach(handle => {
                        handle.style.display = 'none';
                    });

                    // Select this image
                    this.classList.add('selected');

                    // Show handles for this image only
                    document.querySelectorAll(`.resize-handle[data-for-image="${img.id}"]`).forEach(handle => {
                        handle.style.display = 'block';
                    });

                    // Update handle positions immediately
                    updateHandlePositions();

                    // Update handle positions again after a short delay to ensure proper positioning
                    setTimeout(updateHandlePositions, 10);

                    e.stopPropagation();
                });

                // Make image draggable
                img.addEventListener('mousedown', function(e) {
                    if (img.classList.contains('selected') && e.target === img) {
                        e.preventDefault();

                        // Set cursor to move
                        img.style.cursor = 'move';

                        // Get initial positions
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startLeft = parseInt(wrapper.style.left) || 0;
                        const startTop = parseInt(wrapper.style.top) || 0;

                        // Flag to track if we're dragging
                        let isDragging = true;

                        // Function to handle drag
                        function handleDrag(e) {
                            if (!isDragging) return;

                            const newLeft = startLeft + (e.clientX - startX);
                            const newTop = startTop + (e.clientY - startY);

                            // Move the wrapper instead of the image
                            wrapper.style.position = 'relative';
                            wrapper.style.left = `${newLeft}px`;
                            wrapper.style.top = `${newTop}px`;

                            // Ensure the image stays above text
                            wrapper.style.zIndex = '30';

                            // Update handle positions
                            updateHandlePositions();

                            // Force a reflow to ensure the handles are positioned correctly
                            handleContainer.offsetHeight;

                            // Prevent text selection during drag
                            e.preventDefault();
                        }

                        // Function to stop dragging
                        function stopDrag() {
                            isDragging = false;
                            document.removeEventListener('mousemove', handleDrag);
                            document.removeEventListener('mouseup', stopDrag);

                            // Reset cursor
                            img.style.cursor = '';

                            // Update handle positions one more time after drag ends
                            setTimeout(updateHandlePositions, 10);
                        }

                        // Add event listeners for drag
                        document.addEventListener('mousemove', handleDrag);
                        document.addEventListener('mouseup', stopDrag);
                    }
                });
            }
        });

        // Deselect when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.editable img') && !e.target.closest('.resize-handle')) {
                document.querySelectorAll('.editable img').forEach(img => {
                    img.classList.remove('selected');
                });

                document.querySelectorAll('.resize-handle').forEach(handle => {
                    handle.style.display = 'none';
                });
            }
        });

        // Handle keyboard events for selected images and general editor functionality
        document.addEventListener('keydown', function(e) {
            // Check if Delete or Backspace key is pressed
            if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement.classList.contains('editable')) {
                // Find selected image
                const selectedImage = document.querySelector('.editable img.selected');
                if (selectedImage) {
                    e.preventDefault(); // Prevent default delete behavior

                    // Find the wrapper containing the image
                    const wrapper = selectedImage.closest('.img-wrapper');
                    if (wrapper) {
                        // Find the parent paragraph that contains the wrapper
                        const parentParagraph = wrapper.closest('p');
                        if (parentParagraph) {
                            // Remove the entire paragraph containing the image
                            parentParagraph.remove();
                        } else {
                            // Remove just the wrapper if no parent paragraph found
                            wrapper.remove();
                        }
                    } else {
                        // Fallback: remove just the image if wrapper not found
                        selectedImage.remove();

                        // Also remove any associated handles
                        const imgId = selectedImage.id;
                        if (imgId) {
                            document.querySelectorAll(`.resize-handle[data-for-image="${imgId}"]`).forEach(handle => {
                                handle.remove();
                            });
                            document.querySelectorAll(`.resize-handles-container[data-for-image="${imgId}"]`).forEach(container => {
                                container.remove();
                            });
                        }
                    }

                    // Set focus back to the editor
                    currentEditor.focus();
                }
            }

            // Handle Enter key to ensure proper line breaks
            if (e.key === 'Enter' && !e.shiftKey && document.activeElement.classList.contains('editable')) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const startNode = range.startContainer;

                    // Check if we're in or near an image wrapper or image container
                    const nearImage = startNode.nodeType === 1 && (
                        startNode.classList.contains('img-wrapper') ||
                        startNode.querySelector('.img-wrapper') ||
                        startNode.closest('.img-wrapper') ||
                        startNode.classList.contains('image-container') ||
                        startNode.querySelector('.image-container') ||
                        startNode.closest('.image-container')
                    );

                    // Also check if we're in a paragraph right after an image
                    const afterImage = startNode.previousElementSibling &&
                        (startNode.previousElementSibling.classList.contains('image-container') ||
                         startNode.previousElementSibling.querySelector('img'));

                    if (nearImage || afterImage) {
                        e.preventDefault();

                        // Create a new paragraph with proper spacing
                        const newParagraph = document.createElement('p');
                        newParagraph.style.clear = 'both'; // Clear any floats
                        newParagraph.style.display = 'block'; // Ensure block display
                        newParagraph.style.width = '100%'; // Full width
                        newParagraph.innerHTML = '<br>';

                        // Insert the new paragraph
                        document.execCommand('insertHTML', false, newParagraph.outerHTML);

                        // Focus the editor to ensure cursor is visible
                        currentEditor.focus();
                        return;
                    }

                    // If we're in a single column after pressing Enter near an image
                    // Check if the current line is very narrow (possible sign of column issue)
                    const currentLineRect = range.getBoundingClientRect();
                    if (currentLineRect.width < 100) { // If line is suspiciously narrow
                        e.preventDefault();

                        // Create a full-width paragraph
                        const fullWidthParagraph = document.createElement('p');
                        fullWidthParagraph.style.width = '100%';
                        fullWidthParagraph.style.display = 'block';
                        fullWidthParagraph.style.clear = 'both';
                        fullWidthParagraph.innerHTML = '<br>';

                        // Insert the paragraph
                        document.execCommand('insertHTML', false, fullWidthParagraph.outerHTML);
                        return;
                    }
                }
            }
        });
    }

    // Insert text box
    function insertTextBox() {
        // Make sure we have an editor selected
        if (!currentEditor) {
            currentEditor = mainEditor;
        }

        // Focus the current editor to ensure insertion works
        currentEditor.focus();

        // Create a container for the text box
        const container = document.createElement('div');
        container.className = 'text-box-container';
        container.style.position = 'relative';
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.margin = '10px 0';
        container.style.zIndex = '20';

        // Create text box element
        const textBox = document.createElement('div');
        textBox.className = 'text-box';
        textBox.contentEditable = 'true';
        textBox.innerHTML = '<p>Click to edit this text box</p>';
        textBox.id = 'textbox-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

        // Insert the text box
        document.execCommand('insertHTML', false, container.outerHTML);

        // Find the inserted container and add the text box to it
        setTimeout(() => {
            const insertedContainer = currentEditor.querySelector('.text-box-container:last-of-type');
            if (insertedContainer) {
                insertedContainer.appendChild(textBox);

                // Make the text box draggable
                makeTextBoxDraggable(textBox);

                // Focus the text box
                textBox.focus();
            }
        }, 10);
    }

    // Make text box draggable
    function makeTextBoxDraggable(textBox) {
        let isDragging = false;

        textBox.addEventListener('mousedown', function(e) {
            // Only start drag if we're on the text box itself, not its content
            if (e.target === textBox) {
                e.preventDefault();
                isDragging = true;

                // Add selected class
                textBox.classList.add('selected');

                // Set cursor to move
                textBox.style.cursor = 'move';

                // Get initial positions
                const startX = e.clientX;
                const startY = e.clientY;
                const startLeft = parseInt(textBox.style.left) || 0;
                const startTop = parseInt(textBox.style.top) || 0;

                // Function to handle drag
                function handleDrag(e) {
                    if (!isDragging) return;

                    const newLeft = startLeft + (e.clientX - startX);
                    const newTop = startTop + (e.clientY - startY);

                    // Move the text box
                    textBox.style.position = 'relative';
                    textBox.style.left = `${newLeft}px`;
                    textBox.style.top = `${newTop}px`;

                    // Prevent text selection during drag
                    e.preventDefault();
                }

                // Function to stop dragging
                function stopDrag() {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleDrag);
                    document.removeEventListener('mouseup', stopDrag);

                    // Reset cursor
                    textBox.style.cursor = '';
                }

                // Add event listeners for drag
                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', stopDrag);
            }
        });

        // Handle click to select
        textBox.addEventListener('click', function(e) {
            // Don't handle click if we're dragging
            if (isDragging) return;

            // Deselect all text boxes
            document.querySelectorAll('.text-box').forEach(box => {
                box.classList.remove('selected');
            });

            // Select this text box
            textBox.classList.add('selected');
        });

        // Prevent text selection when starting drag
        textBox.addEventListener('selectstart', function(e) {
            if (e.target === textBox) {
                e.preventDefault();
            }
        });
    }

    // Open table modal
    function openTableModal() {
        // Reset selection
        selectedRows = 0;
        selectedCols = 0;
        clearHighlight();

        // Show modal
        document.getElementById('tableModal').style.display = 'block';
    }

    // Open hyperlink modal
    function openHyperlinkModal() {
        // Store the current selection for later use
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            window.lastRange = selection.getRangeAt(0);
        }

        // Get selected text to pre-fill the link text field
        let selectedText = '';
        if (window.lastRange) {
            selectedText = window.lastRange.toString();
        }

        // Pre-fill the link text field with selected text
        document.getElementById('hyperlinkText').value = selectedText;
        document.getElementById('hyperlinkUrl').value = 'https://';
        document.getElementById('hyperlinkTarget').value = '_blank';

        // Show modal
        hyperlinkModal.style.display = 'block';
    }

    // Insert hyperlink from modal
    function insertHyperlinkFromModal() {
        const url = document.getElementById('hyperlinkUrl').value.trim();
        const text = document.getElementById('hyperlinkText').value.trim();
        const target = document.getElementById('hyperlinkTarget').value;

        if (url && text) {
            // Make sure we have an editor selected
            if (!currentEditor) {
                currentEditor = mainEditor;
            }

            // Focus the current editor to ensure insertion works
            currentEditor.focus();

            // Restore the selection if we have one
            if (window.lastRange) {
                try {
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(window.lastRange.cloneRange());

                    // Create the hyperlink HTML
                    const linkHtml = `<a href="${url}" target="${target}" rel="noopener noreferrer">${text}</a>`;

                    // Insert the hyperlink
                    document.execCommand('insertHTML', false, linkHtml);
                } catch (e) {
                    console.error("Error inserting hyperlink:", e);

                    // Fallback to just inserting at cursor position
                    const linkHtml = `<a href="${url}" target="${target}" rel="noopener noreferrer">${text}</a>`;
                    document.execCommand('insertHTML', false, linkHtml);
                }
            } else {
                // If no stored range, just insert at cursor position
                const linkHtml = `<a href="${url}" target="${target}" rel="noopener noreferrer">${text}</a>`;
                document.execCommand('insertHTML', false, linkHtml);
            }

            // Close modal
            hyperlinkModal.style.display = 'none';
        } else {
            alert('Please enter both URL and link text');
        }
    }

    // Insert table
    function insertTable() {
        if (selectedRows > 0 && selectedCols > 0) {
            // Make sure we have an editor selected
            if (!currentEditor) {
                currentEditor = mainEditor;
            }

            // Focus the current editor to ensure insertion works
            currentEditor.focus();

            // Get table options
            const borderStyle = document.getElementById('tableBorderStyle').value;
            const borderWidth = document.getElementById('tableBorderWidth').value;
            const headerStyle = document.getElementById('tableHeaderStyle').value;

            // Determine CSS classes based on options
            let tableClasses = [];

            // Border style
            switch(borderStyle) {
                case 'full':
                    tableClasses.push('full-borders');
                    break;
                case 'none':
                    tableClasses.push('no-borders');
                    break;
                case 'outer':
                    tableClasses.push('outer-border');
                    break;
                case 'header':
                    tableClasses.push('header-border');
                    break;
            }

            // Border width
            switch(borderWidth) {
                case '1px':
                    tableClasses.push('border-thin');
                    break;
                case '2px':
                    tableClasses.push('border-medium');
                    break;
                case '3px':
                    tableClasses.push('border-thick');
                    break;
            }

            // Header style
            switch(headerStyle) {
                case 'default':
                    tableClasses.push('header-default');
                    break;
                case 'bold':
                    tableClasses.push('header-bold');
                    break;
                case 'none':
                    tableClasses.push('header-none');
                    break;
            }

            // Create table HTML with classes
            let tableHTML = '<table class="' + tableClasses.join(' ') + '"><tbody>';

            // Add header row
            tableHTML += '<tr>';
            for (let col = 0; col < selectedCols; col++) {
                tableHTML += '<th>Header ' + (col + 1) + '</th>';
            }
            tableHTML += '</tr>';

            // Add data rows
            for (let row = 1; row < selectedRows; row++) {
                tableHTML += '<tr>';
                for (let col = 0; col < selectedCols; col++) {
                    tableHTML += '<td>Cell ' + (row + 1) + '-' + (col + 1) + '</td>';
                }
                tableHTML += '</tr>';
            }

            tableHTML += '</tbody></table>';

            // Insert the table
            document.execCommand('insertHTML', false, tableHTML);

            // Close modal
            document.getElementById('tableModal').style.display = 'none';
        } else {
            alert('Please select table dimensions');
        }
    }

    // Change layout based on selection
    function changeLayout(layout) {
        // Clear all content when changing layouts
        clearContentForLayoutChange();

        // Hide all edit buttons first
        editHeaderBtn.style.display = 'none';
        editFooterBtn.style.display = 'none';
        editReportHeaderBtn.style.display = 'none';
        editPageHeaderBtn.style.display = 'none';

        // Hide all sections - both by removing active class and setting display to none
        headerSection.classList.remove('active');
        footerSection.classList.remove('active');
        reportHeaderSection.classList.remove('active');
        pageHeaderSection.classList.remove('active');

        headerSection.style.display = 'none';
        footerSection.style.display = 'none';
        reportHeaderSection.style.display = 'none';
        pageHeaderSection.style.display = 'none';

        // Remove any special classes
        reportHeaderSection.classList.remove('full-page', 'split-page');
        pageHeaderSection.classList.remove('full-page', 'split-page');

        // Set placeholders for all editors
        headerEditor.setAttribute('data-placeholder', 'Click to edit Header');
        footerEditor.setAttribute('data-placeholder', 'Click to edit Footer');
        reportHeaderEditor.setAttribute('data-placeholder', 'Click to edit Report Header');
        pageHeaderEditor.setAttribute('data-placeholder', 'Click to edit Page Header');

        // Show appropriate buttons and set up sections based on layout
        switch (layout) {
            case 'none':
                // No headers or footers - clean page
                // Hide all sections
                headerSection.style.display = 'none';
                footerSection.style.display = 'none';
                reportHeaderSection.style.display = 'none';
                pageHeaderSection.style.display = 'none';

                // Hide all edit buttons
                editHeaderBtn.style.display = 'none';
                editFooterBtn.style.display = 'none';
                editReportHeaderBtn.style.display = 'none';
                editPageHeaderBtn.style.display = 'none';

                // Set main editor as current
                currentEditor = mainEditor;
                break;

            case 'header-footer':
                // Standard header & footer layout
                editHeaderBtn.style.display = 'inline-block';
                editFooterBtn.style.display = 'inline-block';
                // Make sections visible for resize handles
                headerSection.style.display = 'block';
                footerSection.style.display = 'block';
                // Hide report and page header sections completely
                reportHeaderSection.style.display = 'none';
                pageHeaderSection.style.display = 'none';
                break;

            case 'header-only':
                // Header only layout
                editHeaderBtn.style.display = 'inline-block';
                // Make header visible for resize handles
                headerSection.style.display = 'block';
                // Hide footer, report and page header sections completely
                footerSection.style.display = 'none';
                reportHeaderSection.style.display = 'none';
                pageHeaderSection.style.display = 'none';
                break;

            case 'footer-only':
                // Footer only layout
                editFooterBtn.style.display = 'inline-block';
                // Make footer visible for resize handles
                footerSection.style.display = 'block';
                // Hide header, report and page header sections completely
                headerSection.style.display = 'none';
                reportHeaderSection.style.display = 'none';
                pageHeaderSection.style.display = 'none';
                break;

            case 'report-header':
                // Full page report header
                editReportHeaderBtn.style.display = 'inline-block';
                reportHeaderSection.classList.add('full-page');
                // Make report header visible for resize handles
                reportHeaderSection.style.display = 'block';
                // Hide page header section completely
                pageHeaderSection.style.display = 'none';
                break;

            case 'page-header':
                // Full page page header
                editPageHeaderBtn.style.display = 'inline-block';
                pageHeaderSection.classList.add('full-page');
                // Make page header visible for resize handles
                pageHeaderSection.style.display = 'block';
                // Hide report header section completely
                reportHeaderSection.style.display = 'none';
                break;

            case 'report-page-header':
                // Split page with report header and page header
                editReportHeaderBtn.style.display = 'inline-block';
                editPageHeaderBtn.style.display = 'inline-block';
                reportHeaderSection.classList.add('split-page');
                pageHeaderSection.classList.add('split-page');
                // Make both sections visible for resize handles
                reportHeaderSection.style.display = 'block';
                pageHeaderSection.style.display = 'block';
                break;
        }

        // Apply layout settings to ensure proper heights
        applyLayoutCSSSettings();

        // Re-initialize resize handles to ensure they work with the new layout
        setTimeout(initResizeHandles, 100);

        // Focus on main editor
        currentEditor = mainEditor;
        mainEditor.focus();
    }

    // Open preview modal
    function openPreviewModal() {
        // Update the preview modal content to include last page layouts
        updatePreviewModalContent();

        // Get URL parameters to determine document type
        const params = getUrlParameters();
        const docType = params.docType || 'report';

        // Get current layouts
        const firstPageLayout = document.getElementById('layoutSelector').value;
        const lastPageLayout = document.getElementById('lastPageLayoutSelector').value;

        // Hide all first page layouts
        document.getElementById('standardLayout').style.display = 'none';
        document.getElementById('reportHeaderLayout').style.display = 'none';
        document.getElementById('pageHeaderLayout').style.display = 'none';
        document.getElementById('reportPageHeaderLayout').style.display = 'none';

        // Clear any existing content in preview elements to avoid duplication
        const previewElements = [
            'previewHeader', 'previewFooter', 'previewMainContent',
            'previewReportHeader', 'previewPageHeader',
            'previewReportHeaderSplit', 'previewPageHeaderSplit'
        ];

        previewElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = '';
            }
        });

        // Hide all last page layouts
        document.getElementById('lastPageStandardLayout').style.display = 'none';
        document.getElementById('reportFooterLayout').style.display = 'none';
        document.getElementById('pageFooterLayout').style.display = 'none';
        document.getElementById('reportPageFooterLayout').style.display = 'none';

        // Clear any existing content in the last page standard layout
        const lastPageStandardLayout = document.getElementById('lastPageStandardLayout');
        if (lastPageStandardLayout) {
            // Keep only the original elements
            const placeholder = lastPageStandardLayout.querySelector('.page-content-placeholder');
            if (placeholder) {
                lastPageStandardLayout.innerHTML = '';
                lastPageStandardLayout.appendChild(placeholder);
            }
        }

        // Handle different document types
        if (docType === 'page') {
            // For Page document type, show only selected sections
            document.getElementById('standardLayout').style.display = 'block';
            // Copy content and apply proper styling
            const mainContent = document.getElementById('mainEditor').innerHTML;
            const previewMainContent = document.getElementById('previewMainContent');
            previewMainContent.innerHTML = mainContent;
            previewMainContent.style.padding = '15mm';
            previewMainContent.style.position = 'relative';
            previewMainContent.style.boxSizing = 'border-box';

            // Hide header and footer by default
            document.getElementById('previewHeader').style.display = 'none';
            document.getElementById('previewFooter').style.display = 'none';

            // Show header if selected
            if (params.header === 'true') {
                document.getElementById('previewHeader').innerHTML = document.getElementById('headerEditor').innerHTML;
                document.getElementById('previewHeader').style.display = 'block';
                document.getElementById('previewHeader').style.visibility = 'visible';
            }

            // Show footer if selected
            if (params.footer === 'true') {
                document.getElementById('previewFooter').innerHTML = document.getElementById('footerEditor').innerHTML;
                document.getElementById('previewFooter').style.display = 'block';
                document.getElementById('previewFooter').style.visibility = 'visible';
            }

            // Hide last page for Page document type
            const lastPagePreview = document.getElementById('lastPagePreview');
            if (lastPagePreview) {
                lastPagePreview.style.display = 'none';
            }

            // Hide page separator
            const pageSeparator = document.querySelector('.page-separator');
            if (pageSeparator) {
                pageSeparator.style.display = 'none';
            }
        } else {
            // For Report document type, use the layout-based approach
            // Show appropriate first page layout based on selection
            switch (firstPageLayout) {
            case 'none':
                // No headers or footers - clean page
                document.getElementById('standardLayout').style.display = 'block';
                // Copy content and apply proper styling
                const mainContent = document.getElementById('mainEditor').innerHTML;
                const previewMainContent = document.getElementById('previewMainContent');
                previewMainContent.innerHTML = mainContent;
                previewMainContent.style.padding = '15mm';
                previewMainContent.style.position = 'relative';
                previewMainContent.style.boxSizing = 'border-box';

                // Hide header and footer
                document.getElementById('previewHeader').style.display = 'none';
                document.getElementById('previewFooter').style.display = 'none';
                break;

            case 'header-footer':
                // Standard header & footer layout
                document.getElementById('standardLayout').style.display = 'block';
                document.getElementById('previewHeader').innerHTML = document.getElementById('headerEditor').innerHTML;
                document.getElementById('previewFooter').innerHTML = document.getElementById('footerEditor').innerHTML;

                // Copy content and apply proper styling
                const mainContent2 = document.getElementById('mainEditor').innerHTML;
                const previewMainContent2 = document.getElementById('previewMainContent');
                previewMainContent2.innerHTML = mainContent2;
                previewMainContent2.style.padding = '15mm';
                previewMainContent2.style.position = 'relative';
                previewMainContent2.style.boxSizing = 'border-box';

                // Make sure the header and footer are visible
                document.getElementById('previewHeader').style.visibility = 'visible';
                document.getElementById('previewHeader').style.display = 'block';
                document.getElementById('previewFooter').style.visibility = 'visible';
                document.getElementById('previewFooter').style.display = 'block';
                break;

            case 'header-only':
                // Header only layout
                document.getElementById('standardLayout').style.display = 'block';
                document.getElementById('previewHeader').innerHTML = document.getElementById('headerEditor').innerHTML;

                // Copy content and apply proper styling
                const mainContent3 = document.getElementById('mainEditor').innerHTML;
                const previewMainContent3 = document.getElementById('previewMainContent');
                previewMainContent3.innerHTML = mainContent3;
                previewMainContent3.style.padding = '15mm';
                previewMainContent3.style.position = 'relative';
                previewMainContent3.style.boxSizing = 'border-box';

                // Make sure the header is visible and footer is hidden
                document.getElementById('previewHeader').style.visibility = 'visible';
                document.getElementById('previewHeader').style.display = 'block';
                document.getElementById('previewFooter').style.visibility = 'hidden';
                document.getElementById('previewFooter').style.display = 'none';
                break;

            case 'footer-only':
                // Footer only layout
                document.getElementById('standardLayout').style.display = 'block';

                // Get footer content
                const footerContent = document.getElementById('footerEditor').innerHTML;
                const previewFooter = document.getElementById('previewFooter');

                // Apply footer content and styling
                previewFooter.innerHTML = footerContent;
                previewFooter.style.position = 'absolute';
                previewFooter.style.bottom = '15mm';
                previewFooter.style.left = '0';
                previewFooter.style.right = '0';
                previewFooter.style.width = '100%';
                previewFooter.style.minHeight = '20mm';
                previewFooter.style.borderTop = '1px dashed #ccc';
                previewFooter.style.padding = '20px 10px 10px 10px';
                previewFooter.style.backgroundColor = 'white';
                previewFooter.style.boxSizing = 'border-box';

                // Copy content and apply proper styling
                const mainContent4 = document.getElementById('mainEditor').innerHTML;
                const previewMainContent4 = document.getElementById('previewMainContent');
                previewMainContent4.innerHTML = mainContent4;
                previewMainContent4.style.padding = '15mm';
                previewMainContent4.style.position = 'relative';
                previewMainContent4.style.boxSizing = 'border-box';

                // Make sure the footer is visible and header is hidden
                document.getElementById('previewHeader').style.visibility = 'hidden';
                document.getElementById('previewHeader').style.display = 'none';
                previewFooter.style.visibility = 'visible';
                previewFooter.style.display = 'block';
                break;

            case 'report-header':
                // Full page report header
                document.getElementById('reportHeaderLayout').style.display = 'block';

                // Get the content from the report header editor
                const reportHeaderContent = document.getElementById('reportHeaderEditor').innerHTML;

                // Set the content in the preview
                const previewReportHeader = document.getElementById('previewReportHeader');
                if (previewReportHeader) {
                    previewReportHeader.innerHTML = reportHeaderContent;

                    // Make sure it's visible and properly positioned
                    previewReportHeader.style.display = 'block';
                    previewReportHeader.style.visibility = 'visible';
                    previewReportHeader.style.position = 'relative';
                    previewReportHeader.style.top = '0';
                    previewReportHeader.style.bottom = 'auto';
                    previewReportHeader.style.height = '100%';
                }
                break;

            case 'page-header':
                // Full page page header
                document.getElementById('pageHeaderLayout').style.display = 'block';

                // Get the content from the page header editor
                const pageHeaderContent = document.getElementById('pageHeaderEditor').innerHTML;

                // Set the content in the preview
                const previewPageHeader = document.getElementById('previewPageHeader');
                if (previewPageHeader) {
                    previewPageHeader.innerHTML = pageHeaderContent;

                    // Make sure it's visible and properly positioned
                    previewPageHeader.style.display = 'block';
                    previewPageHeader.style.visibility = 'visible';
                    previewPageHeader.style.position = 'relative';
                    previewPageHeader.style.top = '0';
                    previewPageHeader.style.bottom = 'auto';
                    previewPageHeader.style.height = '100%';
                }
                break;

            case 'report-page-header':
                // Split page with report header and page header
                document.getElementById('reportPageHeaderLayout').style.display = 'block';

                // Get content from both editors
                const reportHeaderSplitContent = document.getElementById('reportHeaderEditor').innerHTML;
                const pageHeaderSplitContent = document.getElementById('pageHeaderEditor').innerHTML;

                // Set content in the preview elements
                const previewReportHeaderSplit = document.getElementById('previewReportHeaderSplit');
                const previewPageHeaderSplit = document.getElementById('previewPageHeaderSplit');

                if (previewReportHeaderSplit) {
                    // Fix: Ensure we're using the report header content for the report header section
                    previewReportHeaderSplit.innerHTML = reportHeaderSplitContent;
                    previewReportHeaderSplit.style.display = 'block';
                    previewReportHeaderSplit.style.visibility = 'visible';

                    // Ensure proper positioning of the report header at the top
                    previewReportHeaderSplit.style.position = 'absolute';
                    previewReportHeaderSplit.style.top = '0';
                    previewReportHeaderSplit.style.bottom = 'auto';
                    previewReportHeaderSplit.style.left = '0';
                    previewReportHeaderSplit.style.right = '0';
                    previewReportHeaderSplit.style.width = '100%';
                    previewReportHeaderSplit.style.height = '148.5mm';
                    previewReportHeaderSplit.style.borderBottom = '2px solid #999';
                    previewReportHeaderSplit.style.padding = '10px';
                    previewReportHeaderSplit.style.backgroundColor = 'white';
                    previewReportHeaderSplit.style.boxSizing = 'border-box';
                    previewReportHeaderSplit.style.overflow = 'auto';
                }

                if (previewPageHeaderSplit) {
                    // Fix: Ensure we're using the page header content for the page header section
                    previewPageHeaderSplit.innerHTML = pageHeaderSplitContent;
                    previewPageHeaderSplit.style.display = 'block';
                    previewPageHeaderSplit.style.visibility = 'visible';

                    // Ensure proper positioning of the page header at the bottom
                    previewPageHeaderSplit.style.position = 'absolute';
                    previewPageHeaderSplit.style.top = 'auto';
                    previewPageHeaderSplit.style.bottom = '0';
                    previewPageHeaderSplit.style.left = '0';
                    previewPageHeaderSplit.style.right = '0';
                    previewPageHeaderSplit.style.width = '100%';
                    previewPageHeaderSplit.style.height = '148.5mm';
                    previewPageHeaderSplit.style.borderTop = '2px solid #999';
                    previewPageHeaderSplit.style.padding = '10px';
                    previewPageHeaderSplit.style.backgroundColor = 'white';
                    previewPageHeaderSplit.style.boxSizing = 'border-box';
                    previewPageHeaderSplit.style.overflow = 'auto';
                }
                break;
        }

        // Show appropriate last page layout based on selection
        switch (lastPageLayout) {
            case 'none':
                // No special sections
                document.getElementById('lastPageStandardLayout').style.display = 'block';
                // Add last page main content
                const lastPageContent = document.createElement('div');
                lastPageContent.id = 'previewLastPageContent';
                lastPageContent.innerHTML = document.getElementById('lastPageMainEditor').innerHTML;
                lastPageContent.style.margin = '0';
                lastPageContent.style.padding = '15mm';
                lastPageContent.style.visibility = 'visible';
                lastPageContent.style.display = 'block';
                lastPageContent.style.position = 'relative';
                lastPageContent.style.boxSizing = 'border-box';
                document.getElementById('lastPageStandardLayout').appendChild(lastPageContent);
                break;

            case 'footer-only':
                // Footer only layout for last page
                document.getElementById('lastPageStandardLayout').style.display = 'block';

                // Create a footer element for the last page
                if (!document.getElementById('lastPageFooter')) {
                    const lastPageFooter = document.createElement('div');
                    lastPageFooter.id = 'lastPageFooter';
                    lastPageFooter.className = 'page-footer';
                    lastPageFooter.style.position = 'absolute';
                    lastPageFooter.style.bottom = '15mm';
                    lastPageFooter.style.left = '0';
                    lastPageFooter.style.right = '0';
                    lastPageFooter.style.minHeight = '20mm';
                    lastPageFooter.style.padding = '20px 10px 10px 10px';
                    lastPageFooter.style.backgroundColor = 'white';
                    lastPageFooter.style.borderTop = '1px dashed #ccc';

                    document.getElementById('lastPageStandardLayout').appendChild(lastPageFooter);
                }

                // Add content to the footer
                const lastPageFooter = document.getElementById('lastPageFooter');
                lastPageFooter.innerHTML = document.getElementById('footerEditor').innerHTML;
                lastPageFooter.style.visibility = 'visible';
                lastPageFooter.style.display = 'block';

                // Add main content
                const lastPageMainContent = document.createElement('div');
                lastPageMainContent.id = 'previewLastPageContent';
                lastPageMainContent.innerHTML = document.getElementById('lastPageMainEditor').innerHTML;
                lastPageMainContent.style.margin = '0';
                lastPageMainContent.style.padding = '15mm';
                lastPageMainContent.style.visibility = 'visible';
                lastPageMainContent.style.display = 'block';
                lastPageMainContent.style.position = 'relative';
                lastPageMainContent.style.boxSizing = 'border-box';
                document.getElementById('lastPageStandardLayout').appendChild(lastPageMainContent);
                break;

            case 'report-footer':
                // Full page report footer
                document.getElementById('reportFooterLayout').style.display = 'block';

                // Get report footer content
                const reportFooterContent = document.getElementById('reportFooterEditor').innerHTML;
                const previewReportFooter = document.getElementById('previewReportFooter');

                // Apply report footer content and styling
                previewReportFooter.innerHTML = reportFooterContent;
                previewReportFooter.style.position = 'absolute';
                previewReportFooter.style.top = 'auto';
                previewReportFooter.style.bottom = '0';
                previewReportFooter.style.left = '0';
                previewReportFooter.style.right = '0';
                previewReportFooter.style.width = '100%';
                previewReportFooter.style.minHeight = '20mm';
                previewReportFooter.style.borderTop = '1px dashed #ccc';
                previewReportFooter.style.padding = '20px 10px 10px 10px';
                previewReportFooter.style.backgroundColor = 'white';
                previewReportFooter.style.boxSizing = 'border-box';
                previewReportFooter.style.visibility = 'visible';
                previewReportFooter.style.display = 'block';
                break;

            case 'page-footer':
                // Full page page footer
                document.getElementById('pageFooterLayout').style.display = 'block';

                // Get page footer content
                const pageFooterContent = document.getElementById('pageFooterEditor').innerHTML;
                const previewPageFooter = document.getElementById('previewPageFooter');

                // Apply page footer content and styling
                previewPageFooter.innerHTML = pageFooterContent;
                previewPageFooter.style.position = 'absolute';
                previewPageFooter.style.top = 'auto';
                previewPageFooter.style.bottom = '0';
                previewPageFooter.style.left = '0';
                previewPageFooter.style.right = '0';
                previewPageFooter.style.width = '100%';
                previewPageFooter.style.minHeight = '20mm';
                previewPageFooter.style.borderTop = '1px dashed #ccc';
                previewPageFooter.style.padding = '20px 10px 10px 10px';
                previewPageFooter.style.backgroundColor = 'white';
                previewPageFooter.style.boxSizing = 'border-box';
                previewPageFooter.style.visibility = 'visible';
                previewPageFooter.style.display = 'block';
                break;

            case 'report-page-footer':
                // Split page with report footer and page footer
                document.getElementById('reportPageFooterLayout').style.display = 'block';

                // Get content for both footers
                const reportFooterSplitContent = document.getElementById('reportFooterEditor').innerHTML;
                const pageFooterSplitContent = document.getElementById('pageFooterEditor').innerHTML;

                // Get elements
                const previewReportFooterSplit = document.getElementById('previewReportFooterSplit');
                const previewPageFooterSplit = document.getElementById('previewPageFooterSplit');

                // Apply content
                previewReportFooterSplit.innerHTML = reportFooterSplitContent;
                previewPageFooterSplit.innerHTML = pageFooterSplitContent;

                // Style report footer split (bottom half)
                previewReportFooterSplit.style.position = 'absolute';
                previewReportFooterSplit.style.bottom = '0';
                previewReportFooterSplit.style.top = 'auto';
                previewReportFooterSplit.style.left = '0';
                previewReportFooterSplit.style.right = '0';
                previewReportFooterSplit.style.width = '100%';
                previewReportFooterSplit.style.height = '148.5mm';
                previewReportFooterSplit.style.borderTop = '2px solid #999';
                previewReportFooterSplit.style.padding = '10px';
                previewReportFooterSplit.style.backgroundColor = 'white';
                previewReportFooterSplit.style.boxSizing = 'border-box';
                previewReportFooterSplit.style.overflow = 'auto';

                // Style page footer split (top half)
                previewPageFooterSplit.style.position = 'absolute';
                previewPageFooterSplit.style.top = '0';
                previewPageFooterSplit.style.bottom = 'auto';
                previewPageFooterSplit.style.left = '0';
                previewPageFooterSplit.style.right = '0';
                previewPageFooterSplit.style.width = '100%';
                previewPageFooterSplit.style.height = '148.5mm';
                previewPageFooterSplit.style.borderBottom = '2px solid #999';
                previewPageFooterSplit.style.padding = '10px';
                previewPageFooterSplit.style.backgroundColor = 'white';
                previewPageFooterSplit.style.boxSizing = 'border-box';
                previewPageFooterSplit.style.overflow = 'auto';

                // Make both visible
                previewReportFooterSplit.style.visibility = 'visible';
                previewReportFooterSplit.style.display = 'block';
                previewPageFooterSplit.style.visibility = 'visible';
                previewPageFooterSplit.style.display = 'block';
                break;
            }
        }

        // Show the modal
        const previewModal = document.getElementById('previewModal');
        previewModal.style.display = 'block';
        previewModal.classList.add('show');
    }

    // Function to update editor content in preview elements
    function updateEditorContentInPreview() {
        // Get the current content from the editors
        const reportHeaderContent = document.getElementById('reportHeaderEditor').innerHTML;
        const pageHeaderContent = document.getElementById('pageHeaderEditor').innerHTML;
        const reportFooterContent = document.getElementById('reportFooterEditor').innerHTML;
        const pageFooterContent = document.getElementById('pageFooterEditor').innerHTML;
        const headerContent = document.getElementById('headerEditor').innerHTML;
        const footerContent = document.getElementById('footerEditor').innerHTML;
        const mainContent = document.getElementById('mainEditor').innerHTML;

        // Clear any existing content in preview elements to avoid duplication
        const previewElements = [
            'previewHeader', 'previewFooter', 'previewMainContent',
            'previewReportHeader', 'previewPageHeader',
            'previewReportHeaderSplit', 'previewPageHeaderSplit',
            'previewReportFooter', 'previewPageFooter',
            'previewReportFooterSplit', 'previewPageFooterSplit'
        ];

        previewElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = '';
            }
        });

        // Update the preview elements with current content
        const elements = {
            // Standard header/footer elements
            'previewHeader': headerContent,
            'previewFooter': footerContent,
            'previewMainContent': mainContent,

            // Full page header elements
            'previewReportHeader': reportHeaderContent,
            'previewPageHeader': pageHeaderContent,

            // Split page header elements - these are used in the "Report & Page Header" layout
            'previewReportHeaderSplit': reportHeaderContent, // Report header content for the split view
            'previewPageHeaderSplit': pageHeaderContent,     // Page header content for the split view

            // Footer elements
            'previewReportFooter': reportFooterContent,
            'previewPageFooter': pageFooterContent,
            'previewReportFooterSplit': reportFooterContent,
            'previewPageFooterSplit': pageFooterContent
        };

        // Set content for each element
        Object.entries(elements).forEach(([elementId, content]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = content;
                element.style.display = 'block';
                element.style.visibility = 'visible';

                // Apply proper styling to main content
                if (elementId === 'previewMainContent') {
                    element.style.padding = '15mm';
                    element.style.position = 'relative';
                    element.style.boxSizing = 'border-box';
                }
            }
        });
    }

    // Update preview modal content to include last page layouts
    function updatePreviewModalContent() {
        // Get the preview container
        const previewContainer = document.querySelector('.preview-container');

        // Update the content from the editors to the preview elements
        updateEditorContentInPreview();

        // Check if last page preview already exists
        if (!document.getElementById('lastPagePreview')) {
            // Create last page preview elements
            const lastPagePreview = document.createElement('div');
            lastPagePreview.id = 'lastPagePreview';
            lastPagePreview.className = 'a4-page';
            lastPagePreview.innerHTML = `
                <!-- Standard Layout (No special sections) -->
                <div id="lastPageStandardLayout">
                    <div class="page-content-placeholder">
                        <!-- Content will be added dynamically -->
                    </div>
                </div>

                <!-- Report Footer Layout -->
                <div id="reportFooterLayout" style="display: none; position: relative; height: 100%;">
                    <div class="page-report-header" id="previewReportFooter" style="position: absolute; bottom: 0; top: auto;"></div>
                </div>

                <!-- Page Footer Layout -->
                <div id="pageFooterLayout" style="display: none; position: relative; height: 100%;">
                    <div class="page-page-header" id="previewPageFooter" style="position: absolute; bottom: 0; top: auto;"></div>
                </div>

                <!-- Report Footer & Page Footer Layout -->
                <div id="reportPageFooterLayout" style="display: none; position: relative; height: 100%;">
                    <div class="page-page-header-split" id="previewPageFooterSplit" style="position: absolute; top: 0; height: 148.5mm;"></div>
                    <div class="page-report-header-split" id="previewReportFooterSplit" style="position: absolute; bottom: 0; height: 148.5mm;"></div>
                </div>
            `;

            // Add a page separator with label
            const pageSeparator = document.createElement('div');
            pageSeparator.className = 'page-separator';
            pageSeparator.style.width = '100%';
            pageSeparator.style.textAlign = 'center';
            pageSeparator.style.margin = '0';
            pageSeparator.style.borderTop = '1px solid #000000';
            pageSeparator.style.padding = '5px 0';
            pageSeparator.innerHTML = '<h3>Last Page</h3>';

            // Add the elements to the preview container
            previewContainer.appendChild(pageSeparator);
            previewContainer.appendChild(lastPagePreview);
        }

        // Make sure the last page content is visible
        const lastPagePreview = document.getElementById('lastPagePreview');
        if (lastPagePreview) {
            lastPagePreview.style.display = 'block';
            lastPagePreview.style.visibility = 'visible';

            // Make sure all layouts are properly initialized
            const layouts = [
                'lastPageStandardLayout',
                'reportFooterLayout',
                'pageFooterLayout',
                'reportPageFooterLayout'
            ];

            layouts.forEach(layoutId => {
                const layout = document.getElementById(layoutId);
                if (layout) {
                    // Initially hide all layouts
                    layout.style.display = 'none';
                }
            });

            // Make sure all content elements are properly initialized
            const contentElements = [
                'previewReportFooter',
                'previewPageFooter',
                'previewReportFooterSplit',
                'previewPageFooterSplit'
            ];

            contentElements.forEach(elementId => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.style.visibility = 'visible';
                    element.style.display = 'block';
                }
            });
        }
    }

    // Print preview
    function printPreview() {
        // Make sure the last page is visible before printing
        const lastPagePreview = document.getElementById('lastPagePreview');
        if (lastPagePreview) {
            lastPagePreview.style.display = 'block';
        }

        // Make sure all content is visible
        const previewHeader = document.getElementById('previewHeader');
        const previewFooter = document.getElementById('previewFooter');
        const previewMainContent = document.getElementById('previewMainContent');
        const previewReportFooter = document.getElementById('previewReportFooter');
        const previewPageFooter = document.getElementById('previewPageFooter');
        const previewReportFooterSplit = document.getElementById('previewReportFooterSplit');
        const previewPageFooterSplit = document.getElementById('previewPageFooterSplit');

        // Style header if present
        if (previewHeader) {
            previewHeader.style.visibility = 'visible';
            previewHeader.style.display = 'block';
        }

        // Style standard footer if present
        if (previewFooter) {
            previewFooter.style.visibility = 'visible';
            previewFooter.style.display = 'block';
            previewFooter.style.position = 'absolute';
            previewFooter.style.bottom = '15mm';
            previewFooter.style.left = '0';
            previewFooter.style.right = '0';
            previewFooter.style.width = '100%';
            previewFooter.style.minHeight = '20mm';
            previewFooter.style.borderTop = '1px dashed #ccc';
            previewFooter.style.padding = '20px 10px 10px 10px';
            previewFooter.style.backgroundColor = 'white';
            previewFooter.style.boxSizing = 'border-box';
        }

        // Style main content
        if (previewMainContent) {
            previewMainContent.style.visibility = 'visible';
            previewMainContent.style.display = 'block';
            previewMainContent.style.padding = '15mm';
            previewMainContent.style.position = 'relative';
            previewMainContent.style.boxSizing = 'border-box';
        }

        // Style report footer if present
        if (previewReportFooter) {
            previewReportFooter.style.visibility = 'visible';
            previewReportFooter.style.display = 'block';
            previewReportFooter.style.position = 'absolute';
            previewReportFooter.style.top = 'auto';
            previewReportFooter.style.bottom = '0';
            previewReportFooter.style.left = '0';
            previewReportFooter.style.right = '0';
            previewReportFooter.style.width = '100%';
            previewReportFooter.style.minHeight = '20mm';
            previewReportFooter.style.borderTop = '1px dashed #ccc';
            previewReportFooter.style.padding = '20px 10px 10px 10px';
            previewReportFooter.style.backgroundColor = 'white';
            previewReportFooter.style.boxSizing = 'border-box';
        }

        // Style page footer if present
        if (previewPageFooter) {
            previewPageFooter.style.visibility = 'visible';
            previewPageFooter.style.display = 'block';
            previewPageFooter.style.position = 'absolute';
            previewPageFooter.style.top = 'auto';
            previewPageFooter.style.bottom = '0';
            previewPageFooter.style.left = '0';
            previewPageFooter.style.right = '0';
            previewPageFooter.style.width = '100%';
            previewPageFooter.style.minHeight = '20mm';
            previewPageFooter.style.borderTop = '1px dashed #ccc';
            previewPageFooter.style.padding = '20px 10px 10px 10px';
            previewPageFooter.style.backgroundColor = 'white';
            previewPageFooter.style.boxSizing = 'border-box';
        }

        // Style split footers if present
        if (previewReportFooterSplit) {
            previewReportFooterSplit.style.visibility = 'visible';
            previewReportFooterSplit.style.display = 'block';
            previewReportFooterSplit.style.position = 'absolute';
            previewReportFooterSplit.style.bottom = '0';
            previewReportFooterSplit.style.top = 'auto';
            previewReportFooterSplit.style.left = '0';
            previewReportFooterSplit.style.right = '0';
            previewReportFooterSplit.style.width = '100%';
            previewReportFooterSplit.style.height = '148.5mm';
            previewReportFooterSplit.style.borderTop = '2px solid #999';
            previewReportFooterSplit.style.padding = '10px';
            previewReportFooterSplit.style.backgroundColor = 'white';
            previewReportFooterSplit.style.boxSizing = 'border-box';
            previewReportFooterSplit.style.overflow = 'auto';
        }

        if (previewPageFooterSplit) {
            previewPageFooterSplit.style.visibility = 'visible';
            previewPageFooterSplit.style.display = 'block';
            previewPageFooterSplit.style.position = 'absolute';
            previewPageFooterSplit.style.top = '0';
            previewPageFooterSplit.style.bottom = 'auto';
            previewPageFooterSplit.style.left = '0';
            previewPageFooterSplit.style.right = '0';
            previewPageFooterSplit.style.width = '100%';
            previewPageFooterSplit.style.height = '148.5mm';
            previewPageFooterSplit.style.borderBottom = '2px solid #999';
            previewPageFooterSplit.style.padding = '10px';
            previewPageFooterSplit.style.backgroundColor = 'white';
            previewPageFooterSplit.style.boxSizing = 'border-box';
            previewPageFooterSplit.style.overflow = 'auto';
        }

        // Apply proper styling to all preview elements
        const previewElements = document.querySelectorAll('.preview-container *');
        previewElements.forEach(element => {
            element.style.visibility = 'visible';
        });

        // Force a longer delay to ensure everything is rendered properly
        setTimeout(() => {
            window.print();
        }, 500);
    }

    // Save document
    function saveDocument() {
        // First page content
        const headerContent = document.getElementById('headerEditor').innerHTML;
        const mainContent = document.getElementById('mainEditor').innerHTML;
        const footerContent = document.getElementById('footerEditor').innerHTML;
        const reportHeaderContent = document.getElementById('reportHeaderEditor').innerHTML;
        const pageHeaderContent = document.getElementById('pageHeaderEditor').innerHTML;

        // Last page content
        const lastPageMainContent = document.getElementById('lastPageMainEditor').innerHTML;
        const reportFooterContent = document.getElementById('reportFooterEditor').innerHTML;
        const pageFooterContent = document.getElementById('pageFooterEditor').innerHTML;

        // Save to localStorage for demo purposes
        // First page
        localStorage.setItem('headerContent', headerContent);
        localStorage.setItem('mainContent', mainContent);
        localStorage.setItem('footerContent', footerContent);
        localStorage.setItem('reportHeaderContent', reportHeaderContent);
        localStorage.setItem('pageHeaderContent', pageHeaderContent);

        // Last page
        localStorage.setItem('lastPageMainContent', lastPageMainContent);
        localStorage.setItem('reportFooterContent', reportFooterContent);
        localStorage.setItem('pageFooterContent', pageFooterContent);

        // Create and show a custom popup
        const popup = document.createElement('div');
        popup.className = 'save-popup';
        popup.innerHTML = `
            <div class="save-popup-content">
                <div class="save-popup-icon">
                    <i class="material-icons">check_circle</i>
                </div>
                <div class="save-popup-message">Saved successfully!</div>
            </div>
        `;

        // Add styles for the popup
        const style = document.createElement('style');
        style.textContent = `
            .save-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .save-popup-content {
                background-color: white;
                padding: 30px;
                border-radius: 5px;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .save-popup-icon {
                margin-bottom: 15px;
            }
            .save-popup-icon i {
                font-size: 48px;
                color: #4CAF50;
            }
            .save-popup-message {
                font-size: 20px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(popup);

        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'material-index.html';
        }, 1500);
    }

    // Clear all content with confirmation
    function clearAllContent() {
        // Ask for confirmation
        // if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
        //     // Clear all content
        //     clearContentForLayoutChange();

        //     // Reset to default layout
        //     document.getElementById('layoutSelector').value = 'header-footer';
        //     changeLayout('header-footer');

        //     alert('All content has been cleared.');
        // }
            clearContentForLayoutChange();

            // Reset to default layout
            document.getElementById('layoutSelector').value = 'header-footer';
            changeLayout('header-footer');
    }

    // Clear content when changing layouts (without confirmation)
    function clearContentForLayoutChange() {
        // Clear first page editors
        document.getElementById('headerEditor').innerHTML = '';
        document.getElementById('footerEditor').innerHTML = '';
        document.getElementById('reportHeaderEditor').innerHTML = '';
        document.getElementById('pageHeaderEditor').innerHTML = '';
        document.getElementById('mainEditor').innerHTML = '';

        // Clear localStorage for first page
        localStorage.removeItem('headerContent');
        localStorage.removeItem('mainContent');
        localStorage.removeItem('footerContent');
        localStorage.removeItem('reportHeaderContent');
        localStorage.removeItem('pageHeaderContent');

        // Also clear last page content
        clearLastPageContentForLayoutChange();
    }

    // Apply formatting based on selected format
    function applyFormatting(format, editor) {
        // Make sure we're working in the correct editor
        if (currentEditor !== editor) {
            editor.focus();
        }

        // Apply the appropriate formatting
        if (format.match(/^h[1-6]$/)) {
            // For headings
            document.execCommand('formatBlock', false, format);
        } else if (format === 'p') {
            // For paragraphs
            document.execCommand('formatBlock', false, 'p');
        } else if (format === 'pre') {
            // For preformatted text
            document.execCommand('formatBlock', false, 'pre');
        } else if (format === 'blockquote') {
            // For blockquotes
            document.execCommand('formatBlock', false, 'blockquote');
        }

        // Update button states
        updateButtonStates();
    }

    // Apply text color to selected text
    function applyTextColor(color) {
        // Make sure we have an editor selected
        if (!currentEditor) {
            currentEditor = mainEditor;
        }

        // Focus the current editor
        currentEditor.focus();

        // Check if we have a stored range
        if (window.lastRange) {
            try {
                // Create a new selection
                const selection = window.getSelection();
                selection.removeAllRanges();

                // Add the stored range
                selection.addRange(window.lastRange.cloneRange());

                // Apply the color
                document.execCommand('foreColor', false, color);
            } catch (e) {
                console.error("Error applying text color:", e);
                // Fallback to just applying at cursor position
                document.execCommand('foreColor', false, color);
            }
        } else {
            // If no stored range, just apply at cursor position
            document.execCommand('foreColor', false, color);
        }
    }

    // Apply background color to selected text
    function applyBackgroundColor(color) {
        // Make sure we have an editor selected
        if (!currentEditor) {
            currentEditor = mainEditor;
        }

        // Focus the current editor
        currentEditor.focus();

        // Check if we have a stored range
        if (window.lastRange) {
            try {
                // Create a new selection
                const selection = window.getSelection();
                selection.removeAllRanges();

                // Add the stored range
                selection.addRange(window.lastRange.cloneRange());

                // Apply the color
                document.execCommand('hiliteColor', false, color);
            } catch (e) {
                console.error("Error applying background color:", e);
                // Fallback to just applying at cursor position
                document.execCommand('hiliteColor', false, color);
            }
        } else {
            // If no stored range, just apply at cursor position
            document.execCommand('hiliteColor', false, color);
        }
    }

    // Hide all color palettes
    function hideAllPalettes() {
        document.querySelectorAll('.color-palette').forEach(palette => {
            palette.classList.remove('show');
        });
    }

    // Update button states based on current selection
    function updateButtonStates() {
        document.querySelectorAll('.tool-button[data-command]').forEach(button => {
            const command = button.dataset.command;

            if (command && document.queryCommandState(command)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Function to update navigation button states
    function updateNavigationButtonStates() {
        const params = getUrlParameters();
        const navFirstPageBtn = document.getElementById('navFirstPageBtn');
        const navLastPageBtn = document.getElementById('navLastPageBtn');

        // Check if we're on the first page or last page
        const isFirstPage = !lastPageContainer || lastPageContainer.style.display === 'none';
        const isLastPage = lastPageContainer && lastPageContainer.style.display === 'flex';

        // Disable/enable buttons based on current page
        if (navFirstPageBtn) {
            if (isFirstPage || params.lastPage === 'none' || (params.firstPage === 'none' && params.lastPage !== 'none')) {
                navFirstPageBtn.classList.add('disabled');
            } else {
                navFirstPageBtn.classList.remove('disabled');
            }
        }

        if (navLastPageBtn) {
            if (isLastPage || params.lastPage === 'none' || (params.firstPage === 'none' && params.lastPage !== 'none')) {
                navLastPageBtn.classList.add('disabled');
            } else {
                navLastPageBtn.classList.remove('disabled');
            }
        }
    }

    // Set up page navigation buttons
    showLastPageBtn.addEventListener('click', function() {
        // Get URL parameters to check document type and page settings
        const params = getUrlParameters();

        // Don't do anything if first page is 'none' and last page is not 'none'
        // In this case, we're already showing only the last page
        if (params.firstPage === 'none' && params.lastPage !== 'none') {
            return;
        }

        // Show last page
        document.querySelector('.document-page').style.display = 'none';
        lastPageContainer.style.display = 'flex';

        // Show the "Return to First Page" button
        toggleLastPageBtn.style.display = 'inline-block';

        // Hide the "Go to Last Page" button
        showLastPageBtn.style.display = 'none';

        // Update navigation button states
        updateNavigationButtonStates();

        // Apply the last page layout
        changeLastPageLayout(lastPageLayoutSelector.value);

        // Get the current last page layout to determine which editor to focus
        const lastPageLayout = document.getElementById('lastPageLayoutSelector').value;

        // Focus the appropriate editor based on the last page layout
        setTimeout(() => {
            switch (lastPageLayout) {
                case 'report-footer':
                    // Focus the report footer editor
                    currentEditor = reportFooterEditor;
                    reportFooterSection.classList.add('active');
                    reportFooterEditor.focus();
                    break;

                case 'page-footer':
                    // Focus the page footer editor
                    currentEditor = pageFooterEditor;
                    pageFooterSection.classList.add('active');
                    pageFooterEditor.focus();
                    break;

                case 'report-page-footer':
                    // Focus the report footer editor in combined mode (top section)
                    currentEditor = reportFooterEditor;
                    reportFooterSection.classList.add('active');
                    reportFooterEditor.focus();
                    break;

                case 'footer-only':
                    // Focus the footer editor
                    currentEditor = footerEditor;
                    footerSection.classList.add('active');
                    footerEditor.focus();
                    break;

                case 'none':
                default:
                    // Focus the last page main editor
                    currentEditor = lastPageMainEditor;
                    lastPageMainEditor.focus();
                    break;
            }
        }, 200); // Use a slightly longer delay to ensure layout changes are complete
    });

    toggleLastPageBtn.addEventListener('click', function() {
        // Get URL parameters to check document type and page settings
        const params = getUrlParameters();

        // Don't do anything if first page is 'none' and last page is not 'none'
        // In this case, we should only show the last page
        if (params.firstPage === 'none' && params.lastPage !== 'none') {
            return;
        }

        // Don't do anything if last page is 'none'
        // In this case, there's no last page to navigate from
        if (params.lastPage === 'none') {
            return;
        }

        // Show first page
        document.querySelector('.document-page').style.display = 'block';
        lastPageContainer.style.display = 'none';

        // Hide the "Return to First Page" button
        toggleLastPageBtn.style.display = 'none';

        // Show the "Go to Last Page" button if last page is not 'none'
        if (params.lastPage !== 'none') {
            showLastPageBtn.style.display = 'inline-block';
        }

        // Update navigation button states
        updateNavigationButtonStates();

        // Get the current layout to determine which editor to focus
        const currentLayout = document.getElementById('layoutSelector').value;

        // Focus the appropriate editor based on the current layout
        switch (currentLayout) {
            case 'report-header':
                // Focus the report header editor
                currentEditor = reportHeaderEditor;
                reportHeaderSection.classList.add('active');
                setTimeout(() => reportHeaderEditor.focus(), 100);
                break;

            case 'page-header':
                // Focus the page header editor
                currentEditor = pageHeaderEditor;
                pageHeaderSection.classList.add('active');
                setTimeout(() => pageHeaderEditor.focus(), 100);
                break;

            case 'report-page-header':
                // Focus the report header editor in combined mode
                currentEditor = reportHeaderEditor;
                reportHeaderSection.classList.add('active');
                setTimeout(() => reportHeaderEditor.focus(), 100);
                break;

            case 'header-footer':
                // Focus the header editor
                currentEditor = headerEditor;
                headerSection.classList.add('active');
                setTimeout(() => headerEditor.focus(), 100);
                break;

            case 'header-only':
                // Focus the header editor
                currentEditor = headerEditor;
                headerSection.classList.add('active');
                setTimeout(() => headerEditor.focus(), 100);
                break;

            case 'footer-only':
                // Focus the footer editor
                currentEditor = footerEditor;
                footerSection.classList.add('active');
                setTimeout(() => footerEditor.focus(), 100);
                break;

            case 'none':
            default:
                // Focus the main editor
                currentEditor = mainEditor;
                setTimeout(() => mainEditor.focus(), 100);
                break;
        }
    });

    // Set up Exit button
    const exitBtn = document.getElementById('exitBtn');
    if (exitBtn) {
        exitBtn.addEventListener('click', function() {
            // Navigate back to the landing page
            window.location.href = 'landing.html';
        });
    }

    // Set up last page layout selector
    lastPageLayoutSelector.addEventListener('change', function() {
        changeLastPageLayout(this.value);
    });

    // Set up last page section buttons
    editReportFooterBtn.addEventListener('click', function() {
        reportFooterSection.classList.add('active');
        reportFooterSection.style.display = 'block';
        currentEditor = reportFooterEditor;
        reportFooterEditor.focus();
    });

    editPageFooterBtn.addEventListener('click', function() {
        pageFooterSection.classList.add('active');
        pageFooterSection.style.display = 'block';
        currentEditor = pageFooterEditor;
        pageFooterEditor.focus();
    });

    closeReportFooterBtn.addEventListener('click', function() {
        reportFooterSection.classList.remove('active');
        // Don't hide completely if in split mode
        if (!reportFooterSection.classList.contains('split-page')) {
            reportFooterSection.style.display = 'none';
        }
        currentEditor = lastPageMainEditor;
        lastPageMainEditor.focus();
    });

    closePageFooterBtn.addEventListener('click', function() {
        pageFooterSection.classList.remove('active');
        // Don't hide completely if in split mode
        if (!pageFooterSection.classList.contains('split-page')) {
            pageFooterSection.style.display = 'none';
        }
        currentEditor = lastPageMainEditor;
        lastPageMainEditor.focus();
    });

    // Function to change last page layout
    function changeLastPageLayout(layout) {
        // Clear content when changing layouts
        clearLastPageContentForLayoutChange();

        // Hide all edit buttons first
        editReportFooterBtn.style.display = 'none';
        editPageFooterBtn.style.display = 'none';

        // Hide all sections
        reportFooterSection.classList.remove('active');
        pageFooterSection.classList.remove('active');

        reportFooterSection.style.display = 'none';
        pageFooterSection.style.display = 'none';

        // Remove any special classes
        reportFooterSection.classList.remove('full-page', 'split-page');
        pageFooterSection.classList.remove('full-page', 'split-page');

        // Set placeholders for all editors
        reportFooterEditor.setAttribute('data-placeholder', 'Click to edit Report Footer');
        pageFooterEditor.setAttribute('data-placeholder', 'Click to edit Page Footer');

        // Show appropriate buttons and set up sections based on layout
        switch (layout) {
            case 'none':
                // No special sections
                break;

            case 'report-footer':
                // Full page report footer
                editReportFooterBtn.style.display = 'inline-block';
                reportFooterSection.classList.add('full-page');
                reportFooterSection.style.display = 'block'; // Make sure it's visible for resize handles
                break;

            case 'page-footer':
                // Full page page footer
                editPageFooterBtn.style.display = 'inline-block';
                pageFooterSection.classList.add('full-page');
                pageFooterSection.style.display = 'block'; // Make sure it's visible for resize handles
                break;

            case 'report-page-footer':
                // Split page with report footer and page footer
                editReportFooterBtn.style.display = 'inline-block';
                editPageFooterBtn.style.display = 'inline-block';
                reportFooterSection.classList.add('split-page');
                pageFooterSection.classList.add('split-page');
                reportFooterSection.style.display = 'block'; // Make sure it's visible for resize handles
                pageFooterSection.style.display = 'block'; // Make sure it's visible for resize handles
                break;

            case 'footer-only':
                // Footer only layout for last page
                editFooterBtn.style.display = 'inline-block';
                footerSection.style.display = 'block'; // Make sure it's visible for resize handles
                break;
        }

        // Apply layout settings to ensure proper heights
        applyLayoutCSSSettings();

        // Re-initialize resize handles to ensure they work with the new layout
        setTimeout(initResizeHandles, 100);

        // Focus on the appropriate editor based on the layout
        setTimeout(() => {
            switch (layout) {
                case 'report-footer':
                    // Focus the report footer editor
                    currentEditor = reportFooterEditor;
                    reportFooterEditor.focus();
                    break;

                case 'page-footer':
                    // Focus the page footer editor
                    currentEditor = pageFooterEditor;
                    pageFooterEditor.focus();
                    break;

                case 'report-page-footer':
                    // Focus the report footer editor in combined mode (top section)
                    currentEditor = reportFooterEditor;
                    reportFooterEditor.focus();
                    break;

                case 'footer-only':
                    // Focus the footer editor
                    currentEditor = footerEditor;
                    footerEditor.focus();
                    break;

                case 'none':
                default:
                    // Focus the last page main editor
                    currentEditor = lastPageMainEditor;
                    lastPageMainEditor.focus();
                    break;
            }
        }, 200); // Use a slightly longer delay to ensure layout changes are complete
    }

    // Clear last page content when changing layouts
    function clearLastPageContentForLayoutChange() {
        // Clear all editors
        document.getElementById('reportFooterEditor').innerHTML = '';
        document.getElementById('pageFooterEditor').innerHTML = '';
        document.getElementById('lastPageMainEditor').innerHTML = '';

        // Clear localStorage
        localStorage.removeItem('reportFooterContent');
        localStorage.removeItem('pageFooterContent');
        localStorage.removeItem('lastPageMainContent');
    }

    // Function to apply layout settings
    function applyLayoutSettings() {
        // Get values from form
        layoutSettings.headerHeight = document.getElementById('headerHeight').value;
        layoutSettings.footerHeight = document.getElementById('footerHeight').value;

        // Apply settings to CSS
        applyLayoutCSSSettings();

        // Close the modal
        document.getElementById('layoutCustomizeModal').style.display = 'none';

        // Reapply current layout to refresh with new settings
        const currentFirstPageLayout = document.getElementById('layoutSelector').value;
        const currentLastPageLayout = document.getElementById('lastPageLayoutSelector').value;

        changeLayout(currentFirstPageLayout);
        if (lastPageContainer.style.display !== 'none') {
            changeLastPageLayout(currentLastPageLayout);
        }

        // Save settings to localStorage
        localStorage.setItem('layoutSettings', JSON.stringify(layoutSettings));

        alert('Layout settings applied successfully!');
    }

    // Function to apply CSS settings
    function applyLayoutCSSSettings() {
        // Apply to header sections
        if (headerSection) {
            headerSection.style.minHeight = layoutSettings.headerHeight;
        }

        if (reportHeaderSection) {
            reportHeaderSection.style.minHeight = layoutSettings.reportHeaderHeight;
        }

        if (pageHeaderSection) {
            pageHeaderSection.style.minHeight = layoutSettings.pageHeaderHeight;
        }

        // Apply to footer sections
        if (footerSection) {
            footerSection.style.minHeight = layoutSettings.footerHeight;
        }

        if (reportFooterSection) {
            reportFooterSection.style.minHeight = layoutSettings.reportFooterHeight;
        }

        if (pageFooterSection) {
            pageFooterSection.style.minHeight = layoutSettings.pageFooterHeight;
        }

        // Apply to preview sections
        const previewHeader = document.getElementById('previewHeader');
        const previewFooter = document.getElementById('previewFooter');
        const previewReportHeader = document.getElementById('previewReportHeader');
        const previewPageHeader = document.getElementById('previewPageHeader');
        const previewReportFooter = document.getElementById('previewReportFooter');
        const previewPageFooter = document.getElementById('previewPageFooter');

        // Standard header and footer
        if (previewHeader) {
            previewHeader.style.minHeight = layoutSettings.headerHeight;
        }

        if (previewFooter) {
            previewFooter.style.minHeight = layoutSettings.footerHeight;
            previewFooter.style.bottom = '15mm';
        }

        // Report and page headers
        if (previewReportHeader) {
            previewReportHeader.style.minHeight = layoutSettings.reportHeaderHeight;
        }

        if (previewPageHeader) {
            previewPageHeader.style.minHeight = layoutSettings.pageHeaderHeight;
        }

        // Report and page footers
        if (previewReportFooter) {
            previewReportFooter.style.minHeight = layoutSettings.reportFooterHeight;
            previewReportFooter.style.bottom = '15mm';
        }

        if (previewPageFooter) {
            previewPageFooter.style.minHeight = layoutSettings.pageFooterHeight;
            previewPageFooter.style.bottom = '15mm';
        }

        // Split headers and footers
        const previewReportHeaderSplit = document.getElementById('previewReportHeaderSplit');
        const previewPageHeaderSplit = document.getElementById('previewPageHeaderSplit');
        const previewReportFooterSplit = document.getElementById('previewReportFooterSplit');
        const previewPageFooterSplit = document.getElementById('previewPageFooterSplit');

        if (previewReportHeaderSplit) {
            previewReportHeaderSplit.style.minHeight = layoutSettings.reportHeaderHeight;
        }

        if (previewPageHeaderSplit) {
            previewPageHeaderSplit.style.minHeight = layoutSettings.pageHeaderHeight;
        }

        if (previewReportFooterSplit) {
            previewReportFooterSplit.style.minHeight = layoutSettings.reportFooterHeight;
            previewReportFooterSplit.style.bottom = '15mm';
        }

        if (previewPageFooterSplit) {
            previewPageFooterSplit.style.minHeight = layoutSettings.pageFooterHeight;
            previewPageFooterSplit.style.bottom = '15mm';
        }

        // Update print styles
        updatePrintStyles();
    }

    // Function to update print styles
    function updatePrintStyles() {
        // Create or update the style element for print styles
        let styleElement = document.getElementById('custom-print-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'custom-print-styles';
            document.head.appendChild(styleElement);
        }

        // Set the print styles
        styleElement.textContent = `
            @media print {
                /* Standard header and footer */
                .page-header {
                    min-height: ${layoutSettings.headerHeight} !important;
                    position: absolute !important;
                    top: 0 !important;
                    background-color: white !important; /* Ensure white background */
                }

                .page-footer {
                    min-height: ${layoutSettings.footerHeight} !important;
                    bottom: 15mm !important; /* Move footer up by 15mm from bottom */
                    position: absolute !important;
                    padding: 20px 10px 10px 10px !important; /* Added 10px extra padding at the top */
                    background-color: white !important; /* Ensure white background */
                }

                /* Report header and footer */
                .page-report-header {
                    min-height: ${layoutSettings.reportHeaderHeight} !important;
                    background-color: white !important;
                }

                .page-report-footer {
                    min-height: ${layoutSettings.reportFooterHeight} !important;
                    bottom: 15mm !important;
                    position: absolute !important;
                    background-color: white !important;
                    padding: 20px 10px 10px 10px !important;
                }

                /* Page header and footer */
                .page-page-header {
                    min-height: ${layoutSettings.pageHeaderHeight} !important;
                    background-color: white !important;
                }

                .page-page-footer {
                    min-height: ${layoutSettings.pageFooterHeight} !important;
                    bottom: 15mm !important;
                    position: absolute !important;
                    background-color: white !important;
                    padding: 20px 10px 10px 10px !important;
                }

                /* Split headers and footers */
                .page-report-header-split {
                    min-height: ${layoutSettings.reportHeaderHeight} !important;
                    background-color: white !important;
                }

                .page-page-header-split {
                    min-height: ${layoutSettings.pageHeaderHeight} !important;
                    background-color: white !important;
                }

                .page-report-footer-split {
                    min-height: ${layoutSettings.reportFooterHeight} !important;
                    bottom: 15mm !important;
                    position: absolute !important;
                    background-color: white !important;
                    padding: 20px 10px 10px 10px !important;
                }

                .page-page-footer-split {
                    min-height: ${layoutSettings.pageFooterHeight} !important;
                    bottom: 15mm !important;
                    position: absolute !important;
                    background-color: white !important;
                    padding: 20px 10px 10px 10px !important;
                }

                .page-content-placeholder {
                    padding-top: calc(${layoutSettings.headerHeight} + 10mm) !important;
                    padding-bottom: calc(${layoutSettings.footerHeight} + 25mm) !important; /* Increased to account for footer position */
                }
            }
        `;
    }

    // Load saved layout settings if available
    function loadSavedLayoutSettings() {
        const savedSettings = localStorage.getItem('layoutSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                Object.assign(layoutSettings, parsedSettings);
                applyLayoutCSSSettings();
            } catch (e) {
                console.error('Error loading saved layout settings:', e);
            }
        }
    }

    // Load saved settings
    loadSavedLayoutSettings();

    // Function to initialize resize handles for header and footer sections
    function initResizeHandles() {
        // Variables to track resize state
        let isResizing = false;
        let currentSection = null;
        let startY = 0;
        let startHeight = 0;
        let resizeType = ''; // 'top' or 'bottom'

        // Get all resize handles
        const bottomHandles = document.querySelectorAll('.resize-handle-bottom');
        const topHandles = document.querySelectorAll('.resize-handle-top');

        // Add event listeners to bottom resize handles (for headers)
        bottomHandles.forEach(handle => {
            handle.addEventListener('mousedown', function(e) {
                // Start resizing
                isResizing = true;
                currentSection = this.parentElement;
                startY = e.clientY;
                startHeight = parseInt(window.getComputedStyle(currentSection).height);
                resizeType = 'bottom';

                // Add resize class to indicate active resizing
                document.body.classList.add('resizing');

                // Prevent text selection during resize
                e.preventDefault();
            });
        });

        // Add event listeners to top resize handles (for footers)
        topHandles.forEach(handle => {
            handle.addEventListener('mousedown', function(e) {
                // Start resizing
                isResizing = true;
                currentSection = this.parentElement;
                startY = e.clientY;
                startHeight = parseInt(window.getComputedStyle(currentSection).height);
                resizeType = 'top';

                // Add resize class to indicate active resizing
                document.body.classList.add('resizing');

                // Prevent text selection during resize
                e.preventDefault();
            });
        });

        // Add mousemove and mouseup event listeners to document
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;

            // Calculate new height
            let newHeight;
            if (resizeType === 'bottom') {
                // For bottom handles (headers), drag down increases height
                newHeight = startHeight + (e.clientY - startY);
            } else {
                // For top handles (footers), drag up increases height
                newHeight = startHeight - (e.clientY - startY);
            }

            // Ensure minimum height
            newHeight = Math.max(newHeight, 30); // Minimum 30px height

            // Apply new height
            currentSection.style.minHeight = newHeight + 'px';

            // For footer sections, we need to adjust the position to keep it at the bottom
            if (currentSection.id === 'footerSection' ||
                currentSection.id === 'reportFooterSection' ||
                currentSection.id === 'pageFooterSection') {
                // No need to adjust position as it's already positioned at bottom with absolute positioning
            }

            // Update layout settings based on the section being resized
            if (currentSection.id === 'headerSection') {
                layoutSettings.headerHeight = newHeight + 'px';
            } else if (currentSection.id === 'footerSection') {
                layoutSettings.footerHeight = newHeight + 'px';
            } else if (currentSection.id === 'reportHeaderSection') {
                layoutSettings.reportHeaderHeight = newHeight + 'px';
            } else if (currentSection.id === 'pageHeaderSection') {
                layoutSettings.pageHeaderHeight = newHeight + 'px';
            } else if (currentSection.id === 'reportFooterSection') {
                layoutSettings.reportFooterHeight = newHeight + 'px';
            } else if (currentSection.id === 'pageFooterSection') {
                layoutSettings.pageFooterHeight = newHeight + 'px';
            }

            // Save settings to localStorage
            localStorage.setItem('layoutSettings', JSON.stringify(layoutSettings));

            // Update preview if it's open
            updatePreviewSizes();
        });

        document.addEventListener('mouseup', function() {
            if (isResizing) {
                // Stop resizing
                isResizing = false;
                currentSection = null;

                // Remove resize class
                document.body.classList.remove('resizing');

                // Apply layout settings to all sections
                applyLayoutCSSSettings();
            }
        });
    }

    // Function to update preview sizes when resizing
    function updatePreviewSizes() {
        // Standard header and footer
        const previewHeader = document.getElementById('previewHeader');
        const previewFooter = document.getElementById('previewFooter');

        if (previewHeader && headerSection) {
            previewHeader.style.minHeight = headerSection.style.minHeight;
        }

        if (previewFooter && footerSection) {
            previewFooter.style.minHeight = footerSection.style.minHeight;
        }

        // Report header
        const previewReportHeader = document.getElementById('previewReportHeader');
        if (previewReportHeader && reportHeaderSection) {
            previewReportHeader.style.minHeight = reportHeaderSection.style.minHeight;
        }

        // Page header
        const previewPageHeader = document.getElementById('previewPageHeader');
        if (previewPageHeader && pageHeaderSection) {
            previewPageHeader.style.minHeight = pageHeaderSection.style.minHeight;
        }

        // Split headers
        const previewReportHeaderSplit = document.getElementById('previewReportHeaderSplit');
        const previewPageHeaderSplit = document.getElementById('previewPageHeaderSplit');
        if (previewReportHeaderSplit && reportHeaderSection) {
            previewReportHeaderSplit.style.minHeight = reportHeaderSection.style.minHeight;
        }
        if (previewPageHeaderSplit && pageHeaderSection) {
            previewPageHeaderSplit.style.minHeight = pageHeaderSection.style.minHeight;
        }

        // Report footer
        const previewReportFooter = document.getElementById('previewReportFooter');
        if (previewReportFooter && reportFooterSection) {
            previewReportFooter.style.minHeight = reportFooterSection.style.minHeight;
        }

        // Page footer
        const previewPageFooter = document.getElementById('previewPageFooter');
        if (previewPageFooter && pageFooterSection) {
            previewPageFooter.style.minHeight = pageFooterSection.style.minHeight;
        }

        // Split footers
        const previewReportFooterSplit = document.getElementById('previewReportFooterSplit');
        const previewPageFooterSplit = document.getElementById('previewPageFooterSplit');
        if (previewReportFooterSplit && reportFooterSection) {
            previewReportFooterSplit.style.minHeight = reportFooterSection.style.minHeight;
        }
        if (previewPageFooterSplit && pageFooterSection) {
            previewPageFooterSplit.style.minHeight = pageFooterSection.style.minHeight;
        }
    }

    // Initialize the layout
    changeLayout('header-footer');

    // Call the initialization function
    initEditor();

    // Initialize resize handles
    initResizeHandles();

    // Apply settings from URL parameters if any
    applyUrlParameters();

    // Initialize navigation button states
    updateNavigationButtonStates();
});
