// Feature Tours Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create Tour Form Toggle
    const createTourBtn = document.getElementById('createTourBtn');
    const tourForm = document.getElementById('tourForm');
    const cancelTourBtn = document.getElementById('cancelTourBtn');

    if (createTourBtn && tourForm && cancelTourBtn) {
        createTourBtn.addEventListener('click', function() {
            tourForm.style.display = 'block';
        });

        cancelTourBtn.addEventListener('click', function() {
            tourForm.style.display = 'none';
        });
    }

    // Add Step Button
    const addStepBtn = document.getElementById('addStepBtn');
    const tourStepsContainer = document.getElementById('tour-steps-container');

    if (addStepBtn && tourStepsContainer) {
        addStepBtn.addEventListener('click', function() {
            const stepCount = tourStepsContainer.querySelectorAll('.tour-step').length + 1;

            const newStep = document.createElement('div');
            newStep.className = 'tour-step';
            newStep.innerHTML = `
                <div class="step-header">
                    <h4>Step ${stepCount}</h4>
                    <div class="step-actions">
                        <button type="button" class="icon-btn move-up"><i class="fas fa-arrow-up"></i></button>
                        <button type="button" class="icon-btn move-down"><i class="fas fa-arrow-down"></i></button>
                        <button type="button" class="icon-btn delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Step Title*</label>
                    <input type="text" name="stepTitle[]" placeholder="e.g., Welcome to the Dashboard" required>
                </div>

                <div class="form-group">
                    <label>Step Description*</label>
                    <textarea name="stepDescription[]" placeholder="Describe what the user should do in this step" required></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Element Selector (optional)</label>
                        <input type="text" name="stepSelector[]" placeholder="e.g., #dashboard-header">
                    </div>

                    <div class="form-group">
                        <label>Position</label>
                        <select name="stepPosition[]">
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Screenshot</label>
                    <div class="file-input-container">
                        <input type="file" name="stepImage[]" accept="image/*">
                        <button type="button" class="select-from-library-btn">
                            <i class="fas fa-photo-film"></i> Select from Library
                        </button>
                    </div>
                </div>
            `;

            tourStepsContainer.appendChild(newStep);

            // Add event listeners for the new step's buttons
            setupStepButtons(newStep);
        });

        // Setup initial step buttons
        const initialSteps = tourStepsContainer.querySelectorAll('.tour-step');
        initialSteps.forEach(step => {
            setupStepButtons(step);
        });

        function setupStepButtons(step) {
            const deleteBtn = step.querySelector('.delete');
            const moveUpBtn = step.querySelector('.move-up');
            const moveDownBtn = step.querySelector('.move-down');

            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    step.remove();
                    updateStepNumbers();
                });
            }

            if (moveUpBtn) {
                moveUpBtn.addEventListener('click', function() {
                    const prevStep = step.previousElementSibling;
                    if (prevStep) {
                        tourStepsContainer.insertBefore(step, prevStep);
                        updateStepNumbers();
                    }
                });
            }

            if (moveDownBtn) {
                moveDownBtn.addEventListener('click', function() {
                    const nextStep = step.nextElementSibling;
                    if (nextStep) {
                        tourStepsContainer.insertBefore(nextStep, step);
                        updateStepNumbers();
                    }
                });
            }
        }

        function updateStepNumbers() {
            const steps = tourStepsContainer.querySelectorAll('.tour-step');
            steps.forEach((step, index) => {
                const stepHeader = step.querySelector('.step-header h4');
                if (stepHeader) {
                    stepHeader.textContent = `Step ${index + 1}`;
                }
            });
        }
    }

    // Downtime Notice Form Toggle
    const createDowntimeBtn = document.getElementById('createDowntimeBtn');
    const downtimeForm = document.getElementById('downtimeForm');
    const cancelDowntimeBtn = document.getElementById('cancelDowntimeBtn');

    if (createDowntimeBtn && downtimeForm && cancelDowntimeBtn) {
        createDowntimeBtn.addEventListener('click', function() {
            downtimeForm.style.display = 'block';
        });

        cancelDowntimeBtn.addEventListener('click', function() {
            downtimeForm.style.display = 'none';
        });
    }

    // Validation Details Toggle
    const validationViewBtns = document.querySelectorAll('#validation .action-buttons .fa-eye');
    const validationDetails = document.getElementById('validationDetails');
    const backToListBtn = document.querySelector('#validationDetails .fa-arrow-left').parentElement;

    if (validationViewBtns.length > 0 && validationDetails && backToListBtn) {
        validationViewBtns.forEach(btn => {
            btn.parentElement.addEventListener('click', function() {
                validationDetails.style.display = 'block';
            });
        });

        backToListBtn.addEventListener('click', function() {
            validationDetails.style.display = 'none';
        });
    }


});
