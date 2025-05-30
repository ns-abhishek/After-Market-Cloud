# Invoice Management System

A modern, responsive web application for managing invoices with comprehensive features including customer invoices, service returns, internal invoicing, and analytics dashboard.

## Features

### 🏠 Main Dashboard
- **4 Service Cards**: Customer Invoice, Service Invoice Return, Internal Invoice, Internal Invoice Return
- **Quick Statistics**: Real-time overview of system metrics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎨 Theming System
- **Default Theme**: Black and white color scheme
- **Available Themes**: Light and Dark themes
- **Theme Persistence**: Saves user preferences in localStorage
- **System Theme Detection**: Automatically adapts to system dark/light mode

### 🌍 Multi-Language Support
- **Languages**: English, Spanish (Español), French (Français)
- **Dynamic Translation**: Real-time language switching
- **Persistent Settings**: Language preference saved locally

### 📊 Analytics Dashboard
- **Interactive Charts**: Revenue trends, status distribution, payment methods
- **KPI Cards**: Animated statistics with trend indicators
- **Recent Activity**: Live feed of system activities
- **Export Options**: PDF and Excel export capabilities

### 📋 Data Tables
- **Advanced Search**: Global and column-specific search functionality
- **Smart Filters**: Date ranges, status filters, dropdown selections
- **Sortable Columns**: Click to sort by any column
- **Responsive Tables**: Mobile-optimized table layouts
- **Pagination**: Efficient data navigation

### 🔧 Management Features
- **CRUD Operations**: Create, Read, Update, Delete records
- **Bulk Actions**: Export, filter, and manage multiple records
- **Email Integration**: Send invoices via email
- **Status Tracking**: Real-time status updates

## File Structure

```
Invoice_AF/
├── index.html                 # Main dashboard page
├── assets/
│   ├── css/
│   │   ├── main.css          # Core styles
│   │   ├── themes.css        # Theme system
│   │   ├── tables.css        # Table-specific styles
│   │   └── dashboard.css     # Dashboard styles
│   └── js/
│       ├── main.js           # Core functionality
│       ├── themes.js         # Theme management
│       ├── language.js       # Language system
│       └── navigation.js     # Navigation & search
├── pages/
│   ├── customer-invoice.html      # Customer invoice management
│   ├── service-invoice-return.html # Service returns
│   ├── internal-invoice.html      # Internal invoicing
│   ├── internal-invoice-return.html # Internal returns
│   └── dashboard.html             # Analytics dashboard
├── data/
│   └── sample-data.js        # Sample data and utilities
└── README.md                 # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. The application will load with sample data

### Usage

#### Navigation
- **Home**: Return to main dashboard
- **Dashboard**: View analytics and charts
- **Add New**: Create new records (dropdown menu)
- **Export**: Download data as PDF or Excel
- **Advanced Search**: Global search across all data
- **Advanced Filter**: Multi-criteria filtering
- **Theme**: Switch between color themes
- **Language**: Change interface language

#### Managing Invoices

1. **Customer Invoices**
   - Click "Customer Invoice" card on main dashboard
   - Use search and filter controls to find specific records
   - Click action buttons to view, edit, or delete records
   - Use "Add New" to create customer invoices

2. **Service Returns**
   - Access via "Service Invoice Return" card
   - Filter by return type (full/partial) or generation method
   - Track credit amounts and return status

3. **Internal Invoices**
   - Manage internal company invoicing
   - Track by branch (Satisfaction/Rework/Main)
   - Monitor SAP integration status

4. **Internal Returns**
   - Handle internal return processes
   - Link to original internal invoices
   - Track return completion status

#### Analytics Dashboard
- View real-time KPI metrics
- Analyze revenue trends with interactive charts
- Monitor invoice status distribution
- Track payment method preferences
- Review recent system activity

### Customization

#### Adding New Themes
1. Edit `assets/css/themes.css`
2. Add new theme variables following existing pattern
3. Update theme selector in `assets/js/themes.js`

#### Adding New Languages
1. Edit `assets/js/language.js`
2. Add translations to the `translations` object
3. Update language selector options

#### Modifying Data Structure
1. Update sample data in `data/sample-data.js`
2. Modify table generation functions in page-specific scripts
3. Update form fields in modal generation functions

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Flexbox, Grid, custom properties, animations
- **JavaScript (ES6+)**: Modern JavaScript features
- **Bootstrap 5**: Responsive framework and components
- **Font Awesome**: Icon library
- **Chart.js**: Interactive charts and graphs
- **Material Icons**: Google's icon set

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance Features
- **Lazy Loading**: Charts and data loaded on demand
- **Local Storage**: Efficient client-side data persistence
- **Responsive Images**: Optimized for different screen sizes
- **Minimal Dependencies**: Fast loading times

### Accessibility Features
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper document structure

## Data Management

### Sample Data
The system includes comprehensive sample data for demonstration:
- 50+ customer invoice records
- 30+ service return records
- 25+ internal invoice records
- 15+ internal return records

### Data Persistence
- User preferences (theme, language) saved in localStorage
- Form data temporarily stored during sessions
- Export functionality for data backup

### Data Validation
- Client-side validation for all forms
- Required field checking
- Data type validation
- Format verification

## Troubleshooting

### Common Issues

1. **Charts not displaying**
   - Ensure Chart.js library is loaded
   - Check browser console for JavaScript errors
   - Verify canvas elements are present

2. **Themes not switching**
   - Clear browser cache and localStorage
   - Check CSS custom property support
   - Verify theme JavaScript is loaded

3. **Language not changing**
   - Ensure all text has `data-translate` attributes
   - Check translation keys exist in language.js
   - Verify language files are loaded

4. **Tables not filtering**
   - Check JavaScript console for errors
   - Ensure filter functions are properly bound
   - Verify table structure matches filter logic

### Browser Console
Open browser developer tools (F12) to view console messages and debug issues.

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across browsers
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions:
- Check the troubleshooting section
- Review browser console for error messages
- Ensure all files are properly loaded
- Verify browser compatibility

---

**Note**: This is a demonstration application with sample data. For production use, integrate with a backend API and database system.
