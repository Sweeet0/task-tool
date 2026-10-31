# PROGRESS

## 現在地
ステップ0.5「作業環境づくり」— 配置・git初期化・フック確認まで完了（内訳 3/4）

## 前回やったこと（2026-10-31）
- global/ を ~/.claude/ に配置（skills/hooks/agents/templates、衝突なし）
- settings.json の hooks にマージ（既存設定は維持）
- フック確認：$HOME展開OK・日本語OK（BOM付きUTF-8）・SessionStart/Stop OK・Notificationはエラーなく実行（表示は目視未確認）
- git init、初回コミット

## 次の一手
新しいセッションで `/resume` と `/wrap` を一度ずつ試す → 0.5完了 → ステップ1（データ設計）へ

## 未決事項
- データの置き場所（ステップ1で決める）
- 技術構成（ステップ2で決める）
- Notificationの通知がPC画面に実際に出るか（目視確認待ち）
