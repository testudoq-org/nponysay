# PowerShell Script: Move files marked -Archive in for-archive-list.md to archive folder

$baseDir = "ponysay-node"
$archiveDir = "$baseDir\archive"
$archiveList = "$baseDir\for-archive-list.md"

# Ensure archive folder exists
if (!(Test-Path $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir | Out-Null
}

$moved = @()
$warnings = @()

# Read and process the archive list
Get-Content $archiveList | ForEach-Object {
    $line = $_.Trim()
    if ($line -match "^-?[\s`]*[`']?(.+?)['`']?[\s`]+— Archive") {
        # Extract filename (between backticks or at start of line)
        $fileMatch = $line -replace "^-?[\s`]*[`']?(.+?)['`']?[\s`]+— Archive.*$", '$1'
        $filePath = Join-Path $baseDir $fileMatch

        # Skip if already in archive folder
        if ($filePath -like "$archiveDir*") { return }

        if (Test-Path $filePath) {
            $destPath = Join-Path $archiveDir (Split-Path $fileMatch -Leaf)
            if (!(Test-Path $destPath)) {
                Move-Item $filePath $destPath
                $moved += "$fileMatch -> archive\$($fileMatch -replace '^.*\\')"
            } else {
                $warnings += "Warning: $fileMatch already exists in archive"
            }
        } else {
            $warnings += "Warning: $fileMatch not found"
        }
    }
}

# Output summary
Write-Host "Moved files:"
$moved | ForEach-Object { Write-Host $_ }
Write-Host ""
Write-Host "Warnings:"
$warnings | ForEach-Object { Write-Host $_ }