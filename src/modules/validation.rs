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
}
