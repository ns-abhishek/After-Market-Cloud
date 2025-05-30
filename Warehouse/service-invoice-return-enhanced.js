// Service Invoice Return Enhanced JavaScript

// Sample data
const serviceInvoiceData = [
    {
        id: 1,
        serviceInvoiceReturn: 'SR/17TN/20/2023',
        customerInvoice: 'SI/17TN/23/2023 - 1',
        serviceInvoiceReturnDate: '17-Nov-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#2554',
        model: 'Model 43',
        name: 'Customer 12680',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 2,
        serviceInvoiceReturn: 'SR/17TN/25/2023',
        customerInvoice: 'SI/17TN/22/2023 - 1',
        serviceInvoiceReturnDate: '17-Nov-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#4064',
        model: 'Model 16',
        name: 'Customer 4550',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 3,
        serviceInvoiceReturn: 'SR/17TN/24/2023',
        customerInvoice: 'SI/17TN/21/2023 - 1',
        serviceInvoiceReturnDate: '07 Nov 2023',
        isFullReturn: 'Yes',
        serial: 'Serial#4064',
        model: 'Model 16',
        name: 'Customer 4550',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 4,
        serviceInvoiceReturn: 'SR/17TN/23/2023',
        customerInvoice: 'SI/17TN/10/2023 - 1',
        serviceInvoiceReturnDate: '09-Oct-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#9572',
        model: 'Model 43',
        name: 'Customer 12680',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 5,
        serviceInvoiceReturn: 'SR/17TN/22/2023',
        customerInvoice: 'SI/17TN/17/2023 - 1',
        serviceInvoiceReturnDate: '29-Sep-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#9741',
        model: 'Model 83',
        name: 'Customer 12680',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 6,
        serviceInvoiceReturn: 'SR/17TN/21/2023',
        customerInvoice: 'SI/17TN/16/2023 - 1',
        serviceInvoiceReturnDate: '27-Sep-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#0722',
        model: 'Model 108',
        name: 'Customer 13525',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 7,
        serviceInvoiceReturn: 'SR/17TN/20/2023',
        customerInvoice: 'SI/17TN/15/2023 - 1',
        serviceInvoiceReturnDate: '25-Sep-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#432',
        model: 'Model 20',
        name: 'Customer 9578',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 8,
        serviceInvoiceReturn: 'SR/17TN/19/2023',
        customerInvoice: 'SI/17TN/11/2023 - 1',
        serviceInvoiceReturnDate: '25-Sep-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#445',
        model: 'Model 20',
        name: 'Customer 9578',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 9,
        serviceInvoiceReturn: 'SR/17TN/18/2023',
        customerInvoice: 'SI/17TN/15/2023 - 1',
        serviceInvoiceReturnDate: '25-Sep-2023',
        isFullReturn: 'No',
        serial: 'Serial#432',
        model: 'Model 20',
        name: 'Customer 9578',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    },
    {
        id: 10,
        serviceInvoiceReturn: 'SR/17TN/17/2023',
        customerInvoice: 'SI/17TN/14/2023 - 1',
        serviceInvoiceReturnDate: '08-Sep-2023',
        isFullReturn: 'Yes',
        serial: 'Serial#2557',
        model: 'Model 43',
        name: 'Customer 12680',
        generatedThrough: '',
        creditIRN: '',
        creditIRNDate: ''
    }
];

let currentData = [...serviceInvoiceData];
let currentPage = 1;
let pageSize = 10;
let sortableInstance = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTable();
    initializeDragAndDrop();
    setupEventListeners();
    renderTable();
});

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    const tableHeader = document.getElementById('tableHeader');
    
    sortableInstance = Sortable.create(tableHeader, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.drag-handle',
        onEnd: function(evt) {
            console.log('Column moved from', evt.oldIndex, 'to', evt.newIndex);
            updateColumnOrder(evt.oldIndex, evt.newIndex);
        }
    });
}

// Update column order after drag and drop
function updateColumnOrder(oldIndex, newIndex) {
    // Update table body to match header order
    const tbody = document.getElementById('tableBody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = Array.from(row.children);
        const movedCell = cells[oldIndex];
        
        if (newIndex === 0) {
            row.insertBefore(movedCell, row.firstChild);
        } else if (newIndex >= cells.length - 1) {
            row.appendChild(movedCell);
        } else {
            row.insertBefore(movedCell, cells[newIndex + (newIndex > oldIndex ? 1 : 0)]);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', searchTable);
    
    // Modal close on outside click
    document.getElementById('detailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailModal();
        }
    });
}

// Initialize table
function initializeTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
}

// Render table with current data
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = currentData.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pageData.forEach((item, index) => {
        const row = createTableRow(item, startIndex + index);
        tableBody.appendChild(row);
    });
    
    updatePaginationInfo();
}

// Create table row
function createTableRow(item, index) {
    const row = document.createElement('tr');
    row.onclick = () => openDetailModal(item);
    
    row.innerHTML = `
        <td class="checkbox-col">
            <input type="checkbox" class="row-checkbox" data-id="${item.id}" onclick="event.stopPropagation()">
        </td>
        <td>
            <i class="fas fa-eye" style="color: #4299e1; cursor: pointer;"></i>
        </td>
        <td>${item.serviceInvoiceReturn}</td>
        <td>${item.customerInvoice}</td>
        <td>${item.serviceInvoiceReturnDate}</td>
        <td>
            <span class="status-badge ${item.isFullReturn === 'Yes' ? 'status-yes' : 'status-no'}">
                ${item.isFullReturn}
            </span>
        </td>
        <td>${item.serial}</td>
        <td>${item.model}</td>
        <td>${item.name}</td>
        <td>${item.generatedThrough}</td>
        <td>${item.creditIRN}</td>
        <td>${item.creditIRNDate}</td>
    `;
    
    return row;
}

// Open detail modal
function openDetailModal(item) {
    const modal = document.getElementById('detailModal');
    const modalBody = modal.querySelector('.detail-form');
    
    modalBody.innerHTML = createDetailForm(item);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Create detail form
function createDetailForm(item) {
    return `
        <div class="detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div class="detail-section">
                <h4 style="color: #4299e1; margin-bottom: 1rem; font-size: 1.1rem;">Basic Information</h4>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Return #:</label>
                    <input type="text" value="${item.serviceInvoiceReturn}" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Date:</label>
                    <input type="text" value="${item.serviceInvoiceReturnDate}" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Invoice Date:</label>
                    <input type="text" value="17-Nov-2023" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Is Partial Return?:</label>
                    <input type="text" value="${item.isFullReturn === 'Yes' ? 'No' : 'Yes'}" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
            </div>
            
            <div class="detail-section">
                <h4 style="color: #4299e1; margin-bottom: 1rem; font-size: 1.1rem;">Customer Details</h4>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Name:</label>
                    <input type="text" value="${item.name}" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Invoice Address:</label>
                    <input type="text" value="Address 12680" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Work Order #:</label>
                    <input type="text" value="WO/17TN/95/2023 - 1" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Payment Due Date:</label>
                    <input type="text" value="17-Nov-2023" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc;">
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h4 style="color: #4299e1; margin-bottom: 1rem; font-size: 1.1rem;">Asset Details</h4>
            <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin-bottom: 0.5rem;"><strong>Asset is not under Standard Warranty</strong></p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem;">
                    <div>
                        <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Model:</label>
                        <span>${item.model}</span>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Brand:</label>
                        <span>Brand 4</span>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Asset Type:</label>
                        <span>Others</span>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Serial #:</label>
                        <span>${item.serial}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <div style="display: flex; gap: 1rem;">
                <button style="background: none; border: none; color: #4299e1; text-decoration: underline; cursor: pointer;">▼ Labor Charge Details</button>
                <button style="background: none; border: none; color: #4299e1; text-decoration: underline; cursor: pointer;">▼ Part Details</button>
                <button style="background: none; border: none; color: #4299e1; text-decoration: underline; cursor: pointer;">▼ Miscellaneous Details</button>
                <button style="background: none; border: none; color: #4299e1; text-decoration: underline; cursor: pointer;">▼ Attachment Detail</button>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Remarks:</label>
            <textarea readonly style="width: 100%; height: 100px; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f7fafc; resize: vertical;">Test</textarea>
        </div>
    `;
}

// Close detail modal
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Search functionality
function searchTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        currentData = [...serviceInvoiceData];
    } else {
        currentData = serviceInvoiceData.filter(item => 
            Object.values(item).some(value => 
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
    }
    
    currentPage = 1;
    renderTable();
}

// Update pagination info
function updatePaginationInfo() {
    const totalRecords = currentData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);
    
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('totalRecords').textContent = totalRecords;
    document.getElementById('viewStart').textContent = startRecord;
    document.getElementById('viewEnd').textContent = endRecord;
    document.getElementById('viewTotal').textContent = totalRecords;
}

// Pagination functions
function goToPage(direction) {
    const totalPages = Math.ceil(currentData.length / pageSize);
    
    switch(direction) {
        case 'first':
            currentPage = 1;
            break;
        case 'prev':
            if (currentPage > 1) currentPage--;
            break;
        case 'next':
            if (currentPage < totalPages) currentPage++;
            break;
        case 'last':
            currentPage = totalPages;
            break;
    }
    
    renderTable();
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('pageSize').value);
    currentPage = 1;
    renderTable();
}

// Header button functions
function addNew() {
    alert('Add New Service Invoice Return');
}

function refreshData() {
    currentData = [...serviceInvoiceData];
    currentPage = 1;
    renderTable();
    alert('Data refreshed');
}

function advancedSearch() {
    alert('Advanced Search functionality');
}

function exportData() {
    alert('Export functionality');
}

function closeWindow() {
    if (confirm('Are you sure you want to close?')) {
        window.close();
    }
}

// Column panel functions
function toggleColumnPanel() {
    const panel = document.getElementById('columnPanel');
    panel.classList.toggle('active');
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Modal action functions
function editRecord() {
    alert('Edit Record functionality');
}

function printRecord() {
    alert('Print Record functionality');
}

function viewRecord() {
    alert('View Record functionality');
}

function nextRecord() {
    alert('Next Record functionality');
}

function lastRecord() {
    alert('Last Record functionality');
}
