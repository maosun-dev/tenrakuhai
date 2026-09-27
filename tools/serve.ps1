# Minimal static file server for local testing.
# Usage: powershell -ExecutionPolicy Bypass -File tools\serve.ps1 [-Port 8000]
param([int]$Port = 8000)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.mp3'  = 'audio/mpeg'
  '.webp' = 'image/webp'
  '.png'  = 'image/png'
  '.ico'  = 'image/x-icon'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root"
Write-Host "Open http://localhost:$Port/ in your browser. Press Ctrl+C to stop."

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ($rel -eq '') { $rel = 'index.html' }
      $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
      if ($path.StartsWith($root) -and (Test-Path $path -PathType Leaf)) {
        $bytes = [IO.File]::ReadAllBytes($path)
        $ext = [IO.Path]::GetExtension($path).ToLower()
        $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
        $res.AddHeader('Accept-Ranges', 'bytes')
        $start = 0; $end = $bytes.Length - 1
        # Range requests let the browser seek and loop audio.
        $range = $ctx.Request.Headers['Range']
        if ($range -match '^bytes=(\d*)-(\d*)$') {
          if ($Matches[1] -ne '') { $start = [long]$Matches[1]; if ($Matches[2] -ne '') { $end = [Math]::Min([long]$Matches[2], $end) } }
          elseif ($Matches[2] -ne '') { $start = [Math]::Max(0, $bytes.Length - [long]$Matches[2]) }
          $res.StatusCode = 206
          $res.AddHeader('Content-Range', "bytes $start-$end/$($bytes.Length)")
        }
        $len = $end - $start + 1
        $res.ContentLength64 = $len
        $res.OutputStream.Write($bytes, $start, $len)
      } else {
        $res.StatusCode = 404
      }
    } catch {
      # The browser may cancel a request mid-transfer (e.g. while seeking audio); ignore.
    } finally {
      try { $res.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
}
