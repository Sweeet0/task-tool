# SessionStart フック
# セッション開始時に ROADMAP の現在地と PROGRESS.md を AI のコンテキストへ読み込ませる。
# （SessionStart では標準出力がそのままコンテキストに追加される）

$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
$roadmap  = Join-Path $root 'docs/ROADMAP.md'
$progress = Join-Path $root 'docs/PROGRESS.md'

# この仕組みを使っていないプロジェクトでは何もしない
if (-not (Test-Path $progress)) { exit 0 }

$out = @()
$out += '# 自動読み込み（SessionStartフック）'

if (Test-Path $roadmap) {
    $current = Select-String -Path $roadmap -Pattern '今ここ' -Encoding UTF8 | ForEach-Object { $_.Line }
    if ($current) {
        $out += ''
        $out += '## ROADMAP の現在地'
        $out += $current
    }
}

if (Test-Path $progress) {
    $out += ''
    $out += '## docs/PROGRESS.md'
    $out += (Get-Content $progress -Raw -Encoding UTF8)
}

$out += ''
$out += 'ユーザーの最初の発言が「再開」系、または特に依頼がない場合は、現在地・前回の続き・今日のゴール候補を3行で示すこと。'

Write-Output ($out -join "`n")
exit 0
