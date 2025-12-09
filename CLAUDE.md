# Promps Project Context

This file automatically loads **minimal** project context at the start of each Claude Code session.

**Token Optimization**: Only essential information is loaded by default. Load additional contexts as needed using `@` references.

---

## Always Load (Essential Context Only)

### Essential Information - Current Status & Critical Rules
@.ai-context/ESSENTIAL.md

---

## Load When Needed (On-Demand Contexts)

**For Coding Tasks**:
- Conventions: `@.ai-context/context/coding/CONVENTIONS.md`
- Testing Strategy: `@.ai-context/context/coding/TESTING.md`
- API Stability: `@.ai-context/context/coding/API_STABILITY.md`

**For Architecture Tasks**:
- Project Structure: `@.ai-context/context/architecture/PROJECT_STRUCTURE.md`
- Tauri Integration: `@.ai-context/context/architecture/TAURI.md`

**For Workflow Tasks**:
- Branching Strategy: `@.ai-context/context/workflows/BRANCHING.md`
- Release Process: `@.ai-context/context/workflows/RELEASE.md`
- GitHub Projects: `@.ai-context/context/workflows/GITHUB_PROJECTS.md`
- i18n Management: `@.ai-context/context/workflows/I18N.md`

**For Understanding Methodology** (rarely needed):
- AI Collaboration: `@.ai-context/knowledge/methodology/AI_COLLABORATION.md`
- Design Philosophy: `@.ai-context/knowledge/methodology/DESIGN_PHILOSOPHY.md`
- Scale & Architecture: `@.ai-context/knowledge/methodology/SCALE_ARCHITECTURE.md`

**Insights** (optional reading):
- `@.ai-context/insights/` - Various architectural and development insights

---

**Performance Note**: This configuration loads < 100 lines at session startup (vs. ~4,000+ lines previously). This reduces initial token usage from ~9% to ~2-3%.
