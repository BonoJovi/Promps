# フロントエンドテストインデックス

このドキュメントは、JavaScriptで実装されたフロントエンドテストの完全なインデックスです。

**最終更新**: 2025-12-06
**総テスト数**: 42件

---

## 目次

- [blockly-config.test.js](#blockly-configtestjs) - 30件
- [main.test.js](#maintestjs) - 12件

---

## blockly-config.test.js

Blockly.jsのブロック定義とDSL生成ロジックのテスト。

**ファイル**: `res/tests/blockly-config.test.js`
**テスト数**: 30件

### テストスイート構成

| スイート名 | テスト数 | 説明 | 実装ファイル | 行番号 |
|-----------|---------|------|------------|--------|
| Promps Noun Block | 5件 | 名詞ブロックの定義とDSL生成 | blockly-config.test.js | 23-115 |
| Workspace Code Generation | 2件 | ワークスペース全体のコード生成 | blockly-config.test.js | 117-139 |
| Promps Other Block | 5件 | その他ブロックの定義とDSL生成 | blockly-config.test.js | 141-231 |
| Mixed Block Types | 2件 | 複数ブロックタイプの組み合わせ | blockly-config.test.js | 233-277 |
| Blockly Change Event Handling | 2件 | イベントハンドリング | blockly-config.test.js | 279-291 |
| Particle Blocks (Phase 2) | 14件 | 助詞ブロックの動作確認 | blockly-config.test.js | 293-429 |

---

### Promps Noun Block (5件)

名詞ブロックの基本動作テスト。

**実装**: `res/tests/blockly-config.test.js` (行 23-115)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should have correct block definition structure | ブロック定義が正しい構造を持つ | init関数が存在 | 24-41 |
| 2 | should generate correct DSL code from noun block | DSL生成が正しい | `_N:User ` | 43-62 |
| 3 | should handle Japanese text in noun blocks | 日本語テキストを処理できる | `_N:ユーザー ` | 64-81 |
| 4 | should handle empty text field | 空テキストを処理できる | `_N: ` | 83-95 |
| 5 | should handle multi-word text | 複数語を処理できる | `_N:データベース テーブル ブロック ` | 97-114 |

---

### Workspace Code Generation (2件)

ワークスペース全体のコード生成テスト。

**実装**: `res/tests/blockly-config.test.js` (行 117-139)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should generate DSL from multiple noun blocks | 複数の名詞ブロックからDSL生成 | `_N:User _N:Order ` | 118-132 |
| 2 | should handle empty workspace | 空のワークスペースを処理 | `` (空文字列) | 134-138 |

---

### Promps Other Block (5件)

その他ブロック（助詞、動詞など）のテスト。

**実装**: `res/tests/blockly-config.test.js` (行 141-231)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should have correct block definition structure | ブロック定義が正しい構造を持つ | init関数が存在 | 142-158 |
| 2 | should generate correct DSL code from other block (particle) | 助詞のDSL生成 | `が ` | 160-178 |
| 3 | should generate correct DSL code from other block (verb) | 動詞のDSL生成 | `作成 ` | 180-197 |
| 4 | should handle various particle types | 複数の助詞タイプを処理 | 各助詞が正しく生成される | 199-215 |
| 5 | should not add _N: prefix for other blocks | _N:プレフィックスがないことを確認 | `を ` (プレフィックスなし) | 217-230 |

---

### Mixed Block Types (2件)

複数のブロックタイプを組み合わせたテスト。

**実装**: `res/tests/blockly-config.test.js` (行 233-277)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should generate DSL from mixed noun and other blocks | 名詞と助詞の混在 | `_N:User が _N:Order を 作成 ` | 234-254 |
| 2 | should handle complex sentence structure | 複雑な文章構造 | `_N:データベース の _N:テーブル を 定義 する ` | 256-276 |

---

### Blockly Change Event Handling (2件)

Blocklyのイベント処理テスト。

**実装**: `res/tests/blockly-config.test.js` (行 279-291)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should filter out UI events | UIイベントを除外 | shouldUpdate = false | 280-284 |
| 2 | should process non-UI events | 非UIイベントを処理 | shouldUpdate = true | 286-290 |

---

### Particle Blocks (Phase 2) (14件)

Phase 2で追加された助詞ブロックのテスト。

**実装**: `res/tests/blockly-config.test.js` (行 293-429)

#### 個別助詞テスト (9件)

| # | テスト名 | 助詞 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should generate correct DSL for が particle | が | `が ` | 299-302 |
| 2 | should generate correct DSL for を particle | を | `を ` | 304-307 |
| 3 | should generate correct DSL for に particle | に | `に ` | 309-312 |
| 4 | should generate correct DSL for で particle | で | `で ` | 314-317 |
| 5 | should generate correct DSL for と particle | と | `と ` | 319-322 |
| 6 | should generate correct DSL for へ particle | へ | `へ ` | 324-327 |
| 7 | should generate correct DSL for から particle | から | `から ` | 329-332 |
| 8 | should generate correct DSL for まで particle | まで | `まで ` | 334-337 |
| 9 | should generate correct DSL for より particle | より | `より ` | 339-342 |

#### 一括・統合テスト (5件)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 10 | should handle all 9 particle types | 全9種類の助詞を一括テスト | すべて正しく生成される | 344-351 |
| 11 | particle blocks should not have _N: prefix | _N:プレフィックスがないことを確認 | すべてプレフィックスなし | 353-360 |
| 12 | should generate complete sentence with particle blocks | 完全な文章生成 | `_N:User が _N:Order を 作成 ` | 362-384 |
| 13 | should generate sentence with から and まで particles | 範囲指定の文章 | `_N:Database から _N:Data まで 移行 ` | 386-406 |
| 14 | should generate sentence with と particle for conjunction | 並列の文章 | `_N:User と _N:Admin が 作成 ` | 408-428 |

---

## main.test.js

UI操作とプレビュー更新のテスト。

**ファイル**: `res/tests/main.test.js`
**テスト数**: 12件

### テストスイート構成

| スイート名 | テスト数 | 説明 | 実装ファイル | 行番号 |
|-----------|---------|------|------------|--------|
| updatePreview function | 5件 | プレビュー更新機能 | main.test.js | 30-78 |
| Preview pane updates | 4件 | プレビューパネルの表示 | main.test.js | 80-129 |
| Error handling | 3件 | エラーハンドリング | main.test.js | 131-166 |

---

### updatePreview function (5件)

プレビュー更新ロジックのテスト。

**実装**: `res/tests/main.test.js` (行 30-78)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should update preview pane with generated prompt | プレビューパネルが更新される | Tauri invoke が呼ばれる | 31-40 |
| 2 | should handle empty input | 空入力を処理 | プレースホルダー表示 | 42-50 |
| 3 | should handle whitespace-only input | 空白のみの入力を処理 | プレースホルダー表示 | 52-60 |
| 4 | should call Tauri command with correct input | 正しい引数でTauriコマンド呼び出し | `generate_prompt_from_text` が呼ばれる | 62-69 |
| 5 | should display generated prompt in preview | 生成されたプロンプトを表示 | HTML要素に表示される | 71-77 |

---

### Preview pane updates (4件)

プレビューパネルの表示動作テスト。

**実装**: `res/tests/main.test.js` (行 80-129)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should show placeholder when no input | 入力なしでプレースホルダー表示 | "ブロックを配置すると..." | 81-91 |
| 2 | should show generated text when input exists | 入力ありでテキスト表示 | 生成結果が表示される | 93-104 |
| 3 | should preserve Japanese characters | 日本語文字を保持 | `ユーザー (NOUN)` が表示 | 106-117 |
| 4 | should handle special characters | 特殊文字を処理 | 特殊文字が正しく表示される | 119-128 |

---

### Error handling (3件)

エラーハンドリングのテスト。

**実装**: `res/tests/main.test.js` (行 131-166)

| # | テスト名 | 説明 | 期待結果 | 行番号 |
|---|---------|------|---------|--------|
| 1 | should handle Tauri command errors gracefully | Tauriエラーを適切に処理 | プレースホルダー表示 | 132-144 |
| 2 | should log errors to console | エラーをコンソールにログ | console.error が呼ばれる | 146-155 |
| 3 | should not crash on invalid input | 不正な入力でクラッシュしない | エラーハンドリングされる | 157-165 |

---

## テスト実行方法

### 全テスト実行

```bash
cd res/tests
npm test
```

### 特定ファイルのみ実行

```bash
npm test blockly-config.test.js
npm test main.test.js
```

### ウォッチモード

```bash
npm test -- --watch
```

---

## テストカバレッジ

| カテゴリー | テスト数 | カバレッジ |
|-----------|---------|-----------|
| Blockly定義 | 10件 | ブロック定義、DSL生成 |
| 助詞ブロック | 14件 | 9種類の助詞 + 統合テスト |
| ワークスペース | 2件 | コード生成 |
| イベント処理 | 2件 | 変更イベント |
| UI更新 | 9件 | プレビューパネル更新 |
| エラー処理 | 3件 | エラーハンドリング |
| その他 | 2件 | 複雑な構造 |
| **合計** | **42件** | **100% passing** |

---

## 関連ドキュメント

- [TEST_OVERVIEW.md](./TEST_OVERVIEW.md) - テスト全体の概要
- [USER_GUIDE.md](../../ja/USER_GUIDE.md) - ユーザーガイド

---

**このドキュメントは Phase 2 時点のものです。今後のフェーズで内容が更新されます。**
