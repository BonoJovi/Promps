# AI Context: Promps Project Structure

**Purpose**: This document helps AI assistants quickly understand the project structure without reading every file.
**Last Updated**: 2026-02-18
**Keywords**: project structure, プロジェクト構造, architecture, アーキテクチャ, directory structure, ディレクトリ構造, file organization, ファイル構成, modules, モジュール, components, コンポーネント, src, res, folder structure, フォルダ構造, codebase layout, コードベース構成
**Related**: @TAURI.md, @../coding/CONVENTIONS_OVERVIEW.md, @../coding/API_STABILITY.md

---

## Project Overview

**Name**: Promps
**Type**: Desktop application (Tauri v2 + Rust + HTML/JS)
**Purpose**: Visual prompt language generator using Blockly.js — a DSL-based tool for constructing structured prompts with Japanese/English grammar support

---

## Tech Stack

- **Backend**: Rust (Tauri v2 framework)
- **Frontend**: Vanilla HTML/CSS/JavaScript + Blockly.js (no framework)
- **Visual Editor**: Google Blockly.js (block-based programming)
- **i18n**: Built-in Japanese/English support (frontend-side translations)
- **Persistence**: JSON-based project files (`.promps`)

---

## Directory Structure

```
Promps/
├── src/                           # Rust backend source
│   ├── main.rs                    # Entry point, Tauri builder & command registration
│   ├── lib.rs                     # Phase 0 core: PromptPart, parse_input(), generate_prompt()
│   ├── commands.rs                # Tauri commands (bridge frontend ↔ backend)
│   └── modules/                   # Extended modules
│       ├── mod.rs                 # Module declarations
│       └── validation.rs          # Phase 5-6: Grammar validation engine
│
├── res/                           # Frontend resources
│   ├── index.html                 # Single-page application entry
│   ├── css/
│   │   └── common.css             # Styles with CSS custom properties (dark/light theme)
│   └── js/                        # JavaScript modules
│       ├── main.js                # App initialization, theme, i18n, Tauri invocation
│       ├── blockly-config.js      # Blockly workspace, custom blocks, template manager
│       ├── project-manager.js     # Phase 4: Save/load/new project (.promps files)
│       ├── validation-ui.js       # Phase 5-6: Validation result display & auto-fix
│       └── i18n.js                # Internationalization (ja/en translations)
│
├── res/tests/                     # Frontend tests (Jest + JSDOM)
│   ├── blockly-config.test.js     # Block definition & workspace tests
│   ├── main.test.js               # Main logic tests
│   ├── project-manager.test.js    # Project persistence tests
│   ├── validation-ui.test.js      # Validation UI tests
│   └── i18n.test.js               # i18n switching tests
│
├── .ai-context/                   # AI assistant context (THIS DIRECTORY)
│   ├── ESSENTIAL.md               # Session startup (always loaded)
│   ├── context/                   # On-demand context files
│   │   ├── architecture/          # PROJECT_STRUCTURE.md, TAURI.md
│   │   ├── coding/                # CONVENTIONS, TESTING, API_STABILITY
│   │   └── workflows/             # BRANCHING, RELEASE, I18N
│   ├── shared/                    # Git submodule (ai-context-shared)
│   └── archive/                   # Completed TODO records
│
├── docs/                          # User & developer documentation (ja/en)
│   ├── design/                    # Architecture docs
│   ├── developer/                 # API reference, contributor guides
│   ├── user/                      # User guide
│   └── testing/                   # Test documentation
│
├── icons/                         # Application icons (Tauri)
├── src-tauri/                     # Tauri v2 configuration (generated)
├── Cargo.toml                     # Rust dependencies & version
├── tauri.conf.json                # Tauri window & app configuration
├── package.json                   # Node.js dependencies (Blockly, Jest)
└── TODO.md                        # Phase tracking & roadmap
```

---

## Key Modules & Their Responsibilities

### Backend (Rust)

| Module | File | Phase | Purpose |
|--------|------|-------|---------|
| Core Library | `src/lib.rs` | Phase 0 | `PromptPart` struct, `parse_input()`, `generate_prompt()` — **immutable API** |
| Tauri Commands | `src/commands.rs` | Phase 1+ | All `#[tauri::command]` functions bridging frontend ↔ backend |
| Validation | `src/modules/validation.rs` | Phase 5-6 | Grammar validation, token classification, pattern matching |

### Frontend (JavaScript)

| Module | File | Phase | Purpose |
|--------|------|-------|---------|
| Main | `res/js/main.js` | Phase 1+ | Theme management, i18n init, Tauri command invocation |
| Blockly Config | `res/js/blockly-config.js` | Phase 2-3 | Custom blocks (noun/particle/verb/other), workspace setup, template manager |
| Project Manager | `res/js/project-manager.js` | Phase 4 | Save/load/new project operations (`.promps` format) |
| Validation UI | `res/js/validation-ui.js` | Phase 5-6 | Display validation results, highlight errors, auto-fix suggestions |
| i18n | `res/js/i18n.js` | v1.1+ | Translation data & language switching (ja/en) |

---

## Tauri Commands (API Surface)

All commands registered in `src/main.rs`:

| Command | Purpose | Phase |
|---------|---------|-------|
| `generate_prompt_from_text` | Convert DSL input to formatted prompt | Phase 0-1 |
| `greet` | Health check / communication test | Phase 1 |
| `validate_dsl_sequence` | Grammar validation with locale support | Phase 5 |
| `get_patterns` | Retrieve pattern templates by locale | Phase 6 |
| `analyze_dsl_patterns` | Analyze DSL for pattern matches | Phase 6 |
| `save_project` | Save project to `.promps` file | Phase 4 |
| `load_project` | Load project from `.promps` file | Phase 4 |
| `create_new_project` | Create new empty project | Phase 4 |
| `update_project_timestamp` | Update project modification time | Phase 4 |
| `show_open_dialog` | Native file open dialog | Phase 4 |
| `show_save_dialog` | Native file save dialog | Phase 4 |
| `show_confirm_dialog` | Native confirmation dialog | Phase 4 |
| `set_window_title` | Update window title bar | Phase 4 |

---

## Data Flow

### 1. Prompt Generation (Core Flow)
```
Blockly Workspace → DSL text (e.g., "_N:Document を 分析して")
    ↓
main.js → invoke('generate_prompt_from_text', { input })
    ↓
commands.rs → parse_input() + generate_prompt()
    ↓
Result: "Document (NOUN) を 分析して"
    ↓
main.js → Display in preview panel
```

### 2. Grammar Validation
```
DSL text → invoke('validate_dsl_sequence', { input, locale })
    ↓
commands.rs → validate_sequence_with_locale()
    ↓
validation.rs → Token classification → Rule checking → ValidationResult
    ↓
validation-ui.js → Display errors/warnings, highlight blocks
```

### 3. Project Persistence
```
Save: Blockly state + metadata → JSON → invoke('save_project') → .promps file
Load: .promps file → invoke('load_project') → JSON → Restore Blockly workspace
```

---

## Layered Architecture

```
┌─────────────────────────────────────────────────┐
│  Phase 5-6: Validation Layer                     │
│  src/modules/validation.rs                       │
│  - validate_sequence_with_locale()               │
│  - TokenType classification                      │
│  - Pattern templates & matching                  │
└────────────────┬────────────────────────────────┘
                 │ Depends on (calls only, no modify)
                 ↓
┌─────────────────────────────────────────────────┐
│  Phase 1+: Tauri Command Layer                   │
│  src/commands.rs                                 │
│  - generate_prompt_from_text()                   │
│  - save_project() / load_project()               │
│  - validate_dsl_sequence()                       │
└────────────────┬────────────────────────────────┘
                 │ Depends on (calls only, no modify)
                 ↓
┌─────────────────────────────────────────────────┐
│  Phase 0: Core Parsing Layer (IMMUTABLE)         │
│  src/lib.rs                                      │
│  - PromptPart struct                             │
│  - parse_input()                                 │
│  - generate_prompt()                             │
└─────────────────────────────────────────────────┘
```

---

## Test Architecture

### Test Count: 282 tests (100% passing)

| Layer | Location | Count | Tool |
|-------|----------|-------|------|
| Backend | `src/lib.rs` | 13 | `cargo test` |
| Backend | `src/commands.rs` | 25 | `cargo test` |
| Backend | `src/modules/validation.rs` | 54 | `cargo test` |
| Frontend | `res/tests/` (5 test files) | 190 | `npm test` |
| **Total** | | **282** | |

### Running Tests
```bash
# Backend only
cargo test

# Frontend only
cd res/tests && npm test

# All tests
cargo test && cd res/tests && npm test
```

---

## Build & Run

### Development
```bash
cargo tauri dev
```

### Production Build
```bash
cargo tauri build
```

---

## Version Files (Must Update Together)

When releasing a new version, update all three:

| File | Field |
|------|-------|
| `Cargo.toml` | `version = "x.y.z"` |
| `tauri.conf.json` | `"version": "x.y.z"` |
| `package.json` | `"version": "x.y.z"` |

---

## Related Documentation

- **Tauri Integration**: `@TAURI.md`
- **API Stability**: `@../coding/API_STABILITY.md`
- **Coding Conventions**: `@../coding/CONVENTIONS_OVERVIEW.md`
- **Testing Strategy**: `@../coding/TESTING.md`
- **Branching Strategy**: `@../workflows/BRANCHING.md`
- **Release Process**: `@../workflows/RELEASE.md`
