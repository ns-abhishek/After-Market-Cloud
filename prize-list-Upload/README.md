# Price List Manager

A modern, responsive web application for managing price lists with advanced filtering, sorting, and data management capabilities.

## Features

- ✅ **Modern UI Design** - Clean, professional interface with glassmorphism effects
- ✅ **Dark/Light Theme Toggle** - Switch between themes seamlessly
- ✅ **Tab Navigation** - Price List, Upload File, Manual Entry tabs
- ✅ **File Upload** - Drag & drop file upload with validation
- ✅ **Manual Entry** - Form-based data entry with validation
- ✅ **Data Grid** - Advanced search, sort, and export functionality
- ✅ **Dashboard Statistics** - Quick view cards showing upload statistics
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **Pure HTML/CSS/JavaScript** - No frameworks or dependencies required

## How to Run

### Option 1: Using HTTP Server (Recommended)

**Method A: Using the provided batch file**
1. Double-click `start-server.bat`
2. Choose option 1 (Python HTTP Server)
3. Open your browser and go to `http://localhost:8000`

**Method B: Manual Python server**
```bash
# Open command prompt in the project directory
python -m http.server 8000

# Then open: http://localhost:8000
```

**Method C: Using Node.js (if installed)**
```bash
# Install http-server globally
npm install -g http-server

# Start server
http-server

# Then open: http://localhost:8080
```

### Option 2: Direct File Opening (✅ Fully Self-Contained)

The HTML file now contains all CSS and JavaScript embedded directly inside it, making it completely self-contained and fully functional when opened directly.

**Method A: Using the batch file**
1. Double-click `start-server.bat`
2. Choose option 2 (Open directly)

**Method B: Manual opening**
1. Double-click `index.html`
2. Or right-click → "Open with" → your preferred browser

**✅ Works exactly the same as Live Server!**

## Project Structure

```
price-list-manager/
├── index.html          # Main HTML file (fully self-contained)
├── script.js           # JavaScript functionality (for HTTP servers)
├── styles.css          # External CSS file (for HTTP servers)
├── start-server.bat    # Batch file to start the application
└── README.md           # This file
```

## Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

## Technical Details

- **Pure HTML/CSS/JavaScript** - No JSX, React, or other frameworks
- **Fully Self-Contained** - All CSS and JavaScript embedded in HTML
- **Cross-Environment Compatible** - Works identically in all serving methods
- **CSS Variables** - For theme management and consistency
- **Modern CSS Features** - Grid, Flexbox, CSS Custom Properties
- **Responsive Design** - Mobile-first approach
- **Accessibility** - Semantic HTML and ARIA labels

## Development

The application is built with:
- Semantic HTML5
- Modern CSS3 with custom properties
- Vanilla JavaScript ES6+
- Material Icons for iconography
- Inter font family for typography

## License

This project is for internal use.
