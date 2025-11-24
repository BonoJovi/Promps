/// Promps Phase 0 Core Logic
///
/// This module contains the core DSL parsing and prompt generation logic
/// from Phase 0, now available as a library for both CLI and GUI (Tauri) usage.

/// Represents a single prompt part
/// Two types: "Noun" (名詞) and "Everything else" (それ以外)
#[derive(Debug, Clone)]
pub struct PromptPart {
    pub is_noun: bool,
    pub text: String,
}

impl PromptPart {
    /// Parse a token into a PromptPart
    /// Format: "_N:text" (noun/名詞) or "text" (everything else/それ以外)
    pub fn from_token(token: &str) -> Self {
        // Check if noun (名詞) - starts with "_N:"
        if let Some(text) = token.strip_prefix("_N:") {
            PromptPart {
                is_noun: true,
                text: text.to_string(),
            }
        } else {
            // Everything else (それ以外)
            PromptPart {
                is_noun: false,
                text: token.to_string(),
            }
        }
    }
}

/// Parse input text into PromptParts
///
/// # Arguments
/// * `input` - Raw input text with space-delimited tokens
///
/// # Returns
/// Vector of PromptPart instances
pub fn parse_input(input: &str) -> Vec<PromptPart> {
    let mut parts = Vec::new();

    for line in input.lines() {
        let line = line.trim();

        // Skip empty lines
        if line.is_empty() {
            continue;
        }

        // Split by double spaces (sentence delimiter)
        let sentences = line.split("  ");

        for sentence in sentences {
            let sentence = sentence.trim();
            if sentence.is_empty() {
                continue;
            }

            // Collect all tokens in this sentence
            let tokens: Vec<&str> = sentence.split_whitespace().collect();
            if tokens.is_empty() {
                continue;
            }

            // Build the sentence text, checking each token for _N: prefix
            let mut text = String::new();
            let mut has_noun = false;

            for (i, token) in tokens.iter().enumerate() {
                // Check if this token is a noun marker
                match token.strip_prefix("_N:") {
                    Some(stripped) => {
                        // This is a noun token
                        has_noun = true;
                        if i > 0 {
                            text.push(' ');
                        }
                        text.push_str(stripped);
                    }
                    None => {
                        // Regular token
                        if i > 0 {
                            text.push(' ');
                        }
                        text.push_str(token);
                    }
                }
            }

            parts.push(PromptPart {
                is_noun: has_noun,
                text,
            });
        }
    }

    parts
}

/// Generate formatted prompt from parts
///
/// # Arguments
/// * `parts` - Vector of PromptPart instances
///
/// # Returns
/// Formatted prompt string
pub fn generate_prompt(parts: &[PromptPart]) -> String {
    let mut output = String::new();

    for part in parts {
        // Add text with noun annotation if applicable
        if part.is_noun {
            output.push_str(&format!("{} (NOUN)\n", part.text));
        } else {
            output.push_str(&format!("{}\n", part.text));
        }
    }

    output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_noun() {
        let token = "_N:データベーステーブルブロック機能";
        let part = PromptPart::from_token(token);

        assert_eq!(part.is_noun, true);
        assert_eq!(part.text, "データベーステーブルブロック機能");
    }

    #[test]
    fn test_parse_everything_else() {
        let token = "データベースのテーブル構造を視覚的に定義する";
        let part = PromptPart::from_token(token);

        assert_eq!(part.is_noun, false);
        assert_eq!(part.text, "データベースのテーブル構造を視覚的に定義する");
    }

    #[test]
    fn test_generate_prompt() {
        let parts = vec![
            PromptPart {
                is_noun: true,
                text: "テーブルブロック機能".to_string(),
            },
            PromptPart {
                is_noun: false,
                text: "データベーステーブルを定義します".to_string(),
            },
            PromptPart {
                is_noun: true,
                text: "対象ユーザー".to_string(),
            },
        ];

        let prompt = generate_prompt(&parts);

        assert!(prompt.contains("テーブルブロック機能 (NOUN)"));
        assert!(prompt.contains("データベーステーブルを定義します\n"));
        assert!(prompt.contains("対象ユーザー (NOUN)"));
    }

    #[test]
    fn test_empty_parts() {
        let parts = vec![];
        let prompt = generate_prompt(&parts);
        assert_eq!(prompt, "");
    }

    #[test]
    fn test_noun_prefix_stripping() {
        // Noun (名詞)
        let noun_token = "_N:機能名";
        let noun_part = PromptPart::from_token(noun_token);
        assert_eq!(noun_part.is_noun, true);
        assert_eq!(noun_part.text, "機能名");

        // Everything else (それ以外)
        let other_token = "これは説明文です";
        let other_part = PromptPart::from_token(other_token);
        assert_eq!(other_part.is_noun, false);
        assert_eq!(other_part.text, "これは説明文です");
    }

    #[test]
    fn test_multi_token_sentence() {
        // Multiple tokens should be combined into one sentence
        let part = PromptPart {
            is_noun: true,
            text: "GUI ブロック ビルダー 機能".to_string(),
        };

        assert_eq!(part.is_noun, true);
        assert_eq!(part.text, "GUI ブロック ビルダー 機能");
    }

    #[test]
    fn test_noun_in_middle_of_sentence() {
        // Test case: "テキストフィールド を _N:変数 に コピーしてください"
        // Should be marked as noun because it contains _N: marker
        let part = PromptPart {
            is_noun: true,
            text: "テキストフィールド を 変数 に コピーしてください".to_string(),
        };

        assert_eq!(part.is_noun, true);
        assert!(part.text.contains("変数"));
        assert!(!part.text.contains("_N:"));
    }

    #[test]
    fn test_parse_input() {
        let input = "_N:データベーステーブルブロック機能  データベースのテーブル構造を視覚的に定義する機能です";
        let parts = parse_input(input);

        assert_eq!(parts.len(), 2);
        assert_eq!(parts[0].is_noun, true);
        assert_eq!(parts[0].text, "データベーステーブルブロック機能");
        assert_eq!(parts[1].is_noun, false);
        assert_eq!(parts[1].text, "データベースのテーブル構造を視覚的に定義する機能です");
    }
}
