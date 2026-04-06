$cd = "C:\Users\qaise\Downloads\dentists"
$templatePath = "$cd\index.html"
$outputPath = "$cd\index.bundle.html"
$html = Get-Content $templatePath -Raw
$failed = $false

$images = @("hero_interior.png", "teeth_macro.png", "implant_model.png", "perfect_smile.png")
foreach ($img in $images) {
    $path = "$cd\images\$img"
    $marker = "images/$img"
    if (-not $html.Contains($marker)) {
        Write-Host "WARNING: marker not found in template for $img — skipping"
        continue
    }
    if (Test-Path $path) {
        Write-Host "Embedding $img..."
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $b64 = [System.Convert]::ToBase64String($bytes)
        $html = $html.Replace($marker, "data:image/png;base64,$b64")
    } else {
        Write-Host "ERROR: $img not found at $path"
        $failed = $true
    }
}

$cssMarker = '<link rel="stylesheet" href="style.css">'
if (-not $html.Contains($cssMarker)) {
    Write-Host "ERROR: CSS link marker not found in template"
    $failed = $true
} else {
    $cssPath = "$cd\style.css"
    if (Test-Path $cssPath) {
        Write-Host "Embedding CSS..."
        $css = Get-Content $cssPath -Raw
        $html = $html.Replace($cssMarker, "<style>`n$css`n</style>")
    } else {
        Write-Host "ERROR: style.css not found"
        $failed = $true
    }
}

$jsMarker = '<script src="script.js"></script>'
if (-not $html.Contains($jsMarker)) {
    Write-Host "ERROR: JS script marker not found in template"
    $failed = $true
} else {
    $jsPath = "$cd\script.js"
    if (Test-Path $jsPath) {
        Write-Host "Embedding JS..."
        $js = Get-Content $jsPath -Raw
        $html = $html.Replace($jsMarker, "<script>`n$js`n</script>")
    } else {
        Write-Host "ERROR: script.js not found"
        $failed = $true
    }
}

if ($failed) {
    Write-Host "Bundle FAILED — see errors above. Output not written."
    exit 1
}

Set-Content $outputPath $html -Encoding UTF8
Write-Host "Successfully bundled all assets into index.bundle.html"
