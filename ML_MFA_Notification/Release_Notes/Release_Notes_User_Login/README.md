# Login with Release Notes

A simple web application that displays release notes as a popup when a user logs in, requiring them to save the release notes as a PDF before completing the login process.

## Features

- Login page with username/number and password fields
- Release notes popup that appears when a user logs in
- Functionality to save release notes as a PDF
- User must save the PDF before completing login

## How to Use

1. Open `index.html` in a web browser
2. Enter the following credentials:
   - Username: `user123`
   - Password: `password123`
3. If there's a new release, a popup will appear with the release notes
4. Click the "Save as PDF" button to save the release notes
5. After saving the PDF, the "Continue to Login" button will be enabled
6. Click "Continue to Login" to complete the login process

## Technical Details

- Built with HTML, CSS, and JavaScript
- Uses jsPDF and html2canvas libraries for PDF generation
- Sample release notes are stored in the `Release Notes` directory

## Customization

To add or modify release notes, edit the `releaseNotes` object in `script.js` or add new JSON files to the `Release Notes` directory.

## Future Enhancements

- Connect to a backend API for authentication
- Fetch release notes from a server
- Add more styling options
- Implement user preferences for release notes display
