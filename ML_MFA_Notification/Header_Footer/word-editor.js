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

        // Apply document type settings
        if (params.docType === 'report') {
            // Show the last page navigation button for report type
            if (showLastPageBtn) {
                showLastPageBtn.style.display = 'inline-block';
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
                } else if (params.firstPage === 'page-header') {
                    // Show only page header
                    pageHeaderSection.style.display = 'block';
                    pageHeaderSection.classList.add('active');
                    currentEditor = pageHeaderEditor;
                } else if (params.firstPage === 'report-page-header') {
                    // Show both report and page headers
                    reportHeaderSection.style.display = 'block';
                    reportHeaderSection.classList.add('active');
                    pageHeaderSection.style.display = 'block';
                    pageHeaderSection.classList.add('active');
                    currentEditor = reportHeaderEditor;
                } else if (params.firstPage === 'none') {
                    // Show no headers or footers
                    currentEditor = mainEditor;
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
            }

            // Show footer if selected
            if (params.footer === 'true') {
                footerSection.style.display = 'block';
                footerSection.classList.add('active');

                // If header is not selected, set footer as current editor
                if (params.header !== 'true') {
                    currentEditor = footerEditor;
                }
            }

            // If neither header nor footer is selected, default to main editor
            if (params.header !== 'true' && params.footer !== 'true') {
                currentEditor = mainEditor;
            }
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

        // Set up text box insertion
        insertTextBoxBtn.addEventListener('click', function() {
            insertTextBox();
        });

        // Set up table insertion
        insertTableBtn.addEventListener('click', function() {
            openTableModal();
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
                <span class="close">&times;</span>
                <div class="preview-header">
                    <h3>Preview</h3>
                    <button id="printPreviewBtn" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                        <i class="material-icons">print</i> Print
                    </button>
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
                        <div id="reportHeaderLayout" style="display: none;">
                            <div class="page-report-header" id="previewReportHeader"></div>
                        </div>

                        <!-- Page Header Layout -->
                        <div id="pageHeaderLayout" style="display: none;">
                            <div class="page-page-header" id="previewPageHeader"></div>
                        </div>

                        <!-- Report Header & Page Header Layout -->
                        <div id="reportPageHeaderLayout" style="display: none;">
                            <div class="page-report-header-split" id="previewReportHeaderSplit"></div>
                            <div class="page-page-header-split" id="previewPageHeaderSplit"></div>
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

                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
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
                    <button id="insertTableBtn" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                        Insert Table
                    </button>
                    <button id="cancelTableBtn" class="mdl-button mdl-js-button mdl-button--raised">
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

                    // Insert the image at cursor position
                    document.execCommand('insertHTML', false, img.outerHTML);

                    // Make images interactive
                    makeImagesInteractive();

                    // Select the newly inserted image
                    setTimeout(() => {
                        const newImage = currentEditor.querySelector('img:last-of-type');
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

            // Insert the wrapped image
            document.execCommand('insertHTML', false, wrapper.outerHTML);

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

                        // Get initial positions
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startLeft = img.offsetLeft;
                        const startTop = img.offsetTop;

                        // Function to handle drag
                        function handleDrag(e) {
                            const newLeft = startLeft + (e.clientX - startX);
                            const newTop = startTop + (e.clientY - startY);

                            // Move the wrapper instead of the image
                            wrapper.style.position = 'relative';
                            wrapper.style.left = `${newLeft}px`;
                            wrapper.style.top = `${newTop}px`;

                            // Update handle positions
                            updateHandlePositions();

                            // Force a reflow to ensure the handles are positioned correctly
                            handleContainer.offsetHeight;
                        }

                        // Function to stop dragging
                        function stopDrag() {
                            document.removeEventListener('mousemove', handleDrag);
                            document.removeEventListener('mouseup', stopDrag);

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

        // Handle keyboard events for selected images
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
                        // Remove the wrapper and all its contents (image and handles)
                        wrapper.remove();
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

        // Create text box element
        const textBox = document.createElement('div');
        textBox.className = 'text-box';
        textBox.contentEditable = 'true';
        textBox.innerHTML = '<p>Click to edit this text box</p>';

        // Insert the text box
        document.execCommand('insertHTML', false, textBox.outerHTML);
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
            document.getElementById('previewMainContent').innerHTML = document.getElementById('mainEditor').innerHTML;

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
                document.getElementById('previewMainContent').innerHTML = document.getElementById('mainEditor').innerHTML;

                // Hide header and footer
                document.getElementById('previewHeader').style.display = 'none';
                document.getElementById('previewFooter').style.display = 'none';
                break;

            case 'header-footer':
                // Standard header & footer layout
                document.getElementById('standardLayout').style.display = 'block';
                document.getElementById('previewHeader').innerHTML = document.getElementById('headerEditor').innerHTML;
                document.getElementById('previewFooter').innerHTML = document.getElementById('footerEditor').innerHTML;
                document.getElementById('previewMainContent').innerHTML = document.getElementById('mainEditor').innerHTML;

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
                document.getElementById('previewMainContent').innerHTML = document.getElementById('mainEditor').innerHTML;

                // Make sure the header is visible and footer is hidden
                document.getElementById('previewHeader').style.visibility = 'visible';
                document.getElementById('previewHeader').style.display = 'block';
                document.getElementById('previewFooter').style.visibility = 'hidden';
                document.getElementById('previewFooter').style.display = 'none';
                break;

            case 'footer-only':
                // Footer only layout
                document.getElementById('standardLayout').style.display = 'block';
                document.getElementById('previewFooter').innerHTML = document.getElementById('footerEditor').innerHTML;
                document.getElementById('previewMainContent').innerHTML = document.getElementById('mainEditor').innerHTML;

                // Make sure the footer is visible and header is hidden
                document.getElementById('previewHeader').style.visibility = 'hidden';
                document.getElementById('previewHeader').style.display = 'none';
                document.getElementById('previewFooter').style.visibility = 'visible';
                document.getElementById('previewFooter').style.display = 'block';
                break;

            case 'report-header':
                // Full page report header
                document.getElementById('reportHeaderLayout').style.display = 'block';
                document.getElementById('previewReportHeader').innerHTML = document.getElementById('reportHeaderEditor').innerHTML;
                break;

            case 'page-header':
                // Full page page header
                document.getElementById('pageHeaderLayout').style.display = 'block';
                document.getElementById('previewPageHeader').innerHTML = document.getElementById('pageHeaderEditor').innerHTML;
                break;

            case 'report-page-header':
                // Split page with report header and page header
                document.getElementById('reportPageHeaderLayout').style.display = 'block';
                document.getElementById('previewReportHeaderSplit').innerHTML = document.getElementById('reportHeaderEditor').innerHTML;
                document.getElementById('previewPageHeaderSplit').innerHTML = document.getElementById('pageHeaderEditor').innerHTML;
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
                lastPageContent.style.margin = '20px 0';
                lastPageContent.style.visibility = 'visible';
                lastPageContent.style.display = 'block';
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
                lastPageMainContent.style.margin = '20px 0';
                lastPageMainContent.style.visibility = 'visible';
                lastPageMainContent.style.display = 'block';
                document.getElementById('lastPageStandardLayout').appendChild(lastPageMainContent);
                break;

            case 'report-footer':
                // Full page report footer
                document.getElementById('reportFooterLayout').style.display = 'block';
                document.getElementById('previewReportFooter').innerHTML = document.getElementById('reportFooterEditor').innerHTML;
                document.getElementById('previewReportFooter').style.visibility = 'visible';
                document.getElementById('previewReportFooter').style.display = 'block';
                break;

            case 'page-footer':
                // Full page page footer
                document.getElementById('pageFooterLayout').style.display = 'block';
                document.getElementById('previewPageFooter').innerHTML = document.getElementById('pageFooterEditor').innerHTML;
                document.getElementById('previewPageFooter').style.visibility = 'visible';
                document.getElementById('previewPageFooter').style.display = 'block';
                break;

            case 'report-page-footer':
                // Split page with report footer and page footer
                document.getElementById('reportPageFooterLayout').style.display = 'block';
                document.getElementById('previewReportFooterSplit').innerHTML = document.getElementById('reportFooterEditor').innerHTML;
                document.getElementById('previewPageFooterSplit').innerHTML = document.getElementById('pageFooterEditor').innerHTML;
                document.getElementById('previewReportFooterSplit').style.visibility = 'visible';
                document.getElementById('previewReportFooterSplit').style.display = 'block';
                document.getElementById('previewPageFooterSplit').style.visibility = 'visible';
                document.getElementById('previewPageFooterSplit').style.display = 'block';
                break;
            }
        }

        // Show the modal
        const previewModal = document.getElementById('previewModal');
        previewModal.style.display = 'block';
        previewModal.classList.add('show');
    }

    // Update preview modal content to include last page layouts
    function updatePreviewModalContent() {
        // Get the preview container
        const previewContainer = document.querySelector('.preview-container');

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
                        <p>Last Page Content</p>
                        <p>This is a preview of how your last page will look on an A4 page</p>
                    </div>
                </div>

                <!-- Report Footer Layout -->
                <div id="reportFooterLayout" style="display: none;">
                    <div class="page-report-header" id="previewReportFooter"></div>
                </div>

                <!-- Page Footer Layout -->
                <div id="pageFooterLayout" style="display: none;">
                    <div class="page-page-header" id="previewPageFooter"></div>
                </div>

                <!-- Report Footer & Page Footer Layout -->
                <div id="reportPageFooterLayout" style="display: none;">
                    <div class="page-page-header-split" id="previewPageFooterSplit"></div>
                    <div class="page-report-header-split" id="previewReportFooterSplit"></div>
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

        if (previewHeader) {
            previewHeader.style.visibility = 'visible';
            previewHeader.style.display = 'block';
        }

        if (previewFooter) {
            previewFooter.style.visibility = 'visible';
            previewFooter.style.display = 'block';
        }

        if (previewMainContent) {
            previewMainContent.style.visibility = 'visible';
            previewMainContent.style.display = 'block';
        }

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
        if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
            // Clear all content
            clearContentForLayoutChange();

            // Reset to default layout
            document.getElementById('layoutSelector').value = 'header-footer';
            changeLayout('header-footer');

            alert('All content has been cleared.');
        }
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

    // Set up page navigation buttons
    showLastPageBtn.addEventListener('click', function() {
        // Show last page
        document.querySelector('.document-page').style.display = 'none';
        lastPageContainer.style.display = 'flex';

        // Show the "Return to First Page" button
        toggleLastPageBtn.style.display = 'inline-block';

        // Hide the "Go to Last Page" button
        showLastPageBtn.style.display = 'none';

        // Set current editor to last page main editor
        currentEditor = lastPageMainEditor;
        lastPageMainEditor.focus();

        // Apply the last page layout
        changeLastPageLayout(lastPageLayoutSelector.value);
    });

    toggleLastPageBtn.addEventListener('click', function() {
        // Show first page
        document.querySelector('.document-page').style.display = 'block';
        lastPageContainer.style.display = 'none';

        // Hide the "Return to First Page" button
        toggleLastPageBtn.style.display = 'none';

        // Show the "Go to Last Page" button
        showLastPageBtn.style.display = 'inline-block';

        // Set current editor to main editor
        currentEditor = mainEditor;
        mainEditor.focus();
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

        // Focus on last page main editor
        currentEditor = lastPageMainEditor;
        lastPageMainEditor.focus();
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
});
