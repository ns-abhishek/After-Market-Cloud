// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the main page with navigation
    const mainContent = document.getElementById('mainContent');

    if (mainContent) {
        // We're on the main page, integrate Party grid
        integratePartyGrid();
    } else {
        // We might be on the standalone Party grid page
        console.log('Standalone Party grid page detected');
    }

    // Function to integrate Party grid with main navigation
    function integratePartyGrid() {
        // Add Party to menu items
        const menuItems = window.menuItems || [];
        if (menuItems.length > 0) {
            menuItems.push({
                text: 'Party',
                section: 'party',
                icon: 'fas fa-users-cog'
            });
        }

        // Create a div container for Party grid
        const partyGrid = document.createElement('div');
        partyGrid.id = 'partyGrid';
        partyGrid.className = 'grid-container';
        partyGrid.style.display = 'none';

        // Create grid header
        const gridHeader = document.createElement('div');
        gridHeader.className = 'grid-header';
        gridHeader.innerHTML = `
            <div class="grid-title">Party List</div>
            <div class="grid-actions">
                <button class="refresh-btn" id="refreshPartyGrid">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
                <button class="clear-filters-btn" id="clearPartyFiltersBtn">
                    <i class="fas fa-eraser"></i> Clear Filters
                </button>
                <button class="grid-action-button" id="partyAdvancedSearch" title="Advanced Search">
                    <i class="fas fa-filter"></i>
                </button>
            </div>
        `;

        // Create a button to open the standalone Party grid
        const openStandaloneBtn = document.createElement('button');
        openStandaloneBtn.className = 'refresh-btn';
        openStandaloneBtn.style.marginLeft = '10px';
        openStandaloneBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Open Full Party Grid';
        openStandaloneBtn.addEventListener('click', function() {
            window.open('party-grid-material.html', '_blank');
        });

        gridHeader.querySelector('.grid-actions').appendChild(openStandaloneBtn);

        // Create grid content
        const gridContent = document.createElement('div');
        gridContent.className = 'grid-content';
        gridContent.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>Party Grid Integration</h3>
                <p>The Party grid is available as a standalone page for better performance and user experience.</p>
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="openPartyGridBtn">
                    <i class="fas fa-external-link-alt"></i> Open Party Grid
                </button>
            </div>
        `;

        // Add event listener to the button
        gridContent.querySelector('#openPartyGridBtn').addEventListener('click', function() {
            window.open('party-grid-material.html', '_blank');
        });

        // Append header and content to grid
        partyGrid.appendChild(gridHeader);
        partyGrid.appendChild(gridContent);

        // Append to main content
        mainContent.appendChild(partyGrid);

        // Add to grid containers
        const gridContainers = window.gridContainers || {};
        if (Object.keys(gridContainers).length > 0) {
            gridContainers['party'] = partyGrid;
        }

        // Add Party to navigation menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const partyMenuItem = document.createElement('li');
            const partyLink = document.createElement('a');
            partyLink.href = '#';
            partyLink.setAttribute('data-section', 'party');
            partyLink.innerHTML = '<i class="fas fa-users-cog"></i> Party';

            partyMenuItem.appendChild(partyLink);
            navMenu.appendChild(partyMenuItem);

            // Add click event listener
            partyLink.addEventListener('click', function(e) {
                e.preventDefault();
                showPartyGrid();

                // Close menu suggestions if open
                const menuSuggestions = document.getElementById('menuSuggestions');
                if (menuSuggestions) {
                    menuSuggestions.classList.remove('show');
                }
            });
        }

        // Function to show Party grid
        function showPartyGrid() {
            // Hide all grids first
            Object.values(gridContainers).forEach(grid => {
                if (grid) grid.style.display = 'none';
            });

            // Show Party grid
            partyGrid.style.display = 'block';
            window.currentActiveSection = 'party';

            // Update the advanced search button text
            const advancedSearchBtn = document.getElementById('toggleAdvancedSearch');
            if (advancedSearchBtn) {
                advancedSearchBtn.innerHTML = '<i class="fas fa-filter"></i> Party Advanced Search';
            }

            // Dispatch grid change event
            const event = new CustomEvent('grid-change', {
                detail: { section: 'party' }
            });
            document.dispatchEvent(event);

            // Update active menu item
            const navLinks = document.querySelectorAll('.nav-menu li a');
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                if (link.getAttribute('data-section') === 'party') {
                    link.parentElement.classList.add('active');
                }
            });
        }
    }
});

// Alternative approach: Create a standalone link to the Party grid
function createPartyLink() {
    // Check if we're on the index page
    const mainContent = document.getElementById('mainContent');

    if (mainContent) {
        // Create a button to open the Party grid
        const partyButton = document.createElement('button');
        partyButton.className = 'party-button';
        partyButton.innerHTML = '<i class="fas fa-users-cog"></i> Open Party Grid';
        partyButton.style.position = 'fixed';
        partyButton.style.bottom = '20px';
        partyButton.style.right = '20px';
        partyButton.style.padding = '10px 20px';
        partyButton.style.backgroundColor = '#212529';
        partyButton.style.color = 'white';
        partyButton.style.border = 'none';
        partyButton.style.borderRadius = '4px';
        partyButton.style.cursor = 'pointer';
        partyButton.style.zIndex = '1000';

        // Add click event
        partyButton.addEventListener('click', function() {
            window.open('party-grid-material.html', '_blank');
        });

        // Append to body
        document.body.appendChild(partyButton);
    }
}

// Execute the alternative approach if needed
// Uncomment the line below if the main integration doesn't work
// document.addEventListener('DOMContentLoaded', createPartyLink);
