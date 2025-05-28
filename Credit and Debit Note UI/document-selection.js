/**
 * Document selection functionality to handle communication between Dashboard and CreditDebitUI
 */

/**
 * Sets up click handlers for document type cards in the Dashboard
 */
function setupDocumentTypeCardClicks() {
    // Select all note cards in the dashboard
    const noteCards = document.querySelectorAll('.note-card');
    noteCards.forEach(card => {
        card.addEventListener('click', function() {
            const docType = this.getAttribute('data-status') || 'No Tax';
            console.log('Selected document type:', docType);
            
            // Store the selected document type in localStorage
            localStorage.setItem('selectedDocumentType', docType);
            
            // Navigate to CreditDebitUI.html
            window.location.href = 'CreditDebitUI.html';
        });
    });

    // Select document type cards in CreditDebitUI
    const documentTypeCards = document.querySelectorAll('.document-type-card');
    documentTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            const docType = this.getAttribute('data-doc-type');
            console.log('Selected document type:', docType);
            
            // Get the clear filter button
            const clearFilterBtn = document.getElementById('clear-filter-btn');
            if (clearFilterBtn) {
                clearFilterBtn.classList.remove('hidden');
            }
            
            // Apply the filter to transactions
            filterTransactionsByDocType(docType);
        });
    });
    
    // Set up clear filter button if present
    const clearFilterBtn = document.getElementById('clear-filter-btn');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            localStorage.removeItem('selectedDocumentType');
            // Reset transaction list without filter
            clearTransactionFilter();
            this.classList.add('hidden');
        });
    }
}

/**
 * Filter transactions by document type (implementation depends on page structure)
 */
function filterTransactionsByDocType(docType) {
    // This function will be defined differently in CreditDebitUI.html
    if (typeof filterTransactions === 'function') {
        filterTransactions(docType);
    } else {
        console.log('filterTransactions function not available on this page');
    }
}

/**
 * Clear transaction filter (implementation depends on page structure)
 */
function clearTransactionFilter() {
    // This function will be defined differently in CreditDebitUI.html
    if (typeof clearFilter === 'function') {
        clearFilter();
    } else {
        console.log('clearFilter function not available on this page');
    }
}

/**
 * Check for selected document type on page load
 */
function checkSelectedDocumentType() {
    const selectedDocType = localStorage.getItem('selectedDocumentType');
    if (selectedDocType) {
        console.log('Found selected document type:', selectedDocType);
        
        // Get the clear filter button if we're on CreditDebitUI.html
        const clearFilterBtn = document.getElementById('clear-filter-btn');
        if (clearFilterBtn) {
            clearFilterBtn.classList.remove('hidden');
            filterTransactionsByDocType(selectedDocType);
        }
    }
}

// Set up document handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupDocumentTypeCardClicks();
    checkSelectedDocumentType();
});