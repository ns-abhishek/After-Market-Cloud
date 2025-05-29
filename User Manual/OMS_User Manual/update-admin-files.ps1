# PowerShell script to update all admin HTML files
# This script updates CSS and JavaScript references in all admin HTML files

# Get all HTML files in the admin directory
$htmlFiles = Get-ChildItem -Path "admin" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $filePath = $file.FullName
    $content = Get-Content -Path $filePath -Raw
    
    # Replace CSS references
    $content = $content -replace '<link rel="stylesheet" href="../styles.css">', '<link rel="stylesheet" href="css/admin-base.css">'
    
    # Replace JavaScript references
    $content = $content -replace '<script src="../theme-switcher.js"></script>', '<script src="js/admin-theme-switcher.js"></script>'
    
    # Save the updated content
    Set-Content -Path $filePath -Value $content
    
    Write-Host "Updated $($file.Name)"
}

Write-Host "All admin HTML files have been updated."
