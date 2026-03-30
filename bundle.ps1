$cd = "C:\Users\qaise\Downloads\dentists"
$htmlPath = "$cd\index.html"
$html = Get-Content $htmlPath -Raw

$images = @("hero_interior.png", "teeth_macro.png", "implant_model.png", "perfect_smile.png")
foreach ($img in $images) {
    $path = "$cd\images\$img"
    if (Test-Path $path) {
        Write-Host "Embedding $img..."
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $b64 = [System.Convert]::ToBase64String($bytes)
        $html = $html.Replace("images/$img", "data:image/png;base64,$b64")
    } else {
        Write-Host "Skipping $img (Not Found)"
    }
}

$cssPath = "$cd\style.css"
if (Test-Path $cssPath) {
    Write-Host "Embedding CSS..."
    $css = Get-Content $cssPath -Raw
    $html = $html.Replace('<link rel="stylesheet" href="style.css">', "<style>`n$css`n</style>")
}

$jsPath = "$cd\script.js"
if (Test-Path $jsPath) {
    Write-Host "Embedding JS..."
    $js = Get-Content $jsPath -Raw
    $html = $html.Replace('<script src="script.js"></script>', "<script>`n$js`n</script>")
}

Set-Content $htmlPath $html -Encoding UTF8
Write-Host "Successfully bundled all assets into index.html"
