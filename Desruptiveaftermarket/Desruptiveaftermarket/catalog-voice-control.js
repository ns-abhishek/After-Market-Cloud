/**
 * Catalog Voice Control
 * 
 * This file provides voice control functionality for the digital catalog,
 * allowing users to search and navigate using voice commands.
 */

// Global variables
let recognition;
let isListening = false;
let commandFeedback;
let voiceSearchBtn;
let catalogSearch;

// Initialize voice control
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Voice Control...');
    
    // Get DOM elements
    voiceSearchBtn = document.getElementById('voiceSearchBtn');
    catalogSearch = document.getElementById('catalogSearch');
    
    // Create command feedback element if it doesn't exist
    if (!document.getElementById('commandFeedback')) {
        commandFeedback = document.createElement('div');
        commandFeedback.id = 'commandFeedback';
        commandFeedback.className = 'command-feedback';
        document.body.appendChild(commandFeedback);
    } else {
        commandFeedback = document.getElementById('commandFeedback');
    }
    
    // Initialize speech recognition if available
    initSpeechRecognition();
});

// Initialize speech recognition
function initSpeechRecognition() {
    // Check if SpeechRecognition is available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Configure recognition
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // Set up event listeners
        setupRecognitionEvents();
        
        // Add click event to voice search button
        if (voiceSearchBtn) {
            voiceSearchBtn.addEventListener('click', toggleVoiceSearch);
        }
        
        console.log('Speech recognition initialized');
    } else {
        console.warn('Speech recognition not supported');
        
        // Hide voice search button if speech recognition is not supported
        if (voiceSearchBtn) {
            voiceSearchBtn.style.display = 'none';
        }
    }
}

// Set up recognition events
function setupRecognitionEvents() {
    // Start event
    recognition.onstart = function() {
        isListening = true;
        updateVoiceButtonState();
        showCommandFeedback('Listening...', 'listening');
    };
    
    // End event
    recognition.onend = function() {
        isListening = false;
        updateVoiceButtonState();
        hideCommandFeedback();
    };
    
    // Error event
    recognition.onerror = function(event) {
        isListening = false;
        updateVoiceButtonState();
        
        if (event.error === 'no-speech') {
            showCommandFeedback('No speech detected. Try again.', 'error');
        } else if (event.error === 'audio-capture') {
            showCommandFeedback('No microphone detected.', 'error');
        } else if (event.error === 'not-allowed') {
            showCommandFeedback('Microphone access denied.', 'error');
        } else {
            showCommandFeedback('Error: ' + event.error, 'error');
        }
        
        setTimeout(hideCommandFeedback, 3000);
    };
    
    // Result event
    recognition.onresult = function(event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        // Show interim results
        if (event.results[0].isFinal) {
            processVoiceCommand(transcript.toLowerCase());
        } else {
            showCommandFeedback(transcript, 'interim');
        }
    };
}

// Toggle voice search
function toggleVoiceSearch() {
    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            showCommandFeedback('Error starting speech recognition.', 'error');
            setTimeout(hideCommandFeedback, 3000);
        }
    }
}

// Update voice button state
function updateVoiceButtonState() {
    if (voiceSearchBtn) {
        if (isListening) {
            voiceSearchBtn.classList.add('listening');
            voiceSearchBtn.querySelector('i').textContent = 'mic';
        } else {
            voiceSearchBtn.classList.remove('listening');
            voiceSearchBtn.querySelector('i').textContent = 'mic_none';
        }
    }
}

// Process voice command
function processVoiceCommand(command) {
    console.log('Processing voice command:', command);
    
    // Show the command
    showCommandFeedback(`"${command}"`, 'command');
    
    // Check for specific commands
    if (command.includes('search for') || command.includes('find')) {
        // Extract search term
        let searchTerm;
        if (command.includes('search for')) {
            searchTerm = command.split('search for')[1].trim();
        } else if (command.includes('find')) {
            searchTerm = command.split('find')[1].trim();
        }
        
        if (searchTerm) {
            // Set search input value
            if (catalogSearch) {
                catalogSearch.value = searchTerm;
                catalogSearch.dispatchEvent(new Event('input'));
            }
            
            showCommandFeedback(`Searching for "${searchTerm}"`, 'success');
        } else {
            showCommandFeedback('Please specify what to search for.', 'error');
        }
    } else if (command.includes('filter by') || command.includes('show')) {
        // Handle filter commands
        handleFilterCommand(command);
    } else if (command.includes('sort by')) {
        // Handle sort commands
        handleSortCommand(command);
    } else if (command.includes('view as') || command.includes('switch to')) {
        // Handle view commands
        handleViewCommand(command);
    } else if (command.includes('clear') || command.includes('reset')) {
        // Handle clear commands
        if (command.includes('filters') || command.includes('all')) {
            // Clear all filters
            if (typeof clearAllFilters === 'function') {
                clearAllFilters();
                showCommandFeedback('Filters cleared', 'success');
            }
        } else if (command.includes('search')) {
            // Clear search
            if (catalogSearch) {
                catalogSearch.value = '';
                catalogSearch.dispatchEvent(new Event('input'));
                showCommandFeedback('Search cleared', 'success');
            }
        }
    } else {
        // Treat as search term
        if (catalogSearch) {
            catalogSearch.value = command;
            catalogSearch.dispatchEvent(new Event('input'));
        }
        
        showCommandFeedback(`Searching for "${command}"`, 'success');
    }
    
    // Hide feedback after delay
    setTimeout(hideCommandFeedback, 3000);
}

// Handle filter commands
function handleFilterCommand(command) {
    // Category filters
    if (command.includes('category') || command.includes('categories')) {
        const categories = ['filters', 'brakes', 'ignition', 'electrical', 'engine', 'fluids'];
        
        for (const category of categories) {
            if (command.includes(category)) {
                // Find category element and click it
                const categoryElement = document.querySelector(`[data-category="${category}"]`);
                if (categoryElement) {
                    categoryElement.click();
                    showCommandFeedback(`Filtered by category: ${category}`, 'success');
                    return;
                }
            }
        }
    }
    
    // Manufacturer filters
    if (command.includes('manufacturer') || command.includes('brand')) {
        const manufacturers = ['filtercorp', 'brakemasters', 'sparktech', 'electroparts', 'lubetech'];
        
        for (const manufacturer of manufacturers) {
            if (command.includes(manufacturer)) {
                // Find manufacturer element and click it
                const manufacturerElement = document.querySelector(`[data-manufacturer="${manufacturer}"]`);
                if (manufacturerElement) {
                    manufacturerElement.click();
                    showCommandFeedback(`Filtered by manufacturer: ${manufacturer}`, 'success');
                    return;
                }
            }
        }
    }
    
    // Quick filters
    if (command.includes('bestseller') || command.includes('best seller') || command.includes('best sellers')) {
        const filterElement = document.querySelector('[data-filter="bestseller"]');
        if (filterElement) {
            filterElement.click();
            showCommandFeedback('Showing best sellers', 'success');
            return;
        }
    } else if (command.includes('featured')) {
        const filterElement = document.querySelector('[data-filter="featured"]');
        if (filterElement) {
            filterElement.click();
            showCommandFeedback('Showing featured products', 'success');
            return;
        }
    } else if (command.includes('new') || command.includes('newest')) {
        const filterElement = document.querySelector('[data-filter="new"]');
        if (filterElement) {
            filterElement.click();
            showCommandFeedback('Showing new arrivals', 'success');
            return;
        }
    } else if (command.includes('sale') || command.includes('discount')) {
        const filterElement = document.querySelector('[data-filter="sale"]');
        if (filterElement) {
            filterElement.click();
            showCommandFeedback('Showing products on sale', 'success');
            return;
        }
    } else if (command.includes('all products')) {
        const filterElement = document.querySelector('[data-filter="all"]');
        if (filterElement) {
            filterElement.click();
            showCommandFeedback('Showing all products', 'success');
            return;
        }
    }
    
    showCommandFeedback('Filter not recognized', 'error');
}

// Handle sort commands
function handleSortCommand(command) {
    if (command.includes('name') || command.includes('alphabetical')) {
        const sortElement = document.querySelector('[data-sort="name"]');
        if (sortElement) {
            sortElement.click();
            showCommandFeedback('Sorted by name', 'success');
            return;
        }
    } else if (command.includes('price low') || command.includes('lowest price')) {
        const sortElement = document.querySelector('[data-sort="price-low"]');
        if (sortElement) {
            sortElement.click();
            showCommandFeedback('Sorted by price: low to high', 'success');
            return;
        }
    } else if (command.includes('price high') || command.includes('highest price')) {
        const sortElement = document.querySelector('[data-sort="price-high"]');
        if (sortElement) {
            sortElement.click();
            showCommandFeedback('Sorted by price: high to low', 'success');
            return;
        }
    } else if (command.includes('newest') || command.includes('latest')) {
        const sortElement = document.querySelector('[data-sort="newest"]');
        if (sortElement) {
            sortElement.click();
            showCommandFeedback('Sorted by newest first', 'success');
            return;
        }
    } else if (command.includes('rating') || command.includes('best rated')) {
        const sortElement = document.querySelector('[data-sort="rating"]');
        if (sortElement) {
            sortElement.click();
            showCommandFeedback('Sorted by highest rating', 'success');
            return;
        }
    }
    
    showCommandFeedback('Sort option not recognized', 'error');
}

// Handle view commands
function handleViewCommand(command) {
    if (command.includes('grid') || command.includes('tiles')) {
        const viewButton = document.getElementById('gridViewButton');
        if (viewButton) {
            viewButton.click();
            showCommandFeedback('Switched to grid view', 'success');
            return;
        }
    } else if (command.includes('list')) {
        const viewButton = document.getElementById('listViewButton');
        if (viewButton) {
            viewButton.click();
            showCommandFeedback('Switched to list view', 'success');
            return;
        }
    }
    
    showCommandFeedback('View option not recognized', 'error');
}

// Show command feedback
function showCommandFeedback(message, type) {
    commandFeedback.textContent = message;
    commandFeedback.className = 'command-feedback';
    commandFeedback.classList.add(type);
    commandFeedback.classList.add('show');
}

// Hide command feedback
function hideCommandFeedback() {
    commandFeedback.classList.remove('show');
}

// Export functions
window.initVoiceSearch = toggleVoiceSearch;
