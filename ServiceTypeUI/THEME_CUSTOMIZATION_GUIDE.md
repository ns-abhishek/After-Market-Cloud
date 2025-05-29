# 🎨 Theme Customization Guide

## 🎯 **Unified Styles with Theme Variables**

All styles have been consolidated into a single file (`unified-styles.css`) with comprehensive CSS custom properties (variables) for easy theme customization.

## ✅ **What's Been Unified**

### **📁 Single File Structure**
- ✅ **All styles consolidated** into `unified-styles.css`
- ✅ **External imports** (Material Design, Google Fonts, Icons)
- ✅ **Theme variables** for colors, spacing, typography
- ✅ **Component styles** for all UI elements
- ✅ **Responsive design** breakpoints
- ✅ **Utility classes** for quick styling
- ✅ **Dark theme support** built-in

### **🎨 Complete Theme Variable System**

#### **Primary Colors**
```css
--primary-color: #1976d2;
--primary-light: #42a5f5;
--primary-dark: #1565c0;
--primary-variant: #3f51b5;
```

#### **Secondary Colors**
```css
--secondary-color: #dc004e;
--secondary-light: #ff5983;
--secondary-dark: #9a0036;
```

#### **Status Colors**
```css
--success-color: #4caf50;
--warning-color: #ff9800;
--error-color: #f44336;
--info-color: #2196f3;
```

#### **Surface & Background**
```css
--surface-color: #ffffff;
--background-color: #ffffff;
--background-secondary: #f8f9fa;
```

#### **Text Colors**
```css
--text-primary: rgba(0, 0, 0, 0.87);
--text-secondary: rgba(0, 0, 0, 0.6);
--text-on-primary: #ffffff;
```

## 🚀 **How to Change Themes**

### **Method 1: Edit CSS Variables (Recommended)**

Open `unified-styles.css` and modify the `:root` section:

```css
:root {
  /* Change these values for instant theme update */
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... other variables */
}
```

### **Method 2: Override with Custom CSS**

Add this to your HTML or create a separate theme file:

```css
/* Blue Corporate Theme */
:root {
  --primary-color: #2196f3;
  --secondary-color: #ff4081;
  --success-color: #4caf50;
}

/* Green Nature Theme */
:root {
  --primary-color: #4caf50;
  --secondary-color: #ff9800;
  --background-tertiary: #e8f5e8;
}

/* Purple Creative Theme */
:root {
  --primary-color: #9c27b0;
  --secondary-color: #00bcd4;
  --background-tertiary: #f3e5f5;
}
```

## 🎨 **Pre-Built Theme Examples**

### **🔵 Professional Blue Theme**
```css
:root {
  --primary-color: #1565c0;
  --secondary-color: #ff4081;
  --success-color: #2e7d32;
  --warning-color: #f57c00;
  --error-color: #d32f2f;
}
```

### **🟢 Nature Green Theme**
```css
:root {
  --primary-color: #388e3c;
  --secondary-color: #ff8f00;
  --success-color: #2e7d32;
  --background-tertiary: #e8f5e8;
}
```

### **🟣 Creative Purple Theme**
```css
:root {
  --primary-color: #7b1fa2;
  --secondary-color: #00acc1;
  --success-color: #388e3c;
  --background-tertiary: #f3e5f5;
}
```

### **🔴 Bold Red Theme**
```css
:root {
  --primary-color: #d32f2f;
  --secondary-color: #1976d2;
  --success-color: #388e3c;
  --background-tertiary: #ffebee;
}
```

### **⚫ Dark Corporate Theme**
```css
:root {
  --primary-color: #1a365d;
  --secondary-color: #e53e3e;
  --surface-color: #2d3748;
  --background-color: #1a202c;
  --text-primary: rgba(255, 255, 255, 0.92);
  --text-secondary: rgba(255, 255, 255, 0.64);
}
```

## 🌙 **Dark Theme Support**

Dark theme is automatically supported! The application includes:

```css
.dark-theme {
  --surface-color: #121212;
  --background-color: #121212;
  --text-primary: rgba(255, 255, 255, 0.87);
  /* ... other dark theme variables */
}
```

**To enable dark theme:**
```javascript
// Toggle dark theme
document.body.classList.toggle('dark-theme');

// Enable dark theme
document.body.classList.add('dark-theme');

// Disable dark theme
document.body.classList.remove('dark-theme');
```

## 🎯 **Component-Specific Theming**

### **Service Cards**
```css
.service-card__header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}
```

### **Status Indicators**
```css
.service-card__status.active {
  color: var(--active-color); /* Maps to success-color */
}
.service-card__status.inactive {
  color: var(--inactive-color);
}
```

### **Action Buttons**
```css
.operation-action-btn.edit-btn {
  color: var(--primary-color);
}
.operation-action-btn.delete-btn {
  color: var(--error-color);
}
```

## 📱 **Responsive Design**

All components are fully responsive with breakpoints:

```css
/* Tablet */
@media (max-width: 768px) { /* ... */ }

/* Mobile */
@media (max-width: 480px) { /* ... */ }
```

## 🛠 **Utility Classes**

Quick styling with utility classes:

```css
/* Text Colors */
.text-primary, .text-secondary, .text-success, .text-warning, .text-error

/* Background Colors */
.bg-primary, .bg-secondary, .bg-success, .bg-warning, .bg-error

/* Border Colors */
.border-primary, .border-secondary, .border-success, .border-warning, .border-error
```

## 🔧 **Advanced Customization**

### **Spacing System**
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

### **Typography Scale**
```css
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-md: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-xxl: 1.5rem;
```

### **Border Radius**
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

### **Elevation/Shadows**
```css
--elevation-1: 0 1px 3px var(--shadow-light);
--elevation-2: 0 2px 6px var(--shadow-light);
--elevation-3: 0 4px 8px var(--shadow-medium);
--elevation-4: 0 6px 12px var(--shadow-medium);
```

## 🎨 **Quick Theme Switching**

Create multiple theme files and switch between them:

```html
<!-- Default Theme -->
<link rel="stylesheet" href="unified-styles.css" id="theme-css">

<!-- JavaScript theme switching -->
<script>
function switchTheme(themeName) {
  const themeCSS = document.getElementById('theme-css');
  themeCSS.href = `themes/${themeName}-theme.css`;
}

// Usage
switchTheme('blue');    // Load blue-theme.css
switchTheme('green');   // Load green-theme.css
switchTheme('dark');    // Load dark-theme.css
</script>
```

## ✅ **Benefits of Unified Styles**

1. **🎯 Single Point of Control** - Change colors in one place
2. **🚀 Easy Theme Switching** - Modify variables for instant updates
3. **📱 Consistent Responsive Design** - All components scale properly
4. **🌙 Built-in Dark Mode** - Professional dark theme included
5. **🎨 Professional Design System** - Consistent spacing, typography, colors
6. **⚡ Better Performance** - Single CSS file, optimized loading
7. **🛠 Developer Friendly** - Clear variable names, organized structure

## 🎉 **Ready to Use!**

Your application now has a complete, professional design system with easy theme customization. Simply modify the CSS variables in `unified-styles.css` to create your perfect theme!

**The unified styles include everything:**
- ✅ All component styles
- ✅ Responsive design
- ✅ Dark theme support
- ✅ Theme variables
- ✅ Utility classes
- ✅ Professional design system

**Change themes in seconds by modifying just a few CSS variables!** 🎨
