# Convert AcadEng_Vocabulary.xlsx -> data/vocabulary.js
# Output is a JavaScript file (not JSON) so that the static web app can load it
# via <script> tag without hitting CORS restrictions when opened from file://.

$ErrorActionPreference = 'Stop'

$scriptDir  = $PSScriptRoot
$excelPath  = (Resolve-Path (Join-Path $scriptDir '..\..\AcadEng_Vocabulary.xlsx')).Path
$dataDir    = (Resolve-Path (Join-Path $scriptDir '..\data')).Path
$outputPath = Join-Path $dataDir 'vocabulary.js'

$skillNames = @{
    'R' = 'Reading'
    'L' = 'Listening'
    'W' = 'Writing'
    'S' = 'Speaking'
}

function ConvertTo-Slug {
    param([string]$Name)
    $ascii = ($Name -replace '[^a-zA-Z0-9]', '')
    if ($ascii.Length -eq 0) {
        $md5  = [System.Security.Cryptography.MD5]::Create()
        $hash = [BitConverter]::ToString($md5.ComputeHash([Text.Encoding]::UTF8.GetBytes($Name))).Replace('-','').Substring(0, 8).ToLower()
        return "cat-$hash"
    }
    return $ascii.ToLower()
}

Write-Output "Opening $excelPath ..."
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $null

try {
    $wb = $excel.Workbooks.Open($excelPath, $false, $true)  # read-only

    $sheets = New-Object System.Collections.ArrayList
    foreach ($ws in $wb.Worksheets) {
        $sheetName = $ws.Name
        # Match e.g. "R<japanese>1" without embedding Japanese chars in source
        # (PS 5.1 reads .ps1 in system codepage, which can mangle non-ASCII).
        $match = [regex]::Match($sheetName, '^([RLWS]).+?(\d+)$')
        if (-not $match.Success) {
            Write-Warning "Skipping non-matching sheet: $sheetName"
            continue
        }
        $skill      = $match.Groups[1].Value
        $testNumber = [int]$match.Groups[2].Value
        $sheetId    = "$skill$testNumber"

        $used   = $ws.UsedRange
        $maxRow = $used.Rows.Count
        $maxCol = $used.Columns.Count

        $categories = New-Object System.Collections.ArrayList

        # Category headers sit in row 1, columns 2, 5, 8, 11, 14, ... (step 3)
        # In data rows: column c = English, column c+1 = Japanese
        for ($c = 2; $c -le $maxCol; $c += 3) {
            $rawCat = $ws.Cells.Item(1, $c).Value2
            if ($null -eq $rawCat) { continue }
            $catName = ([string]$rawCat).Trim()
            if ($catName.Length -eq 0) { continue }

            $slug  = ConvertTo-Slug $catName
            $words = New-Object System.Collections.ArrayList
            $idx   = 1

            for ($r = 2; $r -le $maxRow; $r++) {
                $rawEn = $ws.Cells.Item($r, $c).Value2
                if ($null -eq $rawEn) { continue }
                $en = ([string]$rawEn).Trim()
                if ($en.Length -eq 0) { continue }

                $rawJa = $ws.Cells.Item($r, $c + 1).Value2
                $ja = if ($null -ne $rawJa) { ([string]$rawJa).Trim() } else { '' }

                $wordId = '{0}-{1}-{2:D3}' -f $sheetId, $slug, $idx
                [void]$words.Add([ordered]@{
                    id = $wordId
                    en = $en
                    ja = $ja
                })
                $idx++
            }

            if ($words.Count -eq 0) { continue }

            [void]$categories.Add([ordered]@{
                id    = "$sheetId-$slug"
                name  = $catName
                words = @($words)
            })
        }

        [void]$sheets.Add([ordered]@{
            id          = $sheetId
            skill       = $skill
            skillName   = $skillNames[$skill]
            testNumber  = $testNumber
            sheetName   = $sheetName
            categories  = @($categories)
        })
    }

    $output = [ordered]@{
        generatedAt = (Get-Date).ToString('o')
        source      = 'AcadEng_Vocabulary.xlsx'
        sheets      = @($sheets)
    }

    $json = $output | ConvertTo-Json -Depth 12 -Compress:$false
    $js   = "window.VOCAB_DATA = $json;`r`n"

    # UTF-8 without BOM
    $utf8 = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($outputPath, $js, $utf8)

    Write-Output ''
    Write-Output '=== Summary ==='
    $totalWords = 0
    foreach ($s in $sheets) {
        $sheetWords = 0
        foreach ($cat in $s.categories) { $sheetWords += $cat.words.Count }
        $totalWords += $sheetWords
        Write-Output ('Sheet {0,-3} ({1}): {2,2} categories, {3,4} words' -f $s.id, $s.sheetName, $s.categories.Count, $sheetWords)
    }
    Write-Output "TOTAL: $totalWords words across $($sheets.Count) sheets"
    Write-Output "Output written to: $outputPath"
}
finally {
    if ($wb)    { $wb.Close($false) | Out-Null }
    if ($excel) { $excel.Quit() }
    if ($excel) { [void][System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
