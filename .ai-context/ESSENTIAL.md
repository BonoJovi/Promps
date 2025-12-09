# AI Context - Essential Information Only

**Last Updated**: 2025-12-09
**Purpose**: Minimal context for session startup (token optimization)

---

## Current Status

**Phase**: Phase 2 Complete (v0.0.2) → Phase 3 Next (Verb blocks)
**Tests**: 68 tests at 100% passing
**Branch**: dev (integration branch)

---

## Critical Rules (3 Points Only)

### 1. API Stability
- **Phase 0 APIs are immutable** - Never modify existing functions/structs
- Add new functions instead of changing existing ones
- Details: `@.ai-context/context/coding/API_STABILITY.md`

### 2. Branching Strategy
- **Persistent Feature Branches** - Do NOT delete feature/phase-* branches after merge
- Each branch = One Phase/Layer (module-like persistence)
- Details: `@.ai-context/context/workflows/BRANCHING.md`

### 3. Testing Policy
- **All tests must pass before merge** (68 tests currently)
- Implement tests immediately after feature completion
- Details: `@.ai-context/context/coding/TESTING.md`

---

## Quick File Locations

**Source Code**:
- Core: `src/lib.rs`, `src/commands.rs`
- Frontend: `res/js/main.js`, `res/js/blockly-config.js`

**Tests**:
- Backend: `src/lib.rs` (13 tests), `src/commands.rs` (13 tests)
- Frontend: `res/tests/` (42 tests)

---

## When You Need More Context

**For Coding**:
- Conventions: `@.ai-context/context/coding/CONVENTIONS.md`
- Testing: `@.ai-context/context/coding/TESTING.md`
- API Stability: `@.ai-context/context/coding/API_STABILITY.md`

**For Architecture**:
- Project Structure: `@.ai-context/context/architecture/PROJECT_STRUCTURE.md`
- Tauri Integration: `@.ai-context/context/architecture/TAURI.md`

**For Workflows**:
- Branching: `@.ai-context/context/workflows/BRANCHING.md`
- Release: `@.ai-context/context/workflows/RELEASE.md`

**For Understanding Design Philosophy** (rarely needed):
- Methodology: `@.ai-context/knowledge/methodology/AI_COLLABORATION.md`
- Design Philosophy: `@.ai-context/knowledge/methodology/DESIGN_PHILOSOPHY.md`
- Scale & Architecture: `@.ai-context/knowledge/methodology/SCALE_ARCHITECTURE.md`

---

## Common Operations (Quick Reference)

**Run tests**:
```bash
cargo test && cd res/tests && npm test
```

**Development**:
```bash
cargo tauri dev
```

**Git workflow** (with persistent branches):
```bash
git checkout -b feature/phase-N
# ... implement ...
git commit -m "feat(phase-N): description"
git checkout dev && git merge --no-ff feature/phase-N
git push origin dev
git push origin feature/phase-N  # ← Keep branch alive
```

---

**This file loads < 100 lines. Load other contexts only when needed.**
