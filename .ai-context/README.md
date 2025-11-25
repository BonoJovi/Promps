# AI Context Directory

**Last Updated**: 2025-11-25
**Purpose**: Hierarchical AI context for efficient information retrieval

---

## Directory Structure

```
.ai-context/
├── README.md                          # This file
│
├── core/                              # [Always Load] Critical context
│   ├── QUICK_REFERENCE.md            # Fast lookup, current status
│   └── DESIGN_PHILOSOPHY.md          # Core design principles
│
├── development/                       # [When Coding] Development practices
│   ├── METHODOLOGY.md                # AI collaboration methodology
│   ├── TESTING_STRATEGY.md           # TDD strategies
│   └── CONVENTIONS.md                # Coding standards
│
├── architecture/                      # [When Designing] System design
│   ├── PROJECT_STRUCTURE.md          # Module organization
│   └── TAURI_INTEGRATION.md          # Tauri framework specifics
│
└── workflows/                         # [When Managing] Project workflows
    ├── GITHUB_PROJECTS.md            # Issue & feature tracking
    └── I18N_MANAGEMENT.md            # Localization management
```

---

## Usage Guidelines for AI

### When Starting a Session
**Always read**:
- `core/QUICK_REFERENCE.md` - Current phase status, critical decisions
- `core/DESIGN_PHILOSOPHY.md` - Design principles, architecture rationale

### When Implementing Code
**Read**:
- `development/METHODOLOGY.md` - AI collaboration patterns
- `development/CONVENTIONS.md` - Coding standards
- `development/TESTING_STRATEGY.md` - Testing approach

### When Making Design Decisions
**Read**:
- `architecture/PROJECT_STRUCTURE.md` - Module responsibilities
- `architecture/TAURI_INTEGRATION.md` - Framework constraints

### When Managing Tasks
**Read**:
- `workflows/GITHUB_PROJECTS.md` - Issue tracking guidelines
- `workflows/I18N_MANAGEMENT.md` - Translation workflows

---

## File Size Reference

| File | Lines | Category | Priority |
|------|-------|----------|----------|
| QUICK_REFERENCE.md | ~150 | Core | High |
| DESIGN_PHILOSOPHY.md | ~950 | Core | High |
| METHODOLOGY.md | ~1,540 | Development | Medium |
| TESTING_STRATEGY.md | ~280 | Development | Medium |
| CONVENTIONS.md | ~870 | Development | Medium |
| PROJECT_STRUCTURE.md | ~320 | Architecture | Low |
| TAURI_INTEGRATION.md | ~55 | Architecture | Low |
| GITHUB_PROJECTS.md | ~110 | Workflow | Low |
| I18N_MANAGEMENT.md | ~280 | Workflow | Low |

---

## Design Rationale

### Why Hierarchical Structure?

1. **Token Efficiency**: Load only necessary context for current task
2. **Scalability**: Easy to add Phase 2, 3, N... documentation
3. **Maintainability**: Clear separation of concerns
4. **Discoverability**: Intuitive categorization for AI navigation

### Priority Levels

- **High**: Core context, always relevant
- **Medium**: Development context, frequently needed when coding
- **Low**: Specialized context, needed for specific tasks

---

## Maintenance Policy

### When to Update

- **core/**: When fundamental design decisions change
- **development/**: When coding patterns or methodologies evolve
- **architecture/**: When module structure or framework integration changes
- **workflows/**: When project management practices change

### File Size Guidelines

- **core/**: Keep concise, < 200 lines preferred for QUICK_REFERENCE
- **development/**: Split if > 2,000 lines
- **architecture/**: Split by subsystem if needed
- **workflows/**: One file per workflow type

---

## GitHub Copilot CLI Integration

**Automatic Loading**: GitHub Copilot CLI automatically loads contexts referenced in `CLAUDE.md` at the root of the repository.

**No Manual Initialization Required**: The hierarchical structure is transparent to Copilot CLI.

---

**This structure ensures AI assistants can efficiently access the right information at the right time.**
