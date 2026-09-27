# Makes the iPhone app icon and launch (splash) images.
#   - App icon (1024x1024, no transparency - the App Store rejects icons with alpha):
#       uses tools/app/ios-icon-1024.png if present (export the Figma frame at 1024),
#       otherwise enlarges assets/icons/icon-512.png.
#   - Splash: plain game background color (#1a1745), 2732x2732.
# Usage: powershell -ExecutionPolicy Bypass -File tools\app\make-ios-assets.ps1
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$xc = Join-Path $root 'ios\App\App\Assets.xcassets'
Add-Type -AssemblyName System.Drawing

function Save-Rgb($img, $size, $path) {
  $bmp = New-Object Drawing.Bitmap $size, $size, ([Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([Drawing.Color]::FromArgb(0x1a, 0x17, 0x45))
  if ($img) { $g.DrawImage($img, 0, 0, $size, $size) }
  $bmp.Save($path, [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

$hi = Join-Path $PSScriptRoot 'ios-icon-1024.png'
$src = if (Test-Path $hi) { $hi } else { Join-Path $root 'assets\icons\icon-512.png' }
$img = [Drawing.Image]::FromFile($src)
Save-Rgb $img 1024 (Join-Path $xc 'AppIcon.appiconset\AppIcon-512@2x.png')
$img.Dispose()
Write-Host "app icon from $([IO.Path]::GetFileName($src))"

foreach ($n in 'splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png') {
  Save-Rgb $null 2732 (Join-Path $xc "Splash.imageset\$n")
}
Write-Host 'splash images: plain #1a1745'
