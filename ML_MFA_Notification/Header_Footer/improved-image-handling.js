// Make images interactive (selectable and resizable)
function makeImagesInteractive() {
    // First, clean up any orphaned resize handles
    document.querySelectorAll('.resize-handle').forEach(handle => {
        // Check if this handle is associated with an image that still exists
        const imgId = handle.getAttribute('data-for-image');
        if (!imgId || !document.getElementById(imgId)) {
            handle.remove();
        }
    });

    document.querySelectorAll('.resize-handles-container').forEach(container => {
        // Check if this container is associated with an image that still exists
        const imgId = container.getAttribute('data-for-image');
        if (!imgId || !document.getElementById(imgId)) {
            container.remove();
        }
    });

    const images = document.querySelectorAll('.editable img');

    images.forEach(img => {
        if (!img.hasAttribute('data-interactive')) {
            // Assign a unique ID to the image if it doesn't have one
            if (!img.id) {
                img.id = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            }
            
            img.setAttribute('data-interactive', 'true');

            // Make the image position relative for resize handles
            img.style.position = 'relative';
            img.style.boxSizing = 'border-box';

            // Create a container for the handles specific to this image
            const handleContainer = document.createElement('div');
            handleContainer.className = 'resize-handles-container';
            handleContainer.style.position = 'absolute';
            handleContainer.style.top = '0';
            handleContainer.style.left = '0';
            handleContainer.style.width = '100%';
            handleContainer.style.height = '100%';
            handleContainer.style.pointerEvents = 'none';
            handleContainer.setAttribute('data-for-image', img.id);
            img.parentNode.appendChild(handleContainer);

            // Create resize handles
            const handles = {
                nw: document.createElement('div'),
                ne: document.createElement('div'),
                sw: document.createElement('div'),
                se: document.createElement('div')
            };

            // Set up each handle
            Object.keys(handles).forEach(pos => {
                const handle = handles[pos];
                handle.className = `resize-handle ${pos}`;
                handle.setAttribute('data-for-image', img.id);
                handle.style.display = 'none';
                handle.style.pointerEvents = 'auto';
                handleContainer.appendChild(handle);

                // Add resize functionality to handle
                handle.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Mark image as resizing
                    img.classList.add('resizing');

                    // Get initial positions
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startWidth = img.offsetWidth;
                    const startHeight = img.offsetHeight;

                    // Function to handle resize
                    function handleResize(e) {
                        let newWidth, newHeight;

                        // Calculate new dimensions based on handle position
                        switch(pos) {
                            case 'se':
                                newWidth = startWidth + (e.clientX - startX);
                                newHeight = startHeight + (e.clientY - startY);
                                break;
                            case 'sw':
                                newWidth = startWidth - (e.clientX - startX);
                                newHeight = startHeight + (e.clientY - startY);
                                break;
                            case 'ne':
                                newWidth = startWidth + (e.clientX - startX);
                                newHeight = startHeight - (e.clientY - startY);
                                break;
                            case 'nw':
                                newWidth = startWidth - (e.clientX - startX);
                                newHeight = startHeight - (e.clientY - startY);
                                break;
                        }

                        // Apply new dimensions with minimum size
                        if (newWidth >= 30) {
                            img.style.width = `${newWidth}px`;
                        }

                        if (newHeight >= 30) {
                            img.style.height = `${newHeight}px`;
                        }

                        // Update handle positions
                        updateHandlePositions();
                    }

                    // Function to stop resizing
                    function stopResize() {
                        document.removeEventListener('mousemove', handleResize);
                        document.removeEventListener('mouseup', stopResize);
                        img.classList.remove('resizing');
                    }

                    // Add event listeners for resize
                    document.addEventListener('mousemove', handleResize);
                    document.addEventListener('mouseup', stopResize);
                });
            });

            // Function to update all handle positions
            function updateHandlePositions() {
                // Get the image's position and dimensions
                const imgRect = img.getBoundingClientRect();
                const parentRect = img.parentNode.getBoundingClientRect();

                // Calculate position relative to parent
                const top = imgRect.top - parentRect.top;
                const left = imgRect.left - parentRect.left;
                const width = imgRect.width;
                const height = imgRect.height;

                // Update container size and position to match image exactly
                handleContainer.style.width = width + 'px';
                handleContainer.style.height = height + 'px';
                handleContainer.style.top = top + 'px';
                handleContainer.style.left = left + 'px';

                // Position the handles at the exact corners
                handles.nw.style.top = '0px';
                handles.nw.style.left = '0px';
                
                handles.ne.style.top = '0px';
                handles.ne.style.left = '100%';
                
                handles.sw.style.top = '100%';
                handles.sw.style.left = '0px';
                
                handles.se.style.top = '100%';
                handles.se.style.left = '100%';
            }

            // Show/hide handles when selecting/deselecting image
            img.addEventListener('click', function(e) {
                // Deselect all images and hide all handles
                document.querySelectorAll('.editable img').forEach(i => {
                    i.classList.remove('selected');
                });
                
                document.querySelectorAll('.resize-handle').forEach(handle => {
                    handle.style.display = 'none';
                });

                // Select this image
                this.classList.add('selected');

                // Show handles for this image only
                document.querySelectorAll(`.resize-handle[data-for-image="${img.id}"]`).forEach(handle => {
                    handle.style.display = 'block';
                });

                // Update handle positions
                updateHandlePositions();

                e.stopPropagation();
            });

            // Make image draggable
            img.addEventListener('mousedown', function(e) {
                if (img.classList.contains('selected') && e.target === img) {
                    e.preventDefault();

                    // Get initial positions
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startLeft = img.offsetLeft;
                    const startTop = img.offsetTop;

                    // Function to handle drag
                    function handleDrag(e) {
                        const newLeft = startLeft + (e.clientX - startX);
                        const newTop = startTop + (e.clientY - startY);

                        img.style.position = 'relative';
                        img.style.left = `${newLeft}px`;
                        img.style.top = `${newTop}px`;

                        // Update handle positions
                        updateHandlePositions();
                    }

                    // Function to stop dragging
                    function stopDrag() {
                        document.removeEventListener('mousemove', handleDrag);
                        document.removeEventListener('mouseup', stopDrag);
                    }

                    // Add event listeners for drag
                    document.addEventListener('mousemove', handleDrag);
                    document.addEventListener('mouseup', stopDrag);
                }
            });
        }
    });

    // Deselect when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.editable img') && !e.target.closest('.resize-handle')) {
            document.querySelectorAll('.editable img').forEach(img => {
                img.classList.remove('selected');
            });
            
            document.querySelectorAll('.resize-handle').forEach(handle => {
                handle.style.display = 'none';
            });
        }
    });
}
