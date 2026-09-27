# Renders tools/ogp/ogp.html to assets/img/ogp.png (1200x630) with headless Edge.
# Usage: powershell -ExecutionPolicy Bypass -File tools\ogp\make-ogp.ps1
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$html = Join-Path $PSScriptRoot 'ogp.html'
$out  = Join-Path $root 'assets\img\ogp.png'
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$url  = 'file:///' + ($html -replace '\\', '/')

$p = Start-Process $edge -Wait -PassThru -ArgumentList @(
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1200,630', '--virtual-time-budget=8000',
  "--user-data-dir=$env:TEMP\tenrakuhai-ogp-edge",
  "--screenshot=$out", $url)
if (Test-Path $out) { Write-Host "wrote $out" } else { Write-Error "screenshot failed (exit $($p.ExitCode))" }
