# Promps TODO List

**Last Updated**: 2026-02-18

---

## Phase 1: GUI Integration (Blockly.js) ✅ Mostly Complete

### Blockly.js Integration ✅

- [x] Add Blockly.js library to frontend (CDN)
- [x] Define custom blocks (Noun, Verb, Particle, Article, Punctuation, Other)
- [x] Implement workspace serialization (JSON)
- [x] Implement DSL generation from blocks
- [x] Add code preview panel

### UI/UX

- [x] Design main application layout
- [x] Add toolbar (New, Open, Save, Save As)
- [x] Add block palette (categorized blocks)
- [x] Add output preview (real-time)
- [ ] Add example projects

---

## Phase 4: Project Persistence (v0.0.4) ✅ Mostly Complete

### File I/O

- [x] Define project file format (JSON, .promps extension)
- [x] Implement save/load functionality
- [ ] Add autosave feature
- [x] Add recent projects list
- [x] Implement project templates (My Templates via localStorage)

---

## Phase 5: Logic Check 基礎 (v0.0.5) ✅ Complete

### Basic Grammatical Validation

- [x] Implement validation.rs module with TokenType, ValidationResult, ValidationError
- [x] Implement 4 grammar rules (particle position, consecutive particles, verb position, consecutive nouns)
- [x] Add validate_dsl_sequence Tauri command
- [x] Create validation-ui.js for real-time error display
- [x] Add block highlighting for errors/warnings

---

## Phase 6: Logic Check 拡張 (v0.0.6) ✅ Complete

### Advanced Grammatical Validation

- [x] Add Rule 5-6: Missing subject/object warnings
- [x] Implement AutoFix with insertBlockBefore/insertBlockAfter
- [x] Add 7 pattern templates (SOV, OV, Topic, Means, Parallel, Source-Dest, OSV)
- [x] Implement analyze_patterns() for smart recommendations
- [x] Add 9 punctuation blocks with 3 punctuation grammar rules

---

## Documentation Updates

### Phase 1

- [ ] Update `docs/en/ARCHITECTURE.md` with GUI architecture
- [ ] Update `docs/ja/ARCHITECTURE.md` with GUI architecture
- [ ] Create `docs/en/BLOCKLY_INTEGRATION.md`
- [ ] Create `docs/ja/BLOCKLY_INTEGRATION.md`
- [ ] Update `README.md` with GUI usage examples

### Phase 5/6

- [ ] Create `docs/en/LOGIC_CHECK.md`
- [ ] Create `docs/ja/LOGIC_CHECK.md`
- [ ] Update `docs/en/API_REFERENCE.md` with error types
- [ ] Update `docs/ja/API_REFERENCE.md` with error types

---

## Testing

### Phase 1 Tests ✅ Mostly Complete

- [x] Add frontend unit tests (Jest + JSDOM: 190 tests)
- [x] Add integration tests (Blockly → DSL → Prompt)
- [x] Add UI interaction tests (block placement, deletion)
- [ ] Add limit validation tests (50, 100 block scenarios)

### Phase 5/6 Tests ✅ Complete

- [x] Add pattern matching tests (validation.rs: 54 tests)
- [x] Add error handling tests (invalid patterns)
- [x] Add edge case tests (complex sentences, English/Japanese)

---

## Security

### Phase 0-1

- [x] Document resource management philosophy (completed 2025-11-28)
- [x] Add stress tests (100, 1000 nouns) (completed 2025-11-28)

### Phase 5/6: Grammar Validation ✅ Complete

- [x] Implement grammar validation (validate_sequence, validate_sequence_en)
- [x] Japanese: 9 rules (particle/verb/noun/punctuation)
- [x] English: 7 rules (article/preposition/verb/period)
- [x] Real-time validation via validate_dsl_sequence Tauri command

---

## Post v1.0.0: Future Features

### i18n (多言語対応)

**Status**: ✅ Implemented (2026-01-31)
**Priority**: Medium
**Branch**: dev

#### Completed Features
- [x] 言語切替ボタン (JA/EN)
- [x] 日本語モード: SOV + 助詞
- [x] 英語モード: SVO + Articles
- [x] が/を は日本語モードのみ表示
- [x] Article カテゴリ (a, an, the, this, that, please) は英語モードのみ
- [x] localStorage による言語設定保存
- [x] テスト 215 件通過

---

### ブロック使用頻度ソート

**Status**: Planned
**Priority**: LOW
**Reason**: UX改善 - よく使うブロックを上位に表示

#### Implementation Idea
- 各ブロックの使用回数を localStorage で記録
- カテゴリ展開時に使用頻度順でソート
- よく使うブロックが上に表示される

#### Implementation Checklist
- [ ] ブロック使用回数の記録機能
- [ ] 使用頻度によるソートロジック
- [ ] ソートの有効/無効切り替え設定
- [ ] リセット機能（使用履歴クリア）

---

### Input Size Limits & DoS Prevention

**Status**: Not Implemented
**Priority**: LOW (防御的機能、現在のユースケースでは緊急性なし)
**Reason**: DoS防止。直接Tauri IPCコールによるパフォーマンス劣化を防止

**Note**: 文法バリデーション（Input Validation）は Phase 5/6 で実装済み。
この項目はサイズ制限のみ。

#### Frontend: Block Count Limits

- [ ] Show warning at 50 blocks
- [ ] Prevent exceeding 100 blocks (hard UI limit)
- [ ] Display clear error messages

#### Backend: Input Size Validation

- [ ] Add `generate_prompt_from_text_checked()` command
- [ ] Add input length validation (100,000 chars)
- [ ] Add noun count validation (10,000 nouns)

#### Rationale

**Why 100 blocks?**
- Tested in Phase 0: `test_many_nouns()` passes in <1ms
- UX consideration: Manageable visual complexity
- Performance: No noticeable latency

**Why 10,000 hard limit?**
- Tested in Phase 0: `test_extreme_many_nouns()` passes (1,000 nouns)
- DoS prevention: Protects against malicious direct Tauri IPC calls
- Memory safety: Within reasonable bounds for most systems

**Why delegate to OS beyond this?**
- Memory availability is dynamic (other processes)
- OS has better resource management (OOM Killer, swap)
- Prevents false negatives (rejecting valid operations)

#### Test Coverage (Phase 0 ✅)

- ✅ 100 nouns: `test_many_nouns()` - Baseline for UI limit
- ✅ 1,000 nouns: `test_extreme_many_nouns()` - Stress test
- ✅ 10,000 characters: `test_very_long_input()` - Long text handling
- ✅ Consecutive markers: `test_consecutive_noun_markers()` - Edge case

**Location**: `src/lib.rs:260-333`

---

### i18n 設計メモ (参考・実装済み)

#### Design Decisions (2026-01-24)

**Implemented Architecture**:
- フロントエンドのみで完結（res/js/i18n.js）
- localStorage で言語設定を保存 (key: 'promps-lang')
- TRANSLATIONS オブジェクトでインライン翻訳データ管理
- localechange イベントで Blockly 再初期化

**Implementation Flow**:
```
[localStorage] ← 言語設定を保存
     ↓
[i18n.js: t() 関数で翻訳取得]
     ↓
[各モジュール: tt()/vt()/pt() ヘルパー経由で使用]
```

#### Implementation Checklist (Completed)

- [x] localStorage による言語設定保存
- [x] Frontend: UI テキストの外部化 (i18n.js)
- [x] 言語切り替えUI（ツールバーボタン）
- [x] 初期対応言語: 日本語、英語
- [x] Blockly ブロックラベル・出力の多言語化
- [ ] Backend: エラーメッセージ等の外部化（将来対応）

---

## Notes

### Design Decisions (2025-11-28)

**Memory Management Responsibility**:
- Application handles business logic limits (100 blocks UI, 10,000 backend)
- OS handles system resource limits (OOM, memory pressure)
- Rationale: Dynamic memory availability, OS expertise, better UX

**Test Strategy**:
- Test realistic scenarios (100, 1,000 nouns)
- Do NOT test extreme memory exhaustion (100,000+ items)
- Reason: Hardware-dependent, risks system instability

**Multi-layer Defense**:
1. Frontend: UX optimization (100 block limit)
2. Backend: DoS prevention (10,000 noun limit)
3. OS: System protection (OOM Killer, swap management)

---

**Document Version**: 2.0
**Created**: 2025-11-28
**Last Review**: 2026-02-18
