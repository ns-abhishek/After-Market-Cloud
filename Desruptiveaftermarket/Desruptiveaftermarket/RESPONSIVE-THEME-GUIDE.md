# Responsive Framework & Global Theme Configuration Guide

## Overview

This guide explains how to use the new responsive framework and global theme configuration system that adapts to any screen resolution and provides comprehensive theme and font management.

## Features

### 🎨 Global Theme System
- **Light Theme**: Clean and bright interface
- **Dark Theme**: Easy on the eyes in low light
- **Auto Theme**: Follows system preference
- **Real-time theme switching**
- **Persistent theme settings**

### 📱 Responsive Framework
- **Adaptive layouts** for all screen sizes
- **Mobile-first design approach**
- **Flexible grid system**
- **Responsive utilities**
- **Breakpoint-based styling**

### 🔤 Typography Configuration
- **Multiple font families**: Inter, Roboto, Poppins, System
- **Scalable font sizes**: Small, Medium, Large
- **Google Fonts integration**
- **Consistent typography scale**

### 🎛️ Interface Density
- **Compact**: Maximum information density
- **Comfortable**: Balanced spacing (default)
- **Spacious**: Generous spacing for accessibility

## Quick Start

### 1. Include Required Files

Add these files to your HTML pages:

```html
<!-- Responsive Framework and Theme System -->
<link rel="stylesheet" href="responsive-framework.css">
<link rel="stylesheet" href="light-theme.css">
<script src="global-config.js"></script>
```

### 2. Basic HTML Structure

Use the responsive framework classes:

```html
<div class="container">
    <div class="row">
        <div class="col-md-6 col-lg-4">
            <div class="card p-3 shadow-sm">
                <h3 class="text-primary">Card Title</h3>
                <p class="text-secondary">Card content</p>
            </div>
        </div>
    </div>
</div>
```

### 3. Access Theme Configuration

Navigate to **Theme Configuration** from the main navigation menu or visit `theme-configurator.html` directly.

## Responsive Grid System

### Breakpoints

| Breakpoint | Size | Device |
|------------|------|---------|
| xs | 0px | Extra small devices |
| sm | 576px | Small devices |
| md | 768px | Medium devices |
| lg | 992px | Large devices |
| xl | 1200px | Extra large devices |
| xxl | 1400px | Extra extra large devices |

### Grid Classes

```html
<!-- Basic columns -->
<div class="col-12">Full width</div>
<div class="col-6">Half width</div>
<div class="col-4">One third</div>

<!-- Responsive columns -->
<div class="col-12 col-md-6 col-lg-4">
    Responsive: Full on mobile, half on tablet, third on desktop
</div>

<!-- Responsive utilities -->
<div class="d-none d-md-block">Hidden on mobile, visible on tablet+</div>
<div class="d-block d-lg-none">Visible on mobile/tablet, hidden on desktop</div>
```

## CSS Variables & Theming

### Color Variables

```css
/* Primary colors */
--color-primary: #000000;
--color-secondary: #ffffff;
--color-accent: #f8fafc;

/* Text colors */
--color-text: #1e293b;
--color-text-secondary: #475569;
--color-text-muted: #64748b;

/* Status colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Typography Variables

```css
/* Font family */
--font-family: 'Inter', sans-serif;

/* Font sizes */
--font-size-base: 16px;
--font-size-sm: 14px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 28px;
```

### Spacing Variables

```css
/* Spacing scale */
--spacing: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

## Utility Classes

### Display Utilities

```html
<div class="d-none">Hidden</div>
<div class="d-block">Block display</div>
<div class="d-flex">Flex display</div>
<div class="d-grid">Grid display</div>

<!-- Responsive display -->
<div class="d-none d-md-block">Hidden on mobile, visible on tablet+</div>
```

### Flexbox Utilities

```html
<div class="d-flex justify-center align-center">
    Centered content
</div>

<div class="d-flex justify-between">
    <span>Left</span>
    <span>Right</span>
</div>
```

### Spacing Utilities

```html
<!-- Margin -->
<div class="m-0">No margin</div>
<div class="m-1">Small margin</div>
<div class="mt-2">Top margin</div>
<div class="mb-3">Bottom margin</div>

<!-- Padding -->
<div class="p-0">No padding</div>
<div class="p-1">Small padding</div>
<div class="pt-2">Top padding</div>
<div class="pb-3">Bottom padding</div>
```

### Text Utilities

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>

<p class="text-primary">Primary color</p>
<p class="text-secondary">Secondary color</p>
<p class="text-muted">Muted color</p>
```

### Background Utilities

```html
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-success">Success background</div>
```

## JavaScript Configuration API

### ConfigManager Methods

```javascript
// Get current configuration
const config = ConfigManager.getConfig();

// Update configuration
ConfigManager.updateConfig({
    theme: 'dark',
    font: 'roboto',
    fontSize: 'large',
    density: 'compact'
});

// Listen for configuration changes
window.addEventListener('configChanged', (e) => {
    console.log('Config updated:', e.detail.config);
});

// Listen for breakpoint changes
window.addEventListener('breakpointChanged', (e) => {
    console.log('Breakpoint changed:', e.detail.breakpoint);
});
```

### Available Configuration Options

```javascript
// Theme options
theme: 'light' | 'dark' | 'auto'

// Font options
font: 'inter' | 'roboto' | 'poppins' | 'system'

// Font size options
fontSize: 'small' | 'medium' | 'large'

// Density options
density: 'compact' | 'comfortable' | 'spacious'

// Animation toggle
animations: true | false
```

## Best Practices

### 1. Mobile-First Design

Always design for mobile first, then enhance for larger screens:

```css
/* Mobile styles (default) */
.card {
    padding: var(--spacing);
}

/* Tablet and up */
@media (min-width: 768px) {
    .card {
        padding: var(--spacing-lg);
    }
}
```

### 2. Use CSS Variables

Always use CSS variables for consistent theming:

```css
/* Good */
.button {
    background: var(--color-primary);
    color: var(--color-secondary);
    padding: var(--spacing) var(--spacing-lg);
}

/* Avoid */
.button {
    background: #000000;
    color: #ffffff;
    padding: 12px 24px;
}
```

### 3. Responsive Images

Make images responsive by default:

```html
<img src="image.jpg" alt="Description" class="w-100 h-auto">
```

### 4. Accessible Design

Consider accessibility in your responsive design:

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Browser Support

- **Modern browsers**: Full support
- **IE 11**: Partial support (CSS variables not supported)
- **Mobile browsers**: Full support
- **Print**: Optimized print styles included

## Performance Considerations

- **CSS variables**: Minimal performance impact
- **Google Fonts**: Loaded asynchronously
- **Responsive images**: Use appropriate sizes
- **Animation**: Respects `prefers-reduced-motion`

## Troubleshooting

### Theme Not Applying

1. Check if `global-config.js` is loaded
2. Verify CSS variables are defined
3. Check browser console for errors

### Responsive Layout Issues

1. Verify container structure
2. Check breakpoint classes
3. Test on actual devices

### Font Loading Issues

1. Check Google Fonts connection
2. Verify font family names
3. Ensure fallback fonts are available

## Examples

See the following files for implementation examples:
- `theme-configurator.html` - Theme configuration interface
- `party-details-advanced.html` - Responsive layout example
- `system-settings.html` - Form layouts
- `user-management.html` - Data tables

## Support

For questions or issues with the responsive framework and theme system, please refer to the documentation or contact the development team.
