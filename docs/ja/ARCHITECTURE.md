# Promps アーキテクチャドキュメント

**バージョン**: Phase 0
**最終更新**: 2025-11-25
**対象読者**: 開発者、コントリビューター、AI アシスタント

---

## 概要

このドキュメントは、モジュール構造、データフロー、設計決定、進化パスを含む Promps Phase 0 のアーキテクチャ設計を説明します。

**コアコンセプト**: Promps は、簡素化された入力言語を AI 消費用の構造化プロンプトに翻訳する**コンパイラ的な DSL プロセッサ**です。

---

## 高レベルアーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                    Promps Phase 0                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────┐      ┌──────────────┐              │
│  │ フロントエンド │      │ バックエンド │              │
│  │  (Tauri UI)   │ IPC  │   (Rust)     │              │
│  │               │◄────►│              │              │
│  │  - HTML/CSS   │      │  - Parsing   │              │
│  │  - JavaScript │      │  - Generation│              │
│  └───────────────┘      └──────────────┘              │
│                                                         │
│         │                       │                      │
│         │                       ▼                      │
│         │              ┌─────────────────┐            │
│         │              │ コアライブラリ   │            │
│         │              │  (src/lib.rs)   │            │
│         │              │                 │            │
│         │              │  - PromptPart   │            │
│         │              │  - parse_input  │            │
│         │              │  - generate_    │            │
│         │              │    prompt       │            │
│         │              └─────────────────┘            │
│         │                                              │
│         ▼                                              │
│  ┌────────────┐                                       │
│  │ ユーザー    │                                       │
│  │ 対話       │                                       │
│  └────────────┘                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘

入力フロー:
ユーザー入力 → フロントエンド → Tauri IPC → バックエンドコマンド → コアライブラリ → 出力
```

---

## モジュール構造

### ディレクトリレイアウト

```
Promps/
├── src/                       # Rust ソースコード
│   ├── main.rs                # アプリケーションエントリーポイント（Tauri）
│   ├── lib.rs                 # コアライブラリ（パーシング、生成）
│   ├── commands.rs            # Tauri コマンド（IPC レイヤー）
│   └── modules/               #（将来）追加モジュール
│       └── mod.rs             # モジュール宣言
│
├── res/                       # フロントエンドリソース（Tauri）
│   ├── html/
│   │   └── index.html         # メイン UI
│   ├── js/
│   │   ├── main.js            # フロントエンドロジック
│   │   └── constants.js       #（将来）定数
│   └── css/
│       └── common.css         #（将来）スタイル
│
├── docs/                      # ドキュメント
│   ├── en/                    # 英語ドキュメント
│   ├── ja/                    # 日本語ドキュメント
│   └── README.md              # ドキュメントインデックス
│
├── Cargo.toml                 # Rust 依存関係
├── tauri.conf.json            # Tauri 設定
└── README.md                  # ユーザードキュメント
```

---

## コアコンポーネント

### 1. コアライブラリ (`src/lib.rs`)

**責務**: 純粋なパーシングと生成ロジック（I/O なし、UI なし）

**主要設計**: ライブラリは**フレームワーク非依存**で、以下で使用可能：
- CLI ツール
- GUI アプリケーション（Tauri）
- Web サービス
- テストフレームワーク

**モジュール**:

```rust
// データ構造
pub struct PromptPart {
    pub is_noun: bool,
    pub text: String,
}

// 公開 API
pub fn parse_input(input: &str) -> Vec<PromptPart>
pub fn generate_prompt(parts: &[PromptPart]) -> String

// 内部 API
impl PromptPart {
    pub fn from_token(token: &str) -> Self
}
```

**依存関係**:
- なし（Rust 標準ライブラリのみ）

**テスト**: 7 つのユニットテスト（公開 API の 100% カバレッジ）

---

### 2. Tauri コマンド (`src/commands.rs`)

**責務**: フロントエンド（JavaScript）とバックエンド（Rust）の橋渡し

**設計パターン**: コアライブラリの薄いラッパー

**コマンド**:

```rust
#[tauri::command]
pub fn generate_prompt_from_text(input: String) -> String
    ↓
呼び出し: parse_input() + generate_prompt()

#[tauri::command]
pub fn greet(name: String) -> String
    ↓
目的: Tauri IPC のヘルスチェック
```

**エラーハンドリング**: なし（Phase 0 - Phase N に延期）

**テスト**: 2 つのユニットテスト（コマンドレベルのテスト）

---

### 3. Tauri アプリケーション (`src/main.rs`)

**責務**: アプリケーションライフサイクル管理

**構造**:
```rust
mod commands;
mod modules;

use commands::{generate_prompt_from_text, greet};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            generate_prompt_from_text,
            greet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**依存関係**:
- `tauri`: デスクトップアプリケーションフレームワーク
- `commands`: Tauri コマンドモジュール

---

### 4. フロントエンド (HTML/JS)

**ステータス**: Phase 0 - 最小限の実装（基本的な Tauri ウィンドウ）

**将来（Phase 1）**:
- Blockly.js 統合
- ビジュアルブロックビルダー
- ドラッグアンドドロップインターフェース

**現在の構造**:
```
res/
├── html/
│   └── index.html      #（将来）メイン UI
├── js/
│   └── main.js         #（将来）フロントエンドロジック
└── css/
    └── common.css      #（将来）スタイル
```

---

## データフロー

### エンドツーエンドフロー（Tauri アプリケーション）

```
1. ユーザー入力（フロントエンド）
   │
   │ JavaScript: await invoke('generate_prompt_from_text', { input })
   ▼
2. Tauri IPC レイヤー
   │
   │ シリアル化: JavaScript String → Rust String
   ▼
3. バックエンドコマンド (src/commands.rs)
   │
   │ generate_prompt_from_text(input: String)
   ▼
4. コアライブラリ (src/lib.rs)
   │
   ├─► parse_input(&input)
   │    │
   │    ├─► 行で分割
   │    ├─► ダブルスペースで分割（文）
   │    ├─► シングルスペースで分割（トークン）
   │    ├─► _N: マーカーをスキャン
   │    └─► PromptPart ベクターを構築
   │
   └─► generate_prompt(&parts)
        │
        ├─► パーツを反復
        ├─► 各パーツをフォーマット（必要に応じて (NOUN) を追加）
        └─► フォーマット済み文字列を返す
   ▼
5. バックエンドコマンド（戻り値）
   │
   │ 戻り値: String
   ▼
6. Tauri IPC レイヤー
   │
   │ シリアル化: Rust String → JavaScript String
   ▼
7. フロントエンド（JavaScript）
   │
   │ 結果をユーザーに表示
   ▼
8. ユーザー出力
```

---

### パーシングフロー（詳細）

```
入力: "_N:User が _N:Order を 作成  説明文です"

parse_input() フロー:

1. 行で分割
   ↓
   ["_N:User が _N:Order を 作成  説明文です"]

2. ダブルスペースで分割
   ↓
   ["_N:User が _N:Order を 作成", "説明文です"]

3. 各文について:

   文 1: "_N:User が _N:Order を 作成"
   ├─► スペースで分割: ["_N:User", "が", "_N:Order", "を", "作成"]
   ├─► _N: をスキャン: トークン[0] と トークン[2] で発見
   ├─► has_noun = true
   ├─► テキストを再構築: "User が Order を 作成"
   └─► PromptPart { is_noun: true, text: "User が Order を 作成" }

   文 2: "説明文です"
   ├─► スペースで分割: ["説明文です"]
   ├─► _N: をスキャン: 見つからない
   ├─► has_noun = false
   ├─► テキストを再構築: "説明文です"
   └─► PromptPart { is_noun: false, text: "説明文です" }

4. ベクターを返す:
   ↓
   [
       PromptPart { is_noun: true, text: "User が Order を 作成" },
       PromptPart { is_noun: false, text: "説明文です" }
   ]
```

---

### 生成フロー（詳細）

```
入力: [
    PromptPart { is_noun: true, text: "User が Order を 作成" },
    PromptPart { is_noun: false, text: "説明文です" }
]

generate_prompt() フロー:

1. 出力を初期化: String::new()

2. パーツを反復:

   パート 1: is_noun = true
   ├─► 追加: "User が Order を 作成"
   ├─► 追加: " (NOUN)"
   └─► 追加: "\n"

   パート 2: is_noun = false
   ├─► 追加: "説明文です"
   └─► 追加: "\n"

3. 出力を返す:
   ↓
   "User が Order を 作成 (NOUN)\n説明文です\n"
```

---

## 設計決定

### 決定 1: ライブラリファーストアーキテクチャ

**問題**: CLI と GUI の両方の使用のためにコードを構造化する方法は？

**解決策**: コアロジックを `src/lib.rs`（ライブラリ）に、アプリケーション固有のコードを `src/main.rs` と `src/commands.rs` に配置。

**メリット**:
- ✅ アプリケーション間で再利用可能（CLI、GUI、Web サービス）
- ✅ 独立してテスト可能（ユニットテストに UI 不要）
- ✅ フレームワーク非依存（Tauri を他のフレームワークと交換可能）

**トレードオフ**:
- ⚠️ 追加の間接レイヤー（commands.rs が lib.rs をラップ）
- ⚠️ より多くのファイルをメンテナンス

**結論**: メリットが長期的な保守性のためのトレードオフを上回る。

---

### 決定 2: 文レベルの `is_noun`（トークンレベルではない）

**問題**: `PromptPart` はトークンを表現すべきか、文を表現すべきか？

**解決策**: `PromptPart` = **文**（意味的単位）、トークンではない。

**検討した代替案**:
```rust
// オプション A: トークンレベル（採用せず）
PromptPart { is_noun: true, text: "User" }
PromptPart { is_noun: false, text: "が" }
PromptPart { is_noun: true, text: "Order" }
...

// オプション B: 文レベル（採用）
PromptPart { is_noun: true, text: "User が Order を 作成" }
```

**メリット**:
- ✅ 自然言語構造を保持
- ✅ よりシンプルなデータモデル（より少ないオブジェクト）
- ✅ より簡単な関係分析（Phase N）
- ✅ 人間の思考に沿う（文 = 思考の単位）

**トレードオフ**:
- ⚠️ 文内の個別のトークンを区別できない
- ⚠️ 名詞アノテーションが文全体に適用される（個別の単語ではない）

**結論**: 文レベルの粒度が現在および将来のニーズに最適。

---

### 決定 3: 文のどこにでも `_N:` を配置可能

**問題**: `_N:` は文の先頭のみに許可すべきか？

**解決策**: `_N:` は文の**どこにでも**配置可能。

**メリット**:
- ✅ 自然言語の柔軟性（日本語の語順は柔軟）
- ✅ ユーザーは強調を表現可能（"注文を _N:ユーザーが 作成" は User を強調）
- ✅ ユーザーの思考プロセスの強制的な並び替えなし

**実装コスト**:
- ⚠️ やや複雑なパーシング（文全体をスキャンする必要）

**結論**: 柔軟性は軽微な実装の複雑さに値する。

---

### 決定 4: Phase 0 ではエラーハンドリングなし

**問題**: 無効な入力をどのように処理するか？

**解決策**: Phase 0 では**検証なし**（Phase N に延期）。

**根拠**:
- Phase 0 の目標: コア機能を確立
- 検証には AST ベースのパターンマッチングが必要（Phase N のスコープ）
- 早期の検証は Phase N 実装時にリファクタリングが必要になる可能性

**現在の動作**:
- 無効な入力 → そのままパース（予期しない出力を生成する可能性）
- 空の入力 → 空のベクター/文字列を返す

**将来（Phase N）**:
```rust
pub enum PrompError { ... }
pub fn parse_input(input: &str) -> Result<Vec<PromptPart>, PrompError>
```

**結論**: エラーハンドリングの延期は、将来の拡張性を犠牲にすることなく Phase 0 の複雑さを軽減。

---

### 決定 5: Phase 0 ではファイル I/O なし

**問題**: Phase 0 はプロンプトの保存/読み込みをサポートすべきか？

**解決策**: Phase 0 では**ファイル I/O なし**（Phase N+1 に延期）。

**根拠**:
- Phase 0: CLI/GUI 入力 → 即座の出力（永続化なし）
- Phase 1: ビジュアルブロックビルダー（テストのみ、保存なし）
- Phase N+1: 確定したブロックタイプ → 一度だけ保存/読み込みを実装

**メリット**:
- ✅ 急速な開発中のスキーマ変更を回避（Phase 1-N）
- ✅ マイグレーションの複雑さなし
- ✅ 安定時に単一の実装努力

**YAGNI 原則**: "You Aren't Gonna Need It" - 実際に必要になるまで機能を実装しない。

**結論**: ファイル I/O の延期は早すぎる設計のロックインを防ぐ。

---

## アーキテクチャパターン

### パターン 1: コンパイラアナロジー

Promps アーキテクチャは**コンパイラパイプライン**を模倣：

```
コンパイラフェーズ   Promps フェーズ         ステータス
─────────────────────────────────────────────────────────
字句解析           →  トークンパーシング      ✅ Phase 0
構文解析           →  AST 構築              🔜 Phase N
構文検証           →  パターンマッチング     🔜 Phase N
意味分析           → （なし - AI の仕事）    ❌ スコープ外
型チェック         →  名詞の関係性           🔜 Phase N
IR 生成            →  正規化された AST       🔜 Phase N+1
コード生成         →  プロンプト出力         ✅ Phase 0
```

**Phase 0 のスコープ**: 字句解析 + コード生成（最小限の実行可能コンパイラ）

---

### パターン 2: AST 的データ構造

`PromptPart` は **AST ノード**：

```rust
PromptPart {
    is_noun: bool,    // ← 型アノテーション（AST ノードタイプのような）
    text: String,     // ← 意味的内容（AST ノード値のような）
}
```

**AST 比較**:
```
従来の AST ノード:
  type: NodeType (enum)
  children: Vec<Node>
  value: Option<Value>

PromptPart（簡素化された AST ノード）:
  is_noun: bool（型アノテーション）
  text: String（値）
  children:（なし - Phase 0 ではフラット構造）
```

**将来（Phase N）**: ネストされたノードを持つ階層的 AST。

---

### パターン 3: 関心の分離

**コアライブラリ** (src/lib.rs):
- ✅ 純粋関数（副作用なし）
- ✅ I/O なし（ファイル読み書きなし、ネットワークなし）
- ✅ UI 依存関係なし（Tauri なし、HTML/JS なし）
- ✅ フレームワーク非依存

**アプリケーション層** (src/main.rs, src/commands.rs):
- ✅ I/O 処理（stdin/stdout、ファイル操作）
- ✅ UI 統合（Tauri IPC）
- ✅ アプリケーションライフサイクル
- ✅ フレームワーク固有コード

**メリット**:
- 簡単なテスト（コアライブラリを独立してテスト）
- 簡単なリファクタリング（コアに影響を与えずに UI を変更）
- 簡単な再利用（異なるコンテキストでコアライブラリを使用可能）

---

## パフォーマンス特性

### 時間計算量

| 関数 | 計算量 | 備考 |
|------|--------|------|
| `PromptPart::from_token()` | O(n) | n = トークン長 |
| `parse_input()` | O(m × k) | m = トークン数、k = 平均トークン長 |
| `generate_prompt()` | O(p × t) | p = パーツ数、t = 平均テキスト長 |

**全体**: O(m × k) - 総入力サイズに対して線形

---

### メモリ使用量

**データ構造サイズ**（64 ビットシステム）:
```
PromptPart:         25 バイト
├─ is_noun:         1 バイト（bool）
├─ text:           24 バイト（String）
│   ├─ ptr:         8 バイト
│   ├─ len:         8 バイト
│   └─ cap:         8 バイト
└─ padding:         0 バイト

Vec<PromptPart>:    24 バイト（オーバーヘッド）+ 25n バイト（要素）
```

**総メモリ**: O(n)、n = 総文字数

---

### スケーラビリティ

**現在の制限**（Phase 0）:
- ✅ 入力サイズ: ハードリミットなし（利用可能メモリによる制限）
- ✅ トークン数: ハードリミットなし
- ✅ 文の数: ハードリミットなし

**実用的な制限**（テスト済み）:
- 10,000 文字: ~500 μs、~100 KB メモリ
- 予想される実際の使用: プロンプトあたり <1,000 文字

**ボトルネック**: 文字列割り当て（テキスト処理では避けられない）

---

## テスト戦略

### ユニットテスト

**カバレッジ**: 公開 API の 100%

**テスト構造**:
```
src/lib.rs（tests モジュール）:
├─ test_parse_noun()
├─ test_parse_everything_else()
├─ test_generate_prompt()
├─ test_empty_parts()
├─ test_noun_prefix_stripping()
├─ test_multi_token_sentence()
└─ test_noun_in_middle_of_sentence()

src/commands.rs（tests モジュール）:
├─ test_generate_prompt_from_text()
└─ test_greet()
```

**テスト実行**:
```bash
cargo test              # 全テスト
cargo test --lib        # ライブラリテストのみ
cargo test commands::   # コマンドテストのみ
```

---

### 統合テスト

**ステータス**: Phase 0 - 未実装

**将来の戦略**:
```
tests/
├─ integration_test.rs    # 完全なワークフローテスト
├─ cli_test.rs            # CLI アプリケーションテスト
└─ fixtures/
    ├─ input1.txt         # テスト入力ファイル
    └─ expected1.txt      # 期待される出力ファイル
```

---

## 進化パス

### Phase 0 → Phase 1（GUI 統合）

**変更**:
```
追加:
├─ res/html/index.html        (Blockly.js UI)
├─ res/js/blockly-config.js   (ブロック定義)
└─ res/js/ui-helpers.js       (UI ユーティリティ)

変更:
└─ src/commands.rs            (GUI 用新 Tauri コマンド)

不変:
└─ src/lib.rs                 (コアライブラリ - 変更なし)
```

**互換性**: 100% 後方互換性（コア API 不変）

---

### Phase 1 → Phase N（ロジックチェック）

**設計哲学**: **レイヤー化アーキテクチャ - 非破壊的拡張**

Phase N は、開放閉鎖原則に従って、Phase 0 の上に検証を**別レイヤー**として追加します：
- Phase 0 コアは**不変**（修正に対して閉鎖）
- 検証レイヤーを**追加**（拡張に対して開放）

**変更**:
```
追加:
├─ src/modules/validation.rs  (新規: 検証レイヤー)
│   ├─ parse_input_checked() → Result<Vec<PromptPart>, ValidationError>
│   ├─ validate_pattern()
│   └─ ValidationError enum
│
├─ src/modules/patterns.rs    (新規: 文法パターン)
│   └─ VALID_PATTERNS
│
└─ src/modules/parser.rs      (新規: AST 構築 - 将来)

不変:
└─ src/lib.rs                 (Phase 0 コア - 変更なし)
    ├─ parse_input()          (安定した API を維持)
    ├─ generate_prompt()      (安定した API を維持)
    └─ PromptPart             (安定した構造を維持)
```

**レイヤー化アーキテクチャ**:
```
┌─────────────────────────────────────┐
│   Phase N: 検証レイヤー            │  ← 新規
│   ├─ parse_input_checked()         │
│   ├─ validate_pattern()             │
│   └─ Error → ユーザーに再入力促す  │
└────────────┬────────────────────────┘
             │ 検証 OK
             ▼
┌─────────────────────────────────────┐
│   Phase 0: コアパーシングレイヤー  │  ← 不変
│   ├─ parse_input()                 │
│   ├─ generate_prompt()             │
│   └─ PromptPart                    │
└─────────────────────────────────────┘
```

**実装例**:
```rust
// Phase N 検証レイヤー (src/modules/validation.rs)
pub fn parse_input_checked(input: &str) -> Result<Vec<PromptPart>, ValidationError> {
    // Phase 0 コアを再利用（修正不要）
    let parts = parse_input(input);

    // 検証を上に追加
    validate_pattern(&parts)?;
    validate_noun_relationships(&parts)?;

    Ok(parts)
}
```

**UI 統合**:
```javascript
// 検証付きフロントエンド
async function processInput(input) {
    try {
        // 検証レイヤーを使用
        const result = await invoke('parse_input_checked', { input });
        displayPrompt(result);  // 成功 → 次へ進む
    } catch (error) {
        // エラー → ユーザーに再入力を促す
        showError(error.message);
        highlightInvalidInput(error.position);
    }
}
```

**互換性**: **非破壊的**（Phase 0 API は安定を維持）

**メリット**:
- ✅ **関心の分離**: パーシング vs. 検証
- ✅ **単一責任**: 各レイヤーが1つの仕事のみ
- ✅ **開放閉鎖原則**: 修正なしで拡張
- ✅ **ゼロマイグレーションコスト**: 既存コードは動作し続ける
- ✅ **テスト容易性**: 各レイヤーを独立してテスト

**マイグレーション**（オプション - 既存コードはそのまま動作）:
```rust
// Phase 0 コード（まだ動作、変更不要）
let parts = parse_input(input);

// Phase N コード（検証をオプトイン）
let parts = parse_input_checked(input)?;  // 検証エラーを取得
```

---

### Phase N → Phase N+1（プロジェクト永続化）

**変更**:
```
追加:
├─ src/modules/io.rs          (ファイル I/O 操作)
├─ src/modules/project.rs     (プロジェクト構造)
└─ src/commands.rs            (save_project、load_project コマンド)
```

**ファイルフォーマット**（計画）:
```json
{
    "version": "0.2.0",
    "workspace": "...",  // Blockly XML/JSON
    "metadata": {
        "created": "2025-11-25T12:00:00Z",
        "modified": "2025-11-25T13:00:00Z"
    }
}
```

**互換性**: 追加的（コアライブラリへの破壊的変更なし）

---

## デプロイメントアーキテクチャ

### 現在（Phase 0）

```
┌─────────────────────────────┐
│ Tauri デスクトップアプリ    │
│  (単一実行ファイル)         │
│                             │
│  ├─ フロントエンド          │
│  │  (HTML/CSS/JS)           │
│  └─ バックエンド            │
│     (Rust バイナリ)         │
└─────────────────────────────┘
```

**プラットフォームサポート**:
- ✅ Linux（開発環境）
- 🔜 Windows（将来）
- 🔜 macOS（将来）

**配布**:
- ソースコード: GitHub リポジトリ
- バイナリ: `cargo build --release`（ローカルビルド）

---

### 将来（Phase 1+）

**クロスプラットフォームビルド**:
```
ビルドマトリックス:
├─ Linux (x86_64)
├─ Windows (x86_64)
├─ macOS (x86_64)
└─ macOS (ARM64 / Apple Silicon)
```

**配布チャネル**:
- GitHub Releases（ビルド済みバイナリ）
- パッケージマネージャー（Homebrew、Chocolatey など）

---

## セキュリティ考慮事項

### Phase 0 セキュリティ

**セキュリティ要件なし**（シングルユーザー、ローカルのみ）:
- ❌ 認証なし
- ❌ 認可なし
- ❌ 暗号化なし
- ❌ ネットワーク通信なし

**根拠**: Promps Phase 0 は外部通信のない**ローカル専用ツール**。

---

### 将来のセキュリティ（Phase 1+）

**潜在的なリスク**（機能が追加された場合）:
1. **ファイル I/O**（Phase N+1）:
   - リスク: パストラバーサル攻撃
   - 緩和策: ファイルパスの検証、ファイルアクセスのサンドボックス化

2. **ネットワーク機能**（将来）:
   - リスク: データ漏洩、MITM 攻撃
   - 緩和策: HTTPS のみ、証明書検証

3. **マルチユーザー**（スコープ外）:
   - リスク: 不正アクセス
   - 緩和策: 適用外（シングルユーザーツール）

---

## 付録

### 技術スタックサマリー

| レイヤー | 技術 | バージョン | 目的 |
|----------|------|-----------|------|
| デスクトップフレームワーク | Tauri | 1.x | クロスプラットフォームデスクトップアプリ |
| バックエンド言語 | Rust | 1.70+ | コアロジック、パーシング、生成 |
| フロントエンド言語 | JavaScript | ES6+ | UI ロジック（将来） |
| フロントエンド UI | HTML/CSS | - | ユーザーインターフェース（将来） |
| ブロックエディタ | Blockly.js | - | ビジュアルプログラミング（Phase 1） |

---

### ビルド依存関係

**Rust クレート**:
```toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[build-dependencies]
tauri-build = { version = "1.5", features = [] }
```

**フロントエンド依存関係**（Phase 1）:
```json
{
  "dependencies": {
    "@tauri-apps/api": "^1.5.0",
    "blockly": "^9.0.0"
  }
}
```

---

### 用語集

| 用語 | 定義 |
|------|------|
| AST | Abstract Syntax Tree - コード構造の階層的表現 |
| DSL | Domain Specific Language - 特定の問題領域用の専門言語 |
| IPC | Inter-Process Communication - Tauri フロントエンド-バックエンド通信のメカニズム |
| 字句解析 | コンパイルの最初のフェーズ - トークン化 |
| PromptPart | 意味的単位（文）を表すコアデータ構造 |
| Tauri | Web 技術でデスクトップアプリを構築するフレームワーク |

---

### 関連ドキュメント

- **コア機能**: `CORE_FEATURES.md`
- **API リファレンス**: `API_REFERENCE.md`
- **ユーザーガイド**: `../../README.md`

---

**ドキュメントバージョン**: 1.0
**最終更新**: 2025-11-25
**次回レビュー**: Phase 1 実装開始前
