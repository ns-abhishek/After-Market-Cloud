// Enhanced Filter System

// Filter History Manager
class FilterHistoryManager {
    constructor(maxHistory = 20) {
        this.maxHistory = maxHistory;
        this.history = this.loadHistory();
    }
    
    loadHistory() {
        const saved = localStorage.getItem('filterHistory');
        return saved ? JSON.parse(saved) : [];
    }
    
    addToHistory(filter) {
        // Create history entry
        const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            filter: filter,
            resultCount: filter.resultCount || 0
        };
        
        // Add to beginning of array
        this.history.unshift(historyEntry);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(0, this.maxHistory);
        }
        
        // Save to localStorage
        this.saveHistory();
        
        return historyEntry;
    }
    
    saveHistory() {
        localStorage.setItem('filterHistory', JSON.stringify(this.history));
    }
    
    clearHistory() {
        this.history = [];
        localStorage.removeItem('filterHistory');
    }
    
    renderHistory(containerId, onApply) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (this.history.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <p>No filter history yet.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.history.forEach(entry => {
            const timeAgo = this.getTimeAgo(new Date(entry.timestamp));
            const filterName = this.getFilterDescription(entry.filter);
            
            const historyItem = document.createElement('div');
            historyItem.className = 'timeline-item';
            historyItem.innerHTML = `
                <div class="timeline-item-time">${timeAgo}</div>
                <div class="timeline-item-filter">${filterName}</div>
                <div class="timeline-item-results">${entry.resultCount} results</div>
            `;
            
            historyItem.addEventListener('click', () => {
                if (onApply) onApply(entry.filter);
            });
            
            container.appendChild(historyItem);
        });
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 0) {
            return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
        }
        if (diffHour > 0) {
            return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
        }
        if (diffMin > 0) {
            return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
        }
        return 'Just now';
    }
    
    getFilterDescription(filter) {
        // Create a human-readable description of the filter
        let description = '';
        
        if (filter.smartSearch) {
            description = `Search: "${filter.smartSearch}"`;
        } else if (filter.activeFilters && filter.activeFilters.length > 0) {
            if (filter.activeFilters.includes('all') && filter.activeFilters.length === 1) {
                description = 'All reports';
            } else {
                const filterTypes = [];
                if (filter.activeFilters.includes('active')) filterTypes.push('Active');
                if (filter.activeFilters.includes('inactive')) filterTypes.push('Inactive');
                if (filter.activeFilters.includes('set')) filterTypes.push('Set');
                if (filter.activeFilters.includes('not-set')) filterTypes.push('Not Set');
                
                description = filterTypes.join(', ');
            }
        } else if (filter.wizardFilter) {
            description = `${filter.wizardFilter.type} - ${filter.wizardFilter.status}`;
        } else {
            description = 'Custom filter';
        }
        
        return description;
    }
}

// Filter Preview Manager
class FilterPreviewManager {
    constructor(data) {
        this.data = data;
        this.previewPanel = document.getElementById('filter-preview-panel');
        this.previewContent = document.getElementById('preview-content');
        this.previewCount = document.getElementById('preview-count');
    }
    
    updatePreview(filteredData) {
        if (!this.previewPanel || !this.previewContent || !this.previewCount) return;
        
        // Update count
        this.previewCount.textContent = `${filteredData.length} results`;
        
        // Clear previous content
        this.previewContent.innerHTML = '';
        
        // Show preview items (limited to 5)
        const previewItems = filteredData.slice(0, 5);
        
        if (previewItems.length === 0) {
            this.previewContent.innerHTML = `
                <div class="empty-preview">
                    <p>No results match your filter criteria.</p>
                </div>
            `;
            return;
        }
        
        previewItems.forEach(item => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <div class="preview-item-name">${item.name}</div>
                <div class="preview-item-details">
                    ${item.status} | ${item.active ? 'Active' : 'Inactive'}
                </div>
            `;
            
            this.previewContent.appendChild(previewItem);
        });
        
        // Add "Show more" if there are more items
        if (filteredData.length > 5) {
            const showMore = document.createElement('div');
            showMore.className = 'preview-show-more';
            showMore.textContent = `+ ${filteredData.length - 5} more items`;
            this.previewContent.appendChild(showMore);
        }
    }
}

// Filter Wizard Manager
class FilterWizardManager {
    constructor(data) {
        this.data = data;
        this.wizardDialog = document.getElementById('filter-wizard-dialog');
        this.currentStep = 1;
        this.selections = {
            type: null,
            status: null,
            timeRange: null,
            customDateRange: {
                start: null,
                end: null
            }
        };
        
        this.mdcDialog = null;
        if (this.wizardDialog) {
            this.mdcDialog = new mdc.dialog.MDCDialog(this.wizardDialog);
        }
    }
    
    openWizard() {
        if (!this.mdcDialog) return;
        
        // Reset wizard state
        this.currentStep = 1;
        this.selections = {
            type: null,
            status: null,
            timeRange: null,
            customDateRange: {
                start: null,
                end: null
            }
        };
        
        // Show first step
        this.showStep(1);
        
        // Setup event listeners
        this.setupWizardEvents();
        
        // Open dialog
        this.mdcDialog.open();
    }
    
    setupWizardEvents() {
        // Next button
        const nextButton = document.getElementById('wizard-next-button');
        if (nextButton) {
            // Remove existing listeners
            const newNextButton = nextButton.cloneNode(true);
            nextButton.parentNode.replaceChild(newNextButton, nextButton);
            
            newNextButton.addEventListener('click', () => {
                if (this.currentStep < 4) {
                    this.nextStep();
                } else {
                    this.applyWizardFilter();
                    this.mdcDialog.close();
                }
            });
        }
        
        // Back button
        const backButton = document.getElementById('wizard-back-button');
        if (backButton) {
            // Remove existing listeners
            const newBackButton = backButton.cloneNode(true);
            backButton.parentNode.replaceChild(newBackButton, backButton);
            
            newBackButton.addEventListener('click', () => {
                if (this.currentStep > 1) {
                    this.prevStep();
                }
            });
        }
        
        // Cancel button
        const cancelButton = document.getElementById('wizard-cancel-button');
        if (cancelButton) {
            // Remove existing listeners
            const newCancelButton = cancelButton.cloneNode(true);
            cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
            
            newCancelButton.addEventListener('click', () => {
                this.mdcDialog.close();
            });
        }
        
        // Setup wizard options
        this.setupWizardOptions();
    }
    
    setupWizardOptions() {
        // Step 1 options
        const typeOptions = document.querySelectorAll('#wizard-step-1 .wizard-option');
        typeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                typeOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Store selection
                this.selections.type = option.getAttribute('data-value');
                
                // Enable next button
                document.getElementById('wizard-next-button').disabled = false;
            });
        });
        
        // Step 2 options
        const statusOptions = document.querySelectorAll('#wizard-step-2 .wizard-option');
        statusOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                statusOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Store selection
                this.selections.status = option.getAttribute('data-value');
                
                // Enable next button
                document.getElementById('wizard-next-button').disabled = false;
            });
        });
        
        // Step 3 options
        const timeOptions = document.querySelectorAll('#wizard-step-3 .wizard-option');
        timeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                timeOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Store selection
                this.selections.timeRange = option.getAttribute('data-value');
                
                // Show/hide custom date range
                const customDateRange = document.getElementById('custom-date-range');
                if (this.selections.timeRange === 'custom') {
                    customDateRange.style.display = 'flex';
                } else {
                    customDateRange.style.display = 'none';
                }
                
                // Enable next button
                document.getElementById('wizard-next-button').disabled = false;
            });
        });
        
        // Custom date range inputs
        const startDateInput = document.getElementById('wizard-start-date');
        const endDateInput = document.getElementById('wizard-end-date');
        
        if (startDateInput) {
            startDateInput.addEventListener('change', () => {
                this.selections.customDateRange.start = startDateInput.value;
            });
        }
        
        if (endDateInput) {
            endDateInput.addEventListener('change', () => {
                this.selections.customDateRange.end = endDateInput.value;
            });
        }
    }
    
    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show requested step
        const step = document.getElementById(`wizard-step-${stepNumber}`);
        if (step) {
            step.classList.add('active');
        }
        
        // Update current step
        this.currentStep = stepNumber;
        
        // Update buttons
        const backButton = document.getElementById('wizard-back-button');
        const nextButton = document.getElementById('wizard-next-button');
        
        if (backButton) {
            backButton.disabled = stepNumber === 1;
        }
        
        if (nextButton) {
            if (stepNumber === 4) {
                nextButton.textContent = 'Apply Filter';
                nextButton.disabled = false;
                this.updateSummary();
            } else {
                nextButton.textContent = 'Next';
                
                // Disable next button if no selection made
                switch (stepNumber) {
                    case 1:
                        nextButton.disabled = !this.selections.type;
                        break;
                    case 2:
                        nextButton.disabled = !this.selections.status;
                        break;
                    case 3:
                        nextButton.disabled = !this.selections.timeRange;
                        break;
                }
            }
        }
    }
    
    nextStep() {
        if (this.currentStep < 4) {
            this.showStep(this.currentStep + 1);
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    updateSummary() {
        const summaryElement = document.getElementById('wizard-summary');
        if (!summaryElement) return;
        
        // Create summary HTML
        let summaryHtml = '';
        
        // Type
        let typeText = 'All';
        if (this.selections.type === 'reports') typeText = 'Reports';
        if (this.selections.type === 'companies') typeText = 'Companies';
        if (this.selections.type === 'regions') typeText = 'Regions';
        
        summaryHtml += `
            <div class="summary-item">
                <div class="summary-label">Type:</div>
                <div class="summary-value">${typeText}</div>
            </div>
        `;
        
        // Status
        let statusText = 'All';
        if (this.selections.status === 'active') statusText = 'Active';
        if (this.selections.status === 'inactive') statusText = 'Inactive';
        if (this.selections.status === 'set') statusText = 'Set';
        if (this.selections.status === 'not-set') statusText = 'Not Set';
        
        summaryHtml += `
            <div class="summary-item">
                <div class="summary-label">Status:</div>
                <div class="summary-value">${statusText}</div>
            </div>
        `;
        
        // Time Range
        let timeRangeText = 'All Time';
        if (this.selections.timeRange === 'this-month') timeRangeText = 'This Month';
        if (this.selections.timeRange === 'last-month') timeRangeText = 'Last Month';
        if (this.selections.timeRange === 'this-year') timeRangeText = 'This Year';
        if (this.selections.timeRange === 'custom') {
            const start = this.selections.customDateRange.start || 'Any';
            const end = this.selections.customDateRange.end || 'Any';
            timeRangeText = `Custom: ${start} to ${end}`;
        }
        
        summaryHtml += `
            <div class="summary-item">
                <div class="summary-label">Time Range:</div>
                <div class="summary-value">${timeRangeText}</div>
            </div>
        `;
        
        // Update summary element
        summaryElement.innerHTML = summaryHtml;
        
        // Update preview
        this.updateWizardPreview();
    }
    
    updateWizardPreview() {
        // Apply the filter to get preview data
        const filteredData = this.applyWizardFilterToData();
        
        // Update preview count
        const previewCountElement = document.getElementById('wizard-preview-count');
        if (previewCountElement) {
            previewCountElement.textContent = `${filteredData.length} results`;
        }
        
        // Update preview list
        const previewListElement = document.getElementById('wizard-preview-list');
        if (previewListElement) {
            previewListElement.innerHTML = '';
            
            // Show up to 5 preview items
            const previewItems = filteredData.slice(0, 5);
            
            if (previewItems.length === 0) {
                previewListElement.innerHTML = `
                    <div class="preview-list-item">
                        <p>No results match your filter criteria.</p>
                    </div>
                `;
                return;
            }
            
            previewItems.forEach(item => {
                const listItem = document.createElement('div');
                listItem.className = 'preview-list-item';
                listItem.textContent = item.name;
                previewListElement.appendChild(listItem);
            });
            
            // Add "Show more" if there are more items
            if (filteredData.length > 5) {
                const showMore = document.createElement('div');
                showMore.className = 'preview-list-item show-more';
                showMore.textContent = `+ ${filteredData.length - 5} more items`;
                previewListElement.appendChild(showMore);
            }
        }
    }
    
    applyWizardFilterToData() {
        // Apply the wizard filter to the data
        let filteredData = [...this.data];
        
        // Filter by status
        if (this.selections.status && this.selections.status !== 'all') {
            if (this.selections.status === 'active') {
                filteredData = filteredData.filter(item => item.active);
            } else if (this.selections.status === 'inactive') {
                filteredData = filteredData.filter(item => !item.active);
            } else if (this.selections.status === 'set') {
                filteredData = filteredData.filter(item => item.status === 'Set');
            } else if (this.selections.status === 'not-set') {
                filteredData = filteredData.filter(item => item.status === 'Not Set');
            }
        }
        
        // Filter by time range
        if (this.selections.timeRange && this.selections.timeRange !== 'all-time') {
            const now = new Date();
            let startDate, endDate;
            
            if (this.selections.timeRange === 'this-month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            } else if (this.selections.timeRange === 'last-month') {
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            } else if (this.selections.timeRange === 'this-year') {
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
            } else if (this.selections.timeRange === 'custom') {
                if (this.selections.customDateRange.start) {
                    startDate = new Date(this.selections.customDateRange.start);
                }
                if (this.selections.customDateRange.end) {
                    endDate = new Date(this.selections.customDateRange.end);
                }
            }
            
            if (startDate) {
                filteredData = filteredData.filter(item => new Date(item.startDate) >= startDate);
            }
            
            if (endDate) {
                filteredData = filteredData.filter(item => new Date(item.startDate) <= endDate);
            }
        }
        
        return filteredData;
    }
    
    applyWizardFilter() {
        // Get filtered data
        const filteredData = this.applyWizardFilterToData();
        
        // Create filter object
        const filter = {
            wizardFilter: {
                type: this.selections.type,
                status: this.selections.status,
                timeRange: this.selections.timeRange,
                customDateRange: this.selections.customDateRange
            },
            resultCount: filteredData.length
        };
        
        // Add to filter history
        if (window.filterHistoryManager) {
            window.filterHistoryManager.addToHistory(filter);
        }
        
        // Update the grid with filtered results
        populateReportsGrid(filteredData);
        
        // Update filter chips
        let chipLabel = '';
        if (this.selections.type) {
            chipLabel += this.selections.type.charAt(0).toUpperCase() + this.selections.type.slice(1) + ' ';
        }
        if (this.selections.status && this.selections.status !== 'all') {
            chipLabel += this.selections.status.charAt(0).toUpperCase() + this.selections.status.slice(1) + ' ';
        }
        if (this.selections.timeRange && this.selections.timeRange !== 'all-time') {
            if (this.selections.timeRange === 'this-month') {
                chipLabel += 'This Month';
            } else if (this.selections.timeRange === 'last-month') {
                chipLabel += 'Last Month';
            } else if (this.selections.timeRange === 'this-year') {
                chipLabel += 'This Year';
            } else if (this.selections.timeRange === 'custom') {
                chipLabel += 'Custom Date Range';
            }
        }
        
        addFilterChip('wizard', chipLabel.trim() || 'Wizard Filter');
        
        // Update the filtered counts
        updateFilteredCounts(filteredData);
        
        // Update filter preview
        if (window.filterPreviewManager) {
            window.filterPreviewManager.updatePreview(filteredData);
        }
        
        // Show confirmation
        showSnackbar(`Filter applied: ${filteredData.length} results`);
    }
}

// Smart Recommendations Manager
class SmartRecommendationsManager {
    constructor(data) {
        this.data = data;
        this.recommendationsDialog = document.getElementById('smart-recommendations-dialog');
        this.mdcDialog = null;
        
        if (this.recommendationsDialog) {
            this.mdcDialog = new mdc.dialog.MDCDialog(this.recommendationsDialog);
        }
    }
    
    generateRecommendations() {
        // Analyze data to generate smart recommendations
        const recommendations = [];
        
        // Recommendation 1: Most common status
        const statusCounts = this.countByProperty('status');
        const mostCommonStatus = this.getMostCommon(statusCounts);
        if (mostCommonStatus) {
            recommendations.push({
                title: `${mostCommonStatus.value} Reports`,
                description: `${mostCommonStatus.count} reports with status "${mostCommonStatus.value}"`,
                filter: {
                    type: 'status',
                    value: mostCommonStatus.value
                }
            });
        }
        
        // Recommendation 2: Most common region
        const regionCounts = this.countByProperty('region');
        const mostCommonRegion = this.getMostCommon(regionCounts);
        if (mostCommonRegion) {
            recommendations.push({
                title: `${mostCommonRegion.value} Region`,
                description: `${mostCommonRegion.count} reports from ${mostCommonRegion.value}`,
                filter: {
                    type: 'region',
                    value: mostCommonRegion.value
                }
            });
        }
        
        // Recommendation 3: Active reports
        const activeCount = this.data.filter(item => item.active).length;
        if (activeCount > 0) {
            recommendations.push({
                title: 'Active Reports',
                description: `${activeCount} active reports`,
                filter: {
                    type: 'active',
                    value: true
                }
            });
        }
        
        // Recommendation 4: Recent reports (last month)
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const recentCount = this.data.filter(item => new Date(item.startDate) >= lastMonth).length;
        if (recentCount > 0) {
            recommendations.push({
                title: 'Recent Reports',
                description: `${recentCount} reports from the last month`,
                filter: {
                    type: 'timeRange',
                    value: 'last-month'
                }
            });
        }
        
        return recommendations;
    }
    
    countByProperty(property) {
        const counts = {};
        this.data.forEach(item => {
            const value = item[property];
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });
        return counts;
    }
    
    getMostCommon(counts) {
        let mostCommon = null;
        let maxCount = 0;
        
        for (const value in counts) {
            if (counts[value] > maxCount) {
                maxCount = counts[value];
                mostCommon = {
                    value: value,
                    count: counts[value]
                };
            }
        }
        
        return mostCommon;
    }
    
    showRecommendations() {
        if (!this.mdcDialog) return;
        
        // Generate recommendations
        const recommendations = this.generateRecommendations();
        
        // Populate recommendations list
        const recommendationsList = document.getElementById('recommendations-list');
        if (recommendationsList) {
            recommendationsList.innerHTML = '';
            
            if (recommendations.length === 0) {
                recommendationsList.innerHTML = `
                    <div class="empty-recommendations">
                        <p>No recommendations available.</p>
                    </div>
                `;
            } else {
                recommendations.forEach(recommendation => {
                    const recommendationItem = document.createElement('div');
                    recommendationItem.className = 'recommendation-item';
                    recommendationItem.innerHTML = `
                        <div class="recommendation-info">
                            <div class="recommendation-title">${recommendation.title}</div>
                            <div class="recommendation-description">${recommendation.description}</div>
                        </div>
                        <button class="mdc-button mdc-button--outlined recommendation-action">
                            <span class="mdc-button__label">Apply</span>
                        </button>
                    `;
                    
                    // Add click handler for apply button
                    const applyButton = recommendationItem.querySelector('.recommendation-action');
                    applyButton.addEventListener('click', () => {
                        this.applyRecommendation(recommendation);
                        this.mdcDialog.close();
                    });
                    
                    recommendationsList.appendChild(recommendationItem);
                });
            }
        }
        
        // Open dialog
        this.mdcDialog.open();
    }
    
    applyRecommendation(recommendation) {
        let filteredData = [...this.data];
        
        // Apply filter based on recommendation type
        if (recommendation.filter.type === 'status') {
            filteredData = filteredData.filter(item => item.status === recommendation.filter.value);
        } else if (recommendation.filter.type === 'region') {
            filteredData = filteredData.filter(item => item.region === recommendation.filter.value);
        } else if (recommendation.filter.type === 'active') {
            filteredData = filteredData.filter(item => item.active === recommendation.filter.value);
        } else if (recommendation.filter.type === 'timeRange') {
            const now = new Date();
            let startDate;
            
            if (recommendation.filter.value === 'last-month') {
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                filteredData = filteredData.filter(item => new Date(item.startDate) >= startDate);
            }
        }
        
        // Update the grid with filtered results
        populateReportsGrid(filteredData);
        
        // Update filter chips
        addFilterChip('recommendation', recommendation.title);
        
        // Update the filtered counts
        updateFilteredCounts(filteredData);
        
        // Update filter preview
        if (window.filterPreviewManager) {
            window.filterPreviewManager.updatePreview(filteredData);
        }
        
        // Show confirmation
        showSnackbar(`Applied recommendation: ${recommendation.title}`);
    }
}

// Export the classes for use in the main script
window.FilterHistoryManager = FilterHistoryManager;
window.FilterPreviewManager = FilterPreviewManager;
window.FilterWizardManager = FilterWizardManager;
window.SmartRecommendationsManager = SmartRecommendationsManager;
