# Attachment UI - Google Framework

A modern attachment management UI built using Google's Web Components and Framework.

## Features

- Complete UI implementation using Google's official Web Components
- Google Material Design styling and interactions
- Integration with Google APIs and services
- Responsive layout that works on desktop and mobile
- File upload with drag and drop support
- List and grid views for attachments
- File preview for various file types using Google Docs Viewer
- Signature requirement and tracking
- Google account integration ready

## Project Structure

```
AttachmentUI_GoogleFramework/
├── index.html              # Main application entry point with Google Web Components
├── 404.html                # 404 error page
├── server.js               # Simple HTTP server
├── styles/
│   ├── material-theme.css  # Google Web Components theme customization
│   └── app.css             # Application-specific styles
├── scripts/
│   ├── material-components.js  # Google Web Components initialization
│   └── app.js                  # Main application logic with Google API integration
```

## Getting Started

### Prerequisites

- Node.js (for running the server)

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Start the server:

```bash
node server.js
```

4. Open your browser and go to `http://localhost:8080`

## Usage

### Uploading Files

1. Click the "Upload" button or drag files to the upload area
2. Select a file from your computer
3. Choose a reference document (optional)
4. Check "Requires Signature" if needed
5. Click "Upload" to complete the process

### Viewing Files

1. Click the "View" button on any file in the list or grid view
2. The file will open in the file viewer dialog
3. For Office documents, the Google Docs Viewer will be used

### Managing Files

- Use the list/grid toggle to switch between view modes
- Download files using the download button
- Delete files using the delete button

## Technologies Used

- HTML5, CSS3, JavaScript
- Google Web Components (@material/mwc-* components)
- Google APIs and Services
- Google Docs Viewer for document previews
- Google Account integration
- Google Material Design System

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

## License

This project is licensed under the MIT License - see the LICENSE file for details.
