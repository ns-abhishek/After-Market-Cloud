// Mock data for segments
const segmentData = {
    agriculture: [
        { id: 1, name: 'Cultivating', isActive: true },
        { id: 2, name: 'Harvesting', isActive: true },
        { id: 3, name: 'Livestock Management', isActive: false },
        { id: 4, name: 'Irrigation Systems', isActive: true }
    ],
    automobile: [
        { id: 1, name: 'Mass Transit', isActive: true },
        { id: 2, name: 'Off Highway', isActive: true },
        { id: 3, name: 'Passenger Vehicles', isActive: false },
        { id: 4, name: 'Commercial Vehicles', isActive: true }
    ],
    construction: [
        { id: 1, name: 'Road Construction', isActive: true },
        { id: 2, name: 'Building Construction', isActive: true },
        { id: 3, name: 'Bridge Construction', isActive: false },
        { id: 4, name: 'Infrastructure Development', isActive: true }
    ],
    fleet: [
        { id: 1, name: 'Logistics Fleet', isActive: true },
        { id: 2, name: 'Delivery Services', isActive: true },
        { id: 3, name: 'Emergency Services', isActive: false },
        { id: 4, name: 'Public Transportation', isActive: true }
    ],
    government: [
        { id: 1, name: 'Municipal Services', isActive: true },
        { id: 2, name: 'Defense Operations', isActive: true },
        { id: 3, name: 'Emergency Response', isActive: false },
        { id: 4, name: 'Public Works', isActive: true }
    ],
    mining: [
        { id: 1, name: 'Underground Mining', isActive: true },
        { id: 2, name: 'Surface Mining', isActive: true },
        { id: 3, name: 'Quarrying', isActive: false },
        { id: 4, name: 'Mineral Processing', isActive: true }
    ]
};

// Function to get segments for a primary segment
function getSegments(primarySegment) {
    return segmentData[primarySegment] || [];
}

// Function to add a new segment
function addSegment(primarySegment, segmentName, isActive) {
    if (!segmentData[primarySegment]) {
        segmentData[primarySegment] = [];
    }
    
    const newId = Math.max(...segmentData[primarySegment].map(s => s.id), 0) + 1;
    const newSegment = {
        id: newId,
        name: segmentName,
        isActive: isActive
    };
    
    segmentData[primarySegment].push(newSegment);
    return newSegment;
}

// Function to update a segment
function updateSegment(primarySegment, segmentId, updates) {
    const segments = segmentData[primarySegment];
    if (!segments) return false;
    
    const segmentIndex = segments.findIndex(s => s.id === segmentId);
    if (segmentIndex === -1) return false;
    
    Object.assign(segments[segmentIndex], updates);
    return true;
}

// Function to delete segments
function deleteSegments(primarySegment, segmentIds) {
    if (!segmentData[primarySegment]) return false;
    
    segmentData[primarySegment] = segmentData[primarySegment].filter(
        segment => !segmentIds.includes(segment.id)
    );
    return true;
}

// Function to search segments
function searchSegments(primarySegment, searchTerm) {
    const segments = segmentData[primarySegment] || [];
    if (!searchTerm) return segments;
    
    return segments.filter(segment => 
        segment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Function to export segments as CSV
function exportSegments(primarySegment) {
    const segments = segmentData[primarySegment] || [];
    const headers = ['ID', 'Name', 'Is Active'];
    const csvContent = [
        headers.join(','),
        ...segments.map(segment => [
            segment.id,
            `"${segment.name}"`,
            segment.isActive ? 'Yes' : 'No'
        ].join(','))
    ].join('\n');
    
    return csvContent;
}

// Function to get primary segment display name
function getPrimarySegmentDisplayName(key) {
    const displayNames = {
        agriculture: 'Agriculture',
        automobile: 'Automobile',
        construction: 'Construction',
        fleet: 'Fleet',
        government: 'Government',
        mining: 'Mining'
    };
    return displayNames[key] || key;
}
