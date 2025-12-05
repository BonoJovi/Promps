# Quick Reference - Promps Project

**Last Updated**: 2025-12-05
**Purpose**: Fast lookup for AI assistants during active development

---

## Current Phase Status

- **Phase 0 (CLI)**: ✅ Complete (100%) - **Critical Foundation**
- **Phase 1 (GUI)**: ✅ Complete (100%) - 42 tests at 100% passing
- **Phase 2 (Block Types)**: 🔜 Next - Adding more block types
- **Phase N (Logic Check)**: ⏳ Main Challenge - 50-100 pattern matching
- **Phase N+1 (File I/O)**: 📋 Planned
- **Phase N+2 (Layout)**: 📋 Planned

**Current Development Status**:
- **Architecture**: Mostly finalized
- **Strategy**: Pattern expansion (not new features)
- **Bottleneck**: Phase N logic check (Japanese particle analysis)
- **Foundation**: Phase 0's `_N:` prefix enables noun identification, Phase N focuses on particle patterns only

---

## Critical Design Decisions

### 1. Token-Level Noun Detection (Phase 0-1)
```
Input:  "_N:User が _N:Order を 作成"
Output: "User (NOUN) が Order (NOUN) を 作成"
        ↑               ↑
        Each noun gets individual (NOUN) marker
```

**Why**: Multiple nouns in one sentence require individual marking for AI understanding.

### 2. _N: Prefix Purpose
- **NOT** just a marker - it's AST-like type annotation
- Guarantees noun identification (no inference needed)
- Foundation for Phase N validation
- User never sees it in GUI (auto-generated from blocks)

### 3. Single-Line Output Format
```
Output: "User (NOUN) が Order (NOUN) を 作成\n"
        ↑─────────────────────────────────↑
        Single line preserves sentence unity for AI
```

**Why**: AI processes as one task, not separate commands.

---

## File Locations

### Source Code
- **Core parsing**: `src/lib.rs` (parse_input, generate_prompt)
- **Tauri commands**: `src/commands.rs` (generate_prompt_from_text)
- **Frontend logic**: `res/js/main.js`, `res/js/blockly-config.js`

### Tests
- **Backend**: `src/lib.rs` (8 tests), `src/commands.rs` (13 tests)
- **Frontend**: `res/tests/blockly-config.test.js` (10 tests), `res/tests/main.test.js` (11 tests)
- **Total**: 42 tests at 100% passing

### Documentation
- **User docs**: `docs/en/`, `docs/ja/`
- **AI context**: `.ai-context/` (this directory)

---

## Key Data Structures

### PromptPart (Rust)
```rust
pub struct PromptPart {
    pub is_noun: bool,  // True if token is _N: prefixed
    pub text: String,   // Token text (without _N: prefix)
}
```

### Block Definition (JavaScript)
```javascript
{
  "type": "noun_block",
  "message0": "名詞 %1",
  "args0": [{"type": "field_input", "name": "TEXT", "text": ""}]
}
```

---

## Common Operations

### Running Tests
```bash
# Backend tests
cargo test

# Frontend tests
cd res/tests && npm test

# All tests
cargo test && cd res/tests && npm test && cd ../..
```

### Building
```bash
# Development
cargo tauri dev

# Production
cargo tauri build
```

---

## Current Test Coverage

| Component | Tests | Status |
|-----------|-------|--------|
| Core parsing (lib.rs) | 8 | ✅ 100% |
| Tauri integration (commands.rs) | 13 | ✅ 100% |
| Blockly config | 10 | ✅ 100% |
| UI logic | 11 | ✅ 100% |
| **Total** | **42** | **✅ 100%** |

---

## Phase 2 Scope (Next)

**Goal**: Add more block types beyond "noun_block"

**Planned blocks**:
- Particle blocks (が、を、に、で、etc.)
- Verb blocks (action representation)
- Adjective blocks (descriptors)
- Connective blocks (と、や、など)

**Implementation approach**:
1. Define new block types in `blockly-config.js`
2. Update DSL generation logic
3. Add tests for each block type
4. Update documentation

**Phase N dependency**: Logic check requires knowing parts of speech.

---

## Future Features (Post v1.0 Release)

### Multiple Noun Enumeration Feature (Phase N+4 or later)

**Purpose**: Allow listing multiple nouns under a single subject (e.g., database table column definitions)

**Use Case Example**:
```
Input (Blockly):
  Table: User
    Columns: ID, Name, Email, CreatedAt

Output (DSL):
  _N:User { _N:ID _N:Name _N:Email _N:CreatedAt }
```

**Implementation Options**:
1. **Fixed slots** (⭐ Easy, ~30 min, low flexibility)
2. **Statement Input** (⭐⭐ Medium, 1-2 hours, medium flexibility)
3. **Mutator with +/- buttons** (⭐⭐⭐ Advanced, 3-5 hours, high flexibility) ← Recommended

**Release Strategy**:
- v1.0: Simple subject + single noun pattern
- Collect user feedback and usage patterns
- v2.0+: Add multiple noun enumeration as "power user feature"

**Phase N Impact**: Requires new pattern validation rules for table-like structures

**Status**: Deferred until post-v1.0 (awaiting user feedback)

---

## Immediate Context Needs

When working on:

- **Code implementation** → Read `development/CONVENTIONS.md`
- **Architecture decisions** → Read `core/DESIGN_PHILOSOPHY.md`
- **Testing strategy** → Read `development/TESTING_STRATEGY.md`
- **Project structure** → Read `architecture/PROJECT_STRUCTURE.md`
- **Workflow management** → Read `workflows/GITHUB_PROJECTS.md`

---

**This file provides fast access to essential information without reading full documentation.**
