# ① 上々 (jyoujyou) — 業務アプリ

飲食店「上々」の業務アプリ（買い物リスト・仕込み表・シフト・売上管理など）の単一HTML
ファイル（`index.html`）。Firebase Realtime Database（プロジェクト `jyoujyou-shop2`）と
リアルタイム同期する構成で、ビルド不要・そのまま公開して動く。

このフォルダ（`~/Desktop/jyoujyou`、GitHub `atsup0917-arch/jyoujyou`、branch `main`）が
**唯一の正規の作業コピー**。他の場所に古いコピーを作らない。

## 編集前に必ず

**`git fetch origin main` してから origin/main の内容を土台にする。** ローカルの
`git status` が "up to date" と出ていても、それは前回fetchした時点の情報でしかない。
過去に一度、fetch漏れで「本番とGitHubが食い違っている」と誤診断したことがある。

## 公開は指示があった時だけ

**GitHubへのpushも、Netlifyへのデプロイも、毎回ユーザーの明示的な指示があった時だけ行う。**
変更のたびに自動でpush/デプロイしない。

- **GitHub**: push すると GitHub Pages (`https://atsup0917-arch.github.io/jyoujyou/`) が
  自動で再ビルドされる。
- **Netlify**: サイト名 `jyoujyou`（サイトID `855743c2-1673-445c-82da-f5376e79959d`、
  URL `https://jyoujyou.netlify.app`）。**GitHub連携の自動デプロイはオフ**なので、
  push しただけでは反映されない。このフォルダで `netlify deploy --prod --dir=.` を
  実行する（Netlify CLIはこのMacで既にログイン済み、`.netlify/state.json`で
  サイトに紐付け済み）。Netlifyは無料枠のクレジットを気にしているため、GitHub pushより
  さらに一段階慎重に、明確な指示があった時だけ実行する。

## 他の似たリポジトリと絶対に混同しない

`atsup0917-arch` アカウントには見た目が似た複数のリポジトリがある：
- ② `kondo-shopping`（近藤家の別の買い物リストアプリ、Firebase `kondo-fcbf8`）
- ③ `isono`（イソノさんという別の方の店のアプリ、①をベースに作った別物、
  Firebase `isono-shop`）
- ④ `-jyoujyou-test`（確認用テストリポジトリ）

これらのHTMLファイルとこの①のファイルを取り違えて上書きしない。Firebase設定
（`firebaseConfig`/`databaseURL`/`projectId`）も同様に、他のプロジェクトのものと
混同しない。

## ⚠️ このファイルを他プロジェクトのひな形にする際の重大な注意

このファイルには上々の実際のスタッフ名・シフトデータ・仕込み原価カテゴリ・野菜発注
品目が複数箇所に直接埋め込まれており、**接続先のFirebaseデータベースが空だと自動的に
書き込まれる**（③イソノさんのアプリを作る際、実際にこれで実データが漏れた実例あり）。
このファイルを別のFirebaseプロジェクト向けにコピーする場合は、必ず以下を確認・除去
してから接続する：

- `<script id="shiftEmbeddedSepFirstDinnerData">` / `...LunchData">` — 実名入り
  シフトデータを丸ごと書き込むスクリプト。削除する。
- `SHIFT_ADD_DEFAULTS`、`staffAddReliableFix` 内の `LUNCH`/`DINNER` 定数、
  `DEFAULT_SHIFT_STAFF_NAMES` — いずれも実名入り。空配列にする。
- `shift/staffMap` のリアルタイム同期処理内の `staffMap['40']='梶野美瑠'` の
  ハードコード上書き。削除する。
- 野菜発注の既定品目配列（上々の実際の発注品目）。空にする。
- シフトの「番号と名前を保存」欄のplaceholder例文（実名）。一般的な例に差し替える。

（単位・仕込みコストカテゴリ・調味料カテゴリなど、一般的な内容のものは残してよい）

詳細・経緯は memory の `jyoujyou-embedded-pii-landmine` を参照。

## 動作確認

変更後は可能な限り `python3 -m http.server` + ブラウザプレビューで実際に操作し、
コンソールエラーが増えていないこと・各タブ（買い物/開店閉店/仕込み表/シフト）が
正常に動くことを確認してから公開する。

変更履歴は `git log` を参照（このファイルには変更ログを書かない）。
