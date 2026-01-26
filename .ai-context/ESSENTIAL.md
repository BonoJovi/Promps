# AI Context - Essential Information Only

**Last Updated**: 2026-01-26
**Purpose**: Minimal context for session startup (token optimization)
**Keywords**: essential, quick start, overview, status, current state, 現在の状態, エッセンシャル, 概要, project status, version, tests, テスト, critical rules, 重要なルール, quick reference, クイックリファレンス, entry point, starting point
**Related**: @README.md, @context/coding/API_STABILITY.md, @context/workflows/BRANCHING.md, @context/coding/TESTING.md

---

## Current Status

**Version**: v0.0.5 (Grammar Validation)
**Phase**: Phase 5 Complete (Basic Grammar Validation Engine)
**Tests**: 213 tests at 100% passing (Backend 58 + Frontend 155)
**Branch**: dev (integration branch)

---

## Roadmap

| Version | Phase | Content | Status |
|---------|-------|---------|--------|
| v0.0.3-2 | Phase 3 | Verb blocks | ✅ Complete |
| v0.0.4 | Phase 4 | Project Persistence (save/load) | ✅ Complete |
| v0.0.5 | Phase 5 | Logic Check 基礎 (basic validation) | ✅ Complete |
| v0.0.6 | Phase 6 | Logic Check 拡張 (advanced + suggestions) | Next |
| **v1.0.0** | - | **Stable Release** | After v0.0.6 verification |

---

## Critical Rules (4 Points)

### 1. API Stability
- **Phase 0 APIs are immutable** - Never modify existing functions/structs
- Add new functions instead of changing existing ones
- Details: `@.ai-context/context/coding/API_STABILITY.md`

### 2. Branching Strategy
- **Persistent Feature Branches** - Do NOT delete feature/phase-* branches after merge
- Each branch = One Phase/Layer (module-like persistence)
- Details: `@.ai-context/context/workflows/BRANCHING.md`

### 3. Testing Policy
- **All tests must pass before merge** (213 tests currently)
- Implement tests immediately after feature completion
- Details: `@.ai-context/context/coding/TESTING.md`

### 4. Git Push Policy
- **Always `git pull` before `git push`**
- Reason: GitHub Actions updates README.md (access graph)
- Pushing without pull may cause conflicts

---

## Quick File Locations

**Source Code**:
- Core: `src/lib.rs`, `src/commands.rs`
- Validation: `src/modules/validation.rs`
- Frontend: `res/js/main.js`, `res/js/blockly-config.js`, `res/js/project-manager.js`, `res/js/validation-ui.js`

**Tests**:
- Backend: `src/lib.rs` (13 tests), `src/commands.rs` (25 tests), `src/modules/validation.rs` (20 tests)
- Frontend: `res/tests/` (155 tests)

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

**Shared Context** (via submodule `shared/`):
- Documentation: `@.ai-context/shared/workflows/DOCUMENTATION_CREATION.md`
- Developer Profile: `@.ai-context/shared/developer/YOSHIHIRO_NAKAHARA_PROFILE.md`
- Methodology: `@.ai-context/shared/methodology/AI_COLLABORATION.md`
- Design Philosophy: `@.ai-context/shared/methodology/DESIGN_PHILOSOPHY.md`
- Insights: `@.ai-context/shared/insights/`

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
git pull origin dev  # ← Always pull before push (GitHub Actions updates README)
git push origin dev
git push origin feature/phase-N  # ← Keep branch alive
```

---

**This file loads < 100 lines. Load other contexts only when needed.**
