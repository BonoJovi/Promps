# Scale and Architecture

**Last Updated**: 2025-12-08
**Purpose**: Relationship between project scale and architectural pattern selection

---

## Core Principle

**Architecture is a tool, not a dogma.**

The same architectural pattern does not apply to all project scales. Choose the right tool for the right scale.

---

## Promps: Intentionally Minimal

### Design Constraints

```
Purpose: Single (DSL → Natural Language translation)
Phases: Finite (5-10 layers maximum)
Dependencies: Unidirectional (Phase N → Phase 0)
Interdependencies: Minimal
Complexity: Intentionally low
```

### Why Minimal Implementation

**NOT because**:
- Limited time/resources
- Prototype only
- Lack of ambition

**BUT because**:
- ✅ Enables pure layered architecture
- ✅ Allows architectural experimentation
- ✅ Simplifies documentation
- ✅ Proves design principles
- ✅ Serves as reference implementation

### Unix Philosophy Application

```
"Do one thing and do it well"
  ↓
Promps does ONE thing: DSL → NL translation
  ↓
Does it well: Pure layered architecture
```

---

## KakeiBon: Necessarily Complex

### System Characteristics

```
Purpose: Multiple (user management, transactions, encryption, reporting, i18n...)
Features: 10+ screens
Tables: 10+ database tables
Tests: 525 tests
Dependencies: Bidirectional (transactions ↔ accounts ↔ categories)
Complexity: Inherently high
```

### Why Layered Architecture Would Fail

**If applied strictly**:
```
Phase 0: Database access
Phase 1: Encryption layer
Phase 2: User management
Phase 3: Account management
Phase 4: Category management
Phase 5: Transaction management
Phase 6: Aggregation features
Phase 7: UI layer
...
Phase 15-20: ???

Problems:
- Too many phases (unmanageable)
- Complex interdependencies (circular dependencies unavoidable)
- Feature branch explosion (15-20 persistent branches)
- API stability impossible (everything depends on everything)
```

**What KakeiBon used instead**:
- Modularization (not layering)
- Strategic commonalization
- SQL centralization
- Constants externalization
- Traditional Git Flow (feature branches deleted after merge)

---

## Scale-Architecture Matrix

| Scale | Phase Count | Architecture | Branching Strategy | Example |
|-------|-------------|--------------|-------------------|---------|
| **Small** | 5-10 | Pure Layered | Persistent Feature Branch | Promps |
| **Medium** | 10-20 | Hybrid (Layered + Modular) | Modified Git Flow | - |
| **Large** | 20+ | Microservices / Modular | Feature Flags / Trunk-based | KakeiBon |

---

## When Layered Architecture Works

### Ideal Conditions

✅ **Single primary purpose**
- Example: Promps (DSL translation only)

✅ **Finite layer count** (< 10)
- Can enumerate all phases upfront

✅ **Clear layer boundaries**
- Each phase has distinct responsibility

✅ **Unidirectional dependencies**
- Upper layers depend on lower layers only

✅ **Minimal interdependencies**
- Layers don't need to communicate sideways

✅ **Stable core layer**
- Phase 0 API can remain immutable

### Benefits When Conditions Met

- Loose coupling (automatic)
- Easy module separation
- Persistent feature branches work well
- API stability policy is practical
- Merge conflicts are rare

---

## When Layered Architecture Fails

### Warning Signs

❌ **Multiple competing purposes**
- Example: "User management AND reporting AND encryption AND..."

❌ **Unclear layer count**
- "We'll figure out layers as we go"

❌ **Fuzzy boundaries**
- "This feature could be Phase 3 or Phase 5..."

❌ **Circular dependencies**
- Transactions need Categories, Categories need Transactions

❌ **Many interdependencies**
- Every feature touches 5+ other features

❌ **Unstable core**
- Phase 0 API needs frequent changes

### What Happens

- Tight coupling emerges
- Module separation is difficult
- Persistent branches become a burden
- API stability is impossible
- Merge conflicts are frequent

### Alternative Approaches

**For medium projects**:
- Modular architecture (not layered)
- Service-oriented architecture
- Plugin architecture

**For large projects**:
- Microservices
- Feature flags
- Trunk-based development

---

## KakeiBon → Promps Knowledge Transfer

### What KakeiBon Taught (Practice)

```
Implicit patterns discovered:
- Modularization works
- Commonalization is critical
- SQL centralization reduces cognitive load
- Constants externalization improves clarity
- Immediate testing catches issues early
```

### What Promps Formalized (Theory)

```
Explicit principles extracted:
- Layered Architecture (when scale permits)
- Non-Breaking Extension Principle
- API Stability Policy
- Persistent Feature Branch strategy
- Loose Coupling as emergent property
```

### Complementary Relationship

```
KakeiBon (Complex system)
  ↓ Extracted patterns from practice
Promps (Simple system)
  ↓ Formalized as design principles
.ai-context/ (Documentation)
  ↓ Reusable knowledge
Future projects
```

**Together, not separately**:
- KakeiBon alone → "It worked, but why?"
- Promps alone → "Nice theory, but does it work?"
- **Both** → Practice ↔ Theory integration

---

## Scalability Limits of This Approach

### Promps Approach Works When

```
Phase count: 5-10 (manageable)
Feature branches: 5-10 (trackable)
Developers: 1-3 (coordination easy)
Purpose: Single (clear boundaries)
```

### Breaks Down When

```
Phase count: 15-20+ (overwhelming)
Feature branches: 15-20+ (chaos)
Developers: 10+ (coordination hard)
Purpose: Multiple (fuzzy boundaries)
```

---

## Decision Framework

### For New Projects

**Ask these questions**:

1. **How many distinct purposes?**
   - Single → Consider layered architecture
   - Multiple → Consider modular architecture

2. **Can you enumerate all phases upfront?**
   - Yes, < 10 → Layered might work
   - No, or > 10 → Modular is safer

3. **Are dependencies unidirectional?**
   - Mostly yes → Layered might work
   - No (circular) → Modular is safer

4. **Is the core stable?**
   - Yes → API stability policy works
   - No → Use versioning/deprecation

5. **How many developers?**
   - 1-3 → Persistent branches work
   - 10+ → Traditional Git Flow

---

## Key Insights

### 1. Minimal ≠ Trivial

```
Promps is minimal by design:
- NOT because it's a toy project
- BUT because minimalism enables architectural purity
```

### 2. Scale Determines Strategy

```
Same principles, different implementations:
- Small: Pure layered architecture
- Large: Modular architecture

Both use: Commonalization, testing, clear boundaries
```

### 3. Architecture is Contextual

```
No universal "best architecture"
  ↓
Best architecture = Best fit for context
  ↓
Context = Scale + Purpose + Team + Constraints
```

### 4. Experimentation Requires Simplicity

```
Complex system (KakeiBon):
- Hard to isolate principles
- Many confounding factors

Simple system (Promps):
- Easy to test principles
- Clear cause-effect relationships
  ↓
Promps serves as architectural laboratory
```

---

## Practical Guidance

### Starting a New Project

**Step 1: Assess scale**
```bash
# Estimate phase count
# If < 10: Consider layered
# If > 10: Consider modular
```

**Step 2: Check dependencies**
```bash
# Draw dependency graph
# If mostly unidirectional: Layered works
# If many circular: Modular is safer
```

**Step 3: Evaluate team**
```bash
# If small team (1-3): Persistent branches OK
# If large team (10+): Traditional Git Flow
```

**Step 4: Start minimal**
```bash
# Implement core only
# Validate architecture works
# Then expand
```

---

## Related Documentation

- **DESIGN_PHILOSOPHY.md**: Core design principles (Promps-specific)
- **BRANCHING_STRATEGY.md**: Persistent Feature Branch details
- **API_STABILITY.md**: API stability policy

---

**For contributor-facing documentation, see**: `docs/ja/contributor/SCALE_AND_ARCHITECTURE.md`
