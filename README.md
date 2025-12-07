# 🎨 Promps - Visual Prompt Builder

<div align="center">

> **A Visual Block-Based Tool for Creating Structured AI Prompts**  
> **AIプロンプト作成のためのビジュアルブロックベースツール**

[![Tech Preview](https://img.shields.io/badge/Status-Tech%20Preview-orange)](https://github.com/BonoJovi/Promps/releases)
[![Version](https://img.shields.io/badge/Version-0.0.2-blue)](https://github.com/BonoJovi/Promps/releases/tag/v0.0.2)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-v2-blue.svg)](https://tauri.app/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Build prompts by dragging and dropping blocks, just like Scratch!**  
**Scratchのようにブロックをドラッグ&ドロップしてプロンプトを作成！**

</div>

---

## 💌 Message from Developer / 開発者からのメッセージ

<div style="border: 3px solid #4a90e2; padding: 20px; margin: 20px 0; background-color: #f8f9fa; font-size: 1.1em;">

### Prompsユーザの皆さんへ

いつもPrompsに関心を寄せていただき、誠にありがとうございます。  
プロジェクト発案者のBonoJovi(Yoshihiro NAKAHARA)です。

**Ver.0.0.2 テックプレビュー版をリリースいたしました！**

Ver.0.0.1からVer.0.0.2への更新では、**助詞ブロック機能**を追加しました。これにより、「が」「を」「に」「で」「と」「へ」「から」「まで」「より」の9種類の助詞ブロックが使えるようになり、より自然な日本語のプロンプトを視覚的に構築できるようになりました。

また、ブロックパレットに**折りたたみ可能なカテゴリUI**を実装し、「名詞」「助詞」「その他」のカテゴリごとにブロックを整理しました。これにより、多数のブロックから目的のものを素早く見つけられるようになりました。

Prompsはまだテックプレビュー段階ですが、基本的なプロンプト構築機能は動作しており、テストしていただける状態です。現段階では文法検証機能やプロジェクトの保存/読込機能はまだ実装されていませんが、今後のリリースで追加予定です。

**テスターを募集しています！** あなたのフィードバックがPrompsの未来を形作ります。動作確認、バグ報告、機能リクエストなど、どんな形でも構いませんので、ぜひご協力ください。

**2025-12-06 (JST) Written by Yoshihiro NAKAHARA**

---

### To Promps Users

Thank you for your continued interest in Promps.  
I'm BonoJovi (Yoshihiro NAKAHARA), the project initiator.

**We have released Ver.0.0.2 Tech Preview!**

The update from Ver.0.0.1 to Ver.0.0.2 introduces **Particle Blocks** functionality. This adds 9 types of Japanese particle blocks (が、を、に、で、と、へ、から、まで、より), enabling you to visually construct more natural Japanese prompts.

Additionally, we've implemented a **collapsible category UI** in the block palette, organizing blocks into "Noun", "Particle", and "Other" categories. This makes it easier to quickly find the blocks you need from the growing collection.

Promps is still in Tech Preview stage, but the basic prompt building functionality is working and ready for testing. While grammar validation and project save/load features are not yet implemented, they are planned for future releases.

**We're looking for testers!** Your feedback will shape the future of Promps. Whether it's testing functionality, reporting bugs, or requesting features, any form of contribution is welcome.

**2025-12-06 (JST) Written by Yoshihiro NAKAHARA**

</div>

---

## ⚠️ Tech Preview Notice / テックプレビュー版について

**This is a Technology Preview release (v0.0.2)** - an early version to gather feedback and test the concept.  
**これはテクノロジープレビュー版(v0.0.2)です** - フィードバック収集とコンセプト検証のための初期バージョンです。

**What this means: / これが意味すること：**
- ✅ Core functionality works and is ready for testing / コア機能は動作し、テスト可能な状態です
- ✅ **NEW in v0.0.2:** Particle blocks (9 types) added / **v0.0.2の新機能:** 助詞ブロック(9種類)を追加
- ✅ **NEW in v0.0.2:** Collapsible category UI / **v0.0.2の新機能:** 折りたたみ可能なカテゴリUI
- ⚠️ No grammar validation yet / 文法検証機能はまだありません
- ⚠️ No project save/load yet / プロジェクト保存/読込機能はまだありません
- 🐛 Bugs are expected - please report them! / バグは想定内です - ぜひ報告してください！

**We're looking for testers!** Your feedback will shape the future of Promps. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to help.  
**テスターを募集しています！** あなたのフィードバックがPrompsの未来を形作ります。協力方法は[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

---

## 🚀 Quick Start / クイックスタート

### 1. Download & Install / ダウンロード & インストール

**Download the latest release: / 最新リリースをダウンロード：**
- 📥 [Download v0.0.2](https://github.com/BonoJovi/Promps/releases/tag/v0.0.2)

**Available for: / 対応プラットフォーム：**
- 🐧 Linux (AppImage, deb, rpm)
- 🪟 Windows (exe installer, msi)
- 🍎 macOS (dmg for Intel and Apple Silicon)

### 2. Build from Source / ソースからビルド

```bash
# Clone the repository / リポジトリをクローン
git clone https://github.com/BonoJovi/Promps.git
cd Promps

# Build the application / アプリケーションをビルド
cargo tauri build

# Or run in development mode / または開発モードで実行
cargo tauri dev
```

---

## 📖 How to Use / 使い方

### Step 1: Place Blocks / ステップ1: ブロックを配置

Drag blocks from the left panel to the workspace.  
左パネルからワークスペースにブロックをドラッグします。

**Available block types: / 利用可能なブロックタイプ：**

- **🏷️ Noun Block (名詞)**: For entities like "User", "Order", "Database"  
  エンティティ用（「ユーザー」「注文」「データベース」など）

- **✨ Particle Block (助詞) [NEW in v0.0.2]**: Japanese particles  
  日本語の助詞（「が」「を」「に」「で」「と」「へ」「から」「まで」「より」）

- **📝 Other Block (その他)**: For verbs and other words  
  動詞やその他の単語用

### Step 2: Connect Blocks / ステップ2: ブロックを接続

- Snap blocks together to form sentences  
  ブロックをスナップして文を形成します
  
- Blocks connect vertically to create sequences  
  ブロックは縦方向に接続してシーケンスを作成します

### Step 3: Generate Prompt / ステップ3: プロンプトを生成

- Your prompt appears in real-time in the preview panel  
  プレビューパネルにリアルタイムでプロンプトが表示されます
  
- Noun blocks are automatically marked with `(NOUN)` in the output  
  名詞ブロックは出力で自動的に`(NOUN)`マークが付きます
  
- Copy the generated prompt for use with AI assistants  
  生成されたプロンプトをコピーしてAIアシスタントで使用できます

---

## 💡 Example Usage / 使用例

### Building a Simple Prompt / シンプルなプロンプトの構築

**Blocks: / ブロック：**
```
[Noun: User] → [Particle: が] → [Noun: Order] → [Particle: を] → [Other: 作成]
```

**Generated Output: / 生成される出力：**
```
User (NOUN) が Order (NOUN) を 作成
```

### Building a Complex Prompt / 複雑なプロンプトの構築

**Blocks: / ブロック：**
```
[Noun: データベース] → [Particle: から] → [Noun: レコード] → [Particle: を] 
→ [Other: 取得して] → [Noun: ファイル] → [Particle: に] → [Other: 保存]
```

**Generated Output: / 生成される出力：**
```
データベース (NOUN) から レコード (NOUN) を 取得して ファイル (NOUN) に 保存
```

---

## 🎯 Features / 機能

### Current Features / 現在の機能

- ✅ Visual block-based interface (powered by Blockly.js)  
  ビジュアルブロックベースのインターフェース（Blockly.js搭載）

- ✅ **NEW:** 9 types of particle blocks (が、を、に、で、と、へ、から、まで、より)  
  **新機能:** 9種類の助詞ブロック

- ✅ **NEW:** Collapsible category UI (Noun, Particle, Other)  
  **新機能:** 折りたたみ可能なカテゴリUI（名詞、助詞、その他）

- ✅ Real-time prompt preview  
  リアルタイムプロンプトプレビュー

- ✅ Automatic noun detection and marking  
  自動名詞検出とマーキング

- ✅ Simple drag-and-drop operation  
  シンプルなドラッグ&ドロップ操作

- ✅ Desktop application (Tauri + Rust)  
  デスクトップアプリケーション（Tauri + Rust）

- ✅ Multi-platform support (Linux, Windows, macOS)  
  マルチプラットフォーム対応

### Coming Soon / 近日実装予定

- 🔜 More block types (verbs, adjectives)  
  より多くのブロックタイプ（動詞、形容詞）

- 🔜 Grammar validation  
  文法検証

- 🔜 Project save/load  
  プロジェクトの保存/読込

- 🔜 Layout customization  
  レイアウトのカスタマイズ

- 🔜 Example templates  
  サンプルテンプレート

---

## 🤝 Join Our Community / コミュニティに参加

**Help make Promps better for everyone!**  
**Prompsをみんなのためにより良くするお手伝いをしてください！**

We welcome **all types of contributions** - not just code!  
**あらゆる形の貢献**を歓迎します—コードだけではありません！

---

### 🧪 Testers Wanted! / テスター募集！

**No programming experience needed! / プログラミング経験不要！**

**🎉 NEW: v0.0.2 Multi-Platform Binaries Now Available!**  
**🎉 新着: v0.0.2でマルチプラットフォームバイナリが利用可能に！**

**Platform Status: / プラットフォーム状況：**
- ✅ **Linux**: Verified and tested by developer / 開発者により検証済み・テスト済み
- ⚠️ **Windows**: **Binary available but needs real hardware testing!** / **バイナリは利用可能だが実機テストが必要！**
- ⚠️ **macOS (Intel & Apple Silicon)**: **Binary available but needs real hardware testing!** / **バイナリは利用可能だが実機テストが必要！**

**What we need from you: / お願いしたいこと：**
- 🔍 Download and test the latest release / 最新リリースをダウンロード＆テスト
- 🐛 Report any bugs or issues you encounter / 遭遇したバグや問題を報告
- ✅ Confirm if basic features work correctly / 基本機能が正常に動作するか確認
- 💬 Share your experience (UI/UX feedback welcome!) / 使用感を共有（UI/UXフィードバック歓迎！）
- 💡 Suggest new features or improvements / 新機能や改善点を提案

**Download:** [Latest Release](https://github.com/BonoJovi/Promps/releases/latest)

---

### 💡 Feature Requests & Feedback / 機能リクエスト & フィードバック

Have ideas to make Promps better?
Prompsをより良くするアイデアはありますか？

- 🆕 **[Submit Feature Request](https://github.com/BonoJovi/Promps/issues/new)**
- 🐛 **[Report a Bug](https://github.com/BonoJovi/Promps/issues/new)**
- 💬 **[Join Discussions](https://github.com/BonoJovi/Promps/discussions)** - Q&A, Ideas, General chat / 質問、アイデア、雑談
  - 📖 **[Discussion Guidelines](.github/DISCUSSIONS.md)** - How to use discussions / ディスカッション利用ガイド

---

### 💻 Developers / 開発者

For code contributions:  
コード貢献について：

- 📋 **[Contributing Guide](CONTRIBUTING.md)**
- 📘 **[Development Documentation](docs/)**

---

## 🛣️ Release History / リリース履歴

### Version 0.0.2 (2025-12-06)

**Major Features: / 主要機能：**
- ✨ Added 9 particle blocks (が、を、に、で、と、へ、から、まで、より)
- ✨ Collapsible category UI in toolbox
- ✨ Enhanced visual styling for categories
- 🧪 Added 11 new frontend tests (68 total tests, 100% passing)

### Version 0.0.1 (2025-11-25)

**Initial Release: / 初回リリース：**
- ✨ Visual block builder with Blockly.js
- ✨ Noun and Other block types
- ✨ Real-time prompt generation
- ✨ Desktop application framework

---

## 📊 Technical Details / 技術詳細

**Tech Stack: / 技術スタック：**
- **Backend**: Rust (with Tauri framework)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Block Engine**: Blockly.js (Google's visual programming library)
- **Build System**: Cargo + Tauri CLI

**Tests: / テスト：**
- 🧪 68 frontend tests (100% passing)
- 🧪 Particle block integration tests
- 🧪 Category UI behavior tests

---

## 📝 License / ライセンス

MIT License - see [LICENSE](LICENSE) file for details  
MITライセンス - 詳細は[LICENSE](LICENSE)ファイルをご覧ください

Copyright (c) 2025 Yoshihiro NAKAHARA

---

## 📧 Contact / 連絡先

- **Issues**: https://github.com/BonoJovi/Promps/issues
- **Email**: promps-dev@zundou.org

---

**Built with ❤️ for better AI collaboration**  
**より良いAIコラボレーションのために ❤️ を込めて開発**

---

<!-- STATS_START -->
## 📊 Repository Statistics

<div align="center">

### 📈 Daily Traffic

![Daily Traffic Stats](docs/stats_graph_daily.png)

### 📊 Cumulative Traffic

![Cumulative Traffic Stats](docs/stats_graph_cumulative.png)

| Metric | Count |
|--------|-------|
| 👁️ **Total Views** | **73** |
| 📦 **Total Clones** | **78** |

*Last Updated: 2025-12-07 01:33 UTC*

</div>
<!-- STATS_END -->
