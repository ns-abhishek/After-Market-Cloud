/**
 * Document Management Service
 * 
 * This file provides document management functionality including:
 * - Secure document storage and retrieval
 * - Document versioning
 * - Access control
 * - Document categorization and tagging
 * - Document search and filtering
 */

// Document storage keys
const DOCUMENT_STORAGE_KEYS = {
    DOCUMENTS: 'dm_documents',
    VERSIONS: 'dm_versions',
    CATEGORIES: 'dm_categories',
    TAGS: 'dm_tags',
    ACCESS_CONTROL: 'dm_access_control',
    METADATA: 'dm_metadata'
};

// Default document categories
const DEFAULT_CATEGORIES = [
    { id: 'cat1', name: 'Contracts', description: 'Legal agreements and contracts' },
    { id: 'cat2', name: 'Invoices', description: 'Billing and payment documents' },
    { id: 'cat3', name: 'Manuals', description: 'User guides and manuals' },
    { id: 'cat4', name: 'Reports', description: 'Business reports and analytics' },
    { id: 'cat5', name: 'Templates', description: 'Document templates' },
    { id: 'cat6', name: 'Legal', description: 'Legal documents and compliance' },
    { id: 'cat7', name: 'Marketing', description: 'Marketing materials' },
    { id: 'cat8', name: 'Technical', description: 'Technical specifications and documentation' }
];

// Default document tags
const DEFAULT_TAGS = [
    { id: 'tag1', name: 'Important', color: '#ff0000' },
    { id: 'tag2', name: 'Confidential', color: '#ff9900' },
    { id: 'tag3', name: 'Draft', color: '#0099ff' },
    { id: 'tag4', name: 'Approved', color: '#00cc00' },
    { id: 'tag5', name: 'Archived', color: '#999999' },
    { id: 'tag6', name: 'Shared', color: '#9900cc' }
];

// Document Management Service
const DocumentManagement = {
    // Initialize document management
    initialize: function() {
        console.log('Initializing Document Management Service...');
        
        // Initialize categories if they don't exist
        if (!localStorage.getItem(DOCUMENT_STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        }
        
        // Initialize tags if they don't exist
        if (!localStorage.getItem(DOCUMENT_STORAGE_KEYS.TAGS)) {
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.TAGS, JSON.stringify(DEFAULT_TAGS));
        }
        
        // Initialize documents if they don't exist
        if (!localStorage.getItem(DOCUMENT_STORAGE_KEYS.DOCUMENTS)) {
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.DOCUMENTS, JSON.stringify([]));
        }
        
        // Initialize versions if they don't exist
        if (!localStorage.getItem(DOCUMENT_STORAGE_KEYS.VERSIONS)) {
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.VERSIONS, JSON.stringify([]));
        }
        
        // Initialize access control if it doesn't exist
        if (!localStorage.getItem(DOCUMENT_STORAGE_KEYS.ACCESS_CONTROL)) {
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.ACCESS_CONTROL, JSON.stringify({}));
        }
        
        console.log('Document Management Service initialized');
    },
    
    // Document CRUD operations
    getDocuments: function() {
        return JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.DOCUMENTS)) || [];
    },
    
    getDocumentById: function(id) {
        const documents = this.getDocuments();
        return documents.find(doc => doc.id === id) || null;
    },
    
    saveDocument: function(document) {
        // Validate document
        if (!document.name) {
            return { success: false, message: 'Document name is required' };
        }
        
        const documents = this.getDocuments();
        const index = documents.findIndex(d => d.id === document.id);
        
        if (index !== -1) {
            // Update existing document
            const existingDoc = documents[index];
            
            // Check if content has changed
            if (document.content && document.content !== existingDoc.content) {
                // Create a new version
                this.createVersion(existingDoc);
            }
            
            // Update document
            documents[index] = { 
                ...existingDoc, 
                ...document, 
                updatedAt: new Date().toISOString(),
                updatedBy: document.updatedBy || 'system'
            };
        } else {
            // Add new document
            const newDocument = {
                ...document,
                id: document.id || `DOC${String(documents.length + 1).padStart(3, '0')}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: document.createdBy || 'system',
                updatedBy: document.updatedBy || 'system',
                version: 1,
                status: document.status || 'Active'
            };
            documents.push(newDocument);
        }
        
        localStorage.setItem(DOCUMENT_STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
        
        return { 
            success: true, 
            document: index !== -1 ? documents[index] : documents[documents.length - 1] 
        };
    },
    
    deleteDocument: function(id) {
        const documents = this.getDocuments();
        const index = documents.findIndex(d => d.id === id);
        
        if (index !== -1) {
            // Remove document
            documents.splice(index, 1);
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
            
            // Remove versions
            this.deleteVersions(id);
            
            // Remove access control
            this.removeAccessControl(id);
            
            return { success: true };
        }
        
        return { success: false, message: 'Document not found' };
    },
    
    // Document versioning
    getVersions: function(documentId) {
        const versions = JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.VERSIONS)) || [];
        return versions.filter(v => v.documentId === documentId);
    },
    
    createVersion: function(document) {
        const versions = JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.VERSIONS)) || [];
        
        // Create a new version
        const version = {
            id: `V${String(versions.length + 1).padStart(3, '0')}`,
            documentId: document.id,
            version: document.version,
            content: document.content,
            createdAt: document.updatedAt,
            createdBy: document.updatedBy
        };
        
        versions.push(version);
        localStorage.setItem(DOCUMENT_STORAGE_KEYS.VERSIONS, JSON.stringify(versions));
        
        return version;
    },
    
    deleteVersions: function(documentId) {
        const versions = JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.VERSIONS)) || [];
        const filteredVersions = versions.filter(v => v.documentId !== documentId);
        localStorage.setItem(DOCUMENT_STORAGE_KEYS.VERSIONS, JSON.stringify(filteredVersions));
    },
    
    // Document categories
    getCategories: function() {
        return JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.CATEGORIES)) || [];
    },
    
    getCategoryById: function(id) {
        const categories = this.getCategories();
        return categories.find(cat => cat.id === id) || null;
    },
    
    saveCategory: function(category) {
        const categories = this.getCategories();
        const index = categories.findIndex(c => c.id === category.id);
        
        if (index !== -1) {
            // Update existing category
            categories[index] = { ...categories[index], ...category };
        } else {
            // Add new category
            const newCategory = {
                ...category,
                id: category.id || `cat${categories.length + 1}`
            };
            categories.push(newCategory);
        }
        
        localStorage.setItem(DOCUMENT_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        
        return index !== -1 ? categories[index] : categories[categories.length - 1];
    },
    
    deleteCategory: function(id) {
        const categories = this.getCategories();
        const index = categories.findIndex(c => c.id === id);
        
        if (index !== -1) {
            categories.splice(index, 1);
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
            return true;
        }
        
        return false;
    },
    
    // Document tags
    getTags: function() {
        return JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.TAGS)) || [];
    },
    
    getTagById: function(id) {
        const tags = this.getTags();
        return tags.find(tag => tag.id === id) || null;
    },
    
    saveTag: function(tag) {
        const tags = this.getTags();
        const index = tags.findIndex(t => t.id === tag.id);
        
        if (index !== -1) {
            // Update existing tag
            tags[index] = { ...tags[index], ...tag };
        } else {
            // Add new tag
            const newTag = {
                ...tag,
                id: tag.id || `tag${tags.length + 1}`
            };
            tags.push(newTag);
        }
        
        localStorage.setItem(DOCUMENT_STORAGE_KEYS.TAGS, JSON.stringify(tags));
        
        return index !== -1 ? tags[index] : tags[tags.length - 1];
    },
    
    deleteTag: function(id) {
        const tags = this.getTags();
        const index = tags.findIndex(t => t.id === id);
        
        if (index !== -1) {
            tags.splice(index, 1);
            localStorage.setItem(DOCUMENT_STORAGE_KEYS.TAGS, JSON.stringify(tags));
            return true;
        }
        
        return false;
    },
    
    // Document access control
    getAccessControl: function(documentId) {
        const accessControl = JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.ACCESS_CONTROL)) || {};
        return accessControl[documentId] || { users: [], roles: [] };
    },
    
    setAccessControl: function(documentId, access) {
        const accessControl = JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.ACCESS_CONTROL)) || {};
        accessControl[documentId] = access;
        localStorage.setItem(DOCUMENT_STORAGE_KEYS.ACCESS_CONTROL, JSON.stringify(accessControl));
    },
    
    removeAccessControl: function(documentId) {
        const accessControl = JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEYS.ACCESS_CONTROL)) || {};
        delete accessControl[documentId];
        localStorage.setItem(DOCUMENT_STORAGE_KEYS.ACCESS_CONTROL, JSON.stringify(accessControl));
    },
    
    hasAccess: function(documentId, userId, userRoles) {
        const access = this.getAccessControl(documentId);
        
        // Check if user has direct access
        if (access.users.includes(userId)) {
            return true;
        }
        
        // Check if user has role-based access
        if (userRoles && userRoles.some(role => access.roles.includes(role))) {
            return true;
        }
        
        return false;
    },
    
    // Document search and filtering
    searchDocuments: function(query, options = {}) {
        const documents = this.getDocuments();
        
        if (!query) {
            return documents;
        }
        
        const normalizedQuery = query.toLowerCase();
        
        return documents.filter(doc => {
            // Filter by category if specified
            if (options.category && doc.category !== options.category) {
                return false;
            }
            
            // Filter by tag if specified
            if (options.tag && (!doc.tags || !doc.tags.includes(options.tag))) {
                return false;
            }
            
            // Filter by status if specified
            if (options.status && doc.status !== options.status) {
                return false;
            }
            
            // Search in document name and content
            return (
                doc.name.toLowerCase().includes(normalizedQuery) ||
                (doc.description && doc.description.toLowerCase().includes(normalizedQuery)) ||
                (doc.content && doc.content.toLowerCase().includes(normalizedQuery))
            );
        });
    }
};

// Initialize document management when the script loads
document.addEventListener('DOMContentLoaded', function() {
    DocumentManagement.initialize();
});
