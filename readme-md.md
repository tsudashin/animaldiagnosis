# 性格診断アプリ - セットアップガイド

## 📋 プロジェクト構造

```
personality-diagnosis/
├── src/
│   ├── components/
│   │   └── PersonalityDiagnosis.tsx    # メインコンポーネント
│   ├── data/
│   │   ├── archetypes.ts               # 60種類のアーキタイプデータ
│   │   └── questions.ts                # 質問データ（axis/direction定義）
│   ├── lib/
│   │   ├── scoring.ts                  # スコアリングロジック
│   │   └── diagnosis.ts                # 診断ロジック
│   ├── types/
│   │   └── index.ts                    # 型定義
│   └── App.tsx                         # エントリーポイント
├── package.json                        # 依存関係
└── README.md                           # このファイル
```

## 🚀 セットアップ手順（初心者向け）

### ステップ1: Node.jsのインストール

1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTS版（推奨版）をダウンロードしてインストール
3. インストール完了後、ターミナル（コマンドプロンプト）を開いて確認:
   ```bash
   node --version
   npm --version
   ```

### ステップ2: プロジェクトの作成

1. ターミナルで作業したいフォルダに移動:
   ```bash
   cd Desktop
   ```

2. Vite + Reactプロジェクトを作成:
   ```bash
   npm create vite@latest personality-diagnosis -- --template react-ts
   ```

3. プロジェクトフォルダに移動:
   ```bash
   cd personality-diagnosis
   ```

### ステップ3: ファイルの配置

以下のファイルを指定の場所に配置してください:

1. **src/types/index.ts** - 型定義ファイル
2. **src/data/archetypes.ts** - アーキタイプデータ
3. **src/data/questions.ts** - 質問データ
4. **src/lib/scoring.ts** - スコアリングロジック
5. **src/lib/diagnosis.ts** - 診断ロジック
6. **src/components/PersonalityDiagnosis.tsx** - メインコンポーネント
7. **src/App.tsx** - エントリーポイント（既存ファイルを置き換え）

### ステップ4: 依存関係のインストール

ターミナルで以下を実行:

```bash
npm install
npm install lucide-react
```

### ステップ5: Tailwind CSSの設定

1. Tailwind CSSをインストール:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **tailwind.config.js** を以下の内容に置き換え:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **src/index.css** を以下の内容に置き換え:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### ステップ6: アプリの起動

ターミナルで以下を実行:

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くと診断アプリが表示されます！

## 🎯 システムAの仕組み

### アルゴリズムの流れ

1. **質問への回答**
   - ユーザーが36問の質問に7段階（-3〜+3）で回答

2. **6軸スコアの計算**
   - 各質問は特定の軸（EX, TF, LD, IN, MP, SP）に紐付いている
   - 回答値 × 方向性（1 or -1）で各軸のスコアを計算
   - 各軸を平均化し、-1〜+1の範囲に正規化

3. **コサイン類似度の計算**
   - ユーザーの6軸ベクトルと60種類のアーキタイプ座標との類似度を計算
   - 類似度 = 内積 / (ベクトルの大きさの積)

4. **最適タイプの選定**
   - 類似度が最も高いアーキタイプをトップマッチとして返す
   - 上位3候補も表示

### 6軸の意味

- **EX**: 外向性（Extroversion） - 社交的 ↔ 内向的
- **TF**: 思考・感情（Thinking-Feeling） - 論理的 ↔ 感情的
- **LD**: 主導性（Leadership-Dominance） - リーダー気質 ↔ 協調的
- **IN**: 直感性（Intuition） - 直感的 ↔ 慎重
- **MP**: マイペース（My Pace） - マイペース ↔ ルール重視
- **SP**: スピード（Speed） - 行動派 ↔ 熟考派

## 🔧 カスタマイズ方法

### 質問を変更したい場合

`src/data/questions.ts` を編集してください。各質問には以下が必要です:

```typescript
{
  text: '質問文',
  axis: 'EX' | 'TF' | 'LD' | 'IN' | 'MP' | 'SP',  // どの軸か
  direction: 1 | -1  // 1=肯定で軸が増加、-1=肯定で軸が減少
}
```

### アーキタイプを変更したい場合

`src/data/archetypes.ts` を編集してください。各アーキタイプには以下が必要です:

```typescript
{
  id: 'タイプ名',
  centroid: {
    EX: 数値,  // -1〜+1の範囲
    TF: 数値,
    LD: 数値,
    IN: 数値,
    MP: 数値,
    SP: 数値
  }
}
```

## 🐛 デバッグ機能

診断結果画面で「デバッグ情報を表示」ボタンをクリックすると、以下が確認できます:

- ユーザーの6軸スコア（正規化後）
- トップマッチのアーキタイプ座標
- コサイン類似度の詳細（上位5件）

これにより、診断ロジックが正しく動作しているか確認できます。

## 📦 本番環境へのデプロイ

### ビルド

```bash
npm run build
```

`dist/` フォルダに本番用ファイルが生成されます。

### デプロイ先の例

- **Vercel**: [vercel.com](https://vercel.com) - 無料、簡単
- **Netlify**: [netlify.com](https://netlify.com) - 無料、簡単
- **GitHub Pages**: GitHubリポジトリから直接公開

## ❓ トラブルシューティング

### Q: `npm install` でエラーが出る
A: Node.jsのバージョンを確認してください。v16以上が必要です。

### Q: 画面が真っ白になる
A: ブラウザの開発者ツール（F12）でエラーを確認してください。

### Q: Tailwind CSSのスタイルが効かない
A: `tailwind.config.js` と `src/index.css` の設定を確認してください。

### Q: 診断結果が正しくない
A: デバッグ情報を表示して、スコア計算を確認してください。

## 📞 サポート

問題が解決しない場合は、以下を確認してください:

1. すべてのファイルが正しい場所に配置されているか
2. `npm install` が正常に完了しているか
3. ブラウザのコンソールにエラーが出ていないか

## 🎉 完成！

これで性格診断アプリの実装は完了です。診断を楽しんでください！