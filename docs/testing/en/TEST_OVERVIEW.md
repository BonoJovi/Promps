# Test Overview

This document describes the testing strategy, execution methods, and overall test landscape for the Promps project.

**Last Updated**: 2026-02-18
**Total Tests**: 282 (Rust 92 + JavaScript 190)

---

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Architecture](#test-architecture)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Test Design Principles](#test-design-principles)

---

## Testing Philosophy

The Promps project follows an **incremental test implementation** strategy.

### Core Principles

1. **Immediate test implementation**
   - Tests are added immediately after feature implementation
   - Early bug detection minimizes impact on subsequent phases

2. **Maintain 100% pass rate**
   - All tests must pass at all times
   - Never proceed to the next phase with failing tests

3. **Incremental expansion**
   - Tests are added phase by phase: Phase 0, Phase 1, Phase 2, ...
   - Each phase is verified before moving to the next

---

## Test Architecture

### Overview

```
┌──────────────────────────────────────────────┐
│  Frontend (JavaScript)                        │
│  - blockly-config.test.js                    │
│  - main.test.js                              │
│  - project-manager.test.js                   │
│  - validation-ui.test.js                     │
│  - i18n.test.js                              │
│  Total: 190 tests                            │
└──────────────┬───────────────────────────────┘
               │
               │ Tauri IPC
               │
┌──────────────▼───────────────────────────────┐
│  Backend (Rust)                               │
│  - src/lib.rs: 13 tests                      │
│  - src/commands.rs: 25 tests                 │
│  - src/modules/validation.rs: 54 tests       │
│  Total: 92 tests                             │
└──────────────────────────────────────────────┘
```

### Directory Structure

```
Promps/
├── src/                              # Rust backend
│   ├── lib.rs                        # Core logic tests (13)
│   ├── commands.rs                   # Tauri command tests (25)
│   └── modules/
│       └── validation.rs             # Validation engine tests (54)
│
├── res/tests/                        # JavaScript frontend (Jest + JSDOM)
│   ├── blockly-config.test.js        # Block definition & workspace tests
│   ├── main.test.js                  # UI logic & preview tests
│   ├── project-manager.test.js       # Project persistence tests
│   ├── validation-ui.test.js         # Validation UI display tests
│   └── i18n.test.js                  # i18n switching tests
│
└── docs/testing/                     # Test documentation
    ├── ja/                           # Japanese
    └── en/                           # English (this directory)
```

---

## Quick Start

### Run all tests

```bash
# Backend + Frontend
cargo test && cd res/tests && npm test
```

### Frontend only

```bash
cd res/tests
npm test
```

### Backend only

```bash
cargo test
```

---

## Running Tests

### 1. Frontend Tests (JavaScript)

#### Setup (first time only)

```bash
cd res/tests
npm install
```

#### Run all tests

```bash
npm test
```

#### Run a specific file

```bash
npm test blockly-config.test.js
npm test main.test.js
npm test validation-ui.test.js
```

#### Watch mode (during development)

```bash
npm test -- --watch
```

---

### 2. Backend Tests (Rust)

#### Run all tests

```bash
cargo test
```

#### Run specific modules

```bash
cargo test --lib            # lib.rs only
cargo test --bin promps     # commands.rs only
cargo test validation       # validation.rs tests
```

#### Verbose output

```bash
cargo test -- --nocapture
```

---

## Test Design Principles

### Phase 0: Core Tests (CLI)

**Scope**: Core parsing logic
**Coverage**:
- `_N:` prefix identification
- Token splitting logic
- DSL generation

### Phase 1: GUI Integration Tests

**Scope**: Blockly.js integration
**Coverage**:
- Blockly block definitions
- DSL generation (GUI version)
- UI change event handling

### Phase 2: Particle Block Tests

**Scope**: Fixed particle blocks
**Coverage**:
- All 9 particle types (ga, wo, ni, de, to, he, kara, made, yori)
- Fixed label behavior
- Practical sentence generation patterns

### Phase 3: Verb Block Tests

**Scope**: Verb blocks (fixed + custom)
**Coverage**:
- Fixed verb blocks (analyze, summarize, translate, etc.)
- Custom verb input
- Newline block behavior

### Phase 4: Project Persistence Tests

**Scope**: Save/load functionality
**Coverage**:
- Project save/load round-trip
- New project creation
- File dialog integration

### Phase 5-6: Validation Tests

**Scope**: Grammar validation engine
**Coverage**:
- Token classification (Noun, Particle, Verb, Punctuation, etc.)
- Sequence validation rules (6 rules)
- Pattern template matching (7 patterns)
- Japanese and English locale support

---

## Test Coverage

### Test Count by Phase

| Phase | Frontend | Backend | Total |
|-------|----------|---------|-------|
| Phase 0 | 0 | 13 | 13 |
| Phase 1 | 31 | 26 | 57 |
| Phase 2 | 42 | 26 | 68 |
| Phase 3 | 61 | 26 | 87 |
| Phase 4 | — | — | — |
| Phase 5-6 | — | 54 | — |
| v1.1+ (i18n) | — | — | — |
| **Current (v1.3.3)** | **190** | **92** | **282** |

### Pass Rate

- **Current**: 100% (282/282 passing)
- **Target**: Always 100%

---

## Notes

### Node.js Version

Frontend tests use ES Modules, requiring Node.js 14.8.0 or later.

```bash
node --version  # Verify >= v14.8.0
```

### Environment Variables

No special environment variables are required.

### Test Execution Order

Tests are independent and can be run in any order.

---

## Troubleshooting

### Frontend tests fail

```bash
# Reinstall node_modules
cd res/tests
rm -rf node_modules package-lock.json
npm install
npm test
```

### Backend tests fail

```bash
# Clear build cache
cargo clean
cargo test
```

---

## Related Documentation

- [Frontend Test Index](./FRONTEND_TEST_INDEX.md) - Detailed test case index
- [User Guide (EN)](../../user/en/USER_GUIDE.md) - Basic operations
- [User Guide (JA)](../../user/ja/USER_GUIDE.md) - Basic operations (Japanese)
