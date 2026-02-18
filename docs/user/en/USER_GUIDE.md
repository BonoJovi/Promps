# Promps User Guide

**Last Updated**: 2026-02-18
**Target Version**: v1.3.3

---

## Table of Contents

- [Introduction](#introduction)
- [Basic Operations](#basic-operations)
- [Grammar Validation](#grammar-validation)
- [Pattern Templates](#pattern-templates)
- [Saving and Loading Projects](#saving-and-loading-projects)
- [Block Types](#block-types)
- [Prompt Examples](#prompt-examples)
- [Tips & Tricks](#tips--tricks)

---

## Introduction

Promps is a tool for creating AI prompts using visual blocks. Like Scratch, you can generate structured prompts simply by dragging and dropping blocks to combine them.

### Screen Layout

```
┌──────────────────────────────────────────────────┐
│  Promps - Visual Prompt Builder                  │
├──────────────┬───────────────────────┬───────────┤
│              │                       │           │
│  Block       │   Workspace           │  Preview  │
│  Palette     │   (Block placement)   │  (Output) │
│              │                       │           │
│  > Nouns     │                       │  Output:  │
│  > Particles │   [Drag & drop       │  User     │
│  > Verbs     │    blocks here]      │  (NOUN)   │
│  > Other     │                       │  が Order │
│              │                       │  (NOUN) を│
│              │                       │  作成     │
└──────────────┴───────────────────────┴───────────┘
```

Promps supports two language modes:
- **Japanese mode**: Generates Japanese prompts with SOV word order and particles
- **English mode**: Generates English prompts with SVO word order and prepositions

---

## Basic Operations

### 1. Placing Blocks

**Step 1: Select a category**
- Click a category name in the left panel to expand it
- Example: Click "Nouns" to display noun blocks

**Step 2: Drag a block**
- Click and drag a block to the central workspace

**Step 3: Connect blocks**
- Blocks connect vertically
- They snap together automatically when placed close enough

### 2. Editing Blocks

**Noun blocks**:
- Click the text field inside the block to edit
- Example: Change "User" to "Customer"

**Particle blocks**:
- Fixed labels, cannot be edited (by design)
- Simply drag the particle you need from the palette

### 3. Deleting Blocks

**Method 1: Drag to trash**
- Drag the block to the trash icon at the bottom of the workspace

**Method 2: Right-click menu**
- Right-click the block and select "Delete Block"

### 4. Checking the Preview

- The generated prompt appears in real-time in the right panel
- It updates automatically when you add, remove, or edit blocks

---

## Grammar Validation

Real-time grammar checking is performed as you place blocks.

### Validation Rules

#### Japanese Mode

| Rule | Type | Description |
|------|------|-------------|
| **Particle position** | Error | Particles must be placed after a noun |
| **Consecutive particles** | Error | Particles cannot appear consecutively |
| **Verb position** | Warning | Verbs should be placed at the end of a sentence |
| **Consecutive nouns** | Warning | A particle is recommended between consecutive nouns |
| **Missing subject** | Warning | A verb exists but no subject marker (ga) is present |
| **Missing object** | Warning | A verb exists but no object marker (wo) is present |

#### English Mode

English mode validates SVO (Subject-Verb-Object) word order with prepositions and articles.

### Status Indicators

- **Green**: Grammatically correct structure
- **Red**: Error (must be fixed)
- **Yellow**: Warning (recommendation)

### AutoFix

When a "Fix" button appears alongside a warning message:

1. Click the "Fix" button
2. The necessary blocks are automatically inserted
3. The validation result updates automatically

---

## Pattern Templates

Pattern templates are available to guide block placement according to grammatical sentence patterns.

### Available Patterns (Japanese Mode)

| Pattern | Structure | Example |
|---------|-----------|---------|
| **Basic (SOV)** | Noun ga Noun wo Verb | User ga Data wo analyze |
| **Object-Verb (OV)** | Noun wo Verb | Document wo summarize |
| **Topic** | Noun wa Noun wo Verb | System wa Log wo output |
| **Means/Location** | Noun de Noun wo Verb | API de Data wo fetch |
| **Parallel** | Noun to Noun wo Verb | User to Admin wo compare |
| **Range** | Noun kara Noun made Verb | StartDate kara EndDate made aggregate |
| **Object-first (OSV)** | Noun wo Noun ga Verb | Document wo User ga analyze |

### Pattern Analysis

As you place blocks, the system automatically analyzes which pattern your current structure matches. If the pattern is incomplete, the missing blocks are suggested.

---

## Saving and Loading Projects

### Toolbar Buttons

The header contains the following buttons:

| Button | Function | Shortcut |
|--------|----------|----------|
| **New** | Create new project | `Ctrl+N` |
| **Open** | Open project | `Ctrl+O` |
| **Save** | Save project | `Ctrl+S` |
| **Save As** | Save with new name | `Ctrl+Shift+S` |

### File Format

- Extension: `.promps`
- Format: JSON (editable with any text editor)
- Contents: Workspace block layout, zoom level, scroll position

### Unsaved Changes

- When the workspace is modified, `*` appears in the title bar
- Example: `Untitled * - Promps`
- The `*` disappears after saving

### Step-by-Step

**New Project**:
1. Click the `New` button (or `Ctrl+N`)
2. If there are unsaved changes, a confirmation dialog appears

**Save**:
1. Click the `Save` button (or `Ctrl+S`)
2. On first save, a file save dialog appears
3. Enter a file name and save

**Open**:
1. Click the `Open` button (or `Ctrl+O`)
2. Select a `.promps` file
3. The workspace is restored

---

## Block Types

### Available Blocks

#### 1. Noun Blocks (Green)

**Purpose**: Represent entities or objects

**Examples**:
- `User` - A user entity
- `Order` - An order entity
- `Database` - A database entity
- Custom nouns - Enter any text

**Output format**: `_N:text` becomes `text (NOUN)`

#### 2. Particle Blocks (Blue) - Japanese Mode

**Purpose**: Indicate the relationship between nouns and verbs

| Particle | Meaning | Example |
|----------|---------|---------|
| **ga** | Subject marker | User **ga** analyze |
| **wo** | Object marker | Order **wo** create |
| **ni** | Direction/target | Database **ni** save |
| **de** | Means/location | System **de** process |
| **to** | Parallel/together | User **to** Admin |
| **wa** | Topic marker | Data **wa** important |
| **mo** | Addition/also | User **mo** check |
| **kara** | Starting point | Database **kara** fetch |
| **made** | Endpoint | Start **made** End |

**Output format**: Particle text as-is

#### 3. Preposition/Article Blocks - English Mode

**Purpose**: Express relationships in English SVO grammar

Articles: `a`, `an`, `the`, `this`, `that`
Prepositions: `to`, `with`, `from`, `in`, `on`, `at`, `by`, `for`, `of`, `about`, `into`, `through`

#### 4. Verb Blocks (Red)

**Purpose**: Represent actions or operations

**Fixed verbs (Japanese mode)**:
| Verb | Purpose |
|------|---------|
| **analyze** | Instruct to analyze data or content |
| **summarize** | Instruct to summarize content |
| **translate** | Instruct to translate text |

**Custom verbs**: Enter any verb (default: create)

**Output format**: Verb text as-is

#### 5. Punctuation Blocks (Orange)

**Purpose**: Express sentence breaks and emphasis

| Symbol | Name | Purpose |
|--------|------|---------|
| **,** | Comma (touten) | Mid-sentence break |
| **.** | Period (kuten) | End of sentence |
| **!** | Exclamation | Emphasis/surprise |
| **?** | Question mark | Question |
| **"** | Double quote | Start/end quotation |
| **'** | Single quote | Start/end quotation |
| **,** | Comma (Western) | Separator (English-style) |
| **/** | Slash | Alternatives/separator |
| **&** | Ampersand | Parallel |

**Punctuation grammar rules**:
- Comma cannot follow object marker "wo"
- Commas should follow particles
- Periods should follow verbs

#### 6. Other Blocks (Purple)

**Purpose**: Free-text elements that don't belong to other categories

The text field accepts any input. Use this for tokens that don't fit into noun, particle, or verb categories.

**Output format**: Input text as-is

---

## Prompt Examples

### Example 1: Simple Analysis Instruction

**Block layout**:
```
[Noun: Document] -> [wo] -> [Verb: analyze]
```

**Generated output**:
```
Document (NOUN) wo analyze
```

**Effect for AI**:
- Clearly identifies `Document` as a noun (target)
- Specifies "analyze" as the concrete action

---

### Example 2: Subject and Object

**Block layout**:
```
[Noun: User] -> [ga] -> [Noun: Order] -> [wo] -> [Verb: Custom(create)]
```

**Generated output**:
```
User (NOUN) ga Order (NOUN) wo create
```

**Effect for AI**:
- The relationship between subject (User) and object (Order) is clear
- Custom verb specifies any desired action

---

### Example 3: Translation Instruction

**Block layout**:
```
[Noun: Text] -> [wo] -> [Verb: translate]
```

**Generated output**:
```
Text (NOUN) wo translate
```

---

### Example 4: Summarization Instruction

**Block layout**:
```
[Noun: Report] -> [wo] -> [Verb: summarize]
```

**Generated output**:
```
Report (NOUN) wo summarize
```

---

### Example 5: Parallel Nouns

**Block layout**:
```
[Noun: User] -> [to] -> [Noun: Admin] -> [ga] -> [Verb: Custom(manage)]
```

**Generated output**:
```
User (NOUN) to Admin (NOUN) ga manage
```

---

### Example 6: Database Operation

**Block layout**:
```
[Noun: Database] -> [kara] -> [Noun: Data] -> [wo] -> [Verb: Custom(fetch)]
```

**Generated output**:
```
Database (NOUN) kara Data (NOUN) wo fetch
```

---

### Example 7: Range Specification

**Block layout**:
```
[Noun: StartDate] -> [kara] -> [Noun: EndDate] -> [made] -> [Verb: Custom(aggregate)]
```

**Generated output**:
```
StartDate (NOUN) kara EndDate (NOUN) made aggregate
```

---

## Tips & Tricks

### Expanding/Collapsing Categories

- Click a category name to expand or collapse it
- Collapse unused categories to keep the palette tidy

### Aligning Blocks

- Right-click on the workspace and select "Cleanup Blocks" for automatic alignment
- Useful when your block structure gets complex

### Zoom

- Zoom controls are in the bottom-right corner of the workspace
- `+` to zoom in, `-` to zoom out
- Mouse wheel also works for zooming

### Keyboard Shortcuts

**Project operations**:
- `Ctrl+N`: New project
- `Ctrl+O`: Open project
- `Ctrl+S`: Save
- `Ctrl+Shift+S`: Save As

**Block operations**:
- `Ctrl+C`: Copy block
- `Ctrl+V`: Paste block
- `Delete`: Delete selected block
- `Ctrl+Z`: Undo

---

## FAQ

### Q: Why can't I edit particle block text?

A: This is by design. Particles are fixed grammatical elements, so editing is disabled to prevent entering incorrect particles. Simply select the particle you need from the palette.

### Q: How do I copy the generated prompt?

A: Select the text in the preview panel and use `Ctrl+C` to copy.

### Q: How do I reorder blocks?

A: Detach a block first, then reconnect it in the desired position. A direct reorder feature is not yet available.

### Q: Can I save my project?

A: Yes! Save/load functionality is available. Use `Ctrl+S` to save and `Ctrl+O` to open. The file format is `.promps` (JSON).

### Q: What should I do when a grammar error appears?

A: Review the error message and follow the instructions to rearrange your blocks. If a "Fix" button is available, click it for automatic correction.

### Q: What are pattern templates?

A: They are guides for arranging blocks according to grammatical sentence patterns. The system automatically analyzes which pattern your current arrangement matches and suggests what may be missing.

---

## Current Features (v1.3.3)

- Noun blocks (fixed + custom)
- Particle blocks (9 types for Japanese, articles/prepositions for English)
- Verb blocks (11 fixed + custom)
- Punctuation blocks (9 types)
- Other block (free-text input)
- Project save/load (.promps format)
- Toolbar (New, Open, Save, Save As)
- Keyboard shortcuts
- Real-time grammar validation (6 rules)
- AutoFix (automatic correction)
- Pattern templates (7 types)
- Dark/light theme
- Japanese/English language switching

### Feedback

Please report bugs and feature requests at [GitHub Issues](https://github.com/BonoJovi/Promps/issues)
