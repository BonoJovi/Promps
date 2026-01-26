/// Promps Phase 5-6 - Grammar Validation Module
///
/// This module provides grammar validation for DSL sequences.
/// It checks for common Japanese grammar patterns and reports errors/warnings.

use serde::{Deserialize, Serialize};

// ============================================================================
// Token Classification
// ============================================================================

/// Token types for grammar validation
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum TokenType {
    /// Noun (名詞) - tokens starting with _N:
    Noun,
    /// Particle (助詞) - が、を、に、で、と、へ、から、まで、より
    Particle,
    /// Verb (動詞) - fixed verbs and custom verbs ending in して/する
    Verb,
    /// Other (その他) - everything else
    Other,
}

impl TokenType {
    /// Classify a token into its type
    pub fn classify(token: &str) -> Self {
        let token = token.trim();

        // Check for noun marker
        if token.starts_with("_N:") {
            return TokenType::Noun;
        }

        // Check for particles (助詞)
        if Self::is_particle(token) {
            return TokenType::Particle;
        }

        // Check for verbs (動詞)
        if Self::is_verb(token) {
            return TokenType::Verb;
        }

        TokenType::Other
    }

    /// Check if token is a particle (助詞)
    fn is_particle(token: &str) -> bool {
        // Common Japanese particles
        const PARTICLES: &[&str] = &[
            "が", "を", "に", "で", "と", "へ", "から", "まで", "より",
            "の", "も", "は", "や", "か", "ね", "よ", "わ",
        ];
        PARTICLES.contains(&token)
    }

    /// Check if token is a verb (動詞)
    fn is_verb(token: &str) -> bool {
        // Fixed verbs from Phase 3
        const FIXED_VERBS: &[&str] = &[
            "分析して", "要約して", "翻訳して", "作成して",
            "削除して", "更新して", "検索して", "表示して",
            "保存して", "読み込んで", "送信して", "受信して",
        ];

        if FIXED_VERBS.contains(&token) {
            return true;
        }

        // Custom verbs ending in して or する
        if token.ends_with("して") || token.ends_with("する") {
            return true;
        }

        false
    }
}

// ============================================================================
// Validation Result Types
// ============================================================================

/// Severity level for validation errors
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Severity {
    /// Error - must be fixed
    Error,
    /// Warning - should be reviewed
    Warning,
}

/// Validation error codes
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ValidationErrorCode {
    /// Rule 1: Particle without preceding noun
    ParticleWithoutNoun,
    /// Rule 2: Consecutive particles
    ConsecutiveParticles,
    /// Rule 3: Verb not at end
    VerbNotAtEnd,
    /// Rule 4: Consecutive nouns without particle
    ConsecutiveNouns,
    /// Rule 5: Missing subject (no が with verb)
    MissingSubject,
    /// Rule 6: Missing object (no を with verb)
    MissingObject,
}

/// Auto-fix action type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AutoFixActionType {
    /// Insert a block before the target position
    InsertBefore,
    /// Insert a block after the target position
    InsertAfter,
}

/// Auto-fix action for automatic error correction
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AutoFixAction {
    /// Type of action to perform
    pub action_type: AutoFixActionType,
    /// Block type to insert (e.g., "promps_noun", "promps_particle_ga")
    pub block_type: String,
    /// Target position (0-indexed token position)
    pub target_position: usize,
    /// Label for the fix button
    pub label: String,
}

/// A single validation error or warning
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationError {
    /// Error code for programmatic handling
    pub code: ValidationErrorCode,
    /// Human-readable message (Japanese)
    pub message: String,
    /// Position in the token sequence (0-indexed)
    pub position: usize,
    /// Severity level
    pub severity: Severity,
    /// Suggested fix (optional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub suggestion: Option<String>,
    /// Auto-fix action (optional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub autofix: Option<AutoFixAction>,
}

impl ValidationError {
    /// Create a new validation error
    pub fn new(
        code: ValidationErrorCode,
        message: impl Into<String>,
        position: usize,
        severity: Severity,
        suggestion: Option<String>,
    ) -> Self {
        ValidationError {
            code,
            message: message.into(),
            position,
            severity,
            suggestion,
            autofix: None,
        }
    }

    /// Create a new validation error with auto-fix action
    pub fn with_autofix(
        code: ValidationErrorCode,
        message: impl Into<String>,
        position: usize,
        severity: Severity,
        suggestion: Option<String>,
        autofix: AutoFixAction,
    ) -> Self {
        ValidationError {
            code,
            message: message.into(),
            position,
            severity,
            suggestion,
            autofix: Some(autofix),
        }
    }
}

/// Result of validating a token sequence
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Whether the sequence is valid (no errors)
    pub is_valid: bool,
    /// List of errors and warnings
    pub errors: Vec<ValidationError>,
    /// Count of errors
    pub error_count: usize,
    /// Count of warnings
    pub warning_count: usize,
}

impl ValidationResult {
    /// Create a new empty (valid) result
    pub fn new() -> Self {
        ValidationResult {
            is_valid: true,
            errors: Vec::new(),
            error_count: 0,
            warning_count: 0,
        }
    }

    /// Add an error to the result
    pub fn add_error(&mut self, error: ValidationError) {
        match error.severity {
            Severity::Error => {
                self.is_valid = false;
                self.error_count += 1;
            }
            Severity::Warning => {
                self.warning_count += 1;
            }
        }
        self.errors.push(error);
    }
}

impl Default for ValidationResult {
    fn default() -> Self {
        Self::new()
    }
}

// ============================================================================
// Validation Logic
// ============================================================================

/// Validate a DSL token sequence
///
/// # Arguments
/// * `input` - Space-delimited DSL tokens
///
/// # Returns
/// ValidationResult with any errors/warnings found
///
/// # Rules
/// 1. Particle must follow a noun (Error)
/// 2. No consecutive particles (Error)
/// 3. Verb should be at end (Warning)
/// 4. Consecutive nouns without particle (Warning)
/// 5. Missing subject - no が with verb (Warning)
/// 6. Missing object - no を with verb (Warning)
pub fn validate_sequence(input: &str) -> ValidationResult {
    let mut result = ValidationResult::new();

    // Tokenize input
    let tokens: Vec<&str> = input.split_whitespace().collect();

    if tokens.is_empty() {
        return result;
    }

    // Classify all tokens
    let classified: Vec<(usize, &str, TokenType)> = tokens
        .iter()
        .enumerate()
        .map(|(i, t)| (i, *t, TokenType::classify(t)))
        .collect();

    // Track state for validation
    let mut prev_type: Option<TokenType> = None;

    for (i, token, token_type) in classified.iter() {
        let i = *i;
        let token_type = *token_type;

        // Rule 1: Particle must follow a noun
        if token_type == TokenType::Particle {
            match prev_type {
                None => {
                    // Particle at beginning - add auto-fix to insert noun
                    result.add_error(ValidationError::with_autofix(
                        ValidationErrorCode::ParticleWithoutNoun,
                        format!("助詞「{}」の前に名詞がありません", token),
                        i,
                        Severity::Error,
                        Some("名詞ブロックを追加してください".to_string()),
                        AutoFixAction {
                            action_type: AutoFixActionType::InsertBefore,
                            block_type: "promps_noun".to_string(),
                            target_position: i,
                            label: "名詞を追加".to_string(),
                        },
                    ));
                }
                Some(TokenType::Noun) => {
                    // OK - particle follows noun
                }
                Some(TokenType::Particle) => {
                    // Rule 2: Consecutive particles - add auto-fix to insert noun
                    result.add_error(ValidationError::with_autofix(
                        ValidationErrorCode::ConsecutiveParticles,
                        format!("助詞「{}」が連続しています", token),
                        i,
                        Severity::Error,
                        Some("間に名詞や動詞を追加してください".to_string()),
                        AutoFixAction {
                            action_type: AutoFixActionType::InsertBefore,
                            block_type: "promps_noun".to_string(),
                            target_position: i,
                            label: "名詞を追加".to_string(),
                        },
                    ));
                }
                Some(_) => {
                    // Particle after verb or other - could be valid in some cases
                    // For now, allow it with a warning
                }
            }
        }

        // Rule 4: Consecutive nouns without particle (warning)
        if token_type == TokenType::Noun {
            if prev_type == Some(TokenType::Noun) {
                result.add_error(ValidationError::with_autofix(
                    ValidationErrorCode::ConsecutiveNouns,
                    "名詞が連続しています".to_string(),
                    i,
                    Severity::Warning,
                    Some("間に助詞を追加することを検討してください".to_string()),
                    AutoFixAction {
                        action_type: AutoFixActionType::InsertBefore,
                        block_type: "promps_particle_to".to_string(),
                        target_position: i,
                        label: "「と」を追加".to_string(),
                    },
                ));
            }
        }

        prev_type = Some(token_type);
    }

    // Rule 3: Verb should be at end (check after loop)
    // Find all verb positions
    for (i, _token, token_type) in classified.iter() {
        if *token_type == TokenType::Verb && *i < tokens.len() - 1 {
            // Check if there are non-particle tokens after this verb
            let has_significant_after = classified[*i + 1..]
                .iter()
                .any(|(_, _, t)| *t == TokenType::Noun || *t == TokenType::Verb);

            if has_significant_after {
                result.add_error(ValidationError::new(
                    ValidationErrorCode::VerbNotAtEnd,
                    "動詞が末尾にありません".to_string(),
                    *i,
                    Severity::Warning,
                    Some("動詞を文末に移動してください".to_string()),
                ));
            }
        }
    }

    // Check for presence of verb (needed for Rules 5 and 6)
    let has_verb = classified.iter().any(|(_, _, t)| *t == TokenType::Verb);

    if has_verb {
        // Find the verb position for error reporting
        let verb_pos = classified
            .iter()
            .find(|(_, _, t)| *t == TokenType::Verb)
            .map(|(i, _, _)| *i)
            .unwrap_or(0);

        // Rule 5: Missing subject (no が with verb)
        let has_ga = tokens.iter().any(|t| *t == "が");
        if !has_ga {
            result.add_error(ValidationError::with_autofix(
                ValidationErrorCode::MissingSubject,
                "主語がありません（「が」がありません）".to_string(),
                verb_pos,
                Severity::Warning,
                Some("「名詞 が」を追加してください".to_string()),
                AutoFixAction {
                    action_type: AutoFixActionType::InsertBefore,
                    block_type: "promps_particle_ga".to_string(),
                    target_position: 0,
                    label: "「が」を追加".to_string(),
                },
            ));
        }

        // Rule 6: Missing object (no を with verb)
        let has_wo = tokens.iter().any(|t| *t == "を");
        if !has_wo {
            result.add_error(ValidationError::with_autofix(
                ValidationErrorCode::MissingObject,
                "目的語がありません（「を」がありません）".to_string(),
                verb_pos,
                Severity::Warning,
                Some("「名詞 を」を追加してください".to_string()),
                AutoFixAction {
                    action_type: AutoFixActionType::InsertBefore,
                    block_type: "promps_particle_wo".to_string(),
                    target_position: verb_pos,
                    label: "「を」を追加".to_string(),
                },
            ));
        }
    }

    result
}

// ============================================================================
// Pattern Templates (Phase 6 Step 3)
// ============================================================================

/// A pattern template for common sentence structures
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatternTemplate {
    /// Unique identifier for the pattern
    pub id: String,
    /// Human-readable name (Japanese)
    pub name: String,
    /// Description of when to use this pattern
    pub description: String,
    /// The pattern structure (e.g., "Noun が Noun を Verb")
    pub structure: String,
    /// Example usage
    pub example: String,
    /// Block types to insert (in order)
    pub blocks: Vec<PatternBlock>,
}

/// A block in a pattern template
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatternBlock {
    /// Block type (e.g., "promps_noun", "promps_particle_ga")
    pub block_type: String,
    /// Display label for the slot
    pub label: String,
    /// Whether this is a placeholder that user should fill
    pub is_placeholder: bool,
    /// Default value for text fields (optional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_value: Option<String>,
}

impl PatternTemplate {
    /// Create a new pattern template
    pub fn new(
        id: impl Into<String>,
        name: impl Into<String>,
        description: impl Into<String>,
        structure: impl Into<String>,
        example: impl Into<String>,
        blocks: Vec<PatternBlock>,
    ) -> Self {
        PatternTemplate {
            id: id.into(),
            name: name.into(),
            description: description.into(),
            structure: structure.into(),
            example: example.into(),
            blocks,
        }
    }
}

impl PatternBlock {
    /// Create a placeholder block (user should fill)
    pub fn placeholder(block_type: impl Into<String>, label: impl Into<String>) -> Self {
        PatternBlock {
            block_type: block_type.into(),
            label: label.into(),
            is_placeholder: true,
            default_value: None,
        }
    }

    /// Create a fixed block (particle)
    pub fn fixed(block_type: impl Into<String>, label: impl Into<String>) -> Self {
        PatternBlock {
            block_type: block_type.into(),
            label: label.into(),
            is_placeholder: false,
            default_value: None,
        }
    }

    /// Create a block with a default value (for text input blocks)
    pub fn with_value(block_type: impl Into<String>, label: impl Into<String>, value: impl Into<String>) -> Self {
        PatternBlock {
            block_type: block_type.into(),
            label: label.into(),
            is_placeholder: false,
            default_value: Some(value.into()),
        }
    }
}

/// Get all available pattern templates
pub fn get_pattern_templates() -> Vec<PatternTemplate> {
    vec![
        // Pattern 1: Basic S-O-V (Subject-Object-Verb)
        PatternTemplate::new(
            "sov_basic",
            "基本文型（主語-目的語-動詞）",
            "「誰が何をどうする」の基本形",
            "名詞 が 名詞 を 動詞",
            "ユーザー が ドキュメント を 分析して",
            vec![
                PatternBlock::placeholder("promps_noun", "主語"),
                PatternBlock::fixed("promps_particle_ga", "が"),
                PatternBlock::placeholder("promps_noun", "目的語"),
                PatternBlock::fixed("promps_particle_wo", "を"),
                PatternBlock::placeholder("promps_verb_analyze", "動詞"),
            ],
        ),
        // Pattern 2: Object-Verb (目的語-動詞)
        PatternTemplate::new(
            "ov_simple",
            "目的語-動詞文型",
            "「何をどうする」のシンプル形",
            "名詞 を 動詞",
            "ドキュメント を 要約して",
            vec![
                PatternBlock::placeholder("promps_noun", "目的語"),
                PatternBlock::fixed("promps_particle_wo", "を"),
                PatternBlock::placeholder("promps_verb_summarize", "動詞"),
            ],
        ),
        // Pattern 3: Topic pattern (について)
        PatternTemplate::new(
            "topic_about",
            "トピック文型（について）",
            "「〇〇について」でトピックを指定",
            "名詞 について 動詞",
            "データ について 分析して",
            vec![
                PatternBlock::placeholder("promps_noun", "トピック"),
                PatternBlock::with_value("promps_other", "について", "について"),
                PatternBlock::placeholder("promps_verb_analyze", "動詞"),
            ],
        ),
        // Pattern 4: Means/Location pattern (で)
        PatternTemplate::new(
            "means_de",
            "手段・場所文型（で）",
            "「〇〇で」で手段や場所を指定",
            "名詞 で 名詞 を 動詞",
            "日本語 で メール を 翻訳して",
            vec![
                PatternBlock::placeholder("promps_noun", "手段/場所"),
                PatternBlock::fixed("promps_particle_de", "で"),
                PatternBlock::placeholder("promps_noun", "目的語"),
                PatternBlock::fixed("promps_particle_wo", "を"),
                PatternBlock::placeholder("promps_verb_translate", "動詞"),
            ],
        ),
        // Pattern 5: Parallel pattern (と)
        PatternTemplate::new(
            "parallel_to",
            "並列文型（と）",
            "「AとBを」で複数の対象を指定",
            "名詞 と 名詞 を 動詞",
            "データ と 結果 を 保存して",
            vec![
                PatternBlock::placeholder("promps_noun", "対象1"),
                PatternBlock::fixed("promps_particle_to", "と"),
                PatternBlock::placeholder("promps_noun", "対象2"),
                PatternBlock::fixed("promps_particle_wo", "を"),
                PatternBlock::with_value("promps_verb_custom", "動詞", "保存して"),
            ],
        ),
        // Pattern 6: Source-Destination pattern (から...へ/に)
        PatternTemplate::new(
            "source_dest",
            "起点-終点文型（から...に）",
            "「どこからどこへ」の移動・変換",
            "名詞 から 名詞 に 動詞",
            "英語 から 日本語 に 翻訳して",
            vec![
                PatternBlock::placeholder("promps_noun", "起点"),
                PatternBlock::fixed("promps_particle_kara", "から"),
                PatternBlock::placeholder("promps_noun", "終点"),
                PatternBlock::fixed("promps_particle_ni", "に"),
                PatternBlock::placeholder("promps_verb_translate", "動詞"),
            ],
        ),
        // Pattern 7: Object-first pattern (OSV - 目的語先行)
        PatternTemplate::new(
            "osv_emphasis",
            "目的語先行文型（を...が）",
            "目的語を先に述べて強調する形",
            "名詞 を 名詞 が 動詞",
            "ドキュメント を ユーザー が 分析して",
            vec![
                PatternBlock::placeholder("promps_noun", "目的語"),
                PatternBlock::fixed("promps_particle_wo", "を"),
                PatternBlock::placeholder("promps_noun", "主語"),
                PatternBlock::fixed("promps_particle_ga", "が"),
                PatternBlock::placeholder("promps_verb_analyze", "動詞"),
            ],
        ),
    ]
}

/// Result of pattern matching
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatternMatchResult {
    /// Pattern ID
    pub pattern_id: String,
    /// Pattern name
    pub pattern_name: String,
    /// How well the current input matches (0.0 - 1.0)
    pub match_score: f64,
    /// Missing elements to complete the pattern
    pub missing_elements: Vec<String>,
    /// Whether the pattern is complete
    pub is_complete: bool,
}

/// Analyze current input against all patterns
pub fn analyze_patterns(input: &str) -> Vec<PatternMatchResult> {
    let tokens: Vec<&str> = input.split_whitespace().collect();
    let patterns = get_pattern_templates();
    let mut results = Vec::new();

    for pattern in patterns {
        let result = match_pattern(&tokens, &pattern);
        results.push(result);
    }

    // Sort by match score (highest first)
    results.sort_by(|a, b| b.match_score.partial_cmp(&a.match_score).unwrap());

    results
}

/// Match input tokens against a pattern
/// Only matches if tokens match from the BEGINNING of the pattern
fn match_pattern(tokens: &[&str], pattern: &PatternTemplate) -> PatternMatchResult {
    // Build expected tokens from pattern (with specific particle values)
    let expected: Vec<ExpectedToken> = pattern
        .blocks
        .iter()
        .map(|b| ExpectedToken::from_block_type(&b.block_type))
        .collect();

    // Check consecutive match from the beginning
    let mut consecutive_match_count = 0;
    let mut missing_elements = Vec::new();
    let mut had_mismatch = false;

    for (i, exp) in expected.iter().enumerate() {
        if i < tokens.len() && !had_mismatch {
            let token = tokens[i];
            let token_type = TokenType::classify(token);

            // Check if token matches expected
            let matches = match exp {
                ExpectedToken::Noun => token_type == TokenType::Noun,
                ExpectedToken::Particle(p) => token == *p,
                ExpectedToken::Verb => token_type == TokenType::Verb,
                ExpectedToken::Other(text) => token == *text,
            };

            if matches {
                consecutive_match_count += 1;
            } else {
                // Mismatch found - stop counting matches
                had_mismatch = true;
                missing_elements.push(format!("位置{}: {} が必要", i + 1, pattern.blocks[i].label));
            }
        } else {
            // Token missing or already had mismatch
            missing_elements.push(pattern.blocks[i].label.clone());
        }
    }

    let total_expected = expected.len();

    // Only give positive score if we have consecutive matches from start
    // and no mismatches within the token range
    let match_score = if had_mismatch || consecutive_match_count == 0 {
        0.0
    } else {
        consecutive_match_count as f64 / total_expected as f64
    };

    PatternMatchResult {
        pattern_id: pattern.id.clone(),
        pattern_name: pattern.name.clone(),
        match_score,
        missing_elements,
        is_complete: consecutive_match_count == total_expected && tokens.len() == total_expected,
    }
}

/// Expected token for pattern matching
#[derive(Debug, Clone)]
enum ExpectedToken {
    Noun,
    Particle(&'static str),
    Verb,
    Other(&'static str),
}

impl ExpectedToken {
    /// Parse block type to expected token
    fn from_block_type(block_type: &str) -> Self {
        if block_type.starts_with("promps_noun") {
            ExpectedToken::Noun
        } else if block_type.starts_with("promps_particle") {
            // Extract specific particle from block type
            let particle = match block_type {
                "promps_particle_ga" => "が",
                "promps_particle_wo" => "を",
                "promps_particle_ni" => "に",
                "promps_particle_de" => "で",
                "promps_particle_to" => "と",
                "promps_particle_he" => "へ",
                "promps_particle_kara" => "から",
                "promps_particle_made" => "まで",
                "promps_particle_yori" => "より",
                _ => "が", // default
            };
            ExpectedToken::Particle(particle)
        } else if block_type.starts_with("promps_verb") {
            ExpectedToken::Verb
        } else if block_type == "promps_other" {
            ExpectedToken::Other("について")
        } else {
            ExpectedToken::Other("")
        }
    }
}

/// Convert block type string to TokenType (for general classification)
fn block_type_to_token_type(block_type: &str) -> TokenType {
    if block_type.starts_with("promps_noun") {
        TokenType::Noun
    } else if block_type.starts_with("promps_particle") {
        TokenType::Particle
    } else if block_type.starts_with("promps_verb") {
        TokenType::Verb
    } else {
        TokenType::Other
    }
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // Token classification tests

    #[test]
    fn test_classify_noun() {
        assert_eq!(TokenType::classify("_N:User"), TokenType::Noun);
        assert_eq!(TokenType::classify("_N:データベース"), TokenType::Noun);
        assert_eq!(TokenType::classify("_N:"), TokenType::Noun);
    }

    #[test]
    fn test_classify_particle() {
        assert_eq!(TokenType::classify("が"), TokenType::Particle);
        assert_eq!(TokenType::classify("を"), TokenType::Particle);
        assert_eq!(TokenType::classify("に"), TokenType::Particle);
        assert_eq!(TokenType::classify("で"), TokenType::Particle);
        assert_eq!(TokenType::classify("と"), TokenType::Particle);
        assert_eq!(TokenType::classify("へ"), TokenType::Particle);
        assert_eq!(TokenType::classify("から"), TokenType::Particle);
        assert_eq!(TokenType::classify("まで"), TokenType::Particle);
    }

    #[test]
    fn test_classify_fixed_verb() {
        assert_eq!(TokenType::classify("分析して"), TokenType::Verb);
        assert_eq!(TokenType::classify("要約して"), TokenType::Verb);
        assert_eq!(TokenType::classify("翻訳して"), TokenType::Verb);
        assert_eq!(TokenType::classify("作成して"), TokenType::Verb);
    }

    #[test]
    fn test_classify_custom_verb() {
        assert_eq!(TokenType::classify("処理して"), TokenType::Verb);
        assert_eq!(TokenType::classify("実行する"), TokenType::Verb);
        assert_eq!(TokenType::classify("カスタムして"), TokenType::Verb);
    }

    #[test]
    fn test_classify_other() {
        assert_eq!(TokenType::classify("テスト"), TokenType::Other);
        assert_eq!(TokenType::classify("hello"), TokenType::Other);
        assert_eq!(TokenType::classify("123"), TokenType::Other);
    }

    // Rule 1: Particle without noun

    #[test]
    fn test_rule1_particle_at_start() {
        let result = validate_sequence("が _N:User");
        assert!(!result.is_valid);
        assert_eq!(result.error_count, 1);
        assert_eq!(result.errors[0].code, ValidationErrorCode::ParticleWithoutNoun);
        assert_eq!(result.errors[0].position, 0);
    }

    #[test]
    fn test_rule1_particle_after_noun_valid() {
        let result = validate_sequence("_N:User が");
        assert!(result.is_valid);
        assert_eq!(result.error_count, 0);
    }

    #[test]
    fn test_rule1_multiple_particles_without_noun() {
        let result = validate_sequence("が を に");
        assert!(!result.is_valid);
        // First particle has no noun, subsequent are consecutive
        assert!(result.error_count >= 1);
    }

    // Rule 2: Consecutive particles

    #[test]
    fn test_rule2_consecutive_particles() {
        let result = validate_sequence("_N:User が を");
        assert!(!result.is_valid);
        assert_eq!(result.error_count, 1);
        assert_eq!(result.errors[0].code, ValidationErrorCode::ConsecutiveParticles);
    }

    #[test]
    fn test_rule2_separated_particles_valid() {
        let result = validate_sequence("_N:User が _N:Order を");
        assert!(result.is_valid);
        assert_eq!(result.error_count, 0);
    }

    // Rule 3: Verb not at end

    #[test]
    fn test_rule3_verb_not_at_end() {
        let result = validate_sequence("分析して _N:Document");
        assert!(result.warning_count >= 1);
        assert!(result.errors.iter().any(|e| e.code == ValidationErrorCode::VerbNotAtEnd));
    }

    #[test]
    fn test_rule3_verb_at_end_valid() {
        let result = validate_sequence("_N:User が _N:Order を 作成して");
        // Should not have VerbNotAtEnd warning
        assert!(!result.errors.iter().any(|e| e.code == ValidationErrorCode::VerbNotAtEnd));
    }

    // Rule 4: Consecutive nouns

    #[test]
    fn test_rule4_consecutive_nouns() {
        let result = validate_sequence("_N:User _N:Order");
        assert_eq!(result.warning_count, 1);
        assert_eq!(result.errors[0].code, ValidationErrorCode::ConsecutiveNouns);
    }

    #[test]
    fn test_rule4_nouns_with_particle_valid() {
        let result = validate_sequence("_N:User と _N:Order");
        // Should not have ConsecutiveNouns warning
        assert!(!result.errors.iter().any(|e| e.code == ValidationErrorCode::ConsecutiveNouns));
    }

    // Rule 5: Missing subject

    #[test]
    fn test_rule5_missing_subject() {
        let result = validate_sequence("_N:Document を 分析して");
        assert!(result.warning_count >= 1);
        assert!(result.errors.iter().any(|e| e.code == ValidationErrorCode::MissingSubject));
    }

    #[test]
    fn test_rule5_has_subject_valid() {
        let result = validate_sequence("_N:User が _N:Document を 分析して");
        assert!(!result.errors.iter().any(|e| e.code == ValidationErrorCode::MissingSubject));
    }

    #[test]
    fn test_rule5_no_verb_no_warning() {
        // No verb means no subject warning
        let result = validate_sequence("_N:User _N:Document");
        assert!(!result.errors.iter().any(|e| e.code == ValidationErrorCode::MissingSubject));
    }

    // Rule 6: Missing object

    #[test]
    fn test_rule6_missing_object() {
        let result = validate_sequence("_N:User が 作成して");
        assert!(result.warning_count >= 1);
        assert!(result.errors.iter().any(|e| e.code == ValidationErrorCode::MissingObject));
    }

    #[test]
    fn test_rule6_has_object_valid() {
        let result = validate_sequence("_N:User が _N:Document を 分析して");
        assert!(!result.errors.iter().any(|e| e.code == ValidationErrorCode::MissingObject));
    }

    #[test]
    fn test_rule6_no_verb_no_warning() {
        // No verb means no object warning
        let result = validate_sequence("_N:User が _N:Document");
        assert!(!result.errors.iter().any(|e| e.code == ValidationErrorCode::MissingObject));
    }

    // Integration tests

    #[test]
    fn test_valid_complete_sequence() {
        let result = validate_sequence("_N:ユーザー が _N:ドキュメント を 分析して");
        assert!(result.is_valid);
        assert_eq!(result.error_count, 0);
        assert_eq!(result.warning_count, 0);
    }

    #[test]
    fn test_empty_input() {
        let result = validate_sequence("");
        assert!(result.is_valid);
        assert_eq!(result.error_count, 0);
        assert_eq!(result.warning_count, 0);
    }

    #[test]
    fn test_whitespace_only() {
        let result = validate_sequence("   ");
        assert!(result.is_valid);
        assert_eq!(result.error_count, 0);
    }

    #[test]
    fn test_multiple_errors() {
        // が at start (error) + consecutive particles (error)
        let result = validate_sequence("が を _N:User");
        assert!(!result.is_valid);
        assert!(result.error_count >= 2);
    }

    // Serialization tests

    #[test]
    fn test_validation_result_serialization() {
        let result = validate_sequence("が _N:User");
        let json = serde_json::to_string(&result).unwrap();

        assert!(json.contains("\"isValid\":false"));
        assert!(json.contains("\"errorCount\":1"));
        assert!(json.contains("\"severity\":\"error\""));
    }

    #[test]
    fn test_token_type_serialization() {
        let noun = TokenType::Noun;
        let json = serde_json::to_string(&noun).unwrap();
        assert_eq!(json, "\"Noun\"");
    }

    // Auto-fix tests

    #[test]
    fn test_autofix_in_particle_without_noun() {
        let result = validate_sequence("が _N:User");
        assert!(result.errors[0].autofix.is_some());
        let autofix = result.errors[0].autofix.as_ref().unwrap();
        assert_eq!(autofix.block_type, "promps_noun");
        assert_eq!(autofix.action_type, AutoFixActionType::InsertBefore);
    }

    #[test]
    fn test_autofix_in_missing_subject() {
        let result = validate_sequence("_N:Document を 分析して");
        let missing_subject = result.errors.iter()
            .find(|e| e.code == ValidationErrorCode::MissingSubject);
        assert!(missing_subject.is_some());
        let autofix = missing_subject.unwrap().autofix.as_ref().unwrap();
        assert_eq!(autofix.block_type, "promps_particle_ga");
    }

    #[test]
    fn test_autofix_in_missing_object() {
        let result = validate_sequence("_N:User が 作成して");
        let missing_object = result.errors.iter()
            .find(|e| e.code == ValidationErrorCode::MissingObject);
        assert!(missing_object.is_some());
        let autofix = missing_object.unwrap().autofix.as_ref().unwrap();
        assert_eq!(autofix.block_type, "promps_particle_wo");
    }

    #[test]
    fn test_autofix_in_consecutive_nouns() {
        let result = validate_sequence("_N:User _N:Order");
        assert!(result.errors[0].autofix.is_some());
        let autofix = result.errors[0].autofix.as_ref().unwrap();
        assert_eq!(autofix.block_type, "promps_particle_to");
    }

    #[test]
    fn test_autofix_serialization() {
        let result = validate_sequence("が _N:User");
        let json = serde_json::to_string(&result).unwrap();
        assert!(json.contains("\"autofix\""));
        assert!(json.contains("\"actionType\":\"insert_before\""));
        assert!(json.contains("\"blockType\":\"promps_noun\""));
    }

    // Pattern template tests (Phase 6 Step 3)

    #[test]
    fn test_get_pattern_templates_returns_patterns() {
        let patterns = get_pattern_templates();
        assert!(!patterns.is_empty());
        assert!(patterns.len() >= 7); // We have 7 patterns defined
    }

    #[test]
    fn test_pattern_template_sov_basic() {
        let patterns = get_pattern_templates();
        let sov = patterns.iter().find(|p| p.id == "sov_basic").unwrap();

        assert_eq!(sov.name, "基本文型（主語-目的語-動詞）");
        assert_eq!(sov.blocks.len(), 5); // Noun, が, Noun, を, Verb
    }

    #[test]
    fn test_pattern_template_ov_simple() {
        let patterns = get_pattern_templates();
        let ov = patterns.iter().find(|p| p.id == "ov_simple").unwrap();

        assert_eq!(ov.name, "目的語-動詞文型");
        assert_eq!(ov.blocks.len(), 3); // Noun, を, Verb
    }

    #[test]
    fn test_pattern_template_osv_emphasis() {
        let patterns = get_pattern_templates();
        let osv = patterns.iter().find(|p| p.id == "osv_emphasis").unwrap();

        assert_eq!(osv.name, "目的語先行文型（を...が）");
        assert_eq!(osv.blocks.len(), 5); // Noun, を, Noun, が, Verb
        assert_eq!(osv.structure, "名詞 を 名詞 が 動詞");
    }

    #[test]
    fn test_analyze_patterns_osv_match() {
        // "_N:Doc を _N:User が" should match osv_emphasis pattern
        let results = analyze_patterns("_N:Doc を _N:User が");
        let osv_match = results.iter().find(|r| r.pattern_id == "osv_emphasis").unwrap();

        // 4 out of 5 tokens match
        assert!(osv_match.match_score > 0.7);
        assert!(!osv_match.is_complete);
    }

    #[test]
    fn test_analyze_patterns_osv_complete() {
        // Complete OSV pattern
        let results = analyze_patterns("_N:Doc を _N:User が 分析して");
        let osv_match = results.iter().find(|r| r.pattern_id == "osv_emphasis").unwrap();

        assert_eq!(osv_match.match_score, 1.0);
        assert!(osv_match.is_complete);
    }

    #[test]
    fn test_pattern_block_placeholder() {
        let block = PatternBlock::placeholder("promps_noun", "主語");
        assert!(block.is_placeholder);
        assert_eq!(block.block_type, "promps_noun");
        assert_eq!(block.label, "主語");
    }

    #[test]
    fn test_pattern_block_fixed() {
        let block = PatternBlock::fixed("promps_particle_ga", "が");
        assert!(!block.is_placeholder);
        assert_eq!(block.block_type, "promps_particle_ga");
        assert_eq!(block.label, "が");
    }

    #[test]
    fn test_analyze_patterns_empty_input() {
        let results = analyze_patterns("");
        assert!(!results.is_empty());
        // All patterns should have 0 match score for empty input
        for result in &results {
            assert_eq!(result.match_score, 0.0);
        }
    }

    #[test]
    fn test_analyze_patterns_partial_match() {
        // "_N:Doc を" should partially match ov_simple pattern
        let results = analyze_patterns("_N:Doc を");
        let ov_match = results.iter().find(|r| r.pattern_id == "ov_simple").unwrap();

        // 2 out of 3 tokens match
        assert!(ov_match.match_score > 0.5);
        assert!(!ov_match.is_complete);
    }

    #[test]
    fn test_analyze_patterns_complete_match() {
        // "_N:Doc を 分析して" should match ov_simple completely
        let results = analyze_patterns("_N:Doc を 分析して");
        let ov_match = results.iter().find(|r| r.pattern_id == "ov_simple").unwrap();

        assert_eq!(ov_match.match_score, 1.0);
        assert!(ov_match.is_complete);
    }

    #[test]
    fn test_analyze_patterns_sorted_by_score() {
        let results = analyze_patterns("_N:Doc を 分析して");

        // Results should be sorted by match_score descending
        for i in 1..results.len() {
            assert!(results[i - 1].match_score >= results[i].match_score);
        }
    }

    #[test]
    fn test_block_type_to_token_type() {
        assert_eq!(block_type_to_token_type("promps_noun"), TokenType::Noun);
        assert_eq!(block_type_to_token_type("promps_particle_ga"), TokenType::Particle);
        assert_eq!(block_type_to_token_type("promps_particle_wo"), TokenType::Particle);
        assert_eq!(block_type_to_token_type("promps_verb_analyze"), TokenType::Verb);
        assert_eq!(block_type_to_token_type("promps_other"), TokenType::Other);
    }

    #[test]
    fn test_pattern_template_serialization() {
        let patterns = get_pattern_templates();
        let json = serde_json::to_string(&patterns).unwrap();

        assert!(json.contains("\"id\":\"sov_basic\""));
        assert!(json.contains("\"name\":"));
        assert!(json.contains("\"blocks\":"));
    }

    #[test]
    fn test_pattern_match_result_serialization() {
        let results = analyze_patterns("_N:Doc を");
        let json = serde_json::to_string(&results).unwrap();

        assert!(json.contains("\"patternId\":"));
        assert!(json.contains("\"matchScore\":"));
        assert!(json.contains("\"isComplete\":"));
    }
}
