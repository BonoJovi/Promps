# フロントエンドテストインデックス

このドキュメントは、JavaScriptで実装されたフロントエンドテストの完全なインデックスです。

**最終更新**: 2026-02-18
**総テスト数**: 190件

---

## 目次

- [blockly-config.test.js](#blockly-configtestjs)
- [main.test.js](#maintestjs)
- [project-manager.test.js](#project-managertestjs)
- [validation-ui.test.js](#validation-uitestjs)
- [i18n.test.js](#i18ntestjs)

---

## blockly-config.test.js

Blockly.jsのブロック定義、DSL生成ロジック、ワークスペース構成のテスト。

**ファイル**: `res/tests/blockly-config.test.js`

### テストスイート構成

| スイート名 | 説明 |
|-----------|------|
| Promps Noun Block | 名詞ブロックの定義とDSL生成 |
| Workspace Code Generation | ワークスペース全体のコード生成 |
| Promps Other Block | その他ブロックの定義とDSL生成 |
| Mixed Block Types | 複数ブロックタイプの組み合わせ |
| Blockly Change Event Handling | イベントハンドリング |
| Particle Blocks (Phase 2) | 助詞ブロックの動作確認 |
| Verb Blocks (Phase 3) | 動詞ブロックの動作確認 |
| Newline Blocks (Phase 3) | 改行ブロックの動作確認 |
| Toolbox Configuration | ツールボックス構成テスト |

### 主なテスト領域

**名詞ブロック**: ブロック定義構造、DSLコード生成、日本語テキスト処理、空テキスト/複数語のエッジケース

**助詞ブロック**: 全9種類の助詞（が、を、に、で、と、へ、から、まで、より）、プレフィックス検証、文章生成パターン

**動詞ブロック**: 固定動詞ブロック（分析して、要約して、翻訳して）、カスタム動詞入力、DSL生成

**ツールボックス**: カテゴリー構成、ブロック順序、カテゴリー名

---

## main.test.js

UI操作、プレビュー更新、Tauriコマンド統合のテスト。

**ファイル**: `res/tests/main.test.js`

### テストスイート構成

| スイート名 | 説明 |
|-----------|------|
| updatePreview function | プレビュー更新ロジック |
| Preview pane updates | プレビューパネルの表示 |
| Error handling | Tauriエラーハンドリング |
| Event handling | DOMイベント処理 |

### 主なテスト領域

**プレビュー更新**: Tauri invoke呼び出し、空/空白入力の処理、生成プロンプトの表示

**日本語サポート**: プレビューでの日本語文字の保持

**エラー処理**: Tauriコマンドエラーのリカバリ、コンソールログ、不正入力でのクラッシュ防止

---

## project-manager.test.js

プロジェクト永続化のテスト：保存、読込、新規プロジェクト操作。

**ファイル**: `res/tests/project-manager.test.js`

### 主なテスト領域

**保存/読込**: ラウンドトリップのシリアライゼーション、ファイルパス処理、タイムスタンプ更新

**新規プロジェクト**: デフォルト状態の初期化、未保存変更の検出

**ファイルダイアログ**: Tauriとのオープン/保存ダイアログ統合

---

## validation-ui.test.js

検証結果表示、ブロックハイライト、自動修正機能のテスト。

**ファイル**: `res/tests/validation-ui.test.js`

### 主なテスト領域

**結果表示**: エラー/警告メッセージの描画、ステータスインジケーター（緑/赤/黄）

**ブロックハイライト**: エラーブロックのハイライト、修正時のクリア

**自動修正 (AutoFix)**: 自動ブロック挿入、修正後の検証再実行

---

## i18n.test.js

国際化（日本語/英語の言語切替）のテスト。

**ファイル**: `res/tests/i18n.test.js`

### 主なテスト領域

**翻訳**: キー検索、フォールバック動作、欠落キーの処理

**言語切替**: 日本語↔英語のトグル、UIラベル更新、ブロックラベル更新

**永続化**: 言語設定のlocalStorageへの保存

---

## テスト実行方法

### 全フロントエンドテスト

```bash
cd res/tests
npm test
```

### 特定ファイルのみ

```bash
npm test blockly-config.test.js
npm test main.test.js
npm test project-manager.test.js
npm test validation-ui.test.js
npm test i18n.test.js
```

### ウォッチモード

```bash
npm test -- --watch
```

---

## テストカバレッジ

| カテゴリー | 対象範囲 |
|-----------|---------|
| ブロック定義 | 名詞、助詞、動詞、句読点、その他ブロック |
| DSL生成 | 単一ブロック、複数ブロック、混合タイプ |
| ワークスペース | コード生成、空ワークスペース |
| イベント | 変更イベント、UIイベント |
| プレビュー | 更新ロジック、プレースホルダー、日本語テキスト |
| エラー処理 | Tauriエラー、不正入力 |
| プロジェクト永続化 | 保存、読込、新規プロジェクト |
| 検証UI | エラー表示、ブロックハイライト、自動修正 |
| i18n | 翻訳、言語切替 |

**合計**: 190件（100%合格）

---

## 関連ドキュメント

- [テスト概要](./TEST_OVERVIEW.md) - テスト戦略の全体像
- [ユーザーガイド（日本語）](../../user/ja/USER_GUIDE.md) - 基本操作
- [User Guide (English)](../../user/en/USER_GUIDE.md) - 基本操作（英語版）
