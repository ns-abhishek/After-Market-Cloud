// Tax Management System JavaScript

// Sample data
const invoiceData = [
    { id: 'INV001', customer: 'Auto Parts Inc.', date: '2024-01-15', status: 'paid', amount: 1250.00, tax: 125.00, dueDate: '2024-02-15' },
    { id: 'INV002', customer: 'Brake Masters', date: '2024-01-16', status: 'pending', amount: 850.00, tax: 85.00, dueDate: '2024-02-16' },
    { id: 'INV003', customer: 'Car Service Pro', date: '2024-01-17', status: 'paid', amount: 2100.00, tax: 210.00, dueDate: '2024-02-17' },
    { id: 'INV004', customer: 'Fleet Solutions', date: '2024-01-18', status: 'cancelled', amount: 750.00, tax: 75.00, dueDate: '2024-02-18' },
    { id: 'INV005', customer: 'Quick Fix Auto', date: '2024-01-19', status: 'pending', amount: 1500.00, tax: 150.00, dueDate: '2024-02-19' }
];

// Tax Structures Data
const taxStructuresData = [
    { id: 'gst-18', name: 'GST 18%', type: 'GST', rate: 18.00, applicableFor: 'Standard Goods', isActive: true },
    { id: 'gst-12', name: 'GST 12%', type: 'GST', rate: 12.00, applicableFor: 'Essential Goods', isActive: true },
    { id: 'gst-5', name: 'GST 5%', type: 'GST', rate: 5.00, applicableFor: 'Basic Necessities', isActive: true },
    { id: 'igst-18', name: 'IGST 18%', type: 'IGST', rate: 18.00, applicableFor: 'Inter-state Standard', isActive: true },
    { id: 'igst-12', name: 'IGST 12%', type: 'IGST', rate: 12.00, applicableFor: 'Inter-state Essential', isActive: true },
    { id: 'igst-5', name: 'IGST 5%', type: 'IGST', rate: 5.00, applicableFor: 'Inter-state Basic', isActive: false },
    { id: 'sales-tax-7.25', name: 'Sales Tax 7.25%', type: 'Sales Tax', rate: 7.25, applicableFor: 'California Sales', isActive: true },
    { id: 'sales-tax-8', name: 'Sales Tax 8%', type: 'Sales Tax', rate: 8.00, applicableFor: 'New York Sales', isActive: true },
    { id: 'vat-20', name: 'VAT 20%', type: 'VAT', rate: 20.00, applicableFor: 'UK Standard', isActive: true },
    { id: 'vat-5', name: 'VAT 5%', type: 'VAT', rate: 5.00, applicableFor: 'UK Reduced', isActive: false }
];

const jurisdictionData = [
    { country: 'United States', state: 'California', taxType: 'Sales Tax', rate: 7.25, status: 'active' },
    { country: 'United States', state: 'New York', taxType: 'Sales Tax', rate: 8.00, status: 'active' },
    { country: 'India', state: 'Maharashtra', taxType: 'GST', rate: 18.00, status: 'active' },
    { country: 'United Kingdom', state: 'England', taxType: 'VAT', rate: 20.00, status: 'active' },
    { country: 'Canada', state: 'Ontario', taxType: 'HST', rate: 13.00, status: 'active' }
];

const productData = [
    { code: 'BP001', name: 'Brake Pad Set', category: 'Auto Parts', hsn: '87083010', taxClass: 'Standard' },
    { code: 'OF002', name: 'Oil Filter', category: 'Auto Parts', hsn: '84212300', taxClass: 'Standard' },
    { code: 'SV001', name: 'Maintenance Service', category: 'Services', hsn: '998711', taxClass: 'Service' },
    { code: 'TR003', name: 'Tire Set', category: 'Auto Parts', hsn: '40111000', taxClass: 'Standard' },
    { code: 'BA004', name: 'Car Battery', category: 'Auto Parts', hsn: '85071000', taxClass: 'Standard' }
];

// Tax calculation rules
const taxRules = {
    'ca-us': { rate: 7.25, type: 'Sales Tax', currency: 'USD' },
    'ny-us': { rate: 8.00, type: 'Sales Tax', currency: 'USD' },
    'in': { rate: 18.00, type: 'GST', currency: 'INR' },
    'uk': { rate: 20.00, type: 'VAT', currency: 'GBP' }
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeKeyboardShortcuts();
    initializeMaterialDesign();
});

function initializeApp() {
    setupNavigation();
    populateInvoiceTable();
    populateTaxStructuresTable();
    populateJurisdictionsTable();
    populateProductsTable();
    populateTaxRatesTable();
    populateTaxRulesTable();
    setupTabs();
    setupInvoiceForm();
    setDefaultDates();
    populateDashboard();
    setupSearchFunctionality();
    initializeSearchableDropdowns();
    initializeViewSwitcher();
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');

    // Define proper page titles with correct capitalization
    const pageTitles = {
        'dashboard': 'Dashboard',
        'invoices': 'Tax Management',
        'tax-config': 'Tax Structure',
        'products': 'Product Tax Mapping',
        'reports': 'Reports',
        'compliance': 'Compliance',
        'settings': 'Settings'
    };

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show target page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');

            // Update page title with proper capitalization
            const title = pageTitles[targetPage] || 'Dashboard';
            pageTitle.textContent = title;
        });
    });
}

// Invoice Table Population
function populateInvoiceTable() {
    const tbody = document.getElementById('invoice-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    invoiceData.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.customer}</td>
            <td>${invoice.date}</td>
            <td><span class="status ${invoice.status}">${invoice.status}</span></td>
            <td>$${invoice.amount.toFixed(2)}</td>
            <td>$${invoice.tax.toFixed(2)}</td>
            <td>${invoice.dueDate}</td>
            <td>
                <button class="action-btn view" onclick="viewInvoice('${invoice.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editInvoice('${invoice.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteInvoice('${invoice.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Jurisdictions Table
function populateJurisdictionsTable() {
    const tbody = document.getElementById('jurisdictions-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    jurisdictionData.forEach(jurisdiction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jurisdiction.country}</td>
            <td>${jurisdiction.state}</td>
            <td>${jurisdiction.taxType}</td>
            <td>${jurisdiction.rate}%</td>
            <td><span class="status ${jurisdiction.status}">${jurisdiction.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editJurisdiction('${jurisdiction.country}-${jurisdiction.state}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteJurisdiction('${jurisdiction.country}-${jurisdiction.state}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Products Table
function populateProductsTable() {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    productData.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.hsn}</td>
            <td>${product.taxClass}</td>
            <td>
                <button class="action-btn edit" onclick="editProduct('${product.code}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteProduct('${product.code}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Tax Rules Table
function populateTaxRulesTable() {
    const tbody = document.getElementById('tax-rules-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Create sample tax rules data if it doesn't exist
    if (!window.taxRulesData) {
        window.taxRulesData = [
            {
                id: '1',
                name: 'US Sales Tax Rule',
                country: 'United States',
                state: 'California',
                taxType: 'Sales Tax',
                rate: 7.25,
                currency: 'USD',
                priority: 1,
                effectiveDate: '2024-01-01',
                conditions: 'Standard sales tax for California',
                isActive: true
            },
            {
                id: '2',
                name: 'India GST Rule',
                country: 'India',
                state: 'All States',
                taxType: 'GST',
                rate: 18.00,
                currency: 'INR',
                priority: 1,
                effectiveDate: '2024-01-01',
                conditions: 'Standard GST for goods and services',
                isActive: true
            },
            {
                id: '3',
                name: 'UK VAT Rule',
                country: 'United Kingdom',
                state: 'All Regions',
                taxType: 'VAT',
                rate: 20.00,
                currency: 'GBP',
                priority: 1,
                effectiveDate: '2024-01-01',
                conditions: 'Standard VAT rate',
                isActive: true
            }
        ];
    }

    if (window.taxRulesData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="tax-rules-empty">
                    <i class="fas fa-gavel"></i>
                    <h4>No Tax Rules Configured</h4>
                    <p>Click "Add Tax Rule" to create your first tax rule.</p>
                </td>
            </tr>
        `;
        return;
    }

    window.taxRulesData.forEach(rule => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="rule-name">${rule.name}</td>
            <td>${rule.country}</td>
            <td>${rule.taxType}</td>
            <td>${rule.rate}%</td>
            <td>${rule.currency}</td>
            <td>${rule.effectiveDate || 'N/A'}</td>
            <td>
                <label class="status-toggle">
                    <input type="checkbox" ${rule.isActive ? 'checked' : ''}
                           onchange="toggleTaxRuleStatus('${rule.id}', this.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span class="status ${rule.isActive ? 'active' : 'inactive'}">
                    ${rule.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <button class="action-btn edit" onclick="editTaxRule('${rule.id}')" title="Edit Tax Rule">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteTaxRule('${rule.id}')" title="Delete Tax Rule">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Tab functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show target tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Tax Calculator
function calculateTax() {
    const productSelect = document.getElementById('product-select');
    const locationSelect = document.getElementById('location-select');
    const baseAmount = document.getElementById('base-amount');
    const customerType = document.getElementById('customer-type');
    const taxBreakdown = document.getElementById('tax-breakdown');

    if (!productSelect.value || !locationSelect.value || !baseAmount.value) {
        alert('Please fill in all required fields');
        return;
    }

    const amount = parseFloat(baseAmount.value);
    const location = locationSelect.value;
    const custType = customerType.value;

    // Get tax rule for location
    const taxRule = taxRules[location];
    if (!taxRule) {
        alert('Tax rules not found for selected location');
        return;
    }

    // Calculate tax based on customer type
    let taxRate = taxRule.rate;
    if (custType === 'exempt') {
        taxRate = 0;
    } else if (custType === 'b2b' && taxRule.type === 'VAT') {
        // Reverse charge for B2B VAT
        taxRate = 0;
    }

    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;

    // Display breakdown
    taxBreakdown.innerHTML = `
        <h4>Tax Calculation Breakdown</h4>
        <div class="tax-line">
            <span>Base Amount:</span>
            <span>${taxRule.currency} ${amount.toFixed(2)}</span>
        </div>
        <div class="tax-line">
            <span>${taxRule.type} (${taxRate}%):</span>
            <span>${taxRule.currency} ${taxAmount.toFixed(2)}</span>
        </div>
        ${custType === 'b2b' && taxRule.type === 'VAT' ?
            '<div class="tax-line"><span>Note:</span><span>Reverse Charge Applied</span></div>' : ''}
        <div class="tax-line tax-total">
            <span>Total Amount:</span>
            <span>${taxRule.currency} ${totalAmount.toFixed(2)}</span>
        </div>
    `;
}

// Action functions (placeholders)
function viewInvoice(id) {
    alert(`Viewing invoice: ${id}`);
}

function editInvoice(id) {
    alert(`Editing invoice: ${id}`);
}

function deleteInvoice(id) {
    if (confirm(`Are you sure you want to delete invoice ${id}?`)) {
        alert(`Invoice ${id} deleted`);
        // Remove from data and refresh table
        const index = invoiceData.findIndex(inv => inv.id === id);
        if (index > -1) {
            invoiceData.splice(index, 1);
            populateInvoiceTable();
        }
    }
}

function editJurisdiction(id) {
    alert(`Editing jurisdiction: ${id}`);
}

function deleteJurisdiction(id) {
    alert(`Deleting jurisdiction: ${id}`);
}

function editProduct(code) {
    alert(`Editing product: ${code}`);
}

function deleteProduct(code) {
    alert(`Deleting product: ${code}`);
}

function openInvoiceModal() {
    alert('Opening invoice creation modal...');
}

// Tax Structures Table Population
function populateTaxStructuresTable() {
    const tbody = document.getElementById('tax-structures-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    taxStructuresData.forEach(structure => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${structure.name}</strong></td>
            <td>${structure.type}</td>
            <td>${structure.rate}%</td>
            <td>${structure.applicableFor}</td>
            <td>
                <label class="status-toggle">
                    <input type="checkbox" ${structure.isActive ? 'checked' : ''}
                           onchange="toggleTaxStructureStatus('${structure.id}', this.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span class="status ${structure.isActive ? 'active' : 'inactive'}">
                    ${structure.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
            </td>
            <td>
                <button class="action-btn edit" onclick="editTaxStructure('${structure.id}')" title="Edit Tax Structure">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteTaxStructure('${structure.id}')" title="Delete Tax Structure">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Toggle Tax Structure Status
function toggleTaxStructureStatus(id, isActive) {
    const structure = taxStructuresData.find(s => s.id === id);
    if (structure) {
        structure.isActive = isActive;

        // Refresh the current view
        switchView(currentView);

        // Show notification
        const status = isActive ? 'activated' : 'deactivated';
        showNotification(`Tax structure "${structure.name}" has been ${status}`, 'success');
    }
}

// Invoice Modal Functions
function openInvoiceModal() {
    const modal = document.getElementById('invoice-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeInvoiceModal() {
    const modal = document.getElementById('invoice-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('invoice-form').reset();
    resetInvoiceSummary();
}

// Setup Invoice Form
function setupInvoiceForm() {
    const form = document.getElementById('invoice-form');
    if (!form) return;

    // Add event listeners for real-time calculation
    form.addEventListener('input', calculateInvoiceSummary);
    form.addEventListener('change', calculateInvoiceSummary);
}

// Set Default Dates
function setDefaultDates() {
    const today = new Date();
    const invoiceDateField = document.getElementById('invoice-date');
    const dueDateField = document.getElementById('due-date');

    if (invoiceDateField) {
        invoiceDateField.value = today.toISOString().split('T')[0];
    }

    if (dueDateField) {
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 30); // 30 days from today
        dueDateField.value = dueDate.toISOString().split('T')[0];
    }
}

// Add Line Item
function addLineItem() {
    const container = document.getElementById('line-items-container');
    const lineItem = document.createElement('div');
    lineItem.className = 'line-item';

    lineItem.innerHTML = `
        <div class="line-item-row">
            <div class="form-group">
                <label>Product/Service *</label>
                <select name="product" required>
                    <option value="">Select Product</option>
                    <option value="brake-pad">Brake Pad Set - Auto Parts</option>
                    <option value="oil-filter">Oil Filter - Auto Parts</option>
                    <option value="tire-set">Tire Set - Auto Parts</option>
                    <option value="battery">Car Battery - Auto Parts</option>
                    <option value="service">Maintenance Service</option>
                </select>
            </div>
            <div class="form-group">
                <label>Quantity *</label>
                <input type="number" name="quantity" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label>Unit Price *</label>
                <input type="number" name="unitPrice" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <label>Tax Structure *</label>
                <select name="taxStructure" required>
                    <option value="">Select Tax</option>
                    ${taxStructuresData.filter(ts => ts.isActive).map(ts =>
                        `<option value="${ts.id}">${ts.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="text" name="lineAmount" readonly>
            </div>
            <div class="line-item-actions">
                <button type="button" class="btn-remove-line" onclick="removeLineItem(this)" title="Remove Line Item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    container.appendChild(lineItem);

    // Add event listeners for the new line item
    const inputs = lineItem.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateInvoiceSummary);
        input.addEventListener('change', calculateInvoiceSummary);
    });
}

// Remove Line Item
function removeLineItem(button) {
    const lineItem = button.closest('.line-item');
    const container = document.getElementById('line-items-container');

    // Don't remove if it's the only line item
    if (container.children.length > 1) {
        lineItem.remove();
        calculateInvoiceSummary();
    } else {
        showNotification('At least one line item is required', 'warning');
    }
}

// Calculate Invoice Summary
function calculateInvoiceSummary() {
    const lineItems = document.querySelectorAll('.line-item');
    let subtotal = 0;
    let totalTax = 0;

    lineItems.forEach(item => {
        const quantity = parseFloat(item.querySelector('[name="quantity"]').value) || 0;
        const unitPrice = parseFloat(item.querySelector('[name="unitPrice"]').value) || 0;
        const taxStructureId = item.querySelector('[name="taxStructure"]').value;

        const lineAmount = quantity * unitPrice;

        // Update line amount display
        item.querySelector('[name="lineAmount"]').value = `$${lineAmount.toFixed(2)}`;

        // Calculate tax for this line
        if (taxStructureId) {
            const taxStructure = taxStructuresData.find(ts => ts.id === taxStructureId);
            if (taxStructure) {
                const lineTax = (lineAmount * taxStructure.rate) / 100;
                totalTax += lineTax;
            }
        }

        subtotal += lineAmount;
    });

    const total = subtotal + totalTax;

    // Update summary display
    document.getElementById('subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total-tax-amount').textContent = `$${totalTax.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}

// Reset Invoice Summary
function resetInvoiceSummary() {
    document.getElementById('subtotal-amount').textContent = '$0.00';
    document.getElementById('total-tax-amount').textContent = '$0.00';
    document.getElementById('total-amount').textContent = '$0.00';

    // Reset line amounts
    const lineAmounts = document.querySelectorAll('[name="lineAmount"]');
    lineAmounts.forEach(input => input.value = '');
}

// Save Invoice
function saveInvoice() {
    const form = document.getElementById('invoice-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Collect line items data
    const lineItems = [];
    const lineItemElements = document.querySelectorAll('.line-item');

    lineItemElements.forEach(item => {
        const product = item.querySelector('[name="product"]').value;
        const quantity = item.querySelector('[name="quantity"]').value;
        const unitPrice = item.querySelector('[name="unitPrice"]').value;
        const taxStructure = item.querySelector('[name="taxStructure"]').value;

        if (product && quantity && unitPrice && taxStructure) {
            lineItems.push({
                product,
                quantity: parseFloat(quantity),
                unitPrice: parseFloat(unitPrice),
                taxStructure
            });
        }
    });

    if (lineItems.length === 0) {
        showNotification('Please add at least one valid line item', 'error');
        return;
    }

    // Create invoice object
    const invoice = {
        id: 'INV' + String(Date.now()).slice(-6),
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        customerType: formData.get('customerType'),
        billingAddress: formData.get('billingAddress'),
        customerState: formData.get('customerState'),
        taxId: formData.get('taxId'),
        invoiceDate: formData.get('invoiceDate'),
        dueDate: formData.get('dueDate'),
        currency: formData.get('currency'),
        paymentTerms: formData.get('paymentTerms'),
        notes: formData.get('notes'),
        lineItems: lineItems,
        status: 'pending'
    };

    // Calculate totals
    let subtotal = 0;
    let totalTax = 0;

    lineItems.forEach(item => {
        const lineAmount = item.quantity * item.unitPrice;
        subtotal += lineAmount;

        const taxStructure = taxStructuresData.find(ts => ts.id === item.taxStructure);
        if (taxStructure) {
            totalTax += (lineAmount * taxStructure.rate) / 100;
        }
    });

    invoice.amount = subtotal + totalTax;
    invoice.tax = totalTax;

    // Add to invoice data (in real app, this would be an API call)
    invoiceData.unshift(invoice);

    // Refresh invoice table
    populateInvoiceTable();

    // Close modal
    closeInvoiceModal();

    // Show success message
    showNotification(`Invoice ${invoice.id} created successfully!`, 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 2 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 2000);
}

// Material Design Initialization
function initializeMaterialDesign() {
    // Add Material Design classes to existing elements
    addMaterialDesignClasses();

    // Initialize ripple effects
    initializeRippleEffects();

    // Initialize Material Design tabs
    initializeMaterialTabs();

    // Initialize Material Design navigation
    initializeMaterialNavigation();
}

function addMaterialDesignClasses() {
    // Convert buttons to Material Design buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.add('md-button');
        if (btn.classList.contains('btn-primary')) {
            btn.classList.add('md-button-filled');
        } else if (btn.classList.contains('btn-secondary')) {
            btn.classList.add('md-button-outlined');
        }
    });

    // Convert cards to Material Design cards
    const cards = document.querySelectorAll('.stat-card, .tax-overview-card, .report-card, .modal-content');
    cards.forEach(card => {
        card.classList.add('md-card');
    });

    // Convert form inputs to Material Design text fields
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.add('md-text-field');
    });

    // Convert navigation items to Material Design navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.add('md-navigation-item');
    });

    // Convert tabs to Material Design tabs
    const tabContainer = document.querySelector('.tab-buttons');
    if (tabContainer) {
        tabContainer.classList.add('md-tabs');
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(tab => {
        tab.classList.add('md-tab');
    });
}

function initializeRippleEffects() {
    const rippleElements = document.querySelectorAll('.md-button, .md-navigation-item, .md-tab');
    rippleElements.forEach(element => {
        element.classList.add('md-ripple');
    });
}

function initializeMaterialTabs() {
    const tabs = document.querySelectorAll('.md-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Show target tab pane if data-tab attribute exists
            if (targetTab) {
                const tabPanes = document.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => pane.classList.remove('active'));
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            }
        });
    });
}

function initializeMaterialNavigation() {
    const navItems = document.querySelectorAll('.md-navigation-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

// Keyboard Shortcuts System
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Show a subtle notification about keyboard shortcuts
    setTimeout(() => {
        showNotification('Press F1 or Ctrl+H for keyboard shortcuts', 'info');
    }, 3000);
}

function handleKeyboardShortcuts(event) {
    // Check for modifier keys
    const isCtrl = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
    const isAlt = event.altKey;
    const isShift = event.shiftKey;

    // Prevent default browser shortcuts when our shortcuts are used
    if (isCtrl || isAlt) {
        // Global shortcuts with Ctrl/Cmd
        if (isCtrl && !isAlt && !isShift) {
            switch (event.key.toLowerCase()) {
                case 'n':
                    event.preventDefault();
                    openTaxRateModal();
                    showNotification('Keyboard shortcut: Ctrl+N - New Tax Rate', 'info');
                    break;
                case 's':
                    event.preventDefault();
                    saveCurrentForm();
                    showNotification('Keyboard shortcut: Ctrl+S - Save', 'info');
                    break;
                case 'f':
                    event.preventDefault();
                    focusSearchBox();
                    showNotification('Keyboard shortcut: Ctrl+F - Search', 'info');
                    break;
                case 'h':
                    event.preventDefault();
                    showKeyboardShortcutsHelp();
                    break;
                case 'e':
                    event.preventDefault();
                    exportTaxData();
                    showNotification('Keyboard shortcut: Ctrl+E - Export Data', 'info');
                    break;
                case 't':
                    event.preventDefault();
                    toggleThemeMenu();
                    showNotification('Keyboard shortcut: Ctrl+T - Toggle Theme', 'info');
                    break;
            }
        }

        // Alt shortcuts for navigation
        if (isAlt && !isCtrl && !isShift) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    navigateToPage('dashboard');
                    showNotification('Keyboard shortcut: Alt+1 - Dashboard', 'info');
                    break;
                case '2':
                    event.preventDefault();
                    navigateToPage('invoices');
                    showNotification('Keyboard shortcut: Alt+2 - Tax Management', 'info');
                    break;
                case '3':
                    event.preventDefault();
                    navigateToPage('tax-config');
                    showNotification('Keyboard shortcut: Alt+3 - Tax Structure', 'info');
                    break;
                case '4':
                    event.preventDefault();
                    navigateToPage('products');
                    showNotification('Keyboard shortcut: Alt+4 - Product Mapping', 'info');
                    break;
                case '5':
                    event.preventDefault();
                    navigateToPage('reports');
                    showNotification('Keyboard shortcut: Alt+5 - Reports', 'info');
                    break;
                case '6':
                    event.preventDefault();
                    navigateToPage('compliance');
                    showNotification('Keyboard shortcut: Alt+6 - Compliance', 'info');
                    break;
                case '7':
                    event.preventDefault();
                    navigateToPage('settings');
                    showNotification('Keyboard shortcut: Alt+7 - Settings', 'info');
                    break;
            }
        }

        // Tab navigation shortcuts
        if (isCtrl && isShift) {
            switch (event.key.toLowerCase()) {
                case 't':
                    event.preventDefault();
                    switchToNextTab();
                    showNotification('Keyboard shortcut: Ctrl+Shift+T - Next Tab', 'info');
                    break;
            }
        }
    }

    // Escape key shortcuts
    if (event.key === 'Escape') {
        event.preventDefault();
        closeAllModals();
        showNotification('Keyboard shortcut: Escape - Close Modals', 'info');
    }

    // Function keys
    switch (event.key) {
        case 'F1':
            event.preventDefault();
            showKeyboardShortcutsHelp();
            break;
        case 'F2':
            event.preventDefault();
            addTaxStructure();
            showNotification('Keyboard shortcut: F2 - Add Tax Structure', 'info');
            break;
        case 'F3':
            event.preventDefault();
            addTaxRate();
            showNotification('Keyboard shortcut: F3 - Add Tax Rate', 'info');
            break;
        case 'F4':
            event.preventDefault();
            addProductMapping();
            showNotification('Keyboard shortcut: F4 - Add Product Mapping', 'info');
            break;
        case 'F5':
            event.preventDefault();
            refreshCurrentPage();
            showNotification('Keyboard shortcut: F5 - Refresh Page', 'info');
            break;
    }
}

function saveCurrentForm() {
    // Check which modal is open and save accordingly
    const taxRateModal = document.getElementById('tax-rate-modal');
    const taxStructureModal = document.getElementById('tax-structure-modal');
    const taxRuleModal = document.getElementById('tax-rule-modal');
    const productMappingModal = document.getElementById('product-mapping-modal');

    if (taxRateModal && taxRateModal.style.display === 'block') {
        saveTaxRateModal();
    } else if (taxStructureModal && taxStructureModal.style.display === 'block') {
        saveTaxStructure();
    } else if (taxRuleModal && taxRuleModal.style.display === 'block') {
        saveTaxRule();
    } else if (productMappingModal && productMappingModal.style.display === 'block') {
        saveProductMapping();
    } else {
        showNotification('No form is currently open to save', 'warning');
    }
}

function focusSearchBox() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

function navigateToPage(pageId) {
    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (navItem) {
        navItem.click();
    }
}

function switchToNextTab() {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'tax-config') {
        const activeTab = document.querySelector('.tab-btn.active');
        const allTabs = document.querySelectorAll('.tab-btn');
        const currentIndex = Array.from(allTabs).indexOf(activeTab);
        const nextIndex = (currentIndex + 1) % allTabs.length;
        allTabs[nextIndex].click();
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function refreshCurrentPage() {
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        switch (activePage.id) {
            case 'dashboard':
                populateDashboard();
                break;
            case 'tax-config':
                populateTaxStructuresTable();
                populateJurisdictionsTable();
                populateTaxRatesTable();
                populateTaxRulesTable();
                break;
            case 'products':
                populateProductsTable();
                break;
            default:
                showNotification('Page refreshed', 'success');
        }
    }
}

// Tax Rules Helper Functions
function toggleTaxRuleStatus(id, isActive) {
    const rule = window.taxRulesData?.find(r => r.id === id);
    if (rule) {
        rule.isActive = isActive;
        populateTaxRulesTable();
        const status = isActive ? 'activated' : 'deactivated';
        showNotification(`Tax rule "${rule.name}" has been ${status}`, 'success');
    }
}

function editTaxRule(id) {
    showNotification('Edit tax rule functionality coming soon!', 'info');
}

function deleteTaxRule(id) {
    if (confirm('Are you sure you want to delete this tax rule? This action cannot be undone.')) {
        const index = window.taxRulesData?.findIndex(r => r.id === id);
        if (index > -1) {
            const ruleName = window.taxRulesData[index].name;
            window.taxRulesData.splice(index, 1);
            populateTaxRulesTable();
            showNotification(`Tax rule "${ruleName}" deleted successfully`, 'success');
        }
    }
}

function showKeyboardShortcutsHelp() {
    const helpModal = createKeyboardShortcutsModal();
    document.body.appendChild(helpModal);
    helpModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function createKeyboardShortcutsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'keyboard-shortcuts-modal';
    modal.innerHTML = `
        <div class="modal-content md-card" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h2 class="md-title-large">
                    <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">keyboard</span>
                    Keyboard Shortcuts
                </h2>
                <span class="close" onclick="closeKeyboardShortcutsModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="shortcuts-section">
                    <h3 class="md-title-medium">Global Shortcuts</h3>
                    <div class="shortcut-list">
                        <div class="shortcut-item">
                            <kbd>Ctrl + N</kbd>
                            <span>New Tax Rate</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + S</kbd>
                            <span>Save Current Form</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + F</kbd>
                            <span>Focus Search Box</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + E</kbd>
                            <span>Export Data</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + T</kbd>
                            <span>Toggle Theme Menu</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + H</kbd>
                            <span>Show This Help</span>
                        </div>
                    </div>
                </div>

                <div class="shortcuts-section">
                    <h3 class="md-title-medium">Navigation Shortcuts</h3>
                    <div class="shortcut-list">
                        <div class="shortcut-item">
                            <kbd>Alt + 1</kbd>
                            <span>Dashboard</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + 2</kbd>
                            <span>Tax Management</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + 3</kbd>
                            <span>Tax Structure</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + 4</kbd>
                            <span>Product Mapping</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + 5</kbd>
                            <span>Reports</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + 6</kbd>
                            <span>Compliance</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt + 7</kbd>
                            <span>Settings</span>
                        </div>
                    </div>
                </div>

                <div class="shortcuts-section">
                    <h3 class="md-title-medium">Function Keys</h3>
                    <div class="shortcut-list">
                        <div class="shortcut-item">
                            <kbd>F1</kbd>
                            <span>Show Keyboard Shortcuts</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>F2</kbd>
                            <span>Add Tax Structure</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>F3</kbd>
                            <span>Add Tax Rate</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>F4</kbd>
                            <span>Add Product Mapping</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>F5</kbd>
                            <span>Refresh Current Page</span>
                        </div>
                    </div>
                </div>

                <div class="shortcuts-section">
                    <h3 class="md-title-medium">Other Shortcuts</h3>
                    <div class="shortcut-list">
                        <div class="shortcut-item">
                            <kbd>Escape</kbd>
                            <span>Close All Modals</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + Shift + T</kbd>
                            <span>Switch to Next Tab</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary md-button md-button-filled" onclick="closeKeyboardShortcutsModal()">
                    Got it!
                </button>
            </div>
        </div>
    `;
    return modal;
}

function closeKeyboardShortcutsModal() {
    const modal = document.getElementById('keyboard-shortcuts-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Product Mapping Modal Functions
function addProductMapping() {
    const modal = document.getElementById('product-mapping-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('effective-from').value = today;

    // Set default tax exemption
    document.getElementById('tax-exemption').value = 'No';

    // Initialize jurisdiction selector
    initializeJurisdictionSelector();
}

// Jurisdiction Selector Functions
function initializeJurisdictionSelector() {
    const searchInput = document.getElementById('jurisdiction-search');
    const dropdown = document.getElementById('jurisdiction-dropdown');
    const selectedContainer = document.getElementById('selected-jurisdictions');

    // Clear any existing selections
    clearJurisdictionSelections();

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const options = dropdown.querySelectorAll('.jurisdiction-option');

        options.forEach(option => {
            const label = option.querySelector('label').textContent.toLowerCase();
            if (label.includes(searchTerm)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    });

    // Show dropdown on focus
    searchInput.addEventListener('focus', function() {
        dropdown.classList.add('show');
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.jurisdiction-selector')) {
            dropdown.classList.remove('show');
        }
    });

    // Handle checkbox changes
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedJurisdictions();
        });
    });
}

function clearJurisdictionSelections() {
    const checkboxes = document.querySelectorAll('#jurisdiction-dropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedJurisdictions();
}

function updateSelectedJurisdictions() {
    const selectedContainer = document.getElementById('selected-jurisdictions');
    const checkboxes = document.querySelectorAll('#jurisdiction-dropdown input[type="checkbox"]:checked');

    selectedContainer.innerHTML = '';

    if (checkboxes.length === 0) {
        selectedContainer.innerHTML = '<span class="placeholder-text">No jurisdictions selected</span>';
    } else {
        checkboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent;
            const tag = document.createElement('div');
            tag.className = 'jurisdiction-tag';
            tag.innerHTML = `
                ${label}
                <button type="button" class="remove-btn" onclick="removeJurisdiction('${checkbox.value}')">&times;</button>
            `;
            selectedContainer.appendChild(tag);
        });
    }
}

function removeJurisdiction(value) {
    const checkbox = document.getElementById(`jurisdiction-${value}`);
    if (checkbox) {
        checkbox.checked = false;
        updateSelectedJurisdictions();
    }
}

function getSelectedJurisdictions() {
    const checkboxes = document.querySelectorAll('#jurisdiction-dropdown input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function setSelectedJurisdictions(jurisdictions) {
    // Clear all selections first
    clearJurisdictionSelections();

    // Set the specified jurisdictions
    if (jurisdictions && jurisdictions.length > 0) {
        jurisdictions.forEach(jurisdiction => {
            const checkbox = document.getElementById(`jurisdiction-${jurisdiction}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        updateSelectedJurisdictions();
    }
}

function closeProductMappingModal() {
    const modal = document.getElementById('product-mapping-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('product-mapping-form').reset();
}

function saveProductMapping() {
    const form = document.getElementById('product-mapping-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get selected jurisdictions
    const selectedJurisdictions = getSelectedJurisdictions();

    // Create new product mapping object
    const newProduct = {
        code: formData.get('productCode').toUpperCase(),
        name: formData.get('productName'),
        category: formData.get('productCategory'),
        hsn: formData.get('hsnSacCode'),
        taxClass: formData.get('taxClass'),
        unitOfMeasure: formData.get('unitOfMeasure') || 'PCS',
        description: formData.get('productDescription') || '',
        defaultTaxRate: parseFloat(formData.get('defaultTaxRate')) || 0,
        taxExemption: formData.get('taxExemption'),
        applicableJurisdictions: selectedJurisdictions,
        effectiveFrom: formData.get('effectiveFrom'),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };

    // Check if product code already exists
    const existingProduct = productData.find(p => p.code === newProduct.code);
    if (existingProduct) {
        showNotification(`Product with code "${newProduct.code}" already exists`, 'error');
        return;
    }

    // Add to product data
    productData.push(newProduct);

    // Refresh products table
    populateProductsTable();

    // Close modal
    closeProductMappingModal();

    // Show success message
    showNotification(`Product mapping "${newProduct.name}" created successfully!`, 'success');
}

function editProduct(productCode) {
    const product = productData.find(p => p.code === productCode);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }

    // Open modal
    addProductMapping();

    // Populate form with existing data
    document.getElementById('product-code').value = product.code;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('hsn-sac-code').value = product.hsn;
    document.getElementById('tax-class').value = product.taxClass;
    document.getElementById('unit-of-measure').value = product.unitOfMeasure || 'PCS';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('default-tax-rate').value = product.defaultTaxRate || '';
    document.getElementById('tax-exemption').value = product.taxExemption || 'No';
    document.getElementById('effective-from').value = product.effectiveFrom || '';

    // Set selected jurisdictions
    if (product.applicableJurisdictions) {
        setSelectedJurisdictions(product.applicableJurisdictions);
    }

    // Change modal title and button
    document.querySelector('#product-mapping-modal .modal-header h2').textContent = 'Edit Product Mapping';
    document.querySelector('#product-mapping-modal .btn-primary').textContent = 'Update Product Mapping';
    document.querySelector('#product-mapping-modal .btn-primary').setAttribute('onclick', `updateProductMapping('${productCode}')`);

    // Make product code readonly for editing
    document.getElementById('product-code').readOnly = true;
}

function updateProductMapping(productCode) {
    const form = document.getElementById('product-mapping-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get selected jurisdictions
    const selectedJurisdictions = getSelectedJurisdictions();

    // Find and update the product
    const index = productData.findIndex(p => p.code === productCode);
    if (index > -1) {
        productData[index] = {
            ...productData[index],
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            hsn: formData.get('hsnSacCode'),
            taxClass: formData.get('taxClass'),
            unitOfMeasure: formData.get('unitOfMeasure') || 'PCS',
            description: formData.get('productDescription') || '',
            defaultTaxRate: parseFloat(formData.get('defaultTaxRate')) || 0,
            taxExemption: formData.get('taxExemption'),
            applicableJurisdictions: selectedJurisdictions,
            effectiveFrom: formData.get('effectiveFrom'),
            lastModified: new Date().toISOString().split('T')[0]
        };

        // Refresh table
        populateProductsTable();

        // Close modal and reset
        closeProductMappingModal();

        // Reset modal for next use
        document.querySelector('#product-mapping-modal .modal-header h2').textContent = 'Add Product Mapping';
        document.querySelector('#product-mapping-modal .btn-primary').textContent = 'Save Product Mapping';
        document.querySelector('#product-mapping-modal .btn-primary').setAttribute('onclick', 'saveProductMapping()');
        document.getElementById('product-code').readOnly = false;

        // Show success message
        showNotification('Product mapping updated successfully!', 'success');
    }
}

function deleteProduct(productCode) {
    if (confirm('Are you sure you want to delete this product mapping?')) {
        const index = productData.findIndex(p => p.code === productCode);
        if (index > -1) {
            const productName = productData[index].name;
            productData.splice(index, 1);
            populateProductsTable();
            showNotification(`Product mapping "${productName}" deleted successfully!`, 'success');
        }
    }
}

// Tax Structure Modal Functions
function addTaxStructure() {
    const modal = document.getElementById('tax-structure-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('effective-date').value = today;
}

function closeTaxStructureModal() {
    const modal = document.getElementById('tax-structure-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('tax-structure-form').reset();
}

function saveTaxStructure() {
    const form = document.getElementById('tax-structure-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Generate unique ID
    const id = formData.get('taxStructureName').toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Create new tax structure object
    const newTaxStructure = {
        id: id,
        name: formData.get('taxStructureName'),
        type: formData.get('taxType'),
        rate: parseFloat(formData.get('taxRate')),
        applicableFor: formData.get('applicableFor'),
        jurisdiction: formData.get('jurisdiction') || 'National',
        effectiveDate: formData.get('effectiveDate'),
        description: formData.get('taxDescription'),
        isActive: formData.get('isActive') === 'on'
    };

    // Check if tax structure already exists
    const existingIndex = taxStructuresData.findIndex(ts => ts.id === id);
    if (existingIndex > -1) {
        showNotification('Tax structure with this name already exists', 'error');
        return;
    }

    // Add to tax structures data
    taxStructuresData.push(newTaxStructure);

    // Refresh table and dashboard
    populateTaxStructuresTable();
    populateDashboard();

    // Close modal
    closeTaxStructureModal();

    // Show success message
    showNotification(`Tax structure "${newTaxStructure.name}" created successfully!`, 'success');
}

// Tax Rule Modal Functions
function addTaxRule() {
    const modal = document.getElementById('tax-rule-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rule-effective-date').value = today;
}

function closeTaxRuleModal() {
    const modal = document.getElementById('tax-rule-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('tax-rule-form').reset();
}

function saveTaxRule() {
    const form = document.getElementById('tax-rule-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Create new tax rule object
    const newTaxRule = {
        id: Date.now().toString(),
        name: formData.get('ruleName'),
        country: formData.get('ruleCountry'),
        state: formData.get('ruleState') || '',
        taxType: formData.get('ruleTaxType'),
        rate: parseFloat(formData.get('ruleRate')),
        currency: formData.get('ruleCurrency'),
        priority: parseInt(formData.get('rulePriority')) || 2,
        effectiveDate: formData.get('ruleEffectiveDate'),
        conditions: formData.get('ruleConditions'),
        isActive: formData.get('ruleIsActive') === 'on'
    };

    // Add to jurisdiction data (extending existing structure)
    const newJurisdiction = {
        country: getCountryName(newTaxRule.country),
        state: newTaxRule.state || 'All States',
        taxType: newTaxRule.taxType,
        rate: newTaxRule.rate,
        status: newTaxRule.isActive ? 'active' : 'inactive'
    };

    jurisdictionData.push(newJurisdiction);

    // Refresh tables
    populateJurisdictionsTable();

    // Close modal
    closeTaxRuleModal();

    // Show success message
    showNotification(`Tax rule "${newTaxRule.name}" created successfully!`, 'success');
}

// Jurisdiction Modal Functions
function closeJurisdictionModal() {
    const modal = document.getElementById('jurisdiction-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('jurisdiction-form').reset();
}

function saveJurisdiction() {
    const form = document.getElementById('jurisdiction-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Create new jurisdiction object
    const newJurisdiction = {
        country: formData.get('jurisdictionCountry'),
        state: formData.get('jurisdictionState') || 'All States',
        taxType: formData.get('jurisdictionTaxType'),
        rate: parseFloat(formData.get('jurisdictionRate')),
        status: formData.get('jurisdictionIsActive') === 'on' ? 'active' : 'inactive',
        effectiveDate: formData.get('jurisdictionEffectiveDate'),
        description: formData.get('jurisdictionDescription')
    };

    // Check if jurisdiction already exists
    const existingIndex = jurisdictionData.findIndex(j =>
        j.country === newJurisdiction.country && j.state === newJurisdiction.state
    );
    if (existingIndex > -1) {
        showNotification('Jurisdiction with this country and state already exists', 'error');
        return;
    }

    // Add to jurisdiction data
    jurisdictionData.push(newJurisdiction);

    // Refresh table and dashboard
    populateJurisdictionsTable();
    populateDashboard();

    // Close modal
    closeJurisdictionModal();

    // Show success message
    showNotification(`Jurisdiction "${newJurisdiction.country} - ${newJurisdiction.state}" created successfully!`, 'success');
}

// Helper function to get country name from code
function getCountryName(code) {
    const countries = {
        'US': 'United States',
        'IN': 'India',
        'UK': 'United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France'
    };
    return countries[code] || code;
}

function editTaxStructure(id) {
    const structure = taxStructuresData.find(ts => ts.id === id);
    if (!structure) {
        showNotification('Tax structure not found', 'error');
        return;
    }

    // Open modal
    addTaxStructure();

    // Populate form with existing data
    document.getElementById('tax-structure-name').value = structure.name;
    document.getElementById('tax-type').value = structure.type;
    document.getElementById('tax-rate').value = structure.rate;
    document.getElementById('applicable-for').value = structure.applicableFor;
    document.getElementById('jurisdiction').value = structure.jurisdiction || '';
    document.getElementById('effective-date').value = structure.effectiveDate || '';
    document.getElementById('tax-description').value = structure.description || '';
    document.getElementById('is-active').checked = structure.isActive;

    // Change modal title and button text
    document.querySelector('#tax-structure-modal .modal-header h2').textContent = 'Edit Tax Structure';
    document.querySelector('#tax-structure-modal .btn-primary').textContent = 'Update Tax Structure';
    document.querySelector('#tax-structure-modal .btn-primary').setAttribute('onclick', `updateTaxStructure('${id}')`);
}

function updateTaxStructure(id) {
    const form = document.getElementById('tax-structure-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Find and update the tax structure
    const index = taxStructuresData.findIndex(ts => ts.id === id);
    if (index > -1) {
        taxStructuresData[index] = {
            ...taxStructuresData[index],
            name: formData.get('taxStructureName'),
            type: formData.get('taxType'),
            rate: parseFloat(formData.get('taxRate')),
            applicableFor: formData.get('applicableFor'),
            jurisdiction: formData.get('jurisdiction') || 'National',
            effectiveDate: formData.get('effectiveDate'),
            description: formData.get('taxDescription'),
            isActive: formData.get('isActive') === 'on'
        };

        // Refresh table and dashboard
        populateTaxStructuresTable();
        populateDashboard();

        // Close modal
        closeTaxStructureModal();

        // Reset modal for next use
        document.querySelector('#tax-structure-modal .modal-header h2').textContent = 'Add New Tax Structure';
        document.querySelector('#tax-structure-modal .btn-primary').textContent = 'Save Tax Structure';
        document.querySelector('#tax-structure-modal .btn-primary').setAttribute('onclick', 'saveTaxStructure()');

        // Show success message
        showNotification('Tax structure updated successfully!', 'success');
    }
}

function deleteTaxStructure(id) {
    if (confirm('Are you sure you want to delete this tax structure?')) {
        const index = taxStructuresData.findIndex(ts => ts.id === id);
        if (index > -1) {
            const structureName = taxStructuresData[index].name;
            taxStructuresData.splice(index, 1);
            populateTaxStructuresTable();
            populateDashboard(); // Refresh dashboard stats
            showNotification(`Tax structure "${structureName}" deleted successfully`, 'success');
        }
    }
}

// Dashboard Functions
function populateDashboard() {
    populateTaxStructureOverview();
    populateRecentActivity();
    updateDashboardStats();
}

function populateTaxStructureOverview() {
    // Group tax structures by type
    const gstStructures = taxStructuresData.filter(ts => ts.type === 'GST');
    const igstStructures = taxStructuresData.filter(ts => ts.type === 'IGST');
    const salesTaxStructures = taxStructuresData.filter(ts => ts.type === 'Sales Tax');
    const vatStructures = taxStructuresData.filter(ts => ts.type === 'VAT');

    // Populate GST items
    populateTaxTypeSection('gst-items', gstStructures);
    populateTaxTypeSection('igst-items', igstStructures);
    populateTaxTypeSection('sales-tax-items', salesTaxStructures);
    populateTaxTypeSection('vat-items', vatStructures);
}

function populateTaxTypeSection(containerId, structures) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (structures.length === 0) {
        container.innerHTML = '<div class="no-items" style="padding: 1rem; text-align: center; color: #6b7280; font-style: italic;">No structures configured</div>';
        return;
    }

    container.innerHTML = structures.map(structure => `
        <div class="tax-item">
            <div class="tax-item-info">
                <div class="tax-item-name">${structure.name}</div>
                <div class="tax-item-details">${structure.applicableFor}</div>
            </div>
            <div class="tax-item-rate">${structure.rate}%</div>
        </div>
    `).join('');
}

function populateRecentActivity() {
    const activities = [
        {
            icon: 'fas fa-plus',
            title: 'New tax structure "GST 18%" added',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-edit',
            title: 'Updated IGST rate for luxury items',
            time: '4 hours ago'
        },
        {
            icon: 'fas fa-file-invoice',
            title: 'Invoice #INV-2024-001 created',
            time: '6 hours ago'
        },
        {
            icon: 'fas fa-cog',
            title: 'Tax rule for California updated',
            time: '1 day ago'
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'Compliance check completed',
            time: '2 days ago'
        }
    ];

    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function updateDashboardStats() {
    // Update active tax count
    const activeTaxCount = taxStructuresData.filter(ts => ts.isActive).length;
    const activeTaxElement = document.getElementById('active-tax-count');
    if (activeTaxElement) {
        activeTaxElement.textContent = activeTaxCount;
    }

    // Update jurisdiction count
    const uniqueJurisdictions = new Set(jurisdictionData.map(j => j.country)).size;
    const jurisdictionElement = document.getElementById('jurisdiction-count');
    if (jurisdictionElement) {
        jurisdictionElement.textContent = uniqueJurisdictions;
    }

    // Calculate average tax rate
    const totalRate = taxStructuresData.reduce((sum, ts) => sum + ts.rate, 0);
    const avgRate = taxStructuresData.length > 0 ? (totalRate / taxStructuresData.length).toFixed(1) : 0;
    const avgRateElement = document.getElementById('avg-tax-rate');
    if (avgRateElement) {
        avgRateElement.textContent = `${avgRate}%`;
    }

    // Update tax rate summary
    updateTaxRateSummary();
}

function updateTaxRateSummary() {
    if (taxStructuresData.length === 0) return;

    const rates = taxStructuresData.map(ts => ts.rate);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);

    // Find most common rate
    const rateFrequency = {};
    rates.forEach(rate => {
        rateFrequency[rate] = (rateFrequency[rate] || 0) + 1;
    });
    const mostCommonRate = Object.keys(rateFrequency).reduce((a, b) =>
        rateFrequency[a] > rateFrequency[b] ? a : b
    );

    // Find tax types for highest and lowest rates
    const highestRateStructure = taxStructuresData.find(ts => ts.rate === maxRate);
    const lowestRateStructure = taxStructuresData.find(ts => ts.rate === minRate);
    const commonRateStructures = taxStructuresData.filter(ts => ts.rate == mostCommonRate);
    const commonTypes = [...new Set(commonRateStructures.map(ts => ts.type))].join('/');

    // Update elements
    const highestRateElement = document.getElementById('highest-rate');
    if (highestRateElement) {
        highestRateElement.textContent = `${maxRate}% (${highestRateStructure.type})`;
    }

    const lowestRateElement = document.getElementById('lowest-rate');
    if (lowestRateElement) {
        lowestRateElement.textContent = `${minRate}% (${lowestRateStructure.type})`;
    }

    const commonRateElement = document.getElementById('common-rate');
    if (commonRateElement) {
        commonRateElement.textContent = `${mostCommonRate}% (${commonTypes})`;
    }

    const totalStructuresElement = document.getElementById('total-structures');
    if (totalStructuresElement) {
        totalStructuresElement.textContent = taxStructuresData.length;
    }
}

// Tax Rates Functions
function addTaxRate() {
    // Open the tax rate modal instead of inline form
    openTaxRateModal();
}

function openTaxRateModal() {
    const modal = document.getElementById('tax-rate-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modal-rate-effective-date').value = today;
    // Set default currency
    document.getElementById('modal-rate-currency').value = 'USD';

    // Reset modal title and button for new tax rate
    document.querySelector('#tax-rate-modal .modal-header h2').textContent = 'Configure New Tax Rate';
    document.querySelector('#tax-rate-modal .btn-primary').textContent = 'Save Tax Rate';
    document.querySelector('#tax-rate-modal .btn-primary').setAttribute('onclick', 'saveTaxRateModal()');
}

function closeTaxRateModal() {
    const modal = document.getElementById('tax-rate-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('tax-rate-modal-form').reset();
}

function cancelTaxRate() {
    const form = document.getElementById('rate-config-form');
    if (form) {
        form.style.display = 'none';
        // Reset form
        document.getElementById('tax-rate-form').reset();
    }
}

function saveTaxRateModal() {
    const form = document.getElementById('tax-rate-modal-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Create new tax rate object
    const newTaxRate = {
        id: Date.now().toString(),
        jurisdiction: formData.get('jurisdiction'),
        taxType: formData.get('taxType'),
        rate: parseFloat(formData.get('rate')),
        category: formData.get('category') || 'Standard',
        currency: formData.get('currency'),
        effectiveDate: formData.get('effectiveDate'),
        description: formData.get('description'),
        status: 'active'
    };

    // Add to tax rates data (create array if it doesn't exist)
    if (!window.taxRatesData) {
        window.taxRatesData = [];
    }
    window.taxRatesData.push(newTaxRate);

    // Refresh tax rates table
    populateTaxRatesTable();

    // Close modal
    closeTaxRateModal();

    // Show success message
    showNotification(`Tax rate for ${newTaxRate.jurisdiction} created successfully!`, 'success');
}

function saveTaxRate() {
    const form = document.getElementById('tax-rate-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Create new tax rate object
    const newTaxRate = {
        id: Date.now().toString(),
        jurisdiction: formData.get('jurisdiction'),
        taxType: formData.get('taxType'),
        rate: parseFloat(formData.get('rate')),
        category: formData.get('category') || 'Standard',
        currency: formData.get('currency'),
        effectiveDate: formData.get('effectiveDate'),
        description: formData.get('description'),
        status: 'active'
    };

    // Add to tax rates data (create array if it doesn't exist)
    if (!window.taxRatesData) {
        window.taxRatesData = [];
    }
    window.taxRatesData.push(newTaxRate);

    // Refresh tax rates table
    populateTaxRatesTable();

    // Hide form
    cancelTaxRate();

    // Show success message
    showNotification(`Tax rate for ${newTaxRate.jurisdiction} created successfully!`, 'success');
}

function populateTaxRatesTable() {
    const tbody = document.getElementById('tax-rates-tbody');
    if (!tbody || !window.taxRatesData) return;

    if (window.taxRatesData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="tax-rates-empty">
                    <i class="fas fa-percentage"></i>
                    <h4>No Tax Rates Configured</h4>
                    <p>Click "Add Tax Rate" to create your first tax rate configuration.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = window.taxRatesData.map(rate => `
        <tr>
            <td class="rate-jurisdiction">${rate.jurisdiction}</td>
            <td>${rate.taxType}</td>
            <td class="rate-percentage">${rate.rate}%</td>
            <td><span class="rate-category ${rate.category.toLowerCase()}">${rate.category}</span></td>
            <td><span class="rate-currency">${rate.currency}</span></td>
            <td>${rate.effectiveDate || 'N/A'}</td>
            <td><span class="rate-status ${rate.status}">${rate.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editTaxRate('${rate.id}')" title="Edit Tax Rate">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteTaxRate('${rate.id}')" title="Delete Tax Rate">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editTaxRate(id) {
    const rate = window.taxRatesData?.find(r => r.id === id);
    if (!rate) {
        showNotification('Tax rate not found', 'error');
        return;
    }

    // Open modal
    openTaxRateModal();

    // Populate modal form with existing data
    document.getElementById('modal-rate-jurisdiction').value = rate.jurisdiction;
    document.getElementById('modal-rate-tax-type').value = rate.taxType;
    document.getElementById('modal-rate-percentage').value = rate.rate;
    document.getElementById('modal-rate-category').value = rate.category;
    document.getElementById('modal-rate-currency').value = rate.currency;
    document.getElementById('modal-rate-effective-date').value = rate.effectiveDate || '';
    document.getElementById('modal-rate-description').value = rate.description || '';

    // Change modal title and button to update
    document.querySelector('#tax-rate-modal .modal-header h2').textContent = 'Edit Tax Rate';
    document.querySelector('#tax-rate-modal .btn-primary').textContent = 'Update Tax Rate';
    document.querySelector('#tax-rate-modal .btn-primary').setAttribute('onclick', `updateTaxRateModal('${id}')`);
}

function updateTaxRateModal(id) {
    const form = document.getElementById('tax-rate-modal-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Find and update the tax rate
    const index = window.taxRatesData?.findIndex(r => r.id === id);
    if (index > -1) {
        window.taxRatesData[index] = {
            ...window.taxRatesData[index],
            jurisdiction: formData.get('jurisdiction'),
            taxType: formData.get('taxType'),
            rate: parseFloat(formData.get('rate')),
            category: formData.get('category') || 'Standard',
            currency: formData.get('currency'),
            effectiveDate: formData.get('effectiveDate'),
            description: formData.get('description')
        };

        // Refresh table
        populateTaxRatesTable();

        // Close modal and reset button
        closeTaxRateModal();

        // Show success message
        showNotification('Tax rate updated successfully!', 'success');
    }
}

function updateTaxRate(id) {
    const form = document.getElementById('tax-rate-form');
    const formData = new FormData(form);

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Find and update the tax rate
    const index = window.taxRatesData?.findIndex(r => r.id === id);
    if (index > -1) {
        window.taxRatesData[index] = {
            ...window.taxRatesData[index],
            jurisdiction: formData.get('jurisdiction'),
            taxType: formData.get('taxType'),
            rate: parseFloat(formData.get('rate')),
            category: formData.get('category') || 'Standard',
            currency: formData.get('currency'),
            effectiveDate: formData.get('effectiveDate'),
            description: formData.get('description')
        };

        // Refresh table
        populateTaxRatesTable();

        // Hide form and reset button
        cancelTaxRate();
        const saveBtn = document.querySelector('#rate-config-form .btn-primary');
        if (saveBtn) {
            saveBtn.textContent = 'Save Tax Rate';
            saveBtn.setAttribute('onclick', 'saveTaxRate()');
        }

        // Show success message
        showNotification('Tax rate updated successfully!', 'success');
    }
}

function deleteTaxRate(id) {
    if (confirm('Are you sure you want to delete this tax rate?')) {
        const index = window.taxRatesData?.findIndex(r => r.id === id);
        if (index > -1) {
            const rateName = `${window.taxRatesData[index].jurisdiction} ${window.taxRatesData[index].taxType}`;
            window.taxRatesData.splice(index, 1);
            populateTaxRatesTable();
            showNotification(`Tax rate "${rateName}" deleted successfully`, 'success');
        }
    }
}









// Settings Functions
function changeTheme(theme, showNotif = true) {
    // Remove existing theme classes
    document.body.classList.remove('theme-blue', 'theme-navy', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red', 'theme-dark', 'theme-light');

    // Add new theme class
    document.body.classList.add(`theme-${theme}`);

    // Save to localStorage
    localStorage.setItem('selectedTheme', theme);

    // Only show notification if explicitly requested (not during startup)
    if (showNotif) {
        showNotification(`Theme changed to ${theme}`, 'success');
    }
}

function toggleDarkMode(enabled, showNotif = true) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
    if (showNotif) {
        showNotification(`Dark mode ${enabled ? 'enabled' : 'disabled'}`, 'success');
    }
}

function toggleHighContrast(enabled, showNotif = true) {
    if (enabled) {
        document.body.classList.add('high-contrast');
        localStorage.setItem('highContrast', 'enabled');
    } else {
        document.body.classList.remove('high-contrast');
        localStorage.setItem('highContrast', 'disabled');
    }
    if (showNotif) {
        showNotification(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`, 'success');
    }
}

function changeSidebarWidth(width, showNotif = true) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.remove('sidebar-narrow', 'sidebar-normal', 'sidebar-wide');
        sidebar.classList.add(`sidebar-${width}`);
        localStorage.setItem('sidebarWidth', width);
        if (showNotif) {
            showNotification(`Sidebar width changed to ${width}`, 'success');
        }
    }
}

function changeContentDensity(density, showNotif = true) {
    document.body.classList.remove('density-compact', 'density-normal', 'density-comfortable');
    document.body.classList.add(`density-${density}`);
    localStorage.setItem('contentDensity', density);
    if (showNotif) {
        showNotification(`Content density changed to ${density}`, 'success');
    }
}

function toggleAnimations(enabled, showNotif = true) {
    if (enabled) {
        document.body.classList.remove('no-animations');
        localStorage.setItem('animations', 'enabled');
    } else {
        document.body.classList.add('no-animations');
        localStorage.setItem('animations', 'disabled');
    }
    if (showNotif) {
        showNotification(`Animations ${enabled ? 'enabled' : 'disabled'}`, 'success');
    }
}

function changeTableRowHeight(height, showNotif = true) {
    document.body.classList.remove('table-compact', 'table-normal', 'table-large');
    document.body.classList.add(`table-${height}`);
    localStorage.setItem('tableRowHeight', height);
    if (showNotif) {
        showNotification(`Table row height changed to ${height}`, 'success');
    }
}

function changeFontFamily(family, showNotif = true) {
    document.body.classList.remove('font-system', 'font-inter', 'font-roboto', 'font-open-sans', 'font-lato', 'font-source-sans', 'font-arial', 'font-helvetica');
    document.body.classList.add(`font-${family}`);
    localStorage.setItem('fontFamily', family);
    if (showNotif) {
        showNotification(`Font family changed to ${family}`, 'success');
    }
}

function changeFontSize(size, showNotif = true) {
    document.body.classList.remove('font-small', 'font-normal', 'font-medium', 'font-large', 'font-extra-large');
    document.body.classList.add(`font-${size}`);
    localStorage.setItem('fontSize', size);
    if (showNotif) {
        showNotification(`Font size changed to ${size}`, 'success');
    }
}

function changeFontWeight(weight, showNotif = true) {
    document.body.classList.remove('font-light', 'font-normal', 'font-medium', 'font-semi-bold', 'font-bold');
    document.body.classList.add(`font-${weight}`);
    localStorage.setItem('fontWeight', weight);
    if (showNotif) {
        showNotification(`Font weight changed to ${weight}`, 'success');
    }
}

function changeLineHeight(height, showNotif = true) {
    document.body.classList.remove('line-tight', 'line-normal', 'line-relaxed', 'line-loose');
    document.body.classList.add(`line-${height}`);
    localStorage.setItem('lineHeight', height);
    if (showNotif) {
        showNotification(`Line height changed to ${height}`, 'success');
    }
}

function saveSettings() {
    const settings = {
        theme: document.getElementById('theme-selector').value,
        darkMode: document.getElementById('dark-mode-toggle').checked,
        highContrast: document.getElementById('high-contrast-toggle').checked,
        sidebarWidth: document.getElementById('sidebar-width').value,
        contentDensity: document.getElementById('content-density').value,
        animations: document.getElementById('animations-toggle').checked,
        tableRowHeight: document.getElementById('table-row-height').value,
        fontFamily: document.getElementById('font-family').value,
        fontSize: document.getElementById('font-size').value,
        fontWeight: document.getElementById('font-weight').value,
        lineHeight: document.getElementById('line-height').value
    };

    localStorage.setItem('userSettings', JSON.stringify(settings));
    showNotification('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
        // Clear localStorage
        localStorage.removeItem('userSettings');
        localStorage.removeItem('selectedTheme');
        localStorage.removeItem('darkMode');
        localStorage.removeItem('highContrast');
        localStorage.removeItem('sidebarWidth');
        localStorage.removeItem('contentDensity');
        localStorage.removeItem('animations');
        localStorage.removeItem('tableRowHeight');
        localStorage.removeItem('fontFamily');
        localStorage.removeItem('fontSize');
        localStorage.removeItem('fontWeight');
        localStorage.removeItem('lineHeight');

        // Reset to defaults
        document.getElementById('theme-selector').value = 'blue';
        document.getElementById('dark-mode-toggle').checked = false;
        document.getElementById('high-contrast-toggle').checked = false;
        document.getElementById('sidebar-width').value = 'normal';
        document.getElementById('content-density').value = 'normal';
        document.getElementById('animations-toggle').checked = true;
        document.getElementById('table-row-height').value = 'normal';
        document.getElementById('font-family').value = 'system';
        document.getElementById('font-size').value = 'normal';
        document.getElementById('font-weight').value = 'normal';
        document.getElementById('line-height').value = 'normal';

        // Apply defaults
        changeTheme('blue');
        toggleDarkMode(false);
        toggleHighContrast(false);
        changeSidebarWidth('normal');
        changeContentDensity('normal');
        toggleAnimations(true);
        changeTableRowHeight('normal');
        changeFontFamily('system');
        changeFontSize('normal');
        changeFontWeight('normal');
        changeLineHeight('normal');

        showNotification('Settings reset to defaults', 'success');
    }
}

function exportSettings() {
    const settings = {
        theme: document.getElementById('theme-selector').value,
        darkMode: document.getElementById('dark-mode-toggle').checked,
        highContrast: document.getElementById('high-contrast-toggle').checked,
        sidebarWidth: document.getElementById('sidebar-width').value,
        contentDensity: document.getElementById('content-density').value,
        animations: document.getElementById('animations-toggle').checked,
        tableRowHeight: document.getElementById('table-row-height').value,
        fontFamily: document.getElementById('font-family').value,
        fontSize: document.getElementById('font-size').value,
        fontWeight: document.getElementById('font-weight').value,
        lineHeight: document.getElementById('line-height').value,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'tax-app-settings.json';
    link.click();

    URL.revokeObjectURL(url);
    showNotification('Settings exported successfully!', 'success');
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const settings = JSON.parse(e.target.result);

                    // Apply imported settings
                    if (settings.theme) {
                        document.getElementById('theme-selector').value = settings.theme;
                        changeTheme(settings.theme);
                    }
                    if (settings.darkMode !== undefined) {
                        document.getElementById('dark-mode-toggle').checked = settings.darkMode;
                        toggleDarkMode(settings.darkMode);
                    }
                    if (settings.highContrast !== undefined) {
                        document.getElementById('high-contrast-toggle').checked = settings.highContrast;
                        toggleHighContrast(settings.highContrast);
                    }
                    if (settings.sidebarWidth) {
                        document.getElementById('sidebar-width').value = settings.sidebarWidth;
                        changeSidebarWidth(settings.sidebarWidth);
                    }
                    if (settings.contentDensity) {
                        document.getElementById('content-density').value = settings.contentDensity;
                        changeContentDensity(settings.contentDensity);
                    }
                    if (settings.animations !== undefined) {
                        document.getElementById('animations-toggle').checked = settings.animations;
                        toggleAnimations(settings.animations);
                    }
                    if (settings.tableRowHeight) {
                        document.getElementById('table-row-height').value = settings.tableRowHeight;
                        changeTableRowHeight(settings.tableRowHeight);
                    }
                    if (settings.fontFamily) {
                        document.getElementById('font-family').value = settings.fontFamily;
                        changeFontFamily(settings.fontFamily);
                    }
                    if (settings.fontSize) {
                        document.getElementById('font-size').value = settings.fontSize;
                        changeFontSize(settings.fontSize);
                    }
                    if (settings.fontWeight) {
                        document.getElementById('font-weight').value = settings.fontWeight;
                        changeFontWeight(settings.fontWeight);
                    }
                    if (settings.lineHeight) {
                        document.getElementById('line-height').value = settings.lineHeight;
                        changeLineHeight(settings.lineHeight);
                    }

                    showNotification('Settings imported successfully!', 'success');
                } catch (error) {
                    showNotification('Error importing settings: Invalid file format', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Load saved settings on page load (without notifications)
function loadSavedSettings() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && document.getElementById('theme-selector')) {
        document.getElementById('theme-selector').value = savedTheme;
        changeTheme(savedTheme, false); // false = don't show notification
    }

    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled' && document.getElementById('dark-mode-toggle')) {
        document.getElementById('dark-mode-toggle').checked = true;
        toggleDarkMode(true, false); // false = don't show notification
    }

    const highContrast = localStorage.getItem('highContrast');
    if (highContrast === 'enabled' && document.getElementById('high-contrast-toggle')) {
        document.getElementById('high-contrast-toggle').checked = true;
        toggleHighContrast(true, false); // false = don't show notification
    }

    // Load other settings without notifications...
    const sidebarWidth = localStorage.getItem('sidebarWidth');
    if (sidebarWidth && document.getElementById('sidebar-width')) {
        document.getElementById('sidebar-width').value = sidebarWidth;
        changeSidebarWidth(sidebarWidth, false); // false = don't show notification
    }

    const contentDensity = localStorage.getItem('contentDensity');
    if (contentDensity && document.getElementById('content-density')) {
        document.getElementById('content-density').value = contentDensity;
        changeContentDensity(contentDensity, false); // false = don't show notification
    }

    const animations = localStorage.getItem('animations');
    if (animations === 'disabled' && document.getElementById('animations-toggle')) {
        document.getElementById('animations-toggle').checked = false;
        toggleAnimations(false, false); // false = don't show notification
    }

    const tableRowHeight = localStorage.getItem('tableRowHeight');
    if (tableRowHeight && document.getElementById('table-row-height')) {
        document.getElementById('table-row-height').value = tableRowHeight;
        changeTableRowHeight(tableRowHeight, false); // false = don't show notification
    }

    const fontFamily = localStorage.getItem('fontFamily');
    if (fontFamily && document.getElementById('font-family')) {
        document.getElementById('font-family').value = fontFamily;
        changeFontFamily(fontFamily, false); // false = don't show notification
    }

    const fontSize = localStorage.getItem('fontSize');
    if (fontSize && document.getElementById('font-size')) {
        document.getElementById('font-size').value = fontSize;
        changeFontSize(fontSize, false); // false = don't show notification
    }

    const fontWeight = localStorage.getItem('fontWeight');
    if (fontWeight && document.getElementById('font-weight')) {
        document.getElementById('font-weight').value = fontWeight;
        changeFontWeight(fontWeight, false); // false = don't show notification
    }

    const lineHeight = localStorage.getItem('lineHeight');
    if (lineHeight && document.getElementById('line-height')) {
        document.getElementById('line-height').value = lineHeight;
        changeLineHeight(lineHeight, false); // false = don't show notification
    }
}

// Quick Action Functions
function navigateToReports() {
    showPage('reports');
}

function navigateToCompliance() {
    showNotification('Compliance check feature coming soon!', 'info');
}

function exportTaxData() {
    // Show export format selection modal
    showExportModal();
}

function showExportModal() {
    // Create modal HTML
    const modalHTML = `
        <div id="export-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>Export Tax Data</h2>
                    <span class="close" onclick="closeExportModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Choose export format:</p>
                    <div class="export-options">
                        <button class="btn btn-primary export-btn" onclick="exportToFormat('csv')" style="margin: 5px; width: 100%;">
                            <i class="fas fa-file-csv"></i> Export as CSV
                        </button>
                        <button class="btn btn-primary export-btn" onclick="exportToFormat('excel')" style="margin: 5px; width: 100%;">
                            <i class="fas fa-file-excel"></i> Export as Excel
                        </button>
                        <button class="btn btn-primary export-btn" onclick="exportToFormat('pdf')" style="margin: 5px; width: 100%;">
                            <i class="fas fa-file-pdf"></i> Export as PDF
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeExportModal()">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.remove();
    }
}

function exportToFormat(format) {
    closeExportModal();

    // Prepare data
    const headers = ['Tax Structure Name', 'Type', 'Rate (%)', 'Applicable For', 'Jurisdiction', 'Status'];
    const data = taxStructuresData.map(ts => [
        ts.name,
        ts.type,
        ts.rate,
        ts.applicableFor,
        ts.jurisdiction || 'National',
        ts.isActive ? 'Active' : 'Inactive'
    ]);

    switch(format) {
        case 'csv':
            exportToCSV(headers, data);
            break;
        case 'excel':
            exportToExcel(headers, data);
            break;
        case 'pdf':
            exportToPDF(headers, data);
            break;
    }
}

function exportToCSV(headers, data) {
    showNotification('Generating CSV export...', 'info');

    const csvData = [headers, ...data];
    const csvString = csvData.map(row =>
        row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    downloadFile(blob, 'tax_structures_export.csv');

    showNotification('CSV export completed successfully!', 'success');
}

function exportToExcel(headers, data) {
    showNotification('Generating Excel export...', 'info');

    // Create workbook and worksheet
    const workbook = {
        SheetNames: ['Tax Structures'],
        Sheets: {}
    };

    // Prepare data for Excel
    const wsData = [headers, ...data];

    // Create worksheet
    const ws = {};
    const range = { s: { c: 0, r: 0 }, e: { c: headers.length - 1, r: wsData.length - 1 } };

    for (let R = 0; R <= range.e.r; ++R) {
        for (let C = 0; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R };
            const cellRef = encodeCell(cellAddress);
            const cellValue = wsData[R][C];

            if (cellValue !== null && cellValue !== undefined) {
                const cell = { v: cellValue };
                if (typeof cellValue === 'number') cell.t = 'n';
                else cell.t = 's';
                ws[cellRef] = cell;
            }
        }
    }

    ws['!ref'] = encodeRange(range);
    workbook.Sheets['Tax Structures'] = ws;

    // Convert to Excel format and download
    const excelBuffer = writeWorkbook(workbook);
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    downloadFile(blob, 'tax_structures_export.xlsx');

    showNotification('Excel export completed successfully!', 'success');
}

function exportToPDF(headers, data) {
    showNotification('Generating PDF export...', 'info');

    // Create PDF content
    let pdfContent = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; text-align: center; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .summary { margin-top: 20px; padding: 10px; background-color: #f0f8ff; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>Tax Structures Export Report</h1>
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>

            <table>
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="summary">
                <h3>Summary</h3>
                <p><strong>Total Tax Structures:</strong> ${data.length}</p>
                <p><strong>Active Structures:</strong> ${data.filter(row => row[5] === 'Active').length}</p>
                <p><strong>Inactive Structures:</strong> ${data.filter(row => row[5] === 'Inactive').length}</p>
            </div>
        </body>
        </html>
    `;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
        showNotification('PDF export initiated! Use your browser\'s print dialog to save as PDF.', 'success');
    }, 500);
}

// Helper functions for Excel export
function encodeCell(cell) {
    return String.fromCharCode(65 + cell.c) + (cell.r + 1);
}

function encodeRange(range) {
    return encodeCell(range.s) + ':' + encodeCell(range.e);
}

function writeWorkbook(workbook) {
    // Simple Excel file generation (basic implementation)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = worksheet['!ref'];
    const decoded = decodeRange(range);

    let csv = '';
    for (let R = decoded.s.r; R <= decoded.e.r; ++R) {
        let row = [];
        for (let C = decoded.s.c; C <= decoded.e.c; ++C) {
            const cellAddress = encodeCell({ r: R, c: C });
            const cell = worksheet[cellAddress];
            row.push(cell ? cell.v : '');
        }
        csv += row.join('\t') + '\n';
    }

    return new TextEncoder().encode(csv);
}

function decodeRange(range) {
    const parts = range.split(':');
    return {
        s: decodeCell(parts[0]),
        e: decodeCell(parts[1])
    };
}

function decodeCell(cellRef) {
    const match = cellRef.match(/([A-Z]+)(\d+)/);
    const col = match[1].charCodeAt(0) - 65;
    const row = parseInt(match[2]) - 1;
    return { r: row, c: col };
}

function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Report Generation Functions
function generateGSTReport() {
    showNotification('Generating GST Summary Report...', 'info');

    // Simulate report generation delay
    setTimeout(() => {
        // Filter GST-related tax structures
        const gstData = taxStructuresData.filter(ts =>
            ts.type.includes('GST') || ts.type.includes('IGST') || ts.type.includes('CGST') || ts.type.includes('SGST')
        );

        // Create report data
        const reportData = [
            ['GST Summary Report - ' + new Date().toLocaleDateString()],
            [''],
            ['Tax Structure', 'Type', 'Rate (%)', 'Status', 'Applicable For'],
            ...gstData.map(ts => [
                ts.name,
                ts.type,
                ts.rate,
                ts.isActive ? 'Active' : 'Inactive',
                ts.applicableFor
            ]),
            [''],
            ['Total GST Structures:', gstData.length.toString()],
            ['Active Structures:', gstData.filter(ts => ts.isActive).length.toString()],
            ['Average Rate:', (gstData.reduce((sum, ts) => sum + parseFloat(ts.rate), 0) / gstData.length).toFixed(2) + '%']
        ];

        // Convert to CSV and download
        const csvString = reportData.map(row =>
            Array.isArray(row) ? row.map(field => `"${field}"`).join(',') : `"${row}"`
        ).join('\n');

        downloadReport(csvString, 'GST_Summary_Report.csv', reportData);
        showNotification('GST Summary Report generated successfully!', 'success');
    }, 1500);
}

function generateSalesTaxReport() {
    showNotification('Generating Sales Tax Report...', 'info');

    setTimeout(() => {
        // Filter Sales Tax-related structures
        const salesTaxData = taxStructuresData.filter(ts =>
            ts.type.includes('Sales Tax') || ts.type.includes('Sales')
        );

        // Create report data
        const reportData = [
            ['Sales Tax Report - ' + new Date().toLocaleDateString()],
            [''],
            ['Tax Structure', 'Type', 'Rate (%)', 'Status', 'Jurisdiction'],
            ...salesTaxData.map(ts => [
                ts.name,
                ts.type,
                ts.rate,
                ts.isActive ? 'Active' : 'Inactive',
                ts.jurisdiction || 'National'
            ]),
            [''],
            ['Total Sales Tax Structures:', salesTaxData.length.toString()],
            ['Active Structures:', salesTaxData.filter(ts => ts.isActive).length.toString()],
            ['Highest Rate:', Math.max(...salesTaxData.map(ts => parseFloat(ts.rate))).toFixed(2) + '%'],
            ['Lowest Rate:', Math.min(...salesTaxData.map(ts => parseFloat(ts.rate))).toFixed(2) + '%']
        ];

        const csvString = reportData.map(row =>
            Array.isArray(row) ? row.map(field => `"${field}"`).join(',') : `"${row}"`
        ).join('\n');

        downloadReport(csvString, 'Sales_Tax_Report.csv', reportData);
        showNotification('Sales Tax Report generated successfully!', 'success');
    }, 1500);
}

function generateVATReport() {
    showNotification('Generating VAT Returns Report...', 'info');

    setTimeout(() => {
        // Filter VAT-related structures
        const vatData = taxStructuresData.filter(ts =>
            ts.type.includes('VAT') || ts.type.includes('Value Added')
        );

        // Create report data
        const reportData = [
            ['VAT Returns Report - ' + new Date().toLocaleDateString()],
            [''],
            ['Tax Structure', 'Type', 'Rate (%)', 'Status', 'Applicable For'],
            ...vatData.map(ts => [
                ts.name,
                ts.type,
                ts.rate,
                ts.isActive ? 'Active' : 'Inactive',
                ts.applicableFor
            ]),
            [''],
            ['Total VAT Structures:', vatData.length.toString()],
            ['Active Structures:', vatData.filter(ts => ts.isActive).length.toString()],
            ['Standard Rate:', '20%'],
            ['Reduced Rate:', '5%'],
            ['Zero Rate:', '0%']
        ];

        const csvString = reportData.map(row =>
            Array.isArray(row) ? row.map(field => `"${field}"`).join(',') : `"${row}"`
        ).join('\n');

        downloadReport(csvString, 'VAT_Returns_Report.csv', reportData);
        showNotification('VAT Returns Report generated successfully!', 'success');
    }, 1500);
}

// Helper function to download reports with format selection
function downloadReport(csvContent, baseFilename, reportData = null) {
    // Show format selection modal for reports
    showReportExportModal(csvContent, baseFilename, reportData);
}

function showReportExportModal(csvContent, baseFilename, reportData) {
    const modalHTML = `
        <div id="report-export-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>Export Report</h2>
                    <span class="close" onclick="closeReportExportModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Choose export format for <strong>${baseFilename}</strong>:</p>
                    <div class="export-options">
                        <button class="btn btn-primary export-btn" onclick="downloadReportFormat('csv', '${baseFilename}', 'csvContent')" style="margin: 5px; width: 100%;">
                            <i class="fas fa-file-csv"></i> Export as CSV
                        </button>
                        <button class="btn btn-primary export-btn" onclick="downloadReportFormat('excel', '${baseFilename}', 'reportData')" style="margin: 5px; width: 100%;">
                            <i class="fas fa-file-excel"></i> Export as Excel
                        </button>
                        <button class="btn btn-primary export-btn" onclick="downloadReportFormat('pdf', '${baseFilename}', 'reportData')" style="margin: 5px; width: 100%;">
                            <i class="fas fa-file-pdf"></i> Export as PDF
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeReportExportModal()">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // Store data temporarily for access
    window.tempReportData = { csvContent, baseFilename, reportData };

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeReportExportModal() {
    const modal = document.getElementById('report-export-modal');
    if (modal) {
        modal.remove();
    }
    delete window.tempReportData;
}

function downloadReportFormat(format, baseFilename, dataType) {
    const tempData = window.tempReportData;
    closeReportExportModal();

    const filename = baseFilename.replace('.csv', '');

    switch(format) {
        case 'csv':
            const blob = new Blob([tempData.csvContent], { type: 'text/csv' });
            downloadFile(blob, filename + '.csv');
            showNotification('CSV report downloaded successfully!', 'success');
            break;
        case 'excel':
            if (tempData.reportData) {
                exportReportToExcel(tempData.reportData, filename);
            }
            break;
        case 'pdf':
            if (tempData.reportData) {
                exportReportToPDF(tempData.reportData, filename);
            }
            break;
    }
}

function exportReportToExcel(reportData, filename) {
    showNotification('Generating Excel report...', 'info');

    // Extract headers and data from reportData
    const headers = reportData.find(row => Array.isArray(row) && row.length > 1 && !row[0].includes('Report'));
    const dataRows = reportData.filter(row =>
        Array.isArray(row) &&
        row.length > 1 &&
        !row[0].includes('Report') &&
        !row[0].includes('Total') &&
        !row[0].includes('Active') &&
        !row[0].includes('Average') &&
        !row[0].includes('Highest') &&
        !row[0].includes('Lowest') &&
        !row[0].includes('Standard') &&
        row !== headers
    );

    if (headers && dataRows.length > 0) {
        exportToExcel(headers, dataRows);
        showNotification('Excel report generated successfully!', 'success');
    } else {
        // Fallback to simple Excel export
        const simpleData = reportData.filter(row => Array.isArray(row) && row.length > 1);
        if (simpleData.length > 0) {
            exportToExcel(simpleData[0], simpleData.slice(1));
            showNotification('Excel report generated successfully!', 'success');
        }
    }
}

function exportReportToPDF(reportData, filename) {
    showNotification('Generating PDF report...', 'info');

    // Extract title and data
    const title = reportData.find(row => typeof row === 'string' && row.includes('Report')) || filename;
    const headers = reportData.find(row => Array.isArray(row) && row.length > 1 && !row[0].includes('Report'));
    const dataRows = reportData.filter(row =>
        Array.isArray(row) &&
        row.length > 1 &&
        !row[0].includes('Report') &&
        row !== headers
    );

    // Create PDF content
    let pdfContent = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; text-align: center; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                th { background-color: #f2f2f2; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .summary { margin-top: 20px; padding: 10px; background-color: #f0f8ff; border-radius: 5px; }
                .metadata { margin-bottom: 20px; font-size: 14px; }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="metadata">
                <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
    `;

    if (headers && dataRows.length > 0) {
        pdfContent += `
            <table>
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${dataRows.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Add summary information
    const summaryRows = reportData.filter(row =>
        Array.isArray(row) &&
        row.length === 2 &&
        (row[0].includes('Total') || row[0].includes('Active') || row[0].includes('Average') ||
         row[0].includes('Highest') || row[0].includes('Lowest') || row[0].includes('Standard'))
    );

    if (summaryRows.length > 0) {
        pdfContent += `
            <div class="summary">
                <h3>Summary</h3>
                ${summaryRows.map(row => `<p><strong>${row[0]}:</strong> ${row[1]}</p>`).join('')}
            </div>
        `;
    }

    pdfContent += `
        </body>
        </html>
    `;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
        showNotification('PDF report initiated! Use your browser\'s print dialog to save as PDF.', 'success');
    }, 500);
}

// Theme Management Functions
let currentTheme = 'default';

function initializeTheme() {
    // Load saved theme from localStorage without notification, default to navy
    const savedTheme = localStorage.getItem('taxStructureTheme') || 'navy';
    changeTheme(savedTheme, false); // false = don't show notification during startup

    // Close theme menu when clicking outside
    document.addEventListener('click', function(event) {
        const themeMenu = document.getElementById('theme-menu');
        const themeBtn = document.querySelector('.theme-btn');

        if (themeMenu && !themeMenu.contains(event.target) && !themeBtn.contains(event.target)) {
            themeMenu.classList.remove('show');
        }
    });
}

function toggleThemeMenu() {
    const themeMenu = document.getElementById('theme-menu');
    themeMenu.classList.toggle('show');
}

function changeTheme(themeName, showNotif = true) {
    // Remove previous theme
    document.documentElement.removeAttribute('data-theme');

    // Apply new theme
    if (themeName !== 'default') {
        document.documentElement.setAttribute('data-theme', themeName);
    }

    // Update current theme
    currentTheme = themeName;

    // Save to localStorage
    localStorage.setItem('taxStructureTheme', themeName);

    // Update active theme option
    updateActiveThemeOption(themeName);

    // Close theme menu
    const themeMenu = document.getElementById('theme-menu');
    if (themeMenu) {
        themeMenu.classList.remove('show');
    }

    // Show notification only if explicitly requested
    if (showNotif) {
        const themeNames = {
            'default': 'Default',
            'dark': 'Dark',
            'light': 'Light',
            'blue': 'Blue',
            'green': 'Green',
            'purple': 'Purple',
            'orange': 'Orange',
            'red': 'Red',
            'pink': 'Pink',
            'corporate': 'Corporate',
            'midnight': 'Midnight',
            'ocean': 'Ocean',
            'forest': 'Forest',
            'sunset': 'Sunset',
            'autumn': 'Autumn',
            'neon': 'Neon',
            'cyber': 'Cyber',
            'galaxy': 'Galaxy'
        };

        showNotification(`Theme changed to ${themeNames[themeName]}`, 'success');
    }
}

function updateActiveThemeOption(themeName) {
    // Remove active class from all theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
    });

    // Add active class to selected theme
    const activeOption = document.querySelector(`[data-theme="${themeName}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
}

function getThemeColors(themeName) {
    const themes = {
        'default': {
            primary: '#667eea',
            secondary: '#764ba2',
            background: '#f8f9fa'
        },
        'dark': {
            primary: '#4a5568',
            secondary: '#2d3748',
            background: '#1a202c'
        },
        'light': {
            primary: '#4f46e5',
            secondary: '#7c3aed',
            background: '#ffffff'
        },
        'blue': {
            primary: '#1e3a8a',
            secondary: '#3b82f6',
            background: '#f8fafc'
        },
        'green': {
            primary: '#00b894',
            secondary: '#55efc4',
            background: '#f1fffe'
        },
        'purple': {
            primary: '#6c5ce7',
            secondary: '#a29bfe',
            background: '#f8f7ff'
        },
        'orange': {
            primary: '#e17055',
            secondary: '#fdcb6e',
            background: '#fffbf5'
        },
        'red': {
            primary: '#e74c3c',
            secondary: '#ff7675',
            background: '#fef2f2'
        },
        'pink': {
            primary: '#fd79a8',
            secondary: '#fdcb6e',
            background: '#fdf2f8'
        },
        'corporate': {
            primary: '#2c3e50',
            secondary: '#34495e',
            background: '#f8f9fa'
        },
        'midnight': {
            primary: '#0c4a6e',
            secondary: '#1e40af',
            background: '#0f172a'
        },
        'ocean': {
            primary: '#0891b2',
            secondary: '#06b6d4',
            background: '#f0f9ff'
        },
        'forest': {
            primary: '#065f46',
            secondary: '#059669',
            background: '#f0fdf4'
        },
        'sunset': {
            primary: '#ea580c',
            secondary: '#f59e0b',
            background: '#fffbeb'
        },
        'autumn': {
            primary: '#92400e',
            secondary: '#d97706',
            background: '#fefce8'
        },
        'neon': {
            primary: '#8b5cf6',
            secondary: '#06ffa5',
            background: '#0a0a0a'
        },
        'cyber': {
            primary: '#1e1b4b',
            secondary: '#7c3aed',
            background: '#0f0f23'
        },
        'galaxy': {
            primary: '#581c87',
            secondary: '#c026d3',
            background: '#1a0b2e'
        }
    };

    return themes[themeName] || themes['default'];
}

// Search Functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        performSearch(searchTerm);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.toLowerCase().trim();
            performSearch(searchTerm);
        }
    });
}

function performSearch(searchTerm) {
    if (!searchTerm) {
        clearSearchResults();
        return;
    }

    // Get current active page
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;

    const pageId = activePage.id;

    switch (pageId) {
        case 'dashboard':
            searchDashboard(searchTerm);
            break;
        case 'tax-structures':
            searchTaxStructures(searchTerm);
            break;
        case 'invoices':
            searchInvoices(searchTerm);
            break;
        case 'jurisdictions':
            searchJurisdictions(searchTerm);
            break;
        case 'products':
            searchProducts(searchTerm);
            break;
        case 'reports':
            searchReports(searchTerm);
            break;
        default:
            // Search not available for this page - no notification needed
    }
}

function searchTaxStructures(searchTerm) {
    const tbody = document.getElementById('tax-structures-tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    showSearchResults(visibleCount, 'tax structures');
}

function searchInvoices(searchTerm) {
    const tbody = document.getElementById('invoice-tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    showSearchResults(visibleCount, 'invoices');
}

function searchJurisdictions(searchTerm) {
    const tbody = document.getElementById('jurisdictions-tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    showSearchResults(visibleCount, 'jurisdictions');
}

function searchProducts(searchTerm) {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    showSearchResults(visibleCount, 'products');
}

function searchDashboard(searchTerm) {
    // Search in tax structure overview cards
    const taxItems = document.querySelectorAll('.tax-item');
    let visibleCount = 0;

    taxItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Search in activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    showSearchResults(visibleCount, 'dashboard items');
}

function searchReports(searchTerm) {
    const reportCards = document.querySelectorAll('.report-card');
    let visibleCount = 0;

    reportCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    showSearchResults(visibleCount, 'reports');
}

function showSearchResults(count, type) {
    // Search results are now shown silently without notifications
    // Users can see the filtered results directly in the interface
}

function clearSearchResults() {
    // Show all hidden elements
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');
    hiddenElements.forEach(element => {
        if (element.style.display === 'none') {
            element.style.display = '';
        }
    });
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings first (without notifications)
    loadSavedSettings();

    // Initialize theme (will use saved theme if available, without notifications)
    initializeTheme();

    // Populate tax rates table
    populateTaxRatesTable();

    // Show dashboard by default
    showPage('dashboard');

    // Initialize dashboard data
    updateDashboardStats();

    // Load sample data
    loadSampleData();

    // Set default theme to navy if no theme is saved (without notification)
    const savedTheme = localStorage.getItem('selectedTheme');
    if (!savedTheme) {
        changeTheme('navy', false); // false = don't show notification
    }

    // Initialize drag and drop for table headers
    initializeDragAndDrop();

    // Initialize view switcher functionality
    initializeViewSwitcher();
});

// View Switcher Functions
let currentView = 'table';

function initializeViewSwitcher() {
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            const target = this.getAttribute('data-target') || 'tax-structures';
            switchView(view, target);

            // Update active button within the same target group
            const targetButtons = document.querySelectorAll(`.view-btn[data-target="${target}"]`);
            targetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize with table view for both sections
    switchView('table', 'tax-structures');
    switchView('table', 'jurisdictions');
}

function switchView(view, target = 'tax-structures') {
    currentView = view;

    // Hide all view containers for the specific target
    const viewContainers = document.querySelectorAll(`#${target} .view-container`);
    viewContainers.forEach(container => {
        container.style.display = 'none';
    });

    // Show selected view container
    const targetContainer = document.getElementById(`${target}-${view}-view`);
    if (targetContainer) {
        targetContainer.style.display = 'block';
    }

    // Populate the view with data based on target
    if (target === 'tax-structures') {
        switch(view) {
            case 'table':
                populateTaxStructuresTable();
                break;
            case 'cards':
                populateCardsView();
                break;
            case 'list':
                populateListView();
                break;
            case 'grid':
                populateGridView();
                break;
        }
    } else if (target === 'jurisdictions') {
        switch(view) {
            case 'table':
                populateJurisdictionsTable();
                break;
            case 'cards':
                populateJurisdictionsCardsView();
                break;
            case 'list':
                populateJurisdictionsListView();
                break;
            case 'grid':
                populateJurisdictionsGridView();
                break;
        }
    }
}

function populateCardsView() {
    const container = document.getElementById('tax-structures-cards');
    if (!container) return;

    if (!taxStructuresData || taxStructuresData.length === 0) {
        container.innerHTML = '<div class="no-data">No tax structures found</div>';
        return;
    }

    container.innerHTML = taxStructuresData.map(structure => `
        <div class="tax-card">
            <div class="tax-card-header">
                <h3 class="tax-card-title">${structure.name}</h3>
                <span class="tax-card-type">${structure.type}</span>
            </div>
            <div class="tax-card-body">
                <div class="tax-card-rate">${structure.rate}%</div>
                <div class="tax-card-applicable">${structure.applicableFor}</div>
            </div>
            <div class="tax-card-footer">
                <div class="tax-card-status">
                    <label class="status-toggle">
                        <input type="checkbox" ${structure.isActive ? 'checked' : ''}
                               onchange="toggleTaxStructureStatus('${structure.id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status ${structure.isActive ? 'active' : 'inactive'}">
                        ${structure.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </div>
                <div class="tax-card-actions">
                    <button class="action-btn edit" onclick="editTaxStructure('${structure.id}')" title="Edit">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="action-btn delete" onclick="deleteTaxStructure('${structure.id}')" title="Delete">
                        <span class="material-icons">delete</span>
                    </button>
                    <button class="action-btn view" onclick="viewTaxStructure('${structure.id}')" title="View">
                        <span class="material-icons">visibility</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function populateListView() {
    const container = document.getElementById('tax-structures-list');
    if (!container) return;

    if (!taxStructuresData || taxStructuresData.length === 0) {
        container.innerHTML = '<div class="no-data">No tax structures found</div>';
        return;
    }

    container.innerHTML = taxStructuresData.map(structure => `
        <div class="tax-list-item">
            <div class="tax-list-icon">
                ${structure.type.charAt(0)}
            </div>
            <div class="tax-list-content">
                <div class="tax-list-name">${structure.name}</div>
                <div class="tax-list-type">${structure.type}</div>
                <div class="tax-list-rate">${structure.rate}%</div>
                <div class="tax-list-applicable">${structure.applicableFor}</div>
                <div class="tax-list-status">
                    <label class="status-toggle">
                        <input type="checkbox" ${structure.isActive ? 'checked' : ''}
                               onchange="toggleTaxStructureStatus('${structure.id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status ${structure.isActive ? 'active' : 'inactive'}">
                        ${structure.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </div>
            </div>
            <div class="tax-list-actions">
                <button class="action-btn edit" onclick="editTaxStructure('${structure.id}')" title="Edit">
                    <span class="material-icons">edit</span>
                </button>
                <button class="action-btn delete" onclick="deleteTaxStructure('${structure.id}')" title="Delete">
                    <span class="material-icons">delete</span>
                </button>
                <button class="action-btn view" onclick="viewTaxStructure('${structure.id}')" title="View">
                    <span class="material-icons">visibility</span>
                </button>
            </div>
        </div>
    `).join('');
}

function populateGridView() {
    const container = document.getElementById('tax-structures-grid');
    if (!container) return;

    if (!taxStructuresData || taxStructuresData.length === 0) {
        container.innerHTML = '<div class="no-data">No tax structures found</div>';
        return;
    }

    container.innerHTML = taxStructuresData.map(structure => `
        <div class="tax-grid-item">
            <div class="tax-grid-icon">
                ${structure.type.charAt(0)}
            </div>
            <div class="tax-grid-name">${structure.name}</div>
            <div class="tax-grid-rate">${structure.rate}%</div>
            <div class="tax-grid-type">${structure.type}</div>
            <div class="tax-grid-applicable">${structure.applicableFor}</div>
            <div class="tax-grid-status">
                <label class="status-toggle">
                    <input type="checkbox" ${structure.isActive ? 'checked' : ''}
                           onchange="toggleTaxStructureStatus('${structure.id}', this.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span class="status ${structure.isActive ? 'active' : 'inactive'}">
                    ${structure.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
            </div>
            <div class="tax-grid-actions">
                <button class="action-btn edit" onclick="editTaxStructure('${structure.id}')" title="Edit">
                    <span class="material-icons">edit</span>
                </button>
                <button class="action-btn delete" onclick="deleteTaxStructure('${structure.id}')" title="Delete">
                    <span class="material-icons">delete</span>
                </button>
                <button class="action-btn view" onclick="viewTaxStructure('${structure.id}')" title="View">
                    <span class="material-icons">visibility</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Jurisdictions View Functions
function populateJurisdictionsCardsView() {
    const container = document.getElementById('jurisdictions-cards');
    if (!container) return;

    if (!jurisdictionData || jurisdictionData.length === 0) {
        container.innerHTML = '<div class="no-data">No jurisdictions found</div>';
        return;
    }

    container.innerHTML = jurisdictionData.map(jurisdiction => `
        <div class="tax-card">
            <div class="tax-card-header">
                <h3 class="tax-card-title">${jurisdiction.country}</h3>
                <span class="tax-card-type">${jurisdiction.taxType}</span>
            </div>
            <div class="tax-card-body">
                <div class="tax-card-rate">${jurisdiction.rate}%</div>
                <div class="tax-card-applicable">${jurisdiction.state}</div>
            </div>
            <div class="tax-card-footer">
                <div class="tax-card-status">
                    <span class="status ${jurisdiction.status}">
                        ${jurisdiction.status.toUpperCase()}
                    </span>
                </div>
                <div class="tax-card-actions">
                    <button class="action-btn edit" onclick="editJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="Edit">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="action-btn delete" onclick="deleteJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="Delete">
                        <span class="material-icons">delete</span>
                    </button>
                    <button class="action-btn view" onclick="viewJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="View">
                        <span class="material-icons">visibility</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function populateJurisdictionsListView() {
    const container = document.getElementById('jurisdictions-list');
    if (!container) return;

    if (!jurisdictionData || jurisdictionData.length === 0) {
        container.innerHTML = '<div class="no-data">No jurisdictions found</div>';
        return;
    }

    container.innerHTML = jurisdictionData.map(jurisdiction => `
        <div class="tax-list-item">
            <div class="tax-list-icon">
                ${jurisdiction.country.charAt(0)}
            </div>
            <div class="tax-list-content">
                <div class="tax-list-name">${jurisdiction.country}</div>
                <div class="tax-list-type">${jurisdiction.state}</div>
                <div class="tax-list-rate">${jurisdiction.rate}%</div>
                <div class="tax-list-applicable">${jurisdiction.taxType}</div>
                <div class="tax-list-status">
                    <span class="status ${jurisdiction.status}">
                        ${jurisdiction.status.toUpperCase()}
                    </span>
                </div>
            </div>
            <div class="tax-list-actions">
                <button class="action-btn edit" onclick="editJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="Edit">
                    <span class="material-icons">edit</span>
                </button>
                <button class="action-btn delete" onclick="deleteJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="Delete">
                    <span class="material-icons">delete</span>
                </button>
                <button class="action-btn view" onclick="viewJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="View">
                    <span class="material-icons">visibility</span>
                </button>
            </div>
        </div>
    `).join('');
}

function populateJurisdictionsGridView() {
    const container = document.getElementById('jurisdictions-grid');
    if (!container) return;

    if (!jurisdictionData || jurisdictionData.length === 0) {
        container.innerHTML = '<div class="no-data">No jurisdictions found</div>';
        return;
    }

    container.innerHTML = jurisdictionData.map(jurisdiction => `
        <div class="tax-grid-item">
            <div class="tax-grid-icon">
                ${jurisdiction.country.charAt(0)}
            </div>
            <div class="tax-grid-name">${jurisdiction.country}</div>
            <div class="tax-grid-rate">${jurisdiction.rate}%</div>
            <div class="tax-grid-type">${jurisdiction.state}</div>
            <div class="tax-grid-applicable">${jurisdiction.taxType}</div>
            <div class="tax-grid-status">
                <span class="status ${jurisdiction.status}">
                    ${jurisdiction.status.toUpperCase()}
                </span>
            </div>
            <div class="tax-grid-actions">
                <button class="action-btn edit" onclick="editJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="Edit">
                    <span class="material-icons">edit</span>
                </button>
                <button class="action-btn delete" onclick="deleteJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="Delete">
                    <span class="material-icons">delete</span>
                </button>
                <button class="action-btn view" onclick="viewJurisdiction('${jurisdiction.country}-${jurisdiction.state}')" title="View">
                    <span class="material-icons">visibility</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Add missing view function for jurisdictions
function viewJurisdiction(id) {
    alert(`Viewing jurisdiction: ${id}`);
}

// Add jurisdiction function
function addJurisdiction() {
    const modal = document.getElementById('jurisdiction-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('jurisdiction-effective-date').value = today;

    // Reset modal title and button for adding new jurisdiction
    document.querySelector('#jurisdiction-modal .modal-header h2').textContent = 'Add New Jurisdiction';
    document.querySelector('#jurisdiction-modal .btn-primary').textContent = 'Save Jurisdiction';
    document.querySelector('#jurisdiction-modal .btn-primary').setAttribute('onclick', 'saveJurisdiction()');
}

// Add missing view function for tax structures
function viewTaxStructure(id) {
    alert(`Viewing tax structure: ${id}`);
}

// Add missing edit and delete functions for tax structures
function editTaxStructure(id) {
    alert(`Editing tax structure: ${id}`);
}

function deleteTaxStructure(id) {
    if (confirm(`Are you sure you want to delete tax structure ${id}?`)) {
        alert(`Tax structure ${id} deleted`);
        // Remove from data and refresh current view
        const index = taxStructuresData.findIndex(structure => structure.id === id);
        if (index > -1) {
            taxStructuresData.splice(index, 1);
            switchView(currentView, 'tax-structures');
        }
    }
}

// Add tax structure function
function addTaxStructure() {
    const modal = document.getElementById('tax-structure-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('effective-date').value = today;

    // Reset modal title and button for adding new structure
    document.querySelector('#tax-structure-modal .modal-header h2').textContent = 'Add New Tax Structure';
    document.querySelector('#tax-structure-modal .btn-primary').textContent = 'Save Tax Structure';
    document.querySelector('#tax-structure-modal .btn-primary').setAttribute('onclick', 'saveTaxStructure()');
}

// Drag and Drop Functionality for Table Headers
let draggedElement = null;
let draggedIndex = -1;
let columnOrder = ['name', 'type', 'rate', 'applicable', 'status', 'actions'];

function initializeDragAndDrop() {
    const tables = document.querySelectorAll('.config-table');
    tables.forEach(table => {
        setupTableDragAndDrop(table);
    });
}

function setupTableDragAndDrop(table) {
    const headers = table.querySelectorAll('.draggable-header');

    headers.forEach((header, index) => {
        // Drag start
        header.addEventListener('dragstart', function(e) {
            draggedElement = this;
            draggedIndex = index;
            this.classList.add('dragging');

            // Set drag effect
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);

            // Create drag image
            const dragImage = this.cloneNode(true);
            dragImage.style.opacity = '0.8';
            dragImage.style.transform = 'rotate(2deg)';
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, e.offsetX, e.offsetY);

            // Remove drag image after a short delay
            setTimeout(() => {
                if (document.body.contains(dragImage)) {
                    document.body.removeChild(dragImage);
                }
            }, 0);

            showNotification('Drag to reorder columns', 'info');
        });

        // Drag over
        header.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (this !== draggedElement) {
                this.classList.add('drag-over');
            }
        });

        // Drag enter
        header.addEventListener('dragenter', function(e) {
            e.preventDefault();
            if (this !== draggedElement) {
                this.classList.add('drag-over');
            }
        });

        // Drag leave
        header.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });

        // Drop
        header.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            if (this !== draggedElement) {
                const targetIndex = Array.from(this.parentNode.children).indexOf(this);
                reorderColumns(table, draggedIndex, targetIndex);
                showNotification('Column reordered successfully!', 'success');
            }
        });

        // Drag end
        header.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');

            // Remove drag-over class from all headers
            headers.forEach(h => h.classList.remove('drag-over'));

            draggedElement = null;
            draggedIndex = -1;
        });
    });
}

function reorderColumns(table, fromIndex, toIndex) {
    if (fromIndex === toIndex) return;

    const headerRow = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Add reordering class for smooth animation
    table.classList.add('reordering');

    // Reorder header
    const headerCells = Array.from(headerRow.children);
    const movedHeader = headerCells[fromIndex];

    if (fromIndex < toIndex) {
        headerRow.insertBefore(movedHeader, headerCells[toIndex + 1]);
    } else {
        headerRow.insertBefore(movedHeader, headerCells[toIndex]);
    }

    // Reorder all body rows
    const bodyRows = tbody.querySelectorAll('tr');
    bodyRows.forEach(row => {
        const cells = Array.from(row.children);
        const movedCell = cells[fromIndex];

        if (fromIndex < toIndex) {
            row.insertBefore(movedCell, cells[toIndex + 1]);
        } else {
            row.insertBefore(movedCell, cells[toIndex]);
        }
    });

    // Update column order array
    const movedColumn = columnOrder[fromIndex];
    columnOrder.splice(fromIndex, 1);
    columnOrder.splice(toIndex, 0, movedColumn);

    // Save column order to localStorage
    localStorage.setItem('columnOrder', JSON.stringify(columnOrder));

    // Remove reordering class after animation
    setTimeout(() => {
        table.classList.remove('reordering');
    }, 300);
}

function restoreColumnOrder(table) {
    const savedOrder = localStorage.getItem('columnOrder');
    if (savedOrder) {
        try {
            const order = JSON.parse(savedOrder);
            if (order.length === columnOrder.length) {
                columnOrder = order;
                applyColumnOrder(table);
            }
        } catch (e) {
            console.warn('Failed to restore column order:', e);
        }
    }
}

function applyColumnOrder(table) {
    const headerRow = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    const headerCells = Array.from(headerRow.children);
    const bodyRows = tbody.querySelectorAll('tr');

    // Create a mapping of current positions
    const currentOrder = headerCells.map(cell => cell.dataset.column);

    // Reorder headers and body cells according to saved order
    columnOrder.forEach((columnId, newIndex) => {
        const currentIndex = currentOrder.indexOf(columnId);
        if (currentIndex !== -1 && currentIndex !== newIndex) {
            // Move header
            const headerToMove = headerCells[currentIndex];
            headerRow.insertBefore(headerToMove, headerRow.children[newIndex]);

            // Move body cells
            bodyRows.forEach(row => {
                const cellToMove = row.children[currentIndex];
                row.insertBefore(cellToMove, row.children[newIndex]);
            });

            // Update tracking arrays
            headerCells.splice(newIndex, 0, headerCells.splice(currentIndex, 1)[0]);
            currentOrder.splice(newIndex, 0, currentOrder.splice(currentIndex, 1)[0]);
        }
    });
}

function resetColumnOrder(table) {
    columnOrder = ['name', 'type', 'rate', 'applicable', 'status', 'actions'];
    localStorage.removeItem('columnOrder');
    applyColumnOrder(table);
    showNotification('Column order reset to default', 'success');
}
