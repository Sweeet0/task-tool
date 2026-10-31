# Notification フック
# Claude Code が確認待ち・入力待ちになったら Windows の通知を出す。
# 別のことをしていても、待たせていることに気づけるようにする。

$ErrorActionPreference = 'SilentlyContinue'

$raw  = [Console]::In.ReadToEnd()
$data = $raw | ConvertFrom-Json
$msg  = if ($data.message) { [string]$data.message } else { 'Claude Code が待っています' }

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$n = New-Object System.Windows.Forms.NotifyIcon
$n.Icon = [System.Drawing.SystemIcons]::Information
$n.BalloonTipTitle = 'Claude Code'
$n.BalloonTipText  = $msg
$n.Visible = $true
$n.ShowBalloonTip(5000)
Start-Sleep -Seconds 6
$n.Dispose()
exit 0
