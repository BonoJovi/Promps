# AI Context Directory - Optimized for Token Efficiency

**Last Updated**: 2025-12-09
**Purpose**: Hierarchical AI context with lazy loading for optimal token usage

---

## Token Optimization Strategy

**Problem**: Previous structure loaded ~8,400 lines (~9% token budget) at session startup.

**Solution**: 3-tier architecture with lazy loading.

**Result**: < 100 lines loaded at startup (~2-3% token budget).

---

## Directory Structure

```
.ai-context/
├── ESSENTIAL.md                    # [Tier 1] Always loaded (< 100 lines)
│
├── context/                        # [Tier 2] Load when working on specific tasks
│   ├── coding/
│   │   ├── CONVENTIONS.md          # Coding standards
│   │   ├── TESTING.md              # Testing strategy (was TESTING_STRATEGY.md)
│   │   └── API_STABILITY.md        # API change policy
│   │
│   ├── architecture/
│   │   ├── PROJECT_STRUCTURE.md    # Module organization
│   │   └── TAURI.md                # Tauri framework (was TAURI_INTEGRATION.md)
│   │
│   └── workflows/
│       ├── BRANCHING.md            # Branching strategy (was BRANCHING_STRATEGY.md)
│       ├── RELEASE.md              # Release process (was RELEASE_PROCESS.md)
│       ├── GITHUB_PROJECTS.md      # Issue tracking
│       └── I18N.md                 # i18n management (was I18N_MANAGEMENT.md)
│
├── knowledge/                      # [Tier 3] Load when understanding design rationale
│   ├── methodology/
│   │   ├── AI_COLLABORATION.md     # AI collaboration patterns (was METHODOLOGY.md)
│   │   ├── DESIGN_PHILOSOPHY.md    # Core design principles
│   │   └── SCALE_ARCHITECTURE.md   # Scale considerations (was SCALE_AND_ARCHITECTURE.md)
│   │
│   └── archive/
│       └── QUICK_REFERENCE.md      # Historical reference (replaced by ESSENTIAL.md)
│
├── insights/                       # [Optional] Architectural insights
│   ├── AI_COGNITIVE_AUGMENTATION.md
│   ├── NECESSITY_DRIVEN_DESIGN.md
│   ├── PARALLEL_PREDICTION_INSIGHTS.md
│   ├── SOFTWARE_AS_ORGANISM.md
│   └── WHY_REFACTORING_FAILS.md
│
└── README.md                       # This file
```

---

## Usage Guidelines for AI

### Session Startup (Automatic)
- **ESSENTIAL.md** is loaded automatically via CLAUDE.md
- Contains: Current phase, critical rules, quick references
- Size: < 100 lines (token-efficient)

### When Coding
Load as needed:
- `@.ai-context/context/coding/CONVENTIONS.md` - Coding standards
- `@.ai-context/context/coding/TESTING.md` - Testing approach
- `@.ai-context/context/coding/API_STABILITY.md` - API change rules

### When Designing
Load as needed:
- `@.ai-context/context/architecture/PROJECT_STRUCTURE.md`
- `@.ai-context/context/architecture/TAURI.md`

### When Managing Workflows
Load as needed:
- `@.ai-context/context/workflows/BRANCHING.md` - Git workflow
- `@.ai-context/context/workflows/RELEASE.md` - Release procedure
- `@.ai-context/context/workflows/I18N.md` - Localization

### When Understanding "Why"
Load only if you need to understand design rationale (rare):
- `@.ai-context/knowledge/methodology/AI_COLLABORATION.md`
- `@.ai-context/knowledge/methodology/DESIGN_PHILOSOPHY.md`
- `@.ai-context/knowledge/methodology/SCALE_ARCHITECTURE.md`

---

## File Size Reference (Tier 2 & 3)

### Tier 2: Context (Load when working)
| File | Approx Lines | Load When |
|------|-------------|-----------|
| CONVENTIONS.md | ~870 | Implementing code |
| TESTING.md | ~280 | Writing tests |
| API_STABILITY.md | ~330 | Modifying APIs |
| PROJECT_STRUCTURE.md | ~320 | Understanding modules |
| TAURI.md | ~55 | Tauri-specific tasks |
| BRANCHING.md | ~310 | Git operations |
| RELEASE.md | ~220 | Creating releases |
| GITHUB_PROJECTS.md | ~110 | Issue management |
| I18N.md | ~280 | Localization tasks |

### Tier 3: Knowledge (Rarely load)
| File | Approx Lines | Load When |
|------|-------------|-----------|
| AI_COLLABORATION.md | ~1,540 | Understanding methodology |
| DESIGN_PHILOSOPHY.md | ~950 | Understanding architecture |
| SCALE_ARCHITECTURE.md | ~400 | Understanding scalability |

---

## Design Rationale

### Why 3 Tiers?

**Tier 1 (ESSENTIAL.md)**:
- Always loaded, must be minimal
- Contains only what's needed for 90% of tasks
- < 100 lines target

**Tier 2 (context/)**:
- Task-specific contexts
- Loaded on-demand when working on specific areas
- Moderate size (100-1,000 lines per file)

**Tier 3 (knowledge/)**:
- Design philosophy and rationale
- Rarely needed (only when understanding "why")
- Large files (1,000+ lines)

### Token Usage Comparison

| Configuration | Lines Loaded | Token Usage | Use Case |
|--------------|-------------|-------------|----------|
| **Old** (Always Load All) | ~8,400 | ~9% | Every session |
| **New** (ESSENTIAL only) | < 100 | ~2-3% | Default |
| **New** (+ 1 context file) | ~200-1,000 | ~3-5% | Working on specific task |
| **New** (+ 1 knowledge file) | ~1,100-1,600 | ~5-8% | Understanding methodology |

---

## Maintenance Policy

### When to Update ESSENTIAL.md
- Current phase status changes
- Critical rule changes (rare)
- File location references change

### When to Update Tier 2 (context/)
- Coding standards evolve
- Workflow processes change
- Architecture changes

### When to Update Tier 3 (knowledge/)
- Design philosophy evolves
- Methodology refinements
- Historical insights

### File Size Guidelines
- **ESSENTIAL.md**: Keep < 100 lines (strict)
- **Tier 2 files**: < 1,000 lines preferred, split if larger
- **Tier 3 files**: No limit (rarely loaded anyway)

---

## Migration Notes (2025-12-09)

### What Changed
- Created 3-tier structure (was 2-tier)
- Moved ~8,400 lines from "always load" to "load on demand"
- Renamed files for brevity (removed _STRATEGY, _PROCESS suffixes)
- Archived QUICK_REFERENCE.md (replaced by ESSENTIAL.md)

### What Stayed the Same
- File content is unchanged (only moved/renamed)
- All information is still accessible
- No information was deleted

### For Existing Sessions
- Old `@.ai-context/core/QUICK_REFERENCE.md` → Now `@.ai-context/ESSENTIAL.md`
- Old `@.ai-context/development/` → Now `@.ai-context/context/coding/`
- Old `@.ai-context/architecture/` → Now `@.ai-context/context/architecture/`
- Old `@.ai-context/workflows/` → Now `@.ai-context/context/workflows/`
- Old `@.ai-context/core/DESIGN_PHILOSOPHY.md` → Now `@.ai-context/knowledge/methodology/`

---

**This structure ensures AI assistants can efficiently access the right information at the right time, with minimal token overhead.**
