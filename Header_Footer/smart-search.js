// Smart Search and Advanced Filter System

// Natural language processing for smart search
class SmartSearch {
    constructor(data, fields) {
        this.data = data;
        this.fields = fields;
        this.suggestions = [];
        this.recentSearches = this.loadRecentSearches();
    }

    // Process natural language query
    processQuery(query) {
        if (!query) return this.data;

        query = query.toLowerCase();
        
        // Check for special keywords
        const activeMatch = query.match(/active|inactive/g);
        const statusMatch = query.match(/set|not set/g);
        const regionMatch = query.match(/in\s+([a-z\s]+)/i);
        const dateMatch = query.match(/(before|after|between)\s+([a-z0-9\s,]+)/i);
        
        let filteredData = [...this.data];
        
        // Filter by active status
        if (activeMatch) {
            const isActive = activeMatch[0] === 'active';
            filteredData = filteredData.filter(item => item.active === isActive);
        }
        
        // Filter by set status
        if (statusMatch) {
            const status = statusMatch[0] === 'set' ? 'Set' : 'Not Set';
            filteredData = filteredData.filter(item => item.status === status);
        }
        
        // Filter by region
        if (regionMatch && regionMatch[1]) {
            const regionTerm = regionMatch[1].trim();
            filteredData = filteredData.filter(item => {
                return item.region && item.region.toLowerCase().includes(regionTerm);
            });
        }
        
        // Filter by date
        if (dateMatch) {
            const dateType = dateMatch[1];
            const dateValue = dateMatch[2];
            
            // Implement date filtering logic here
            // This would require parsing the natural language date expressions
        }
        
        // General text search across all fields if no specific filters matched
        if (!activeMatch && !statusMatch && !regionMatch && !dateMatch) {
            filteredData = filteredData.filter(item => {
                return this.fields.some(field => {
                    return item[field] && item[field].toString().toLowerCase().includes(query);
                });
            });
        }
        
        // Save this search if it returned results
        if (filteredData.length > 0) {
            this.saveSearch(query);
        }
        
        return filteredData;
    }
    
    // Generate search suggestions based on data and previous searches
    generateSuggestions(partialQuery) {
        if (!partialQuery || partialQuery.length < 2) {
            return this.recentSearches.slice(0, 5);
        }
        
        const suggestions = [];
        const lowercaseQuery = partialQuery.toLowerCase();
        
        // Add suggestions from recent searches
        this.recentSearches.forEach(search => {
            if (search.toLowerCase().includes(lowercaseQuery)) {
                suggestions.push({
                    text: search,
                    type: 'recent'
                });
            }
        });
        
        // Add suggestions for regions
        const uniqueRegions = [...new Set(this.data.map(item => item.region))];
        uniqueRegions.forEach(region => {
            if (region && region.toLowerCase().includes(lowercaseQuery)) {
                suggestions.push({
                    text: `active reports in ${region}`,
                    type: 'region'
                });
            }
        });
        
        // Add suggestions for companies
        const uniqueCompanies = [...new Set(this.data.map(item => item.company))];
        uniqueCompanies.forEach(company => {
            if (company && company.toLowerCase().includes(lowercaseQuery)) {
                suggestions.push({
                    text: `reports from ${company}`,
                    type: 'company'
                });
            }
        });
        
        // Add status suggestions
        if ('set'.includes(lowercaseQuery)) {
            suggestions.push({
                text: 'set status reports',
                type: 'status'
            });
        }
        
        if ('not set'.includes(lowercaseQuery)) {
            suggestions.push({
                text: 'not set status reports',
                type: 'status'
            });
        }
        
        // Add active/inactive suggestions
        if ('active'.includes(lowercaseQuery)) {
            suggestions.push({
                text: 'active reports',
                type: 'active'
            });
        }
        
        if ('inactive'.includes(lowercaseQuery)) {
            suggestions.push({
                text: 'inactive reports',
                type: 'active'
            });
        }
        
        return suggestions.slice(0, 5); // Limit to 5 suggestions
    }
    
    // Save search to recent searches
    saveSearch(query) {
        if (!query || query.length < 3) return;
        
        // Remove this search if it already exists
        this.recentSearches = this.recentSearches.filter(search => search !== query);
        
        // Add to the beginning of the array
        this.recentSearches.unshift(query);
        
        // Limit to 10 recent searches
        if (this.recentSearches.length > 10) {
            this.recentSearches = this.recentSearches.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }
    
    // Load recent searches from localStorage
    loadRecentSearches() {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    }
    
    // Clear recent searches
    clearRecentSearches() {
        this.recentSearches = [];
        localStorage.removeItem('recentSearches');
    }
}

// Visual Filter Builder
class VisualFilterBuilder {
    constructor(canvasId, paletteId) {
        this.canvas = document.getElementById(canvasId);
        this.palette = document.getElementById(paletteId);
        this.nodes = [];
        this.connections = [];
        this.draggedItem = null;
        this.nextNodeId = 1;
        
        this.initDragAndDrop();
    }
    
    initDragAndDrop() {
        // Make palette items draggable
        const paletteItems = document.querySelectorAll('.palette-item');
        paletteItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = {
                    type: item.getAttribute('data-type'),
                    element: item
                };
                e.dataTransfer.setData('text/plain', item.getAttribute('data-type'));
            });
            
            item.addEventListener('dragend', () => {
                this.draggedItem = null;
            });
        });
        
        // Setup canvas as drop target
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedItem) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.createFilterNode(this.draggedItem.type, x, y);
            }
        });
    }
    
    createFilterNode(type, x, y) {
        const nodeId = this.nextNodeId++;
        const node = document.createElement('div');
        node.className = 'filter-node';
        node.id = `filter-node-${nodeId}`;
        node.setAttribute('data-type', type);
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        // Create node content based on type
        let nodeContent = '';
        
        switch (type) {
            case 'category':
                nodeContent = this.createCategoryNodeContent(nodeId);
                break;
            case 'date':
                nodeContent = this.createDateNodeContent(nodeId);
                break;
            case 'text':
                nodeContent = this.createTextNodeContent(nodeId);
                break;
            case 'and':
            case 'or':
            case 'not':
                nodeContent = this.createLogicNodeContent(type, nodeId);
                break;
        }
        
        node.innerHTML = nodeContent;
        this.canvas.appendChild(node);
        
        // Make node draggable
        this.makeNodeDraggable(node);
        
        // Add to nodes array
        this.nodes.push({
            id: nodeId,
            type: type,
            element: node
        });
        
        // Remove instructions if this is the first node
        if (this.nodes.length === 1) {
            const instructions = this.canvas.querySelector('.visual-builder-instructions');
            if (instructions) {
                instructions.style.display = 'none';
            }
        }
        
        return node;
    }
    
    createCategoryNodeContent(nodeId) {
        return `
            <div class="filter-node-header">
                <span class="filter-node-title">Category Filter</span>
                <i class="material-icons" onclick="removeFilterNode(${nodeId})">close</i>
            </div>
            <div class="filter-node-content">
                <select id="filter-node-${nodeId}-field">
                    <option value="region">Region</option>
                    <option value="company">Company</option>
                    <option value="branch">Branch</option>
                    <option value="subBranch">Sub-Branch</option>
                    <option value="status">Status</option>
                    <option value="active">Active</option>
                </select>
                <select id="filter-node-${nodeId}-operator">
                    <option value="equals">equals</option>
                    <option value="not-equals">not equals</option>
                    <option value="contains">contains</option>
                </select>
                <input type="text" id="filter-node-${nodeId}-value" placeholder="Value">
            </div>
            <div class="filter-node-connector input"></div>
            <div class="filter-node-connector output"></div>
        `;
    }
    
    createDateNodeContent(nodeId) {
        return `
            <div class="filter-node-header">
                <span class="filter-node-title">Date Filter</span>
                <i class="material-icons" onclick="removeFilterNode(${nodeId})">close</i>
            </div>
            <div class="filter-node-content">
                <select id="filter-node-${nodeId}-field">
                    <option value="startDate">Start Date</option>
                    <option value="endDate">End Date</option>
                </select>
                <select id="filter-node-${nodeId}-operator">
                    <option value="before">before</option>
                    <option value="after">after</option>
                    <option value="between">between</option>
                </select>
                <input type="date" id="filter-node-${nodeId}-value">
                <input type="date" id="filter-node-${nodeId}-value2" style="display:none">
            </div>
            <div class="filter-node-connector input"></div>
            <div class="filter-node-connector output"></div>
        `;
    }
    
    createTextNodeContent(nodeId) {
        return `
            <div class="filter-node-header">
                <span class="filter-node-title">Text Filter</span>
                <i class="material-icons" onclick="removeFilterNode(${nodeId})">close</i>
            </div>
            <div class="filter-node-content">
                <select id="filter-node-${nodeId}-field">
                    <option value="name">Report Name</option>
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                </select>
                <select id="filter-node-${nodeId}-operator">
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                    <option value="starts-with">starts with</option>
                    <option value="ends-with">ends with</option>
                </select>
                <input type="text" id="filter-node-${nodeId}-value" placeholder="Value">
            </div>
            <div class="filter-node-connector input"></div>
            <div class="filter-node-connector output"></div>
        `;
    }
    
    createLogicNodeContent(type, nodeId) {
        return `
            <div class="filter-node-header">
                <span class="filter-node-title">${type.toUpperCase()}</span>
                <i class="material-icons" onclick="removeFilterNode(${nodeId})">close</i>
            </div>
            <div class="filter-node-connector input"></div>
            <div class="filter-node-connector output"></div>
        `;
    }
    
    makeNodeDraggable(node) {
        let offsetX, offsetY, isDragging = false;
        
        node.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' || 
                e.target.tagName === 'I') {
                return;
            }
            
            isDragging = true;
            offsetX = e.clientX - node.getBoundingClientRect().left;
            offsetY = e.clientY - node.getBoundingClientRect().top;
            
            node.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const rect = this.canvas.getBoundingClientRect();
            let x = e.clientX - rect.left - offsetX;
            let y = e.clientY - rect.top - offsetY;
            
            // Keep node within canvas bounds
            x = Math.max(0, Math.min(x, rect.width - node.offsetWidth));
            y = Math.max(0, Math.min(y, rect.height - node.offsetHeight));
            
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            
            // Update connections
            this.updateConnections();
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                node.style.cursor = 'move';
            }
        });
    }
    
    updateConnections() {
        // Remove existing connection lines
        this.canvas.querySelectorAll('.filter-connection').forEach(conn => {
            conn.remove();
        });
        
        // Redraw connections
        this.connections.forEach(conn => {
            this.drawConnection(conn.from, conn.to);
        });
    }
    
    drawConnection(fromNode, toNode) {
        const fromElement = document.getElementById(`filter-node-${fromNode}`);
        const toElement = document.getElementById(`filter-node-${toNode}`);
        
        if (!fromElement || !toElement) return;
        
        const fromOutput = fromElement.querySelector('.filter-node-connector.output');
        const toInput = toElement.querySelector('.filter-node-connector.input');
        
        const fromRect = fromOutput.getBoundingClientRect();
        const toRect = toInput.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;
        const toX = toRect.left + toRect.width / 2 - canvasRect.left;
        const toY = toRect.top + toRect.height / 2 - canvasRect.top;
        
        const connection = document.createElement('div');
        connection.className = 'filter-connection';
        
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        connection.style.width = `${length}px`;
        connection.style.left = `${fromX}px`;
        connection.style.top = `${fromY}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        this.canvas.appendChild(connection);
    }
    
    addConnection(fromNodeId, toNodeId) {
        this.connections.push({
            from: fromNodeId,
            to: toNodeId
        });
        
        this.drawConnection(fromNodeId, toNodeId);
    }
    
    removeNode(nodeId) {
        // Remove node element
        const node = document.getElementById(`filter-node-${nodeId}`);
        if (node) {
            node.remove();
        }
        
        // Remove from nodes array
        this.nodes = this.nodes.filter(n => n.id !== nodeId);
        
        // Remove connections involving this node
        this.connections = this.connections.filter(
            conn => conn.from !== nodeId && conn.to !== nodeId
        );
        
        // Update remaining connections
        this.updateConnections();
        
        // Show instructions if no nodes left
        if (this.nodes.length === 0) {
            const instructions = this.canvas.querySelector('.visual-builder-instructions');
            if (instructions) {
                instructions.style.display = 'flex';
            }
        }
    }
    
    buildFilterQuery() {
        // Build a query object from the visual filter
        const query = {};
        
        // Implement logic to convert the visual filter to a query
        // This would involve traversing the nodes and connections
        
        return query;
    }
    
    clear() {
        // Remove all nodes
        this.nodes.forEach(node => {
            const element = document.getElementById(`filter-node-${node.id}`);
            if (element) {
                element.remove();
            }
        });
        
        // Clear arrays
        this.nodes = [];
        this.connections = [];
        
        // Remove all connections
        this.canvas.querySelectorAll('.filter-connection').forEach(conn => {
            conn.remove();
        });
        
        // Show instructions
        const instructions = this.canvas.querySelector('.visual-builder-instructions');
        if (instructions) {
            instructions.style.display = 'flex';
        }
    }
}

// Saved Filters Manager
class SavedFiltersManager {
    constructor() {
        this.savedFilters = this.loadSavedFilters();
    }
    
    loadSavedFilters() {
        const saved = localStorage.getItem('savedFilters');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFilter(name, description, filterState) {
        const newFilter = {
            id: Date.now(),
            name,
            description,
            filterState,
            createdAt: new Date().toISOString()
        };
        
        this.savedFilters.push(newFilter);
        this.persistSavedFilters();
        
        return newFilter;
    }
    
    updateFilter(id, updates) {
        this.savedFilters = this.savedFilters.map(filter => {
            if (filter.id === id) {
                return { ...filter, ...updates };
            }
            return filter;
        });
        
        this.persistSavedFilters();
    }
    
    deleteFilter(id) {
        this.savedFilters = this.savedFilters.filter(filter => filter.id !== id);
        this.persistSavedFilters();
    }
    
    persistSavedFilters() {
        localStorage.setItem('savedFilters', JSON.stringify(this.savedFilters));
    }
    
    renderSavedFilters(containerId, onApply, onDelete) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (this.savedFilters.length === 0) {
            container.innerHTML = `
                <div class="empty-saved-filters">
                    <i class="material-icons">bookmark_border</i>
                    <p>No saved filters yet. Create and save filters to access them quickly later.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.savedFilters.forEach(filter => {
            const filterItem = document.createElement('div');
            filterItem.className = 'saved-filter-item';
            filterItem.innerHTML = `
                <div class="saved-filter-info">
                    <div class="saved-filter-name">${filter.name}</div>
                    <div class="saved-filter-description">${filter.description}</div>
                </div>
                <div class="saved-filter-actions">
                    <button class="apply-filter mdc-button mdc-button--outlined">
                        <span class="mdc-button__label">Apply</span>
                    </button>
                    <button class="delete-filter mdc-button mdc-button--outlined">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            `;
            
            container.appendChild(filterItem);
            
            // Setup event listeners
            filterItem.querySelector('.apply-filter').addEventListener('click', () => {
                if (onApply) onApply(filter);
            });
            
            filterItem.querySelector('.delete-filter').addEventListener('click', () => {
                this.deleteFilter(filter.id);
                if (onDelete) onDelete(filter.id);
                this.renderSavedFilters(containerId, onApply, onDelete);
            });
        });
    }
}

// Export the classes for use in the main script
window.SmartSearch = SmartSearch;
window.VisualFilterBuilder = VisualFilterBuilder;
window.SavedFiltersManager = SavedFiltersManager;
