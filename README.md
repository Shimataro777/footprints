# 聖書学習記録

React + Vite + Tailwind CSS で作られた、聖書通読・学び・聖句・疑問メモなどを記録するアプリです。
データは端末のブラウザ内(localStorage)に保存されます。

## 公開手順（GitHubのみで完結・おすすめ）

GitHub Pages と GitHub Actions を使うと、他のサービスを使わずGitHubだけで公開できます。
コマンド操作が不要な **方法A** と、コマンドを使う **方法B** があります。はじめての方は方法Aで。

---

## 方法A：ブラウザだけで公開する（コマンド不要）

### 1. zipを展開する

`bible-tracker.zip` を展開すると、`index.html` や `src` フォルダなどが出てきます。
**この中身を丸ごと**アップロードします（`bible-tracker` というフォルダごとではなく、その中身）。

### 2. GitHubでリポジトリを作る

1. GitHub にログインし、右上の「＋」→「New repository」
2. Repository name に `bible-tracker` と入力
3. **Public** を選ぶ（無料プランでは、Publicでないと公開機能が使えません）
4. 「Create repository」

### 3. ファイルをアップロードする

1. 作ったリポジトリの「uploading an existing file」（または「Add file」→「Upload files」）
2. 展開したファイル・フォルダをすべてドラッグ＆ドロップ
3. 下の「Commit changes」を押す

### 4. 自動公開の設定ファイルを置く（重要）

`.github` のように**ドットで始まるフォルダは、アップロードで抜け落ちることがあります。**
リポジトリの一覧に `.github` が見当たらない場合は、次の手順で作ってください。

1. 「Add file」→「Create new file」
2. ファイル名の欄に、次を**そのまま**入力します（`/` を打つとフォルダが作られます）

   ```
   .github/workflows/deploy.yml
   ```

3. 本文に、zipの中の `.github/workflows/deploy.yml` の中身をそのまま貼り付ける
4. 「Commit changes」

### 5. GitHub Pagesを有効にする（最初の1回だけ）

1. リポジトリの「Settings」→ 左メニューの「Pages」
2. 「Build and deployment」の「Source」を **「GitHub Actions」** に変更

> **ここで注意。**
> GitHubが「Static HTML」などのテンプレートをすすめてくることがありますが、**選ばないでください。**
> それらはビルドをしないため、画面が真っ白になります。
> このアプリは `src/App.jsx` をブラウザが読める形に変換（ビルド）してから公開する必要があります。
> Source を「GitHub Actions」にしたら、そのまま何も選ばずにこの画面を閉じて大丈夫です。
> 手順4で置いた `deploy.yml` が自動的に使われます。
>
> Actionsタブで動いているものの名前が **「Deploy to GitHub Pages」** ならば正解です。
> 「Deploy static content to Pages」になっていたら、テンプレートが使われています。
> `.github/workflows` の中の余計なファイルを削除し、`deploy.yml` だけにしてください。

### 6. 公開を待つ

「Actions」タブを開くと、ビルドが動いています。**緑のチェックがついたら公開完了**です（数分かかります）。
公開URLは `Settings → Pages` の上部に出ます。だいたい次の形です。

```
https://【あなたのユーザー名】.github.io/bible-tracker/
```

### 7. あとから中身を差し替えるとき

`src/App.jsx` を新しいものに入れ替えるだけです。

1. リポジトリで `src` → `App.jsx` を開く
2. 右上の鉛筆マーク（Edit）
3. 中身を全部消して、新しい `BibleTracker.jsx` の中身を貼り付ける
4. 「Commit changes」

保存すると自動で作り直され、数分後に公開ページが新しくなります。

---

## 方法B：コマンドで公開する

### 1. リポジトリを作ってpushする

1. GitHubで新しいリポジトリを作成（例: `bible-tracker`）
2. このフォルダの中身をすべてpush（`.github` フォルダも忘れずに）

```bash
cd bible-tracker
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/【あなたのユーザー名】/bible-tracker.git
git push -u origin main
```

### 2. GitHub Pagesを有効にする（最初の1回だけ）

1. リポジトリの「Settings」→ 左メニューの「Pages」を開く
2. 「Build and deployment」の「Source」を **「GitHub Actions」** に設定

以降は、コードを直して `git push` するだけで自動的に再ビルド・再公開されます。

---

## 公開してから

### iPhoneのホーム画面に追加する

1. 公開されたURLをiPhoneのSafariで開く
2. 共有ボタン → 「ホーム画面に追加」

ひつじのアイコンで追加され、通常のアプリと同じ感覚で使えます。
ブラウザの制約がなくなるため、バックアップのファイル保存も正常に動きます。

### 公開しても、記録は他人に見られません

GitHubで公開されるのは**アプリの仕組み（プログラム）だけ**です。
あなたが書いた記録は端末のブラウザの中だけに保存され、GitHubには一切送られません。

### うまくいかないときは

- **Actionsが赤くなる** … 「Actions」タブでエラー内容が見られます。`.github/workflows/deploy.yml` が正しい場所にあるか確認してください
- **404が出る** … Settings → Pages の Source が「GitHub Actions」になっているか確認。公開直後は数分かかります
- **古い画面のまま** … ブラウザの再読み込み（iPhoneなら一度ホーム画面のアイコンを削除して追加し直す）で直ります
- **真っ白で何も出ない** … 次の2つがよくある原因です
  1. `src` フォルダが入っていない（アプリの中身は `src/App.jsx` にあります）
  2. ビルドしないワークフローが使われている。Actionsタブの名前が「Deploy to GitHub Pages」か確認してください。
     実行時間が20秒ほどで終わっている場合はビルドされていません（正しく動けば1分前後かかります）

## ローカルで動作確認する場合

```bash
npm install
npm run dev
```

## データについて

- データは `localStorage` に保存されるため、**ブラウザ・端末ごとに別々**になります（Claude版のような自動同期はありません）
- ホーム画面のバックアップ機能から、定期的にデータ（JSON）を書き出して保管することをおすすめします
- Safariの「Webサイトのデータを消去」を行うとデータが消えるため注意してください
