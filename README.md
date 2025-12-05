# Promps - Visual Prompt Builder

[![Tech Preview](https://img.shields.io/badge/Status-Tech%20Preview-orange)](https://github.com/BonoJovi/Promps/releases)
[![Version](https://img.shields.io/badge/Version-0.0.1-blue)](https://github.com/BonoJovi/Promps/releases/tag/v0.0.1)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Promps**: A visual block-based tool for creating structured AI prompts

Build prompts by dragging and dropping blocks, just like Scratch!

---

## ⚠️ Tech Preview Notice

**This is a Technology Preview release (v0.0.1)** - an early version to gather feedback and test the concept.

**What this means:**
- ✅ Core functionality works and is ready for testing
- ⚠️ Limited features (only Noun and Other blocks)
- ⚠️ No grammar validation yet
- ⚠️ No project save/load yet
- 🐛 Bugs are expected - please report them!

**We're looking for testers!** Your feedback will shape the future of Promps. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to help.

---

## 🚀 Quick Start

### 1. Install & Run

```bash
# Build the application
cargo tauri build

# Or run in development mode
cargo tauri dev
```

### 2. Using Promps

#### Step 1: Place Blocks
- Drag blocks from the left panel to the workspace
- Two types of blocks available:
  - **Noun Block** (名詞): For entities like "User", "Order", "Database"
  - **Other Block** (その他): For particles, verbs, and other words

#### Step 2: Connect Blocks
- Snap blocks together to form sentences
- Blocks connect vertically to create sequences

#### Step 3: Generate Prompt
- Your prompt appears in real-time in the preview panel
- Noun blocks are automatically marked with `(NOUN)` in the output
- Copy the generated prompt for use with AI assistants

---

## 📖 Example Usage

### Building a Simple Prompt

**Blocks:**
```
[Noun: User] → [Other: が] → [Noun: Order] → [Other: を] → [Other: 作成]
```

**Generated Output:**
```
User (NOUN) が Order (NOUN) を 作成
```

---

## 🎯 Features

- ✅ Visual block-based interface (powered by Blockly.js)
- ✅ Real-time prompt preview
- ✅ Automatic noun detection and marking
- ✅ Simple drag-and-drop operation
- ✅ Desktop application (Tauri + Rust)

---

## 🛣️ Current Status

**Version**: 0.0.1 (Initial Release)

**Included:**
- Visual block builder with Blockly.js
- Noun and Other block types
- Real-time prompt generation

**Coming Soon:**
- More block types (particles, verbs, adjectives)
- Grammar validation
- Project save/load
- Layout customization

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

Copyright (c) 2025 Yoshihiro NAKAHARA

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📧 Contact

- **Issues**: https://github.com/BonoJovi/Promps/issues
- **Email**: promps-dev@zundou.org

---

**Built with ❤️ for better AI collaboration**


<!-- STATS_START -->
## 📊 Repository Statistics

<div align="center">

### 📈 Daily Traffic

![Daily Traffic Stats](docs/stats_graph_daily.png)

### 📊 Cumulative Traffic

![Cumulative Traffic Stats](docs/stats_graph_cumulative.png)

| Metric | Count |
|--------|-------|
| 👁️ **Total Views** | **10** |
| 📦 **Total Clones** | **19** |

*Last Updated: 2025-12-05 08:46 UTC*

</div>
<!-- STATS_END -->
