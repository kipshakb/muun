Add-Type -AssemblyName System.Drawing

$downloads = 'C:\Users\Beibars\Downloads'

# 1. Locate files safely with pure ASCII patterns
$fileHeader = Get-ChildItem $downloads | Where-Object { $_.Name -like '*-59.png' } | Select-Object -First 1
$fileCrystal = Get-ChildItem $downloads | Where-Object { $_.Name -eq 'logo crystal 2.png' } | Select-Object -First 1
$fileFavicon = Get-ChildItem $downloads | Where-Object { $_.Name -like '*-60.png' } | Select-Object -First 1
$fileOg = Get-ChildItem $downloads | Where-Object { $_.Name -like '*-52.png' } | Select-Object -First 1

if (-not $fileHeader) { throw "Header logo (*-59.png) not found in Downloads" }
if (-not $fileCrystal) { throw "Crystal logo (logo crystal 2.png) not found in Downloads" }
if (-not $fileFavicon) { throw "Favicon (*-60.png) not found in Downloads" }
if (-not $fileOg) { throw "OG logo (*-52.png) not found in Downloads" }

Write-Output "Located source files:"
Write-Output "1. Header logo: $($fileHeader.Name)"
Write-Output "2. Crystal logo: $($fileCrystal.Name)"
Write-Output "3. Favicon: $($fileFavicon.Name)"
Write-Output "4. OG logo: $($fileOg.Name)"

# Ensure target directories exist
New-Item -ItemType Directory -Force -Path 'assets' | Out-Null
New-Item -ItemType Directory -Force -Path 'dist/assets' | Out-Null

# ============================================================
# TASK 1: Header logo
# ============================================================
Write-Output "`nProcessing Header Logo..."
Copy-Item -Force $fileHeader.FullName 'assets/logo-header.png'
Copy-Item -Force $fileHeader.FullName 'dist/logo-header.png'
Copy-Item -Force $fileHeader.FullName 'dist/assets/logo-header.png'
Write-Output "Copied to assets/logo-header.png and dist/"

# ============================================================
# TASK 2: Main Page Crystal Logo (Cropped to tight content bounds)
# ============================================================
Write-Output "`nProcessing Main Page Crystal Logo..."
$crysSrc = [System.Drawing.Bitmap]::FromFile($fileCrystal.FullName)
Write-Output "Crystal raw size: $($crysSrc.Width) x $($crysSrc.Height)"

# Content bounds: X=[540, 2565], Y=[1485, 3695], Content: 2026 x 2211
# Safe crop with 20px padding around glow
$crysCropX = 520
$crysCropY = 1460
$crysCropW = [Math]::Min(2070, $crysSrc.Width - $crysCropX)
$crysCropH = [Math]::Min(2260, $crysSrc.Height - $crysCropY)

$crysBmp = New-Object System.Drawing.Bitmap($crysCropW, $crysCropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$crysG = [System.Drawing.Graphics]::FromImage($crysBmp)
$crysG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$crysG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$crysG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$crysG.Clear([System.Drawing.Color]::Transparent)

$crysDestRect = New-Object System.Drawing.Rectangle(0, 0, $crysCropW, $crysCropH)
$crysSrcRect = New-Object System.Drawing.Rectangle($crysCropX, $crysCropY, $crysCropW, $crysCropH)
$crysG.DrawImage($crysSrc, $crysDestRect, $crysSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$crysG.Dispose()
$crysSrc.Dispose()

$crysBmp.Save('assets/logo-crystal.png', [System.Drawing.Imaging.ImageFormat]::Png)
$crysBmp.Dispose()
Copy-Item -Force 'assets/logo-crystal.png' 'dist/logo-crystal.png'
Copy-Item -Force 'assets/logo-crystal.png' 'dist/assets/logo-crystal.png'
Write-Output "Cropped and saved tight assets/logo-crystal.png ($crysCropW x $crysCropH) and dist/"

# ============================================================
# TASK 3: Favicon (Cropped to exact emblem bounds, large & crisp)
# ============================================================
Write-Output "`nProcessing Favicon..."
$favSrc = [System.Drawing.Bitmap]::FromFile($fileFavicon.FullName)
Write-Output "Favicon source size: $($favSrc.Width) x $($favSrc.Height)"

# Content bounds: X=[96, 522], Y=[60, 487], Content: 427 x 428
$favCropRect = New-Object System.Drawing.Rectangle(96, 60, 427, 428)

# 512x512 square canvas with transparent background
$favCanvasSize = 512
$favCanvas = New-Object System.Drawing.Bitmap($favCanvasSize, $favCanvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$favG = [System.Drawing.Graphics]::FromImage($favCanvas)
$favG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$favG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$favG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$favG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$favG.Clear([System.Drawing.Color]::Transparent)

# Fit emblem tightly with tiny 8px margin (fills 97% of canvas like original favicon)
$padding = 8
$avail = $favCanvasSize - ($padding * 2)
$favDestRect = New-Object System.Drawing.Rectangle($padding, $padding, $avail, $avail)
$favG.DrawImage($favSrc, $favDestRect, $favCropRect, [System.Drawing.GraphicsUnit]::Pixel)
$favG.Dispose()
$favSrc.Dispose()

$favCanvas.Save('assets/favicon.png', [System.Drawing.Imaging.ImageFormat]::Png)
Copy-Item -Force 'assets/favicon.png' 'dist/favicon.png'
Copy-Item -Force 'assets/favicon.png' 'dist/assets/favicon.png'
Write-Output "Saved 512x512 assets/favicon.png and dist/"

# Multi-resolution ICO (48x48, 32x32, 16x16) with 32-bit PNG frames
$icoSizes = @(48, 32, 16)
$icoPngList = @()
foreach ($s in $icoSizes) {
    $bmpFrame = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gFrame = [System.Drawing.Graphics]::FromImage($bmpFrame)
    $gFrame.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gFrame.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gFrame.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gFrame.Clear([System.Drawing.Color]::Transparent)
    $gFrame.DrawImage($favCanvas, 0, 0, $s, $s)
    $gFrame.Dispose()

    $msFrame = New-Object System.IO.MemoryStream
    $bmpFrame.Save($msFrame, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpFrame.Dispose()
    $icoPngList += ,$msFrame.ToArray()
    $msFrame.Dispose()
}
$favCanvas.Dispose()

$icoMs = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($icoMs)
$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type 1 = Icon
$bw.Write([uint16]$icoSizes.Count) # Count of frames

$icoDataOffset = 6 + (16 * $icoSizes.Count)
for ($i = 0; $i -lt $icoSizes.Count; $i++) {
    $s = $icoSizes[$i]
    $bytes = $icoPngList[$i]
    $bw.Write([byte]$s)
    $bw.Write([byte]$s)
    $bw.Write([byte]0) # palette
    $bw.Write([byte]0) # reserved
    $bw.Write([uint16]1) # planes
    $bw.Write([uint16]32) # bpp
    $bw.Write([uint32]$bytes.Length)
    $bw.Write([uint32]$icoDataOffset)
    $icoDataOffset += $bytes.Length
}
for ($i = 0; $i -lt $icoSizes.Count; $i++) {
    $bytes = $icoPngList[$i]
    $bw.Write($bytes, 0, $bytes.Length)
}
$bw.Flush()
[System.IO.File]::WriteAllBytes('assets/favicon.ico', $icoMs.ToArray())
$bw.Dispose()
$icoMs.Dispose()

Copy-Item -Force 'assets/favicon.ico' 'dist/favicon.ico'
Copy-Item -Force 'assets/favicon.ico' 'dist/assets/favicon.ico'
Write-Output "Saved multi-resolution (48, 32, 16) assets/favicon.ico and dist/"

# ============================================================
# TASK 4: OpenGraph & Twitter Social Preview on Solid White Background
# ============================================================
Write-Output "`nProcessing Social Share Preview (og:image)..."
$ogSrc = [System.Drawing.Bitmap]::FromFile($fileOg.FullName)
Write-Output "OG source logo size: $($ogSrc.Width) x $($ogSrc.Height)"

$ogWidth = 1200
$ogHeight = 630
$ogCanvas = New-Object System.Drawing.Bitmap($ogWidth, $ogHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$ogG = [System.Drawing.Graphics]::FromImage($ogCanvas)
$ogG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$ogG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$ogG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$ogG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Pure white background as requested: "на белом фоне а не старое"
$ogG.Clear([System.Drawing.Color]::White)

# Fit logo centered horizontally & vertically: width 920px (generous readable display)
$targetLogoW = 920
$targetScale = $targetLogoW / $ogSrc.Width
$targetLogoH = [int]($ogSrc.Height * $targetScale)
$logoX = [int](($ogWidth - $targetLogoW) / 2)
$logoY = [int](($ogHeight - $targetLogoH) / 2)

$ogG.DrawImage($ogSrc, $logoX, $logoY, $targetLogoW, $targetLogoH)
$ogG.Dispose()

# Save as JPEG with 95% quality for fast and crisp social media loading
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 95L)

$ogCanvas.Save('assets/og-image.jpg', $jpegEncoder, $encoderParams)
$ogCanvas.Save('assets/og-image.png', [System.Drawing.Imaging.ImageFormat]::Png)
$ogCanvas.Dispose()
$ogSrc.Dispose()

Copy-Item -Force 'assets/og-image.jpg' 'dist/og-image.jpg'
Copy-Item -Force 'assets/og-image.jpg' 'dist/assets/og-image.jpg'
Copy-Item -Force 'assets/og-image.png' 'dist/assets/og-image.png'
Write-Output "Saved 1200x630 assets/og-image.jpg and dist/ on solid white background"

Write-Output "`nAll image assets processed successfully!"
