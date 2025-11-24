/// Tauri Commands for Promps
///
/// This module defines all Tauri commands that bridge the frontend (JS)
/// and backend (Rust) logic.

use promps::{parse_input, generate_prompt};

/// Generate prompt from DSL input text
///
/// # Arguments
/// * `input` - Raw DSL text (with _N: markers, space-delimited)
///
/// # Returns
/// Formatted prompt string
#[tauri::command]
pub fn generate_prompt_from_text(input: String) -> String {
    let parts = parse_input(&input);
    generate_prompt(&parts)
}

/// Health check command
///
/// Simple command to verify Tauri communication is working
#[tauri::command]
pub fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to Promps.", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_prompt_from_text() {
        let input = "_N:ユーザー が _N:注文 を 作成".to_string();
        let result = generate_prompt_from_text(input);

        assert!(result.contains("ユーザー が 注文 を 作成"));
        assert!(result.contains("(NOUN)"));
    }

    #[test]
    fn test_greet() {
        let result = greet("World".to_string());
        assert_eq!(result, "Hello, World! Welcome to Promps.");
    }
}
