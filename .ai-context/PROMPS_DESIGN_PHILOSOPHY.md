# Promps Design Philosophy and Implementation Strategy

**Last Updated**: 2025-11-24
**Purpose**: Core design decisions and implementation roadmap for AI context preservation

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
| Phase 1 | GUI (Blockly.js) | ⭐⭐ | 2-3 hours |
| Phase 2 | Add block types | ⭐⭐ | 1-2 hours |
| **Phase N** | **Logic Check (AST)** | **⭐⭐⭐⭐⭐** | **Weeks to months** |
| Phase N+1 | Output optimization | ⭐⭐⭐ | Days |

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

**Phase 1**: GUI implementation with Blockly.js
- Visual block builder (Scratch-like)
- Automatic `_N:` annotation
- Drag-and-drop interface

**Phase N**: Logic check (AST-based validation)
- Pattern matching implementation
- Particle analysis
- Relationship validation

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

**This document ensures design continuity across sessions and prevents knowledge loss during context compression.**
