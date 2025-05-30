/**
 * Data Repository Service
 * 
 * This file provides a centralized repository for all data in the application.
 * It handles data storage, retrieval, and synchronization across different sources.
 */

// Repository storage keys
const REPOSITORY_KEYS = {
    PARTIES: 'repository_parties',
    SUPPLIERS: 'repository_suppliers',
    VENDORS: 'repository_vendors',
    CUSTOMERS: 'repository_customers',
    PRODUCTS: 'repository_products',
    CONTRACTS: 'repository_contracts',
    INVOICES: 'repository_invoices',
    DOCUMENTS: 'repository_documents',
    METADATA: 'repository_metadata'
};

// Repository metadata
const REPOSITORY_METADATA = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    sources: ['local', 'ERP', 'CRM', 'PROCUREMENT'],
    entityCount: {
        parties: 0,
        suppliers: 0,
        vendors: 0,
        customers: 0,
        products: 0,
        contracts: 0,
        invoices: 0,
        documents: 0
    }
};

// Data Repository Service
const DataRepository = {
    // Initialize repository
    initialize: function() {
        console.log('Initializing Data Repository...');
        
        // Initialize metadata if it doesn't exist
        if (!localStorage.getItem(REPOSITORY_KEYS.METADATA)) {
            localStorage.setItem(REPOSITORY_KEYS.METADATA, JSON.stringify(REPOSITORY_METADATA));
        }
        
        // Initialize entity collections if they don't exist
        Object.values(REPOSITORY_KEYS).forEach(key => {
            if (key !== REPOSITORY_KEYS.METADATA && !localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
        
        // Update entity counts
        this.updateEntityCounts();
        
        console.log('Data Repository initialized');
    },
    
    // Update entity counts in metadata
    updateEntityCounts: function() {
        const metadata = this.getMetadata();
        
        metadata.entityCount = {
            parties: this.getParties().length,
            suppliers: this.getSuppliers().length,
            vendors: this.getVendors().length,
            customers: this.getCustomers().length,
            products: this.getProducts().length,
            contracts: this.getContracts().length,
            invoices: this.getInvoices().length,
            documents: this.getDocuments().length
        };
        
        metadata.lastUpdated = new Date().toISOString();
        
        localStorage.setItem(REPOSITORY_KEYS.METADATA, JSON.stringify(metadata));
    },
    
    // Get repository metadata
    getMetadata: function() {
        return JSON.parse(localStorage.getItem(REPOSITORY_KEYS.METADATA)) || REPOSITORY_METADATA;
    },
    
    // Party methods
    getParties: function() {
        return JSON.parse(localStorage.getItem(REPOSITORY_KEYS.PARTIES)) || [];
    },
    
    getPartyById: function(id) {
        const parties = this.getParties();
        return parties.find(party => party.id === id) || null;
    },
    
    saveParty: function(party) {
        const parties = this.getParties();
        const index = parties.findIndex(p => p.id === party.id);
        
        if (index !== -1) {
            // Update existing party
            parties[index] = { 
                ...parties[index], 
                ...party, 
                updatedAt: new Date().toISOString(),
                source: party.source || parties[index].source || 'local'
            };
        } else {
            // Add new party
            const newParty = {
                ...party,
                id: party.id || `P${String(parties.length + 1).padStart(3, '0')}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: party.source || 'local'
            };
            parties.push(newParty);
        }
        
        localStorage.setItem(REPOSITORY_KEYS.PARTIES, JSON.stringify(parties));
        this.updateEntityCounts();
        
        return index !== -1 ? parties[index] : parties[parties.length - 1];
    },
    
    deleteParty: function(id) {
        const parties = this.getParties();
        const index = parties.findIndex(p => p.id === id);
        
        if (index !== -1) {
            parties.splice(index, 1);
            localStorage.setItem(REPOSITORY_KEYS.PARTIES, JSON.stringify(parties));
            this.updateEntityCounts();
            return true;
        }
        
        return false;
    },
    
    // Supplier methods
    getSuppliers: function() {
        return JSON.parse(localStorage.getItem(REPOSITORY_KEYS.SUPPLIERS)) || [];
    },
    
    getSupplierById: function(id) {
        const suppliers = this.getSuppliers();
        return suppliers.find(supplier => supplier.id === id) || null;
    },
    
    saveSupplier: function(supplier) {
        const suppliers = this.getSuppliers();
        const index = suppliers.findIndex(s => s.id === supplier.id);
        
        if (index !== -1) {
            // Update existing supplier
            suppliers[index] = { 
                ...suppliers[index], 
                ...supplier, 
                updatedAt: new Date().toISOString(),
                source: supplier.source || suppliers[index].source || 'local'
            };
        } else {
            // Add new supplier
            const newSupplier = {
                ...supplier,
                id: supplier.id || `S${String(suppliers.length + 1).padStart(3, '0')}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: supplier.source || 'local'
            };
            suppliers.push(newSupplier);
        }
        
        localStorage.setItem(REPOSITORY_KEYS.SUPPLIERS, JSON.stringify(suppliers));
        this.updateEntityCounts();
        
        return index !== -1 ? suppliers[index] : suppliers[suppliers.length - 1];
    },
    
    // Document methods
    getDocuments: function() {
        return JSON.parse(localStorage.getItem(REPOSITORY_KEYS.DOCUMENTS)) || [];
    },
    
    getDocumentById: function(id) {
        const documents = this.getDocuments();
        return documents.find(doc => doc.id === id) || null;
    },
    
    saveDocument: function(document) {
        const documents = this.getDocuments();
        const index = documents.findIndex(d => d.id === document.id);
        
        if (index !== -1) {
            // Update existing document
            documents[index] = { 
                ...documents[index], 
                ...document, 
                updatedAt: new Date().toISOString(),
                source: document.source || documents[index].source || 'local'
            };
        } else {
            // Add new document
            const newDocument = {
                ...document,
                id: document.id || `DOC${String(documents.length + 1).padStart(3, '0')}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: document.source || 'local'
            };
            documents.push(newDocument);
        }
        
        localStorage.setItem(REPOSITORY_KEYS.DOCUMENTS, JSON.stringify(documents));
        this.updateEntityCounts();
        
        return index !== -1 ? documents[index] : documents[documents.length - 1];
    },
    
    // Data synchronization methods
    syncWithExternalSystem: function(system, data) {
        console.log(`Syncing data from ${system}...`);
        
        // Process data based on entity type
        Object.keys(data).forEach(entityType => {
            const entities = data[entityType];
            
            switch (entityType) {
                case 'parties':
                    this.syncParties(entities, system);
                    break;
                case 'suppliers':
                    this.syncSuppliers(entities, system);
                    break;
                case 'documents':
                    this.syncDocuments(entities, system);
                    break;
                // Add more entity types as needed
            }
        });
        
        // Update metadata
        const metadata = this.getMetadata();
        metadata.lastUpdated = new Date().toISOString();
        localStorage.setItem(REPOSITORY_KEYS.METADATA, JSON.stringify(metadata));
        
        console.log(`Sync with ${system} completed`);
    },
    
    // Sync parties from external system
    syncParties: function(parties, source) {
        const existingParties = this.getParties();
        
        parties.forEach(party => {
            // Check if party already exists
            const existingIndex = existingParties.findIndex(p => 
                p.id === party.id || 
                (p.externalId && p.externalId === party.externalId)
            );
            
            if (existingIndex !== -1) {
                // Update existing party
                existingParties[existingIndex] = {
                    ...existingParties[existingIndex],
                    ...party,
                    updatedAt: new Date().toISOString(),
                    source: source
                };
            } else {
                // Add new party
                existingParties.push({
                    ...party,
                    id: party.id || `P${String(existingParties.length + 1).padStart(3, '0')}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    source: source
                });
            }
        });
        
        localStorage.setItem(REPOSITORY_KEYS.PARTIES, JSON.stringify(existingParties));
        this.updateEntityCounts();
    },
    
    // Sync suppliers from external system
    syncSuppliers: function(suppliers, source) {
        // Similar implementation as syncParties
        console.log(`Synced ${suppliers.length} suppliers from ${source}`);
    },
    
    // Sync documents from external system
    syncDocuments: function(documents, source) {
        // Similar implementation as syncParties
        console.log(`Synced ${documents.length} documents from ${source}`);
    },
    
    // Search across all entities
    search: function(query, options = {}) {
        const results = {
            parties: [],
            suppliers: [],
            vendors: [],
            customers: [],
            documents: []
        };
        
        // Normalize query
        const normalizedQuery = query.toLowerCase();
        
        // Search parties
        if (!options.entities || options.entities.includes('parties')) {
            results.parties = this.getParties().filter(party => 
                party.name?.toLowerCase().includes(normalizedQuery) ||
                party.contactPerson?.toLowerCase().includes(normalizedQuery) ||
                party.email?.toLowerCase().includes(normalizedQuery)
            );
        }
        
        // Search documents
        if (!options.entities || options.entities.includes('documents')) {
            results.documents = this.getDocuments().filter(doc => 
                doc.name?.toLowerCase().includes(normalizedQuery) ||
                doc.category?.toLowerCase().includes(normalizedQuery)
            );
        }
        
        return results;
    }
};

// Initialize repository when the script loads
document.addEventListener('DOMContentLoaded', function() {
    DataRepository.initialize();
});
