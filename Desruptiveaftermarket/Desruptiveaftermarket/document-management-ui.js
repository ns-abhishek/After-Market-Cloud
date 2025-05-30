/**
 * Document Management UI
 * 
 * This file provides the UI functionality for the document management page,
 * including document listing, filtering, and actions.
 */

// Document list state
let documents = [];
let filteredDocuments = [];
let currentPage = 1;
const documentsPerPage = 10;

// Initialize document management UI
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Document Management UI...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadDocuments();
});

// Set up event listeners
function setupEventListeners() {
    // Upload button
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            showUploadModal();
        });
    }
    
    // Create folder button
    const createFolderBtn = document.getElementById('createFolderBtn');
    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', function() {
            showCreateFolderModal();
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadDocuments();
        });
    }
    
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchDocuments();
        });
    }
    
    // Search input (search on Enter key)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchDocuments();
            }
        });
    }
    
    // Filter selects
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterDocuments();
        });
    }
    
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            filterDocuments();
        });
    }
    
    const tagFilter = document.getElementById('tagFilter');
    if (tagFilter) {
        tagFilter.addEventListener('change', function() {
            filterDocuments();
        });
    }
    
    // Pagination
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.addEventListener('click', function(event) {
            const target = event.target.closest('.pagination-item');
            if (!target) return;
            
            if (target.textContent === 'chevron_left') {
                // Previous page
                if (currentPage > 1) {
                    currentPage--;
                    displayDocuments();
                    updatePagination();
                }
            } else if (target.textContent === 'chevron_right') {
                // Next page
                const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    displayDocuments();
                    updatePagination();
                }
            } else {
                // Specific page
                currentPage = parseInt(target.textContent);
                displayDocuments();
                updatePagination();
            }
        });
    }
}

// Load documents
function loadDocuments() {
    console.log('Loading documents...');
    
    // Get documents from document management service
    documents = DocumentManagement.getDocuments();
    
    // Apply filters
    filterDocuments();
}

// Search documents
function searchDocuments() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    if (query === '') {
        // If search is empty, just apply filters
        filterDocuments();
        return;
    }
    
    // Get filter values
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const tagFilter = document.getElementById('tagFilter');
    
    const category = categoryFilter ? categoryFilter.value : '';
    const type = typeFilter ? typeFilter.value : '';
    const tag = tagFilter ? tagFilter.value : '';
    
    // Search documents with filters
    filteredDocuments = DocumentManagement.searchDocuments(query, {
        category: category || undefined,
        type: type || undefined,
        tag: tag || undefined
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Display documents
    displayDocuments();
    
    // Update pagination
    updatePagination();
}

// Filter documents
function filterDocuments() {
    // Get filter values
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const tagFilter = document.getElementById('tagFilter');
    
    const category = categoryFilter ? categoryFilter.value : '';
    const type = typeFilter ? typeFilter.value : '';
    const tag = tagFilter ? tagFilter.value : '';
    
    // Apply filters
    filteredDocuments = documents.filter(doc => {
        // Category filter
        if (category && doc.category !== category) {
            return false;
        }
        
        // Type filter
        if (type && doc.type !== type) {
            return false;
        }
        
        // Tag filter
        if (tag && (!doc.tags || !doc.tags.includes(tag))) {
            return false;
        }
        
        return true;
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Display documents
    displayDocuments();
    
    // Update pagination
    updatePagination();
}

// Display documents
function displayDocuments() {
    const documentsTable = document.getElementById('documentsTable');
    if (!documentsTable) return;
    
    // Clear table
    documentsTable.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * documentsPerPage;
    const endIndex = startIndex + documentsPerPage;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);
    
    // Check if no documents
    if (paginatedDocuments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 20px;">
                No documents found. Try adjusting your filters or search query.
            </td>
        `;
        documentsTable.appendChild(row);
        return;
    }
    
    // Add document rows
    paginatedDocuments.forEach(doc => {
        const row = document.createElement('tr');
        
        // Set document icon class and text
        let iconClass = 'document-other';
        let iconText = 'DOC';
        
        switch (doc.type) {
            case 'PDF':
                iconClass = 'document-pdf';
                iconText = 'PDF';
                break;
            case 'Word':
                iconClass = 'document-word';
                iconText = 'DOC';
                break;
            case 'Excel':
                iconClass = 'document-excel';
                iconText = 'XLS';
                break;
            case 'Image':
                iconClass = 'document-image';
                iconText = 'IMG';
                break;
        }
        
        // Format tags
        let tagsHtml = '';
        if (doc.tags && doc.tags.length > 0) {
            doc.tags.forEach(tag => {
                tagsHtml += `<span class="tag tag-${tag.toLowerCase()}">${tag}</span>`;
            });
        }
        
        // Format date
        const lastModified = doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'N/A';
        
        // Create row content
        row.innerHTML = `
            <td>${doc.name}</td>
            <td>
                <div class="document-type">
                    <div class="document-icon ${iconClass}">${iconText}</div>
                    <span>${doc.type}</span>
                </div>
            </td>
            <td>${doc.category || 'N/A'}</td>
            <td>${tagsHtml || 'N/A'}</td>
            <td>${doc.size || 'N/A'}</td>
            <td>${lastModified}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-document" data-id="${doc.id}" title="View">
                        <i class="material-icons">visibility</i>
                    </button>
                    <button class="action-btn download-document" data-id="${doc.id}" title="Download">
                        <i class="material-icons">file_download</i>
                    </button>
                    <button class="action-btn share-document" data-id="${doc.id}" title="Share">
                        <i class="material-icons">share</i>
                    </button>
                    <button class="action-btn more-options" data-id="${doc.id}" title="More Options">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
            </td>
        `;
        
        // Add event listeners to action buttons
        row.querySelector('.view-document').addEventListener('click', function() {
            viewDocument(doc.id);
        });
        
        row.querySelector('.download-document').addEventListener('click', function() {
            downloadDocument(doc.id);
        });
        
        row.querySelector('.share-document').addEventListener('click', function() {
            shareDocument(doc.id);
        });
        
        row.querySelector('.more-options').addEventListener('click', function(event) {
            showMoreOptions(event, doc.id);
        });
        
        documentsTable.appendChild(row);
    });
}

// Update pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
    
    // Clear pagination
    pagination.innerHTML = '';
    
    // Previous button
    const prevButton = document.createElement('div');
    prevButton.className = 'pagination-item';
    prevButton.innerHTML = '<i class="material-icons">chevron_left</i>';
    pagination.appendChild(prevButton);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('div');
        pageItem.className = 'pagination-item';
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.textContent = i;
        pagination.appendChild(pageItem);
    }
    
    // Next button
    const nextButton = document.createElement('div');
    nextButton.className = 'pagination-item';
    nextButton.innerHTML = '<i class="material-icons">chevron_right</i>';
    pagination.appendChild(nextButton);
}

// Document action functions
function viewDocument(id) {
    console.log(`Viewing document ${id}...`);
    
    // In a real application, this would open the document viewer
    // For demo purposes, we'll just log a message
    alert(`Viewing document ${id}`);
}

function downloadDocument(id) {
    console.log(`Downloading document ${id}...`);
    
    // In a real application, this would download the document
    // For demo purposes, we'll just log a message
    alert(`Downloading document ${id}`);
}

function shareDocument(id) {
    console.log(`Sharing document ${id}...`);
    
    // In a real application, this would open a sharing dialog
    // For demo purposes, we'll just log a message
    alert(`Sharing document ${id}`);
}

function showMoreOptions(event, id) {
    console.log(`Showing more options for document ${id}...`);
    
    // In a real application, this would show a context menu
    // For demo purposes, we'll just log a message
    alert(`More options for document ${id}`);
}

// Modal functions
function showUploadModal() {
    console.log('Showing upload modal...');
    
    // In a real application, this would show a modal dialog
    // For demo purposes, we'll just log a message
    alert('Upload document modal would be shown here');
}

function showCreateFolderModal() {
    console.log('Showing create folder modal...');
    
    // In a real application, this would show a modal dialog
    // For demo purposes, we'll just log a message
    alert('Create folder modal would be shown here');
}
