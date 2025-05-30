/**
 * Load Three.js Library
 * 
 * This file dynamically loads the Three.js library and its dependencies
 * for 3D visualization in the digital catalog.
 */

// Function to load script
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Load Three.js and dependencies
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading Three.js and dependencies...');
    
    // Load Three.js core
    loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js', function() {
        console.log('Three.js loaded');
        
        // Load OrbitControls
        loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js', function() {
            console.log('OrbitControls loaded');
            
            // Load GLTFLoader
            loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js', function() {
                console.log('GLTFLoader loaded');
                
                // Load DRACOLoader
                loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/DRACOLoader.js', function() {
                    console.log('DRACOLoader loaded');
                    
                    // Dispatch event when all libraries are loaded
                    const event = new Event('threejs-loaded');
                    document.dispatchEvent(event);
                });
            });
        });
    });
});
