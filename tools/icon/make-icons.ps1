# Makes the smaller icon sizes from assets/icons/icon-512.png.
# The 512px icons are exported from the Figma design file
# (https://www.figma.com/design/k2YrF6xnDzHdsN1zL5bi1y):
#   icon-512.png          <- the adopted icon frame (node 5:2)
#   icon-maskable-512.png <- the Android safe-zone variant, content at 72% (node 7:2)
# Usage: powershell -ExecutionPolicy Bypass -File tools\icon\make-icons.ps1
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$dir  = Join-Path $root 'assets\icons'
$big  = Join-Path $dir 'icon-512.png'
if (-not (Test-Path $big)) { Write-Error "missing $big"; exit 1 }

Add-Type -AssemblyName System.Drawing
$src = [Drawing.Image]::FromFile($big)
# 192: Android, 180: iPhone home screen, 32: browser tab
foreach ($s in 192, 180, 32) {
  $bmp = New-Object Drawing.Bitmap $s, $s
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($src, 0, 0, $s, $s)
  $name = if ($s -eq 180) { 'apple-touch-icon.png' } else { "icon-$s.png" }
  $bmp.Save((Join-Path $dir $name), [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}
$src.Dispose()
Get-ChildItem $dir | % { Write-Host "$($_.Name) ($($_.Length) bytes)" }
