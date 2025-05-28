// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const categoryList = document.getElementById('category-list');
const itemsContainer = document.getElementById('items-container');
const breadcrumb = document.getElementById('breadcrumb');
const sortOptions = document.getElementById('sort-options');
const modal = document.getElementById('item-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close-modal');

// State Management
let currentCategory = null;
let currentView = 'grid';
let currentSort = 'name-asc';
let searchQuery = '';
let breadcrumbPath = [{ id: null, name: 'Home' }];
let currentSubcategory = null;

// Initialize the catalog
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderItems();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // View toggle
    gridViewBtn.addEventListener('click', () => setView('grid'));
    listViewBtn.addEventListener('click', () => setView('list'));

    // Sort options
    sortOptions.addEventListener('change', handleSort);

    // Modal close
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Render Categories in Sidebar
function renderCategories() {
    categoryList.innerHTML = '';
    
    catalogData.categories.forEach(category => {
        const li = document.createElement('li');

        // Create the category folder element
        const categoryFolder = document.createElement('div');
        categoryFolder.className = 'category-folder';
        categoryFolder.innerHTML = `
                <span><i class="fas fa-folder folder-icon"></i>${category.name}</span>
            <i class="fas fa-chevron-right expand-icon"></i>
        `;
        
        // Create subcategory items
        const subcategoryList = document.createElement('ul');
        subcategoryList.className = 'subcategory-items';

        // Add subcategory items if they exist
        if (category.items && category.items.length > 0) {
            category.items.forEach(item => {
                const subItem = document.createElement('li');
                subItem.className = 'subcategory-item';
                subItem.textContent = item.name;

                // Add click event for the subcategory
                subItem.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering the category click
                    selectSubcategory(category, item);
        });
        
                subcategoryList.appendChild(subItem);
    });
}

        // Add click event for the category folder to toggle submenu
        categoryFolder.addEventListener('click', () => {
            const isExpanded = subcategoryList.classList.contains('active');
            const expandIcon = categoryFolder.querySelector('.expand-icon');

            // Toggle the submenu
            if (isExpanded) {
                subcategoryList.classList.remove('active');
                expandIcon.classList.remove('fa-chevron-down');
                expandIcon.classList.add('fa-chevron-right');
        } else {
                subcategoryList.classList.add('active');
                expandIcon.classList.remove('fa-chevron-right');
                expandIcon.classList.add('fa-chevron-down');
        }

            selectCategory(category);
    });
    
        li.appendChild(categoryFolder);
        li.appendChild(subcategoryList);
        categoryList.appendChild(li);
    });
}

// Select Category
function selectCategory(category) {
    currentCategory = category.id;
    currentSubcategory = null;
    breadcrumbPath = [{ id: null, name: 'Home' }, { id: category.id, name: category.name }];
            updateBreadcrumb();
            renderItems();

    // Update active category in sidebar
    document.querySelectorAll('.category-folder').forEach(folder => {
        if (folder.querySelector('span').textContent.includes(category.name)) {
            folder.classList.add('active');
        } else {
            folder.classList.remove('active');
}
    });

    // Show interactive diagram link for the selected category
    addInteractiveDiagramLink(category);
}

// Add Interactive Diagram Link for the current category
function addInteractiveDiagramLink(category) {
    let buttonText = "View Interactive Diagram";
    let buttonLink = "#"; // Default link
    let buttonIcon = "fa-project-diagram";

    // Set specific text and links based on category
    switch(category.id) {
        case "engine":
            buttonText = "View Interactive Engine Diagram";
            buttonLink = "engine-diagram.html";
            buttonIcon = "fa-cogs";
            break;
        case "doors":
            buttonText = "View Interactive Doors Diagram";
            buttonLink = "engine-diagram.html?category=doors";
            buttonIcon = "fa-door-open";
            break;
        case "interior":
            buttonText = "View Interactive Interior Diagram";
            buttonLink = "engine-diagram.html?category=interior";
            buttonIcon = "fa-couch";
            break;
        case "software":
        case "software-updates":
            buttonText = "View Software Updates Diagram";
            buttonLink = "engine-diagram.html?category=software";
            buttonIcon = "fa-download";
            break;
        case "gearbox":
            buttonText = "View Interactive Gearbox Diagram";
            buttonLink = "engine-diagram.html?category=gearbox";
            buttonIcon = "fa-cog";
            break;
        case "oidl":
            buttonText = "View Interactive OIDL Diagram";
            buttonLink = "engine-diagram.html?category=oidl";
            buttonIcon = "fa-file-alt";
            break;
    }
        // Remove existing link if it exists
        const existingLink = document.querySelector('.engine-diagram-link');
        if (existingLink) {
            existingLink.remove();
        }

    // Create new diagram link
    const diagramLink = document.createElement('div');
    diagramLink.className = 'engine-diagram-link';
    diagramLink.innerHTML = `
        <a href="${buttonLink}" class="engine-diagram-button">
            <i class="fas ${buttonIcon}"></i> ${buttonText}
        </a>
    `;

    itemsContainer.insertAdjacentElement('beforebegin', diagramLink);
}

// Select Subcategory
function selectSubcategory(category, subcategory) {
    currentCategory = category.id;
    currentSubcategory = subcategory.id;
    breadcrumbPath = [
        { id: null, name: 'Home' },
        { id: category.id, name: category.name },
        { id: subcategory.id, name: subcategory.name }
    ];
    updateBreadcrumb();

    // Show only the selected subcategory item
    renderItems(true);

    // Update active subcategory in sidebar
    document.querySelectorAll('.subcategory-item').forEach(item => {
        if (item.textContent === subcategory.name) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
}
    });
}

// Update Breadcrumb
function updateBreadcrumb() {
    breadcrumb.innerHTML = '';

    breadcrumbPath.forEach((item, index) => {
        const span = document.createElement('span');
        span.textContent = item.name;
        span.addEventListener('click', () => {
            if (index === 0) {
                // Home
                currentCategory = null;
                currentSubcategory = null;
                breadcrumbPath = [{ id: null, name: 'Home' }];
            } else if (index === 1) {
                // Category
                breadcrumbPath = breadcrumbPath.slice(0, index + 1);
                currentCategory = item.id;
                currentSubcategory = null;
            } else {
                // Subcategory
                breadcrumbPath = breadcrumbPath.slice(0, index + 1);
                currentSubcategory = item.id;
            }
            updateBreadcrumb();
            renderItems();
        });

        breadcrumb.appendChild(span);
    });
}

// Set View (Grid or List)
function setView(view) {
    currentView = view;

    if (view === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        itemsContainer.className = 'grid-view';
    } else {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        itemsContainer.className = 'list-view';
    }

    renderItems();
}

// Handle Sort
function handleSort() {
    currentSort = sortOptions.value;
    renderItems();
}

// Handle Search
function handleSearch() {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderItems();
}

// Get Items Based on Current Category, Subcategory, and Search
function getFilteredItems() {
    let items = [];

    if (currentCategory) {
        const category = catalogData.categories.find(cat => cat.id === currentCategory);
        if (category && category.items) {
            if (currentSubcategory) {
                // Show only the specific subcategory item
                const subcategory = category.items.find(item => item.id === currentSubcategory);
                if (subcategory) {
                    items = [subcategory];
                }
            } else {
                // Show all items in the category
                items = category.items;
            }
        }
    } else {
        // Show all items when on home
        catalogData.categories.forEach(category => {
        if (category.items) {
                items = [...items, ...category.items];
        }
        });
    }

    // Apply search filter if there's a query
    if (searchQuery) {
        items = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery) ||
            (item.description && item.description.toLowerCase().includes(searchQuery))
        );
}

    // Apply sorting
    items = sortItems(items, currentSort);

    return items;
}

// Sort Items
function sortItems(items, sortOption) {
    return [...items].sort((a, b) => {
        switch (sortOption) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'id-asc':
                return a.id.localeCompare(b.id);
            case 'id-desc':
                return b.id.localeCompare(a.id);
            default:
                return 0;
        }
    });
}

// Render Items
function renderItems(singleItem = false) {
    const items = getFilteredItems();
    itemsContainer.innerHTML = '';

    if (items.length === 0) {
        itemsContainer.innerHTML = '<div class="no-items">No items found</div>';
        return;
    }

    items.forEach(item => {
        if (currentView === 'grid') {
            renderGridItem(item);
        } else {
            renderListItem(item);
        }
    });

    // If we're showing a single item, automatically show its details
    if (singleItem && items.length === 1) {
        showItemDetail(items[0]);
    }
}

// Render Grid Item
function renderGridItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'grid-item';

    let iconClass = 'fa-file-alt';
    if (item.type === 'folder') {
        iconClass = 'fa-folder';
    } else if (item.type === 'part') {
        iconClass = 'fa-cogs';
    } else if (item.type === 'software') {
        iconClass = 'fa-download';
    } else if (item.icon) {
        iconClass = item.icon;
}

    itemElement.innerHTML = `
        <div class="item-image">
            <i class="fas ${iconClass} fa-3x"></i>
        </div>
        <div class="item-info">
            <div class="item-title">${item.name}</div>
            <div class="item-id">${item.id}</div>
        </div>
    `;

    itemElement.addEventListener('click', () => {
        showItemDetail(item);
    });

    itemsContainer.appendChild(itemElement);
}

// Render List Item
function renderListItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'list-item';

    let iconClass = 'fa-file-alt';
    if (item.type === 'folder') {
        iconClass = 'fa-folder';
    } else if (item.type === 'part') {
        iconClass = 'fa-cogs';
    } else if (item.type === 'software') {
        iconClass = 'fa-download';
    } else if (item.icon) {
        iconClass = item.icon;
    }

    itemElement.innerHTML = `
        <div class="item-image">
            <i class="fas ${iconClass} fa-3x"></i>
        </div>
        <div class="item-info">
            <div class="item-title">${item.name}</div>
            <div class="item-id">${item.id}</div>
            ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
        </div>
    `;

    itemElement.addEventListener('click', () => {
        showItemDetail(item);
    });

    itemsContainer.appendChild(itemElement);
}

// Show Item Detail in Modal
function showItemDetail(item) {
    let iconClass = 'fa-file-alt';
    if (item.type === 'folder') {
        iconClass = 'fa-folder';
    } else if (item.type === 'part') {
        iconClass = 'fa-cogs';
    } else if (item.type === 'software') {
        iconClass = 'fa-download';
    } else if (item.icon) {
        iconClass = item.icon;
    }

    let specsHTML = '';
    if (item.specs) {
        specsHTML = `
            <div class="item-detail-specs">
                <h3>Specifications</h3>
                <table class="specs-table">
                    ${Object.entries(item.specs).map(([key, value]) => `
                        <tr>
                            <td>${key}</td>
                            <td>${value}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }

    modalContent.innerHTML = `
        <div class="item-detail">
            <div class="item-detail-image">
                <i class="fas ${iconClass} fa-5x"></i>
            </div>
            <div class="item-detail-info">
                <h2 class="item-detail-title">${item.name}</h2>
                <div class="item-detail-id">ID: ${item.id}</div>
                <div class="item-detail-type">Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                ${item.description ? `<div class="item-detail-description">${item.description}</div>` : ''}
                ${specsHTML}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Handle Engine Parts Spots (for interactive engine diagrams)
function setupEnginePartSpots() {
    // This would be implemented if we had an actual engine diagram
    // For now, we'll just have a placeholder function

    // Example implementation:
    // const engineSpots = document.querySelectorAll('.engine-spot');
    // engineSpots.forEach(spot => {
    //     spot.addEventListener('click', () => {
    //         const partId = spot.dataset.partId;
    //         const part = findPartById(partId);
    //         if (part) {
    //             showItemDetail(part);
    //         }
    //     });
    // });
}

// Helper function to find a part by ID across all categories
function findItemById(itemId) {
    for (const category of catalogData.categories) {
        if (category.items) {
            const item = category.items.find(item => item.id === itemId);
            if (item) return item;
        }
    }
    return null;
}

// Add custom image for parts if available
function getItemImage(item) {
    // In a real application, you would check if the item has an image
    // For now, we'll just use icons
    return null;
}
