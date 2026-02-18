# Frontend Test Index

This document is the complete index of JavaScript frontend tests.

**Last Updated**: 2026-02-18
**Total Frontend Tests**: 190

---

## Table of Contents

- [blockly-config.test.js](#blockly-configtestjs)
- [main.test.js](#maintestjs)
- [project-manager.test.js](#project-managertestjs)
- [validation-ui.test.js](#validation-uitestjs)
- [i18n.test.js](#i18ntestjs)

---

## blockly-config.test.js

Tests for Blockly.js block definitions, DSL generation logic, and workspace configuration.

**File**: `res/tests/blockly-config.test.js`

### Test Suites

| Suite | Description |
|-------|-------------|
| Promps Noun Block | Noun block definition and DSL generation |
| Workspace Code Generation | Whole-workspace code generation |
| Promps Other Block | Other block types and DSL generation |
| Mixed Block Types | Multiple block type combinations |
| Blockly Change Event Handling | Event handling |
| Particle Blocks (Phase 2) | Particle block behavior |
| Verb Blocks (Phase 3) | Verb block behavior |
| Newline Blocks (Phase 3) | Newline block behavior |
| Toolbox Configuration | Toolbox structure and categories |

### Key Test Areas

**Noun blocks**: Block definition structure, DSL code generation, Japanese text handling, empty/multi-word text edge cases

**Particle blocks**: All 9 particle types (ga, wo, ni, de, to, he, kara, made, yori), prefix verification, sentence generation patterns

**Verb blocks**: Fixed verb blocks (analyze, summarize, translate), custom verb input, DSL generation

**Toolbox**: Category configuration, block ordering, category names

---

## main.test.js

Tests for UI operations, preview updates, and Tauri command integration.

**File**: `res/tests/main.test.js`

### Test Suites

| Suite | Description |
|-------|-------------|
| updatePreview function | Preview update logic |
| Preview pane updates | Preview panel display |
| Error handling | Tauri error handling |
| Event handling | DOM event processing |

### Key Test Areas

**Preview updates**: Tauri invoke calls, empty/whitespace input handling, generated prompt display

**Japanese support**: Japanese character preservation in preview

**Error handling**: Tauri command error recovery, console logging, crash prevention on invalid input

---

## project-manager.test.js

Tests for project persistence: save, load, and new project operations.

**File**: `res/tests/project-manager.test.js`

### Key Test Areas

**Save/Load**: Round-trip serialization, file path handling, timestamp updates

**New project**: Default state initialization, unsaved changes detection

**File dialogs**: Open/save dialog integration with Tauri

---

## validation-ui.test.js

Tests for validation result display, block highlighting, and auto-fix functionality.

**File**: `res/tests/validation-ui.test.js`

### Key Test Areas

**Result display**: Error/warning message rendering, status indicators (green/red/yellow)

**Block highlighting**: Error highlighting on blocks, clear on fix

**AutoFix**: Automatic block insertion, validation re-run after fix

---

## i18n.test.js

Tests for internationalization (Japanese/English language switching).

**File**: `res/tests/i18n.test.js`

### Key Test Areas

**Translation**: Key lookup, fallback behavior, missing key handling

**Language switching**: Japanese to English toggle, UI label updates, block label updates

**Persistence**: Language preference saved to localStorage

---

## Running Tests

### All frontend tests

```bash
cd res/tests
npm test
```

### Specific file

```bash
npm test blockly-config.test.js
npm test main.test.js
npm test project-manager.test.js
npm test validation-ui.test.js
npm test i18n.test.js
```

### Watch mode

```bash
npm test -- --watch
```

---

## Test Coverage Summary

| Category | Scope |
|----------|-------|
| Block definitions | Noun, particle, verb, punctuation, other blocks |
| DSL generation | Single block, multi-block, mixed types |
| Workspace | Code generation, empty workspace |
| Events | Change events, UI events |
| Preview | Update logic, placeholder, Japanese text |
| Error handling | Tauri errors, invalid input |
| Project persistence | Save, load, new project |
| Validation UI | Error display, block highlight, auto-fix |
| i18n | Translation, language switching |

**Total**: 190 tests at 100% passing

---

## Related Documentation

- [Test Overview](./TEST_OVERVIEW.md) - Overall test strategy
- [User Guide (EN)](../../user/en/USER_GUIDE.md) - Basic operations
