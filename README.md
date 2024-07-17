# 都道府県別人口推移グラフ表示アプリケーション

## 概要

このプロジェクトは、[株式会社ゆめみ](https://www.yumemi.co.jp/)のフロントエンドコーディング試験として開発された、都道府県別の総人口推移グラフを表示するSPA（Single Page Application）です。

**総開発時間: 60時間程度**

## 主な機能

- 都道府県の選択
- 選択した都道府県の人口推移グラフ表示
- 複数都道府県の同時比較
- 人口カテゴリー (総人口、年少人口、生産年齢人口、老年人口) の選択と表示

## 技術スタック

- [React](https://reactjs.org/) (v18.3.1) - UIライブラリ
- [TypeScript](https://www.typescriptlang.org/) (v5.2.2) - 静的型付け言語
- [Vite](https://vitejs.dev/) (v5.3.1) - 開発環境とビルドツール
- [Axios](https://axios-http.com/) (v1.7.2) - HTTPクライアント
- [Recharts](https://recharts.org/) (v2.12.7) - グラフライブラリ
- [Jest](https://jestjs.io/) (v29.7.0) - テストフレームワーク
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (v16.0.0) - Reactコンポーネントのテスト

## 開発環境のセットアップ

1. リポジトリをクローン:
   ```bash
   git clone https://github.com/Ojoxux/yumemi_intern_assignment.git
   ```

2. プロジェクトディレクトリに移動：
   ```bash
   cd yumemi_intern_assignment
   ```

3. 依存関係のインストール：
   ```bash
   npm install
   ```

4. 開発サーバーの起動：
   ```bash
   npm run dev
   ```

5. ブラウザで表示されたローカルホストのURLを開いてアプリケーションにアクセス（通常は http://localhost:5173）

## テスト

テストを実行するには以下のコマンドを使用：

```bash
npm test
```

## テストカバレッジの確認

テストカバレッジを実行するには以下のコマンドを使用：

```bash
npm run test:coverage
```

このコマンドを実行すると、テストカバレッジレポートが生成されます。コンソールにサマリーが表示されるほか、詳細なレポートはプロジェクトルートの `coverage` ディレクトリ内にHTML形式で生成されます。
ブラウザで `coverage/lcov-report/index.html` を開くと、より詳細なカバレッジ情報を確認できます。

## ビルドとデプロイ

プロダクションビルドの作成：

```bash
npm run build
```

## デプロイ

このアプリケーションは、[Vercel](https://vercel.com/)にデプロイされています。
デプロイされたWebサイトは、以下のURLから確認できます。
<https://yumemi-intern-assignment.vercel.app/>

## 開発プロセスの反省と学び

このプロジェクトを通じて、以下の点で改善の余地があることに気づきました：

1. **コミット管理**
   - 作業後のコミットを忘れることがあった
   - 改善策：作業の区切りごとに定期的なコミットを心がける

2. **ブランチ管理**
   - ブランチ名と編集内容の不一致
   - 誤ったブランチへのプッシュ
   - 不適切なブランチでの作業とマージ
   - 改善策：
     - 作業前にブランチを確認し、適切な名前で新しいブランチを作成する
     - 誤ってプッシュした場合は `git cherry-pick` を活用して修正する

3. **プルリクエスト管理**
   - ベースブランチの選択ミス
   - 改善策：プルリクエスト作成時に必ずベースブランチを確認する

4. **同期とデプロイ**
   - リモートブランチとの同期不足によるデプロイエラー
   - 改善策：新たな作業を始める前に必ず `git fetch` や `git pull` を実行し、最新の状態を維持する

これらの経験から、Git の基本的な操作とワークフローの重要性を再認識しました。今後のプロジェクトでは、これらの点に特に注意を払い、より効率的で確実な開発プロセスを目指します。