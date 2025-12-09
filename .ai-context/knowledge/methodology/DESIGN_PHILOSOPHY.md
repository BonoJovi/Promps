# Promps Design Philosophy and Implementation Strategy

**Last Updated**: 2025-12-08
**Purpose**: Core design decisions and implementation roadmap for AI context preservation
**Keywords**: design philosophy, 設計思想, design decisions, 設計判断, implementation strategy, 実装戦略, DSL, domain specific language, ドメイン特化言語, natural language, 自然言語, prompt generation, プロンプト生成, visual programming, ビジュアルプログラミング, Blockly, layered architecture, レイヤードアーキテクチャ
**Related**: @SCALE_ARCHITECTURE.md, @AI_COLLABORATION.md, @PROJECT_STRUCTURE.md

---

## 🎯 Project Purpose

Promps is a **DSL (Domain Specific Language) to Natural Language translator** for AI prompt generation.

### Core Concept
```
[Input] Simplified DSL (Internal Representation)
   ↓
_N:User が _N:Order を 作成
   ↓
[Processing] Syntax Analysis + Logic Check + Optimization
   ↓
[Output] Natural Language Prompt (for AI)
   ↓
"ユーザーが注文を作成する機能を実装してください。
UserエンティティとOrderエンティティの関係性を考慮し、
適切なデータモデルを設計してください。"
```

---

## 🧠 Thinking Methodology

### Data-Driven, Bottom-Up Approach

1. **Concrete First**: Start with actual data structures (tables, fields, objects)
2. **Drilldown**: Detailed analysis from concrete examples
3. **Bottom-Up**: Abstract patterns emerge naturally from data
4. **Cognitive Mapping**: Users discover DDD concepts organically

### Why This Works with AI

- **Context-based prompts**: Uses relationships (connectives) instead of isolated keywords
- **Relationship graphs**: AI understands connections between concepts
- **Scalable expressions**: OOP-like flexibility in prompt structure
- **Natural discovery**: Users learn patterns through practice, not theory

---

## 🔑 Critical Design Decision: _N: Prefix

### Purpose: AST-like Annotation System

The `_N:` prefix is **NOT** just a marker - it's a **syntactic annotation** similar to type information in compilers.

### Why _N: Exists

```rust
// Without _N: (Ambiguous)
"ユーザー データ 保存"
→ Which are nouns? AI must infer → Uncertainty

// With _N: (Explicit)
"_N:ユーザー _N:データ 保存"
→ Nouns are definite → Focus on logic check
→ Only need to analyze particles (が、を、に)
```

### Benefits for Logic Check

1. ✅ **Reliable noun extraction**: `is_noun == true` is guaranteed
2. ✅ **Particle analysis focus**: Don't need to infer parts of speech
3. ✅ **Pattern matching simplicity**: Nouns are pre-identified
4. ✅ **Future validation**: Foundation for semantic validation

### User Experience

**Phase 0 (CLI)**: Manual annotation - tedious but temporary
- `_N:User が _N:Order を 作成` ← User types manually
- Only used by developers for bootstrapping

**Phase 1+ (GUI)**: Automatic annotation - seamless
```javascript
// User drags "Noun Block" with text "User"
// ↓ Internally generates:
"_N:User"
// User never sees _N: prefix
```

---

## 📊 Responsibility Separation (Inter-App)

### What Promps DOES (Syntax Check)

1. ✅ **Token pattern validation**: Check if part-of-speech order is grammatically correct
2. ✅ **Noun relationship check**: Verify relationships between nouns are explicitly stated

### What Promps DOES NOT DO (Semantic Analysis)

❌ **Meaning validation**: Whether "User creates Color" makes sense semantically
❌ **Domain knowledge**: Whether User and Order relationship is appropriate
❌ **Deep context**: Whether this sentence contradicts previous sentences (meaning-wise)

### Why This Matters

```
┌──────────────┐
│   Promps     │ ← Syntax validation only
└──────┬───────┘
       │ Generated prompt
       ↓
┌──────────────┐
│   AI/LLM     │ ← Semantic understanding
└──────────────┘
```

**Reasoning**: No need to duplicate semantic analysis - that's the AI's job.

---

## 🇯🇵 Japanese Language Challenge

### Why Logic Check is the Bottleneck

**Problem**: Japanese has extreme word order flexibility

```
English (Fixed order):
"User creates Order" ← Subject-Verb-Object (SVO)
"Order creates User" ← Different meaning

Japanese (Free order):
"_N:ユーザー が _N:注文 を 作成する"
"_N:注文 を _N:ユーザー が 作成する"
"作成する _N:注文 を _N:ユーザー が"
↑ All mean the same thing but different word order
```

### Challenges

1. **Word order variability**: A=B and B=A can be the same meaning
2. **Particle system**: 助詞 (が、を、に、で) determine noun roles
3. **Subject/predicate omission**: Common in Japanese, must infer from context
4. **Bidirectional relations**: "User が Order を 持つ" ≡ "Order は User に 属する"

### Why _N: Helps

```
Without _N:
"ユーザー が 注文 を 作成"
→ Must infer which are nouns from particles
→ Double burden: part-of-speech + logic check

With _N:
"_N:ユーザー が _N:注文 を 作成"
→ Nouns are known
→ Focus only on particle analysis
→ Can handle any word order
```

---

## 🏗️ Architecture: Compiler AST Analogy

### Promps ≈ Compiler Structure

| Compiler | Promps | Status |
|----------|--------|--------|
| Lexical Analysis (Lexer) | Tokenization (_N: identification) | ✅ Phase 0 |
| Syntax Analysis (Parser) | AST construction | 🔜 Phase N |
| Syntax Validation | Pattern matching | 🔜 Phase N |
| Semantic Analysis | - | ❌ AI/LLM responsibility |
| Type Checking | Noun relationship check | 🔜 Phase N |
| Intermediate Representation | Normalized AST | 🔜 Phase N+1 |
| Code Generation | Prompt output | ✅ Phase 0 |

### Current Implementation (Phase 0)

```rust
// Lexical tokens
struct PromptPart {
    is_noun: bool,  // Part-of-speech tag
    text: String,   // Token text
}

// Parsing rules
- Token delimiter: single space
- Sentence delimiter: double space (or more)
- Noun marking: _N: prefix anywhere in sentence
```

### Future Implementation (Phase N)

```rust
// AST structure
enum ASTNode {
    Sentence {
        subject: Option<Noun>,
        object: Option<Noun>,
        verb: Action,
        particles: Vec<Particle>,
    },
    // ...
}

// Pattern matching validation
fn validate_pattern(parts: &[PromptPart]) -> Result<()> {
    match extract_pattern(parts) {
        [Noun, Particle("が"), Noun, Particle("を"), Verb] => Ok(),
        [Noun, Particle("を"), Verb] => Ok(),
        // ... 50-100 patterns
        _ => Err(ValidationError::InvalidPattern)
    }
}
```

---

## 🎯 Implementation Strategy

### Phase Breakdown

| Phase | Content | Difficulty | Estimated Time |
|-------|---------|-----------|----------------|
| Phase 0 | CLI implementation | ⭐ | 1 hour ✅ |
| Phase 1 | Tauri + Blockly.js GUI | ⭐⭐ | 2-3 hours |
| Phase 2 | Add block types | ⭐⭐ | 1-2 hours |
| **Phase N** | **Logic Check (AST)** | **⭐⭐⭐⭐⭐** | **Weeks to months** |
| Phase N+1 | Project file save/load | ⭐⭐ | 2-3 hours |
| Phase N+2 | Layout customization | ⭐⭐ | 2-7 hours |

### Phase N: The Bottleneck

**Why it's hard:**
1. Japanese word order flexibility
2. 50-100+ pattern combinations
3. Particle analysis complexity
4. Bidirectional relationship normalization

**Why it's manageable:**
- ✅ No semantic analysis needed (AI's job)
- ✅ Pattern matching only (no meaning inference)
- ✅ Can start with minimal patterns (5-10)
- ✅ Incremental expansion based on usage

**Fallback strategy:**
If too complex → Restrict word order to canonical form (simplified language)

### Phase N Implementation Plan

```rust
// Step 1: Minimal patterns (5-10)
match pattern {
    [N, が, V] => Ok(),
    [N, を, V] => Ok(),
    [N, が, N, を, V] => Ok(),
    _ => Err("Unsupported pattern")
}

// Step 2: Incremental expansion
// Add commonly used patterns based on user feedback

// Step 3: Normalization
// Convert free word order to canonical form
normalize("[N, を, N, が, V]") → "[N, が, N, を, V]"

// Step 4: Relationship validation
validate_noun_relationships() {
    if (nouns.len() >= 2 && !has_relational_particle()) {
        Err("Missing relationship marker")
    }
}
```

---

## 🏛️ Layered Architecture: Critical Design Philosophy

### The Non-Breaking Extension Principle

**Core Principle**: Phase N validation is implemented as a **separate layer on top of Phase 0**, not as modifications to Phase 0 core.

### Why Layered Architecture?

```
Traditional Approach (Breaking Changes):
  Phase 0: parse_input() → Vec<PromptPart>
  ↓ (Modify Phase 0)
  Phase N: parse_input() → Result<Vec<PromptPart>, ValidationError>
  ↓
  Problem: All existing code breaks!
```

```
Layered Approach (Non-Breaking):
  ┌─────────────────────────────────────┐
  │   Phase N: Validation Layer        │  ← NEW
  │   ├─ parse_input_checked()         │
  │   ├─ validate_pattern()             │
  │   └─ Error → Re-prompt user         │
  └────────────┬────────────────────────┘
               │ Validation OK
               ▼
  ┌─────────────────────────────────────┐
  │   Phase 0: Core Parsing Layer      │  ← UNCHANGED
  │   ├─ parse_input()                 │
  │   ├─ generate_prompt()             │
  │   └─ PromptPart                    │
  └─────────────────────────────────────┘
```

### Implementation Example

**Phase 0 Core (Unchanged)**:
```rust
// src/lib.rs (Phase 0)
pub fn parse_input(input: &str) -> Vec<PromptPart> {
    // Original implementation
    // No modifications needed
}

pub fn generate_prompt(parts: &[PromptPart]) -> String {
    // Original implementation
    // No modifications needed
}
```

**Phase N Validation Layer (New)**:
```rust
// src/modules/validation.rs (Phase N)
use crate::{parse_input, PromptPart};

pub fn parse_input_checked(input: &str) -> Result<Vec<PromptPart>, ValidationError> {
    // 1. Reuse Phase 0 core (no modification)
    let parts = parse_input(input);

    // 2. Add validation on top
    validate_pattern(&parts)?;
    validate_noun_relationships(&parts)?;

    // 3. Return validated result
    Ok(parts)
}

fn validate_pattern(parts: &[PromptPart]) -> Result<(), ValidationError> {
    // Pattern matching logic
}

fn validate_noun_relationships(parts: &[PromptPart]) -> Result<(), ValidationError> {
    // Relationship checking logic
}
```

**Tauri Command Layer**:
```rust
// src/commands.rs
#[tauri::command]
pub fn process_prompt_with_validation(input: String) -> Result<String, String> {
    // Use Phase N validation layer
    let parts = parse_input_checked(&input)
        .map_err(|e| format!("Validation error: {:?}", e))?;

    Ok(generate_prompt(&parts))
}

#[tauri::command]
pub fn process_prompt_without_validation(input: String) -> String {
    // Direct Phase 0 usage (still available)
    let parts = parse_input(&input);
    generate_prompt(&parts)
}
```

### Benefits of Layered Architecture

**1. Zero Migration Cost**
```
Existing code: parse_input() → Still works
New code: parse_input_checked() → Optional upgrade
  ↓
No breaking changes, no migration needed
```

**2. Separation of Concerns**
```
Phase 0 Layer: Responsible for parsing only
Phase N Layer: Responsible for validation only
  ↓
Each layer has one job (Single Responsibility Principle)
```

**3. Testability**
```
Phase 0 tests: Test parsing logic
Phase N tests: Test validation logic
  ↓
Independent test suites, clear boundaries
```

**4. Flexibility**
```
Use case A: Need validation → Use parse_input_checked()
Use case B: Skip validation → Use parse_input()
  ↓
Users choose based on needs
```

**5. Open-Closed Principle**
```
Open for extension: Add new validation layer
Closed for modification: Phase 0 core unchanged
  ↓
Fundamental design principle from SOLID
```

### Real-World Usage Pattern

**GUI Application (Phase 1+)**:
```javascript
// res/js/blockly-handler.js
async function processBlocks() {
    const input = generateInputFromBlocks();

    try {
        // Use validation layer in GUI
        const prompt = await invoke('process_prompt_with_validation', { input });
        displayPrompt(prompt);
    } catch (error) {
        // Show validation error to user
        showValidationError(error);
        highlightInvalidBlocks();
    }
}
```

**CLI Tool (Advanced Users)**:
```rust
// src/main.rs
fn main() {
    let input = get_user_input();

    if args.strict {
        // Strict mode: Use validation
        match parse_input_checked(&input) {
            Ok(parts) => println!("{}", generate_prompt(&parts)),
            Err(e) => eprintln!("Error: {:?}", e),
        }
    } else {
        // Permissive mode: Skip validation
        let parts = parse_input(&input);
        println!("{}", generate_prompt(&parts));
    }
}
```

### Architectural Principles Applied

**1. Dependency Inversion**
```
Phase N depends on Phase 0 abstractions (parse_input)
Phase 0 does not depend on Phase N
  ↓
High-level modules depend on low-level modules
```

**2. Interface Segregation**
```
parse_input(): Minimal interface (Vec<PromptPart>)
parse_input_checked(): Extended interface (Result<...>)
  ↓
Clients use only what they need
```

**3. Liskov Substitution**
```
parse_input_checked() returns Vec<PromptPart> when Ok
Can be used anywhere parse_input() is expected (when unwrapped)
  ↓
Behavioral compatibility maintained
```

### Why This Matters

**Traditional "Add Error Handling" Approach**:
```
Problems:
- Breaks existing code
- Requires migration
- Forces validation on all users
- Couples parsing and validation
```

**Layered Architecture Approach**:
```
Benefits:
- Preserves existing code
- No migration needed
- Validation is optional
- Clear separation of concerns
- Follows SOLID principles
- Extensible for future phases
```

### Future Phase Extensions

This pattern extends naturally to future phases:

```
┌─────────────────────────────────────┐
│   Phase N+2: Optimization Layer    │
│   optimize_prompt()                 │
└────────────┬────────────────────────┘
             │
┌─────────────────────────────────────┐
│   Phase N+1: Serialization Layer   │
│   save_project() / load_project()   │
└────────────┬────────────────────────┘
             │
┌─────────────────────────────────────┐
│   Phase N: Validation Layer         │
│   parse_input_checked()             │
└────────────┬────────────────────────┘
             │
┌─────────────────────────────────────┐
│   Phase 0: Core Parsing Layer       │
│   parse_input() / generate_prompt() │
└─────────────────────────────────────┘
```

Each new phase adds a layer without modifying existing layers. This is the **foundation of sustainable software architecture**.

---

## 🔗 Loose Coupling: An Emergent Property

**Last Updated**: 2025-12-08

### The Automatic Benefit

A critical insight about layered architecture: **Loose coupling emerges automatically** from the design, not as an explicit goal.

When you enforce the Non-Breaking Extension Principle, the system naturally becomes loosely coupled without additional effort.

### Why Loose Coupling Emerges

**1. Unidirectional Dependencies**

```
Phase N → Phase 0 (calls only)
Phase 0 ← Phase N (never modified)
```

**Traditional Development (Tight Coupling)**:
```rust
// Tight coupling example
fn process_data(data: &mut Data) {
    validate(data);      // validate might modify data?
    transform(data);     // transform might modify data?
    save(data);          // save might modify data?
}
// → Functions mutually influence each other
```

**Layered Architecture (Loose Coupling)**:
```rust
// Phase 0: Core (immutable)
pub fn parse_input(input: &str) -> Vec<PromptPart> {
    // Pure function: input → output only
}

// Phase N: Validation (upper layer)
pub fn parse_input_checked(input: &str) -> Result<Vec<PromptPart>, ValidationError> {
    let parts = parse_input(input);  // Just "use" Phase 0
    validate_pattern(&parts)?;        // Phase N's own logic
    Ok(parts)
}
// → Phase 0 is untouched = Loose coupling
```

**2. Stable Interfaces**

```
Phase 0 API = Contract
  ↓
Upper layers depend on this contract
  ↓
Contract never changes = Low coupling
```

**3. Clear Separation of Concerns**

```
Phase 0: Parsing (DSL → Data structure)
Phase N: Validation (Data structure → Error checking)
Phase N+1: File I/O (Data structure → JSON)
  ↓
Each layer does one thing (Single Responsibility Principle)
  ↓
Changes are local = Loose coupling
```

---

### Module Separation Becomes Trivial

**1. Natural File Division**

```
src/
├── lib.rs              # Phase 0 (Core)
├── modules/
│   ├── validation.rs   # Phase N
│   ├── serialization.rs # Phase N+1
│   └── layout.rs       # Phase N+2
```

Each Phase = Independent file → Directly becomes a module

**2. Test Independence**

```rust
// Phase 0 tests (independent of Phase N)
#[test]
fn test_parse_input() {
    let result = parse_input("_N:User");
    assert_eq!(result.len(), 1);
}

// Phase N tests (uses Phase 0, tests Phase N)
#[test]
fn test_validate_pattern() {
    let parts = parse_input("_N:User が _N:Order を");  // Use Phase 0
    assert!(validate_pattern(&parts).is_ok());          // Test Phase N
}
```

Even if Phase 0 is broken, Phase N tests can be written (mockable).

**3. Easy Refactoring**

```rust
// Completely change Phase N implementation
// Phase 0 remains untouched

// Before
pub fn validate_pattern(parts: &[PromptPart]) -> Result<()> {
    // Implementation A
}

// After (complete rewrite)
pub fn validate_pattern(parts: &[PromptPart]) -> Result<()> {
    // Implementation B (totally different algorithm)
}

// Phase 0: Zero changes!
```

---

### Practical Benefits of Loose Coupling

**1. Parallel Development**

```
Developer A: Develops Phase 3 (Verb blocks)
Developer B: Develops Phase N (Logic check)
  ↓
If Phase 0 is stable, no conflicts
```

**2. Incremental Replacement**

```
Phase N Implementation A is slow
  ↓
Develop Phase N Implementation B on separate branch
  ↓
Implementation B is faster → Swap
  ↓
Phase 0, N+1, N+2: No impact
```

**3. Easy Feature Toggle**

```rust
// To disable Phase N
pub fn parse_input_checked(input: &str) -> Result<Vec<PromptPart>, ValidationError> {
    let parts = parse_input(input);
    // validate_pattern(&parts)?;  // ← Just comment out
    Ok(parts)
}
```

**4. Risk Isolation**

```
Phase N has a critical bug
  ↓
Disable Phase N temporarily
  ↓
Phase 0, Phase 1, Phase 2 continue working
  ↓
System remains partially functional
```

---

### Comparison: Traditional vs Layered

| Aspect | Traditional | Layered Architecture |
|--------|-------------|---------------------|
| **Coupling** | Functions call each other bidirectionally | Unidirectional dependency |
| **Change Impact** | Ripple effect across modules | Isolated to single layer |
| **Testing** | Complex mocking needed | Simple, independent tests |
| **Refactoring** | High risk, wide impact | Low risk, local impact |
| **Parallel Development** | Difficult (merge conflicts) | Easy (layer isolation) |
| **Module Extraction** | Requires careful planning | Natural file boundaries |

---

### Code Quality Metrics Improvement

With layered architecture, the following metrics improve automatically:

**Cohesion**: ⬆️ High
- Each layer has a single, well-defined purpose
- Functions within a layer work together closely

**Coupling**: ⬇️ Low
- Layers interact only through stable interfaces
- No bidirectional dependencies

**Testability**: ⬆️ High
- Each layer can be tested independently
- Mock dependencies are minimal

**Maintainability**: ⬆️ High
- Changes are localized to one layer
- Understanding requires reading only relevant layer

**Reusability**: ⬆️ High
- Lower layers (e.g., Phase 0) can be reused in different contexts
- Each layer is self-contained

---

### Why This Matters for Promps

**Specific to Promps**:

1. **Phase count is finite** (5-10 phases)
   - Loose coupling remains manageable
   - Not at risk of "spaghetti architecture"

2. **Each Phase has clear responsibility**
   - Phase 0: Parsing
   - Phase 1: GUI
   - Phase 2+: Block types
   - Phase N: Validation
   - Module boundaries are obvious

3. **API stability policy reinforces loose coupling**
   - Phase 0 APIs never change
   - Upper layers never modify lower layers
   - Coupling cannot increase over time

4. **Branching strategy matches module structure**
   - Each feature/phase-N branch = One module
   - Git workflow mirrors architectural design
   - Merge conflicts are rare (module isolation)

---

### The Emergent Pattern

```
Start with: Layered Architecture
  ↓
Enforce: Non-Breaking Extension Principle
  ↓
Result: Loose Coupling (automatic)
  ↓
Benefits:
  - Easy module separation
  - Independent testing
  - Parallel development
  - Simple refactoring
  - Risk isolation
```

**Key insight**: You don't design for loose coupling directly. You design for layered architecture with stable interfaces, and loose coupling emerges as a natural consequence.

This is the **power of architectural patterns** - they give you benefits you didn't explicitly design for.

---

## 📐 Logic Check Scope

### What to Validate

1. ✅ **Token pattern**: Part-of-speech order is grammatically correct
   - Example: `[N, が, N, を, V]` ✓
   - Example: `[N, N, V]` ✗ (missing particles)

2. ✅ **Noun relationships**: Multiple nouns must have explicit relationships
   - Example: `"_N:User _N:Order 作成"` ✗ (no particles)
   - Example: `"_N:User が _N:Order を 作成"` ✓ (particles present)

3. ✅ **Particle correctness**: Particles match their grammatical roles
   - Example: `"が"` with subject position ✓
   - Example: `"を"` with object position ✓

### What NOT to Validate

❌ Semantic meaning ("User creates Color" makes no sense)
❌ Domain knowledge (User-Order relationship appropriateness)
❌ Deep context (contradiction with previous sentences)

---

## 🚀 Current Status (Phase 0 Complete)

### Achievements

**Files Created:**
- `Cargo.toml`: Project configuration
- `src/main.rs`: ~110 lines, 7 tests (100% passing)
- `README.md`: Comprehensive documentation
- `.gitignore`: Rust project ignore patterns
- `LICENSE`: MIT License (2025 Yoshihiro NAKAHARA)
- Community files: CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md

**Features Implemented:**
- ✅ Space-delimited token parsing
- ✅ Double-space sentence delimiter
- ✅ `_N:` prefix for noun marking (anywhere in sentence)
- ✅ Multi-token sentence support
- ✅ Output to stdout and file
- ✅ Self-hosting capability (can generate prompts for its own development)

**Foundation Established:**
- ✅ Lexical analysis complete
- ✅ Noun identification reliable
- ✅ Token boundaries clear
- ✅ Sentence boundaries defined
- ✅ Flexible noun positioning

### Next Steps

**Phase 1**: Tauri + GUI implementation with Blockly.js
- Tauri framework integration
- Visual block builder (Scratch-like)
- Automatic `_N:` annotation
- Drag-and-drop interface

**Phase N**: Logic check (AST-based validation)
- Pattern matching implementation
- Particle analysis
- Relationship validation

**Phase N+1**: Project file persistence
- Save/load project files (JSON format)
- File I/O via Tauri commands
- Project metadata management

**Phase N+2**: UI customization
- Layout presets (right-handed/left-handed)
- Draggable pane boundaries
- User preference persistence

---

## 💡 Key Insights

1. **_N: is not a marker, it's type information** (like compiler annotations)
2. **Logic check ≠ Semantic analysis** (syntax only, meaning is AI's job)
3. **Japanese complexity requires AST-like approach** (particle analysis + pattern matching)
4. **Phase 0 lays groundwork for Phase N** (reliable tokenization enables complex validation)
5. **Incremental implementation** (start minimal, expand based on usage)

---

## 🤖 AI Collaboration Strategy

### Understanding AI's Probabilistic Nature

**Core Principle**: Modern AI/LLMs are based on statistical/probabilistic models, not deterministic logic.

**Implication**: Output variation is **inherent to the technology**, not a bug.

```
Same prompt: "Create a modal dialog"
↓ Probabilistic AI Model ↓
Output A: <div class="modal-dialog">...
Output B: <div class="modal-popup">...
Output C: <div class="custom-modal">...
```

Each output is statistically valid, but structurally different → Creates checking burden.

### Strategic Commonalization Approach

**Problem**: Reviewing and correcting AI output variations consumes significant energy.

**Solution**: Absorb variations through strategic commonalization.

#### Traditional Approach (High Energy Cost)
```
Generate UI → Review → Fix variations → Repeat
↓
Endless cycle of checking and fixing
Energy drain on every screen/component
```

#### Strategic Approach (Low Energy Cost)
```
1. Identify variation patterns
   - Modal structures vary
   - CSS class names vary
   - Button layouts vary

2. Create common modules
   - Modal class (standardized structure)
   - CSS standards (consistent naming)
   - Component templates (reusable patterns)

3. Instruct AI to use common modules
   - "Use the Modal class from modal.js"
   - Variations absorbed by module
   - Checking burden minimized
```

### Commonalization Granularity

**Flexibility**: Any granularity from 1 line to 100+ lines is valid for commonalization.

**Decision Criteria**:
- Cost of commonalization < Cost of repeated checking
- If duplication appears → Commonalize immediately (not "later")
- Applies to: Code, UI components, CSS classes, modal structures, etc.

**Examples**:
- **Code**: Validation functions (password, username)
- **UI**: Modal class, form templates
- **CSS**: Standard class naming conventions
- **Patterns**: Event handlers, keyboard navigation

### Energy Preservation

**Rationale**: Developer energy is finite and precious.

**Trade-offs**:
- ✅ Spend energy on: Strategic commonalization, core logic, design decisions
- ❌ Don't spend energy on: Checking AI output variations, fixing cosmetic differences

**Result**: Energy preserved for essential thinking, not repetitive checking.

### Real-World Validation (KakeiBon)

**Achievement**: 525 tests, 100% success rate

**Why it worked**:
- Modal class absorbed UI variations
- Validation helpers absorbed logic variations
- CSS standards absorbed styling variations
- Common patterns absorbed structural variations

**Impact**: Minimal hand-back, rare specification changes, consistent quality.

### Best Practices for AI Collaboration

1. **Understand the technology**: AI is probabilistic → Variations are normal
2. **See duplication, fix immediately**: Don't defer commonalization
3. **Any granularity is valid**: 1 line or 100 lines, commonalize if cost-effective
4. **Strategic, not reactive**: Anticipate variation points, commonalize proactively
5. **Preserve energy**: Automate checking through commonalization

### Why This Matters for Promps

Promps itself generates prompts for AI → Understanding AI's probabilistic nature is **essential**.

- **Input**: DSL with clear structure (_N: annotations)
- **Output**: Natural language for probabilistic AI
- **Strategy**: Syntax validation only (let AI handle semantic variations)

By separating syntax (Promps) from semantics (AI), we allow AI to use its probabilistic strength (understanding meaning) while ensuring structural consistency through validation.

---

## 🎨 Business Model

**Open Core Strategy:**
- Phase 0-2: MIT License (Open Source, Free)
- Future Pro Version: Proprietary (Advanced features, Enterprise support)

Repository will remain private initially, can be made public later.

---

## 🏗️ Phase 1 Technical Architecture (Confirmed)

**Last Confirmed**: 2025-11-25

### Technology Stack

```
┌─────────────────────────────────────┐
│   Tauri Desktop Application         │
├─────────────────────────────────────┤
│  Frontend (HTML/CSS/JS)             │
│  ├── Blockly.js (Block editor)     │
│  ├── res/html/index.html            │
│  ├── res/js/ (UI logic)             │
│  └── res/css/ (Styling)             │
├─────────────────────────────────────┤
│  Backend (Rust)                     │
│  ├── src/main.rs (Tauri entry)     │
│  ├── src/lib.rs (Phase 0 core)     │
│  ├── src/commands.rs (Tauri cmds)  │
│  └── src/modules/ (Common modules) │
└─────────────────────────────────────┘
```

### Directory Structure (Confirmed)

```
Promps/
├── Cargo.toml                    # Tauri dependencies
├── tauri.conf.json               # Tauri configuration
├── build.rs                      # Tauri build script
│
├── src/                          # Rust code (unified)
│   ├── main.rs                   # Tauri entry point
│   ├── lib.rs                    # Phase 0 core logic
│   ├── commands.rs               # Tauri commands
│   ├── models.rs                 # Data structures
│   │
│   └── modules/                  # Common Rust modules
│       ├── mod.rs                # Module declarations
│       ├── validation.rs         # (Future) Validation logic
│       ├── parser.rs             # (Future) Parser logic
│       └── utils.rs              # (Future) Utilities
│
├── res/                          # Frontend resources
│   ├── html/
│   │   └── index.html            # Main UI
│   │
│   ├── js/
│   │   ├── main.js               # Main application logic
│   │   ├── blockly-config.js     # Blockly configuration
│   │   ├── ui-helpers.js         # UI helper functions
│   │   └── constants.js          # Constants
│   │
│   ├── css/
│   │   ├── common.css            # Common styles
│   │   └── blockly-theme.css     # Blockly theme
│   │
│   ├── locales/                  # (Future) i18n resources
│   │   ├── ja.json
│   │   └── en.json
│   │
│   └── sql/                      # (Future) SQL queries
│       └── queries.rs            # (May move to src/modules/)
│
└── tests/                        # Test code
    └── fixtures/                 # Hardcoded test data
```

### Key Design Decisions

#### 1. **Unified src/ Directory**
- ✅ All Rust code in `src/` (not `src-tauri/`)
- ✅ Common modules in `src/modules/`
- ✅ Avoids synchronization issues between frontend/backend
- ✅ Simpler dependency management

**Rationale**: Previous project experience showed `src-tauri/` separation caused code sync problems.

#### 2. **No Project File Save/Load Until Phase N+1**
- ❌ No save/load functionality in Phase 1-N
- ❌ No localStorage auto-save
- ✅ Test data is hardcoded in test files

**Rationale**:
- Phase 1-N: Block design and logic only (testing purpose)
- Implementing save/load too early causes:
  - Schema changes with each block type addition
  - Migration complexity
  - Energy drain on non-core features
- Phase N+1: Implement once when all block types are finalized

**YAGNI Principle**: "You Aren't Gonna Need It" - Don't implement features until actually needed.

#### 3. **Module Extraction Strategy**
- ✅ Extract common code immediately when duplication is found
- ✅ "See duplication, fix immediately" (not "later")
- ✅ Any granularity (1 line to 100+ lines) is valid

**Workflow**:
```rust
// Initial: All logic in src/commands.rs
#[tauri::command]
fn process_blocks(blocks: Vec<Block>) -> String {
    // 100 lines of logic here
}

// ↓ Found duplication

// Refactored: Logic extracted to src/modules/
use crate::modules::parser;
use crate::modules::validation;

#[tauri::command]
fn process_blocks(blocks: Vec<Block>) -> Result<String, String> {
    let parts = parser::parse_blocks(blocks);
    validation::validate_pattern(&parts)?;
    Ok(generate_prompt(&parts))
}
```

### Phase 1 Implementation Scope (Minimal)

**✅ Must Implement:**
- Tauri framework integration
- Blockly.js workspace UI
- Noun block type only
- Prompt generation preview
- Basic styling

**❌ Deferred to Later Phases:**
- Project file save/load → Phase N+1
- Layout customization → Phase N+2
- Multiple block types → Phase 2
- Logic validation → Phase N
- i18n support → Phase N+2

### Future Features (Phase N+1, N+2)

#### Phase N+1: Project Persistence

**Implementation**:
```rust
// src/commands.rs
#[derive(Serialize, Deserialize)]
struct ProjectFile {
    version: String,
    workspace: String,  // Blockly XML/JSON
    metadata: ProjectMetadata,
}

#[tauri::command]
async fn save_project(path: String, data: ProjectFile) -> Result<(), String> {
    // Save to local file system
}

#[tauri::command]
async fn load_project(path: String) -> Result<ProjectFile, String> {
    // Load from local file system
}
```

**File Format**: JSON (`.promps` extension)

**Why Later**:
- All block types will be finalized
- Optimal schema design possible
- Single implementation effort (no migrations)

#### Phase N+2: Layout Customization

**Target Users**:
- Right-handed: Block palette on left (default)
- Left-handed: Block palette on right (better ergonomics)

**Implementation**:
```javascript
// res/js/layout-config.js
const LAYOUT_PRESETS = {
    'right-handed': {
        blockPalette: 'left',
        workspace: 'center',
        preview: 'right'
    },
    'left-handed': {
        blockPalette: 'right',
        workspace: 'center',
        preview: 'left'
    }
};
```

```css
/* res/css/layout.css */
.app-container {
    display: grid;
    grid-template-areas: "palette workspace preview";
}

.app-container.left-handed {
    grid-template-areas: "preview workspace palette";
}
```

**Features**:
- Layout preset switching
- Draggable pane boundaries
- User preference persistence
- Keyboard shortcuts

**Why Later**:
- Completely independent from block logic
- UI must be stable first
- Lower priority than core features

### Platform Targets

**Primary**: Linux (development environment)
**Future**: Windows, macOS (cross-platform via Tauri)

---

**This document ensures design continuity across sessions and prevents knowledge loss during context compression.**
