/**
 * Content Filtering Module
 * Handles filtering content by tenant, locale, and other criteria
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const filterSection = document.getElementById('filter-section');
    const filterStatus = document.getElementById('filter-status');
    const filterTenant = document.getElementById('filter-tenant');
    const filterLocale = document.getElementById('filter-locale');
    const applyFiltersButton = document.getElementById('apply-filters');
    const clearFiltersButton = document.getElementById('clear-filters');
    const activeFiltersContainer = document.getElementById('active-filters');
    const activeFilterTags = document.querySelector('.active-filter-tags');
    
    // Initialize content filtering
    initContentFiltering();
    
    /**
     * Initialize content filtering components and event listeners
     */
    function initContentFiltering() {
        // Set up filter buttons
        if (applyFiltersButton) {
            applyFiltersButton.addEventListener('click', applyFilters);
        }
        
        if (clearFiltersButton) {
            clearFiltersButton.addEventListener('click', clearFilters);
        }
        
        // Set up tenant and locale selectors in the content editor
        const contentTenantSelect = document.getElementById('content-tenant');
        const contentLocaleSelect = document.getElementById('content-locale');
        
        if (contentTenantSelect) {
            contentTenantSelect.addEventListener('change', updateContentMetadata);
        }
        
        if (contentLocaleSelect) {
            contentLocaleSelect.addEventListener('change', updateContentMetadata);
        }
    }
    
    /**
     * Apply filters to content table
     */
    function applyFilters() {
        const section = filterSection ? filterSection.value : '';
        const status = filterStatus ? filterStatus.value : '';
        const tenant = filterTenant ? filterTenant.value : '';
        const locale = filterLocale ? filterLocale.value : '';
        
        // Show active filters container if any filters are applied
        if (section || status || tenant || locale) {
            activeFiltersContainer.style.display = 'block';
            
            // Clear existing filter tags
            activeFilterTags.innerHTML = '';
            
            // Add filter tags for each active filter
            if (section) {
                addFilterTag('section', getSectionDisplayName(section));
            }
            
            if (status) {
                addFilterTag('status', getStatusDisplayName(status));
            }
            
            if (tenant) {
                addFilterTag('tenant', getTenantDisplayName(tenant));
            }
            
            if (locale) {
                addFilterTag('locale', getLocaleDisplayName(locale));
            }
        } else {
            activeFiltersContainer.style.display = 'none';
        }
        
        // Filter content rows
        filterContentRows(section, status, tenant, locale);
    }
    
    /**
     * Clear all filters
     */
    function clearFilters() {
        // Reset filter selects
        if (filterSection) filterSection.value = '';
        if (filterStatus) filterStatus.value = '';
        if (filterTenant) filterTenant.value = '';
        if (filterLocale) filterLocale.value = '';
        
        // Hide active filters container
        activeFiltersContainer.style.display = 'none';
        
        // Clear filter tags
        activeFilterTags.innerHTML = '';
        
        // Show all content rows
        const contentRows = document.querySelectorAll('.admin-content-table tbody tr');
        contentRows.forEach(row => {
            row.style.display = '';
        });
    }
    
    /**
     * Add a filter tag to the active filters container
     * @param {string} type - Filter type (section, status, tenant, locale)
     * @param {string} value - Display value for the filter
     */
    function addFilterTag(type, value) {
        const tag = document.createElement('div');
        tag.className = 'content-tag';
        
        // Add appropriate class and icon based on filter type
        switch (type) {
            case 'section':
                tag.classList.add('section');
                tag.innerHTML = `<i class="fas fa-folder"></i> Section: ${value}`;
                break;
                
            case 'status':
                tag.classList.add('status');
                tag.innerHTML = `<i class="fas fa-info-circle"></i> Status: ${value}`;
                break;
                
            case 'tenant':
                tag.classList.add('tenant');
                tag.innerHTML = `<i class="fas fa-building"></i> Tenant: ${value}`;
                break;
                
            case 'locale':
                tag.classList.add('locale');
                tag.innerHTML = `<i class="fas fa-language"></i> Locale: ${value}`;
                break;
        }
        
        // Add remove button
        tag.innerHTML += `<span class="tag-remove" data-type="${type}"><i class="fas fa-times"></i></span>`;
        
        // Add event listener to remove button
        const removeButton = tag.querySelector('.tag-remove');
        removeButton.addEventListener('click', function() {
            removeFilter(this.dataset.type);
        });
        
        // Add tag to container
        activeFilterTags.appendChild(tag);
    }
    
    /**
     * Remove a specific filter
     * @param {string} type - Filter type to remove (section, status, tenant, locale)
     */
    function removeFilter(type) {
        // Reset the corresponding filter select
        switch (type) {
            case 'section':
                if (filterSection) filterSection.value = '';
                break;
                
            case 'status':
                if (filterStatus) filterStatus.value = '';
                break;
                
            case 'tenant':
                if (filterTenant) filterTenant.value = '';
                break;
                
            case 'locale':
                if (filterLocale) filterLocale.value = '';
                break;
        }
        
        // Re-apply filters
        applyFilters();
    }
    
    /**
     * Filter content rows based on selected criteria
     * @param {string} section - Section filter value
     * @param {string} status - Status filter value
     * @param {string} tenant - Tenant filter value
     * @param {string} locale - Locale filter value
     */
    function filterContentRows(section, status, tenant, locale) {
        const contentRows = document.querySelectorAll('.admin-content-table tbody tr');
        
        contentRows.forEach(row => {
            const rowSection = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const rowTenant = row.querySelector('td:nth-child(4) .tenant-badge').textContent.trim().toLowerCase();
            const rowLocale = row.querySelector('td:nth-child(5) .locale-badge').textContent.trim().toLowerCase();
            const rowStatus = row.querySelector('td:nth-child(6) .status-badge').textContent.toLowerCase();
            
            // Check if row matches all selected filters
            const matchesSection = !section || rowSection.includes(section.toLowerCase());
            const matchesStatus = !status || rowStatus.includes(status.toLowerCase());
            const matchesTenant = !tenant || rowTenant.includes(getTenantDisplayName(tenant).toLowerCase());
            const matchesLocale = !locale || rowLocale.includes(locale.toLowerCase());
            
            // Show/hide row based on filter matches
            if (matchesSection && matchesStatus && matchesTenant && matchesLocale) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    /**
     * Update content metadata display in the editor
     */
    function updateContentMetadata() {
        // This function would update any visual indicators of tenant/locale in the editor
        // For now, it's just a placeholder
        console.log('Content metadata updated');
    }
    
    /**
     * Get display name for a section value
     * @param {string} section - Section value
     * @returns {string} Display name
     */
    function getSectionDisplayName(section) {
        const sectionMap = {
            'main': 'Main',
            'getting-started': 'Getting Started',
            'managing-orders': 'Managing Orders',
            'products': 'Products',
            'customers': 'Customers',
            'analytics': 'Analytics',
            'settings': 'Settings',
            'updates': 'Updates'
        };
        
        return sectionMap[section] || section;
    }
    
    /**
     * Get display name for a status value
     * @param {string} status - Status value
     * @returns {string} Display name
     */
    function getStatusDisplayName(status) {
        const statusMap = {
            'published': 'Published',
            'draft': 'Draft',
            'archived': 'Archived'
        };
        
        return statusMap[status] || status;
    }
    
    /**
     * Get display name for a tenant value
     * @param {string} tenant - Tenant value
     * @returns {string} Display name
     */
    function getTenantDisplayName(tenant) {
        const tenantMap = {
            'global': 'Global',
            'acme-corp': 'Acme Corporation',
            'global-ent': 'Global Enterprises',
            'springfield-gov': 'City of Springfield',
            'tech-solutions': 'Tech Solutions Ltd'
        };
        
        return tenantMap[tenant] || tenant;
    }
    
    /**
     * Get display name for a locale value
     * @param {string} locale - Locale value
     * @returns {string} Display name
     */
    function getLocaleDisplayName(locale) {
        const localeMap = {
            'en-US': 'English (US)',
            'de-DE': 'German',
            'fr-FR': 'French',
            'ja-JP': 'Japanese',
            'es-ES': 'Spanish'
        };
        
        return localeMap[locale] || locale;
    }
});
