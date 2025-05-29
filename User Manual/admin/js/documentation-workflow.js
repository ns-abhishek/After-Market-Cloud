/**
 * Documentation Publishing Workflow Module
 * Handles the workflow for creating, reviewing, approving, and publishing documentation
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const workflowStages = document.querySelectorAll('.workflow-stage');
    const workflowActions = document.querySelectorAll('.workflow-action');
    const assigneeSelectors = document.querySelectorAll('.assignee-selector');
    const dueDatePickers = document.querySelectorAll('.due-date-picker');
    const commentForms = document.querySelectorAll('.comment-form');
    const publishButton = document.getElementById('publish-document');
    
    // Initialize workflow
    initWorkflow();
    
    /**
     * Initialize workflow components and event listeners
     */
    function initWorkflow() {
        // Set up workflow stage transitions
        if (workflowStages.length > 0) {
            workflowStages.forEach(stage => {
                setupStageActions(stage);
            });
        }
        
        // Set up workflow actions
        if (workflowActions.length > 0) {
            workflowActions.forEach(action => {
                action.addEventListener('click', handleWorkflowAction);
            });
        }
        
        // Set up assignee selectors
        if (assigneeSelectors.length > 0) {
            assigneeSelectors.forEach(selector => {
                selector.addEventListener('change', updateAssignee);
            });
        }
        
        // Set up due date pickers
        if (dueDatePickers.length > 0) {
            dueDatePickers.forEach(picker => {
                picker.addEventListener('change', updateDueDate);
            });
        }
        
        // Set up comment forms
        if (commentForms.length > 0) {
            commentForms.forEach(form => {
                form.addEventListener('submit', addComment);
            });
        }
        
        // Set up publish button
        if (publishButton) {
            publishButton.addEventListener('click', publishDocument);
        }
    }
    
    /**
     * Set up actions for a workflow stage
     * @param {HTMLElement} stage - The workflow stage element
     */
    function setupStageActions(stage) {
        const stageHeader = stage.querySelector('.stage-header');
        const stageContent = stage.querySelector('.stage-content');
        const stageActions = stage.querySelectorAll('.stage-action');
        
        if (stageHeader) {
            stageHeader.addEventListener('click', () => {
                stage.classList.toggle('expanded');
                if (stageContent) {
                    stageContent.style.display = stage.classList.contains('expanded') ? 'block' : 'none';
                }
            });
        }
        
        if (stageActions.length > 0) {
            stageActions.forEach(action => {
                action.addEventListener('click', handleStageAction);
            });
        }
    }
    
    /**
     * Handle workflow action button click
     * @param {Event} e - The click event
     */
    function handleWorkflowAction(e) {
        e.preventDefault();
        
        const action = e.currentTarget.dataset.action;
        const documentId = e.currentTarget.dataset.documentId;
        
        switch (action) {
            case 'submit-for-review':
                submitForReview(documentId);
                break;
            case 'approve':
                approveDocument(documentId);
                break;
            case 'reject':
                rejectDocument(documentId);
                break;
            case 'request-changes':
                requestChanges(documentId);
                break;
            case 'publish':
                publishDocument(documentId);
                break;
        }
    }
    
    /**
     * Handle stage action button click
     * @param {Event} e - The click event
     */
    function handleStageAction(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = e.currentTarget.dataset.action;
        const stageId = e.currentTarget.closest('.workflow-stage').dataset.stageId;
        
        switch (action) {
            case 'complete':
                completeStage(stageId);
                break;
            case 'reopen':
                reopenStage(stageId);
                break;
            case 'skip':
                skipStage(stageId);
                break;
        }
    }
    
    /**
     * Update assignee for a workflow stage
     * @param {Event} e - The change event
     */
    function updateAssignee(e) {
        const assigneeId = e.target.value;
        const stageId = e.target.closest('.workflow-stage').dataset.stageId;
        
        // In a real application, this would make an API call to update the assignee
        console.log(`Updating assignee for stage ${stageId} to user ${assigneeId}`);
        
        // Update UI to reflect the change
        const assigneeDisplay = e.target.closest('.stage-assignee').querySelector('.assignee-display');
        if (assigneeDisplay) {
            const selectedOption = e.target.options[e.target.selectedIndex];
            assigneeDisplay.textContent = selectedOption.text;
        }
    }
    
    /**
     * Update due date for a workflow stage
     * @param {Event} e - The change event
     */
    function updateDueDate(e) {
        const dueDate = e.target.value;
        const stageId = e.target.closest('.workflow-stage').dataset.stageId;
        
        // In a real application, this would make an API call to update the due date
        console.log(`Updating due date for stage ${stageId} to ${dueDate}`);
        
        // Update UI to reflect the change
        const dueDateDisplay = e.target.closest('.stage-due-date').querySelector('.due-date-display');
        if (dueDateDisplay) {
            dueDateDisplay.textContent = formatDate(dueDate);
        }
    }
    
    /**
     * Add a comment to a workflow stage
     * @param {Event} e - The submit event
     */
    function addComment(e) {
        e.preventDefault();
        
        const form = e.target;
        const stageId = form.closest('.workflow-stage').dataset.stageId;
        const commentInput = form.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        
        if (commentText) {
            // In a real application, this would make an API call to add the comment
            console.log(`Adding comment to stage ${stageId}: ${commentText}`);
            
            // Add comment to the UI
            const commentsList = form.closest('.stage-comments').querySelector('.comments-list');
            if (commentsList) {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment-item';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">Admin User</span>
                        <span class="comment-time">Just now</span>
                    </div>
                    <div class="comment-text">${commentText}</div>
                `;
                commentsList.appendChild(commentElement);
                
                // Clear the input
                commentInput.value = '';
            }
        }
    }
    
    /**
     * Submit a document for review
     * @param {string} documentId - The document ID
     */
    function submitForReview(documentId) {
        // In a real application, this would make an API call to submit the document for review
        console.log(`Submitting document ${documentId} for review`);
        
        // Update UI to reflect the change
        updateWorkflowStatus('review');
        showNotification('Document submitted for review', 'success');
    }
    
    /**
     * Approve a document
     * @param {string} documentId - The document ID
     */
    function approveDocument(documentId) {
        // In a real application, this would make an API call to approve the document
        console.log(`Approving document ${documentId}`);
        
        // Update UI to reflect the change
        updateWorkflowStatus('approved');
        showNotification('Document approved', 'success');
    }
    
    /**
     * Reject a document
     * @param {string} documentId - The document ID
     */
    function rejectDocument(documentId) {
        // In a real application, this would make an API call to reject the document
        console.log(`Rejecting document ${documentId}`);
        
        // Update UI to reflect the change
        updateWorkflowStatus('rejected');
        showNotification('Document rejected', 'error');
    }
    
    /**
     * Request changes to a document
     * @param {string} documentId - The document ID
     */
    function requestChanges(documentId) {
        // In a real application, this would make an API call to request changes
        console.log(`Requesting changes to document ${documentId}`);
        
        // Update UI to reflect the change
        updateWorkflowStatus('changes-requested');
        showNotification('Changes requested', 'warning');
    }
    
    /**
     * Publish a document
     * @param {string} documentId - The document ID
     */
    function publishDocument(documentId) {
        // In a real application, this would make an API call to publish the document
        console.log(`Publishing document ${documentId}`);
        
        // Update UI to reflect the change
        updateWorkflowStatus('published');
        showNotification('Document published successfully', 'success');
    }
    
    /**
     * Complete a workflow stage
     * @param {string} stageId - The stage ID
     */
    function completeStage(stageId) {
        // In a real application, this would make an API call to complete the stage
        console.log(`Completing stage ${stageId}`);
        
        // Update UI to reflect the change
        const stage = document.querySelector(`.workflow-stage[data-stage-id="${stageId}"]`);
        if (stage) {
            stage.classList.add('completed');
            stage.classList.remove('active');
            
            // Activate the next stage
            const nextStage = stage.nextElementSibling;
            if (nextStage && nextStage.classList.contains('workflow-stage')) {
                nextStage.classList.add('active');
            }
        }
        
        showNotification('Stage completed', 'success');
    }
    
    /**
     * Reopen a workflow stage
     * @param {string} stageId - The stage ID
     */
    function reopenStage(stageId) {
        // In a real application, this would make an API call to reopen the stage
        console.log(`Reopening stage ${stageId}`);
        
        // Update UI to reflect the change
        const stage = document.querySelector(`.workflow-stage[data-stage-id="${stageId}"]`);
        if (stage) {
            stage.classList.remove('completed');
            stage.classList.add('active');
        }
        
        showNotification('Stage reopened', 'info');
    }
    
    /**
     * Skip a workflow stage
     * @param {string} stageId - The stage ID
     */
    function skipStage(stageId) {
        // In a real application, this would make an API call to skip the stage
        console.log(`Skipping stage ${stageId}`);
        
        // Update UI to reflect the change
        const stage = document.querySelector(`.workflow-stage[data-stage-id="${stageId}"]`);
        if (stage) {
            stage.classList.add('skipped');
            stage.classList.remove('active');
            
            // Activate the next stage
            const nextStage = stage.nextElementSibling;
            if (nextStage && nextStage.classList.contains('workflow-stage')) {
                nextStage.classList.add('active');
            }
        }
        
        showNotification('Stage skipped', 'warning');
    }
    
    /**
     * Update the workflow status in the UI
     * @param {string} status - The new status
     */
    function updateWorkflowStatus(status) {
        const statusElement = document.querySelector('.workflow-status');
        if (statusElement) {
            statusElement.className = `workflow-status ${status}`;
            
            let statusText = '';
            switch (status) {
                case 'draft':
                    statusText = 'Draft';
                    break;
                case 'review':
                    statusText = 'In Review';
                    break;
                case 'approved':
                    statusText = 'Approved';
                    break;
                case 'rejected':
                    statusText = 'Rejected';
                    break;
                case 'changes-requested':
                    statusText = 'Changes Requested';
                    break;
                case 'published':
                    statusText = 'Published';
                    break;
            }
            
            statusElement.textContent = statusText;
        }
    }
    
    /**
     * Format a date string
     * @param {string} dateString - The date string to format
     * @returns {string} The formatted date string
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    /**
     * Show notification message
     * @param {string} message - The notification message
     * @param {string} type - The notification type (success, error, info, warning)
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                               type === 'error' ? 'fa-times-circle' : 
                               type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Set up close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
});
