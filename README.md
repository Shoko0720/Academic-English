# Academic English Vocabulary - 学習アプリ

`AcadEng_Vocabulary.xlsx` の語彙データを使った、ブラウザだけで動く 4 択クイズ学習アプリです。
間隔反復学習（SRS）で、間違えた単語ほど多く出題されます。
PWA対応のため、ホーム画面に追加すればスマホでもアプリのように使えます。

## 使い方（PC）

1. **初回 (またはExcelを更新したとき) のみ**: PowerShell で語彙データを変換します。

   ```powershell
   .\scripts\convert-excel.ps1
   ```

   `data\vocabulary.js` が生成・上書きされます。
   実行には Microsoft Excel が必要です（COM自動化を利用）。

2. `index.html` をダブルクリックしてブラウザで開きます。

   - 学習履歴はブラウザの `localStorage` に保存されます。
   - 別のブラウザ／別のPCでは履歴は引き継がれません。

## 使い方（スマホ）

GitHub Pages などに公開した URL をスマホのブラウザで開き、ホーム画面に追加します。

### Android (Chrome / Edge / Samsung Internet)
1. 公開URLをChromeで開く
2. アドレスバー右の「インストール」アイコン、または右上メニュー (⋮) → 「アプリをインストール」 をタップ
3. ホーム画面/アプリ一覧にアイコンが追加される
4. アイコンタップで **アドレスバーなしのフルスクリーン** で起動

Chrome は PWA インストール後にストレージを `persistent` 扱いに昇格させるため、学習履歴は長期に保持されます（手動削除/アプリのアンインストールを除く）。

## GitHub Pages へのデプロイ手順

1. GitHub で新規リポジトリを作成（README/.gitignore は自動生成しない）
2. このフォルダ (`vocab-app/`) で:

   ```powershell
   git init -b main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<USERNAME>/<REPO>.git
   git push -u origin main
   ```

3. リポジトリの `Settings` → `Pages` で:
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
4. 1-2分後に `https://<USERNAME>.github.io/<REPO>/` でアクセス可能

## 機能

- **4択クイズ**: 英→日、日→英、ランダムから選択
- **間隔反復学習 (SRS)**: SM-2 を簡略化したアルゴリズムで、正解した単語は出題間隔が伸び、不正解の単語はすぐに再出題されます
- **シート/カテゴリ別学習**: 9シート (R1-3, L1-3, W1-2, S1) × 各カテゴリ単位での学習
- **進捗の永続化**: ブラウザを閉じても次回も復習対象が引き継がれます
- **統計画面**: 累計正解率・学習日数・苦手単語TOP20・直近14日の活動
- **PWA対応**: ホーム画面追加でアプリ化、オフライン動作

## ファイル構成

```
vocab-app/
├── index.html                  エントリポイント (ダブルクリックで起動)
├── manifest.json               PWAマニフェスト
├── sw.js                       Service Worker (オフラインキャッシュ)
├── css/style.css
├── js/
│   ├── app.js                  画面遷移・初期化
│   ├── quiz.js                 4択クイズの生成
│   ├── srs.js                  間隔反復アルゴリズム
│   ├── storage.js              localStorage 読み書き
│   └── stats.js                統計計算
├── data/vocabulary.js          語彙データ (Excelから生成)
├── icons/                      PWAアイコン
└── scripts/
    └── convert-excel.ps1       Excel → vocabulary.js 変換
```

## データを更新したいとき

Excelの内容を変えた場合、または機能を更新した場合:

1. `.\scripts\convert-excel.ps1` を実行して `data/vocabulary.js` を再生成
2. `sw.js` の `CACHE_VERSION = 'v1'` を `'v2'` などに変更
   （これをしないと、既にPWAインストール済みの端末で古いキャッシュが残り続ける）
3. `git add -A && git commit -m "Update vocabulary" && git push`
4. 1-2分後、スマホでアプリを再起動すると新しい内容が反映される

## 学習記録のリセット

統計画面の最下部にある「学習記録をすべて削除」ボタンから可能です。
