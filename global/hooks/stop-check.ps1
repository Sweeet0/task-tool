# Stop フック
# コードに変更があるのに PROGRESS.md が更新されていなければ、1セッションにつき1回だけ AI に知らせる。
# 毎ターン止めると煩わしいので、セッションIDごとにフラグを立てて2回目以降は何もしない。

$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw  = [Console]::In.ReadToEnd()
$data = $raw | ConvertFrom-Json

# 無限ループ防止
if ($data.stop_hook_active) { exit 0 }

$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
Set-Location $root

# この仕組みを使っていないプロジェクトでは何もしない
if (-not (Test-Path (Join-Path $root 'docs/PROGRESS.md'))) { exit 0 }

git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) { exit 0 }

$changes = @(git status --porcelain)
if ($changes.Count -eq 0) { exit 0 }

$codeChanged     = @($changes | Where-Object { $_ -notmatch 'docs/' })
$progressChanged = @($changes | Where-Object { $_ -match 'docs/PROGRESS.md' })
if ($codeChanged.Count -eq 0 -or $progressChanged.Count -gt 0) { exit 0 }

$stateDir = Join-Path $root '.claude/.state'
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$flag = Join-Path $stateDir ("reminded-" + $data.session_id)
if (Test-Path $flag) { exit 0 }
New-Item -ItemType File -Path $flag | Out-Null

$reason = 'コードに変更がありますが docs/PROGRESS.md が未更新です。作業の区切りなら、ユーザーに「/wrap で締めますか？」と一行だけ提案してください。まだ作業が続くなら何もせず続けてください。'
@{ decision = 'block'; reason = $reason } | ConvertTo-Json -Compress | Write-Output
exit 0
