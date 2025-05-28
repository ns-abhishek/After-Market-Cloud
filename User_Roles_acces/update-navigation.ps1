$files = @(
    "roles.html",
    "permissions.html",
    "access-requests.html",
    "audit-logs.html",
    "settings.html",
    "role-definition-guide.html"
)

$navTemplate = Get-Content -Path "nav-template.txt" -Raw

foreach ($file in $files) {
    $content = Get-Content -Path $file -Raw
    
    # Determine which menu item should be active
    $activeClass = ""
    
    if ($file -eq "roles.html") {
        $activeClass = "ROLES_ACTIVE"
    }
    elseif ($file -eq "permissions.html") {
        $activeClass = "PERMISSIONS_ACTIVE"
    }
    elseif ($file -eq "access-requests.html") {
        $activeClass = "ACCESS_REQUESTS_ACTIVE"
    }
    elseif ($file -eq "audit-logs.html") {
        $activeClass = "AUDIT_LOGS_ACTIVE"
    }
    elseif ($file -eq "settings.html") {
        $activeClass = "SETTINGS_ACTIVE"
    }
    
    # Replace placeholders with appropriate active classes
    $newNav = $navTemplate -replace "DASHBOARD_ACTIVE", ""
    $newNav = $newNav -replace "USERS_ACTIVE", ""
    $newNav = $newNav -replace "ROLES_ACTIVE", ""
    $newNav = $newNav -replace "PERMISSIONS_ACTIVE", ""
    $newNav = $newNav -replace "ACCESS_REQUESTS_ACTIVE", ""
    $newNav = $newNav -replace "AUDIT_LOGS_ACTIVE", ""
    $newNav = $newNav -replace "SETTINGS_ACTIVE", ""
    
    # Set the active class for the current page
    if ($activeClass -ne "") {
        $newNav = $newNav -replace $activeClass, "active"
    }
    
    # Replace the sidebar with the top navigation
    $pattern = '(?s)<nav class="sidebar">.*?<\/nav>\s*<main class="content">\s*<header class="content-header">.*?<\/header>'
    $replacement = "$newNav`n        <main class=""content"">
            <header class=""content-header"">
                <div class=""header-left"">
                    <h1>$($file -replace '\.html', '' -replace '-', ' ' | % { (Get-Culture).TextInfo.ToTitleCase($_) })</h1>
                </div>
                <div class=""header-right"">
                    <!-- Empty div to maintain layout -->
                </div>
            </header>"
    
    $newContent = $content -replace $pattern, $replacement
    
    # Save the updated content
    Set-Content -Path $file -Value $newContent
    
    Write-Host "Updated $file"
}

Write-Host "All files have been updated successfully!"
