# Promps - Visual Prompt Language (ViPL) Generator

**Promps: A ViPL (Visual Prompt Language) generation tool**

Meta-level language generator for creating structured prompts that AI assistants can easily understand and process.

---

## 🌟 Project Vision

Promps is designed with a **data-driven, bottom-up thinking approach** that enables effective AI collaboration. By starting with concrete data structures and allowing users to naturally discover abstract concepts, Promps makes prompt engineering accessible to:

- Database designers
- RAD (Rapid Application Development) practitioners
- Delphi/VB developers
- Anyone who thinks in terms of concrete data first

---

## 🚀 Current Status: Phase 0

**Phase 0** is a minimal CLI tool that serves as the foundation for Promps's bootstrap development - using Promps to generate prompts for building Promps itself.

### Phase 0 Features

✅ **Two field types**: "Noun" (名詞) and "Everything else" (それ以外)
✅ **Space-delimited parsing**: Single space for tokens, double space for sentences
✅ **Flexible noun marking**: `_N:` prefix can appear anywhere in a sentence
✅ **Multi-token sentences**: Natural language-like expression
✅ **Self-hosting capable**: Can generate prompts for its own development

---

## 📦 Installation

### Prerequisites

- Rust 1.70 or later

### Build from Source

```bash
git clone https://github.com/BonoJovi/Promps.git
cd Promps
cargo build --release
```

The binary will be created at `target/release/promps`.

---

## 🎯 Usage

### Basic Syntax

```
Format: _N:text (noun/名詞) or text (everything else/それ以外)
Token delimiter: single space
Sentence delimiter: double space (or more)
```

### Running Promps

```bash
./target/release/promps
```

Then enter your prompt parts (Ctrl+D to finish on Unix, Ctrl+Z on Windows).

### Example 1: Simple Prompt

**Input:**
```
_N:データベーステーブルブロック機能  データベースのテーブル構造を視覚的に定義する機能です  _N:対象ユーザー  Phase1で実装予定
```

**Output:**
```
データベーステーブルブロック機能 (NOUN)
データベースのテーブル構造を視覚的に定義する機能です
対象ユーザー (NOUN)
Phase1で実装予定
```

### Example 2: Multi-Token Sentences

**Input:**
```
_N:GUI ブロック ビルダー 機能  ドラッグ アンド ドロップで ブロックを 配置する  _N:技術 スタック  Blockly.js または Scratch Blocks
```

**Output:**
```
GUI ブロック ビルダー 機能 (NOUN)
ドラッグ アンド ドロップで ブロックを 配置する
技術 スタック (NOUN)
Blockly.js または Scratch Blocks
```

### Example 3: Noun in Middle of Sentence

**Input:**
```
テキストフィールド を _N:変数 に コピーしてください  _N:ユーザー が 入力した データ を 保存します
```

**Output:**
```
テキストフィールド を 変数 に コピーしてください (NOUN)
ユーザー が 入力した データ を 保存します (NOUN)
```

**Note:** Any sentence containing `_N:` marker is tagged as `(NOUN)`, enabling flexible expression of relationships and context.

---

## 🧪 Running Tests

```bash
cargo test
```

**Current test coverage:** 7 tests, 100% passing

---

## 🎨 Design Philosophy

### Data-Driven Thinking

Promps is built on the principle of **starting with concrete data structures** rather than abstract concepts:

1. **Concrete First**: Users define actual data (tables, fields, objects)
2. **Drilldown**: Detailed analysis from concrete examples
3. **Bottom-Up**: Abstract patterns emerge naturally from data
4. **Cognitive Mapping**: Users discover DDD concepts (aggregates, bounded contexts) organically

### Why This Works with AI

- **Context-based prompts**: Uses relationships (connectives) instead of isolated keywords
- **Relationship graphs**: AI understands connections between concepts
- **Scalable expressions**: OOP-like flexibility in prompt structure
- **Natural discovery**: Users learn patterns through practice, not theory

---

## 🛣️ Roadmap

### Phase 0 (Current) ✅
- [x] Minimal CLI language generator
- [x] Space-delimited parsing
- [x] Noun/non-noun field types
- [x] Multi-token sentence support
- [x] Flexible noun marking

### Phase 1 (Planned)
- [ ] GUI block builder (Scratch-like interface)
- [ ] Drag-and-drop block placement
- [ ] Visual prompt composition
- [ ] Integration with Blockly.js or Scratch Blocks

### Phase 2+ (Future)
- [ ] Domain-specific blocks (Database, OOP, etc.)
- [ ] Template library
- [ ] Export formats (JSON, YAML, Markdown)
- [ ] Collaboration features

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

Copyright (c) 2025 Yoshihiro NAKAHARA

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🔒 Security

For security issues, please see [SECURITY.md](SECURITY.md).

---

## 📧 Contact

- **Issues**: https://github.com/BonoJovi/Promps/issues
- **Email**: promps-dev@zundou.org

---

## 🌐 Business Model

**Open Core Strategy:**
- Phase 0-2: MIT License (Open Source, Free)
- Future Pro Version: Proprietary (Advanced features, Enterprise support)

---

**Built with ❤️ using data-driven thinking and AI collaboration**
