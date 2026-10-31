# セットアップ手順

## 中身
| フォルダ | 置き場所 | 内容 |
|---|---|---|
| `global/` | `%USERPROFILE%\.claude\` | 全プロジェクト共通のスキル・フック・エージェント・雛形 |
| `task-tool/` | 好きな場所（例 `C:\dev\task-tool`） | タスク管理ツールのプロジェクト本体 |

`global/` を共通の場所に置くので、ゲーム制作など他のプロジェクトでもそのまま使えます。

## 手順（自分でやるのは1と2だけ）

1. zipを展開し、`task-tool` フォルダを好きな場所に置く
2. そのフォルダでClaude Codeを起動し、`global` フォルダの場所を書き換えて下の依頼文を貼る

```
このフォルダは新規プロジェクトです。次を順にやって、最後に結果を短く報告してください。

1. 共通設定の配置
   「（展開した場所）\global」の中身を %USERPROFILE%\.claude\ に配置する。
   - skills / hooks / agents / templates はフォルダごとコピー（同名があれば上書き前に確認）
   - settings-hooks.json はコピーせず、%USERPROFILE%\.claude\settings.json の "hooks" に
     マージする（既存の設定は消さない）

2. フックの動作確認（このWindows環境で）
   - コマンド内の $HOME のパスが正しく展開されるか
   - .ps1 が日本語を含むため、文字化けしないか（必要ならUTF-8 BOM付きで保存し直す）
   - SessionStart：docs/PROGRESS.md の内容が読み込まれるか
   - Stop：stop_hook_active のときに止まらないか
   - Notification：Windowsの通知が出るか
   動かないものは、動くように修正してから次へ進む。

3. このフォルダで git init し、初回コミットする

4. /resume が使えるか確認し、docs/ROADMAP.md のステップ0.5の内訳と
   docs/PROGRESS.md を更新する
```

3. 報告を読んで、問題なければ完了。次からは `/resume` で始めて `/wrap` で終える

## 使えるもの
| 呼び方 | いつ使う |
|---|---|
| `/resume`（「再開して」でも可） | 始めるとき |
| `/wrap`（「今日はここまで」でも可） | 終わるとき |
| `/plan-step` | 新しいステップに入るとき |
| `/decide` | 何かを決めたとき |
| `/detour` | ロードマップにない作業が出てきたとき |
| `/kickoff` | 新しいプロジェクトを始める／止まったものを立て直すとき |

自動で動くもの（フック）
- 起動時：ROADMAPの現在地とPROGRESSを読み込む
- 終了時：コードを変えたのにPROGRESSが未更新なら、1回だけ締めを提案する
- 確認待ち：Windowsの通知を出す

頼めるエージェント
- `reviewer`：コミット前の確認（「reviewerで確認して」）
- `doc-keeper`：docsの整理（「doc-keeperでdocsを整えて」）

## 他のプロジェクトで使うとき
そのフォルダでClaude Codeを起動して `/kickoff` と言うだけ。雛形のコピーと確認リストから始まります。
既存のプロジェクト（ゲーム制作など）でも同じです。
