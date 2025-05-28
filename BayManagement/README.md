# Bay Management System

A modern, responsive web application for managing workshop bays with drag-and-drop functionality, real-time status monitoring, and advanced booking capabilities.

## Features

### 🏭 Core Bay Management
- **Visual Bay Layout**: Interactive workshop floor representation with customizable layouts
- **Real-time Status Monitoring**: Color-coded bay status indicators (Available, Occupied, Maintenance, Blocked)
- **Drag & Drop Assignment**: Intuitive job-to-bay assignment with visual feedback
- **Bay Configuration**: Customizable bay types, equipment, capacity, and tags
- **Context Menus**: Right-click actions for quick bay operations

### 📅 Booking & Scheduling
- **Calendar Interface**: Monthly view with booking indicators
- **Time Slot Management**: 30-minute intervals with conflict detection
- **Recurring Bookings**: Weekly recurring appointment support
- **Booking Validation**: Automatic conflict resolution and availability checking

### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first approach with touch gestures
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Swipe Gestures**: Touch-friendly navigation for mobile devices
- **Progress Indicators**: Visual job completion tracking
- **Toast Notifications**: Real-time feedback for user actions
- **Keyboard Shortcuts**: Power user productivity features

### 🔧 Advanced Features
- **Job Queue Management**: Sortable pending jobs with priority indicators
- **Bay Utilization Tracking**: Performance metrics and efficiency calculations
- **Local Storage**: Persistent data without server requirements
- **Tooltips & Help**: Contextual information on hover
- **Zoom Controls**: Bay layout scaling for different screen sizes

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5 for responsive design
- **Icons**: Font Awesome 6
- **Drag & Drop**: SortableJS library
- **Storage**: Browser LocalStorage API
- **Animations**: CSS transitions and keyframe animations

## File Structure

```
bay-management/
├── index.html              # Main application page
├── css/
│   └── styles.css          # Custom styling and themes
├── js/
│   ├── bay-management.js   # Core bay management logic
│   ├── calendar.js         # Booking and scheduling system
│   └── utils.js           # Utility functions and helpers
└── README.md              # This documentation
```

## Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Start Managing** your workshop bays immediately

No server setup or installation required!

## Usage Guide

### Bay Operations

#### Selecting Bays
- **Click** any bay to select it (highlighted with pulse animation)
- **Double-click** to open configuration dialog
- **Right-click** for context menu with quick actions

#### Drag & Drop Jobs
1. Drag jobs from the queue on the right
2. Drop onto available bays
3. Visual feedback shows valid drop zones
4. Automatic status updates and notifications

#### Bay Configuration
- Access via double-click or context menu
- Configure type, equipment, capacity, and tags
- Changes are saved automatically

### Booking System

#### Creating Bookings
1. Click the calendar icon in the navigation
2. Select a date from the calendar
3. Choose an available time slot
4. Fill in booking details
5. Submit to create the booking

#### Recurring Bookings
- Check "Recurring booking" option
- Automatically creates 4 weeks of bookings
- Conflict detection prevents overlapping appointments

### Keyboard Shortcuts

- **Ctrl/Cmd + Plus**: Zoom in
- **Ctrl/Cmd + Minus**: Zoom out
- **Ctrl/Cmd + 0**: Reset zoom
- **Escape**: Clear bay selection

### Touch Gestures

- **Swipe Left/Right**: Navigate between views
- **Swipe Up**: Show job queue
- **Swipe Down**: Hide job queue
- **Pinch**: Zoom bay layout (on supported devices)

## Customization

### Bay Types
The system supports five bay types with color coding:
- **General Service** (Gray)
- **Alignment** (Cyan)
- **Painting** (Orange)
- **Heavy Duty** (Red)
- **Inspection** (Green)

### Themes
- **Light Theme**: Default professional appearance
- **Dark Theme**: Reduced eye strain for extended use
- Theme preference is saved automatically

### Layout Customization
- Drag bays to reposition them
- Zoom controls for different screen sizes
- Responsive design adapts to mobile devices

## Data Management

### Local Storage
All data is stored in the browser's LocalStorage:
- `bays`: Bay configurations and current status
- `jobs`: Pending and in-progress jobs
- `bookings`: Scheduled appointments
- `completedJobs`: Job history
- `theme`: User theme preference

### Data Persistence
- Automatic saving on all changes
- No data loss on browser refresh
- Export/import functionality can be added

## Browser Compatibility

- **Chrome**: 80+ (Recommended)
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+

## Performance Features

- **Efficient Rendering**: Virtual scrolling for large datasets
- **Debounced Updates**: Optimized real-time updates
- **Lazy Loading**: Progressive content loading
- **Memory Management**: Automatic cleanup of event listeners

## Future Enhancements

### Planned Features
- [ ] Multi-tenant support
- [ ] Real-time collaboration
- [ ] Advanced reporting and analytics
- [ ] Integration with external systems
- [ ] Offline mode with sync
- [ ] Print-friendly layouts
- [ ] Export to PDF/Excel

### API Integration
The system is designed to easily integrate with backend APIs:
- RESTful endpoints for CRUD operations
- WebSocket support for real-time updates
- Authentication and authorization hooks
- Data synchronization capabilities

## Contributing

This is a demonstration project showcasing modern web development practices for bay management systems. The code is structured for easy extension and customization.

### Code Organization
- **Modular Design**: Separate concerns across multiple files
- **ES6+ Features**: Modern JavaScript syntax and features
- **CSS Custom Properties**: Theme system using CSS variables
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## License

This project is provided as-is for demonstration purposes. Feel free to use and modify according to your needs.

## Support

For questions or customization requests, please refer to the inline code documentation and comments throughout the source files.
