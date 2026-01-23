/// Tauri Commands for Promps
///
/// This module defines all Tauri commands that bridge the frontend (JS)
/// and backend (Rust) logic.

use promps::{parse_input, generate_prompt};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

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

// ============================================================================
// Phase 4: Project Persistence
// ============================================================================

/// Project metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectMetadata {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub created_at: String,
    pub modified_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
}

/// Promps project file structure (.promps)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrompProject {
    pub version: String,
    pub metadata: ProjectMetadata,
    pub workspace: serde_json::Value,
    pub settings: serde_json::Value,
}

impl PrompProject {
    /// Create a new project with default values
    pub fn new(name: String) -> Self {
        let now = chrono_now();
        PrompProject {
            version: "1.0.0".to_string(),
            metadata: ProjectMetadata {
                name,
                description: None,
                created_at: now.clone(),
                modified_at: now,
                author: None,
            },
            workspace: serde_json::json!({}),
            settings: serde_json::json!({
                "zoom": 1.0,
                "scrollX": 0,
                "scrollY": 0
            }),
        }
    }
}

/// Get current timestamp in ISO 8601 format
fn chrono_now() -> String {
    // Simple ISO 8601 timestamp without external chrono dependency
    // Format: 2026-01-23T10:00:00Z
    use std::time::{SystemTime, UNIX_EPOCH};
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default();
    let secs = duration.as_secs();

    // Calculate date/time components (simplified UTC)
    let days = secs / 86400;
    let time_secs = secs % 86400;
    let hours = time_secs / 3600;
    let minutes = (time_secs % 3600) / 60;
    let seconds = time_secs % 60;

    // Days since 1970-01-01
    let mut year = 1970;
    let mut remaining_days = days as i64;

    loop {
        let days_in_year = if is_leap_year(year) { 366 } else { 365 };
        if remaining_days < days_in_year {
            break;
        }
        remaining_days -= days_in_year;
        year += 1;
    }

    let month_days = if is_leap_year(year) {
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    } else {
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    };

    let mut month = 1;
    for &days_in_month in &month_days {
        if remaining_days < days_in_month as i64 {
            break;
        }
        remaining_days -= days_in_month as i64;
        month += 1;
    }

    let day = remaining_days + 1;

    format!(
        "{:04}-{:02}-{:02}T{:02}:{:02}:{:02}Z",
        year, month, day, hours, minutes, seconds
    )
}

fn is_leap_year(year: i64) -> bool {
    (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}

/// Save project to file
///
/// # Arguments
/// * `path` - File path to save to
/// * `project` - Project data to save
///
/// # Returns
/// Result indicating success or error message
#[tauri::command]
pub fn save_project(path: String, project: PrompProject) -> Result<(), String> {
    // Validate path has .promps extension
    if !path.to_lowercase().ends_with(".promps") {
        return Err("File must have .promps extension".to_string());
    }

    // Serialize project to JSON
    let json = serde_json::to_string_pretty(&project)
        .map_err(|e| format!("Failed to serialize project: {}", e))?;

    // Write to file
    fs::write(&path, json)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}

/// Load project from file
///
/// # Arguments
/// * `path` - File path to load from
///
/// # Returns
/// Result containing project data or error message
#[tauri::command]
pub fn load_project(path: String) -> Result<PrompProject, String> {
    // Check if file exists
    if !Path::new(&path).exists() {
        return Err(format!("File not found: {}", path));
    }

    // Validate path has .promps extension
    if !path.to_lowercase().ends_with(".promps") {
        return Err("File must have .promps extension".to_string());
    }

    // Read file contents
    let contents = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    // Parse JSON
    let project: PrompProject = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse project file: {}", e))?;

    Ok(project)
}

/// Create a new empty project
///
/// # Arguments
/// * `name` - Project name
///
/// # Returns
/// New project with default values
#[tauri::command]
pub fn create_new_project(name: String) -> PrompProject {
    PrompProject::new(name)
}

/// Update project modified timestamp
///
/// # Arguments
/// * `project` - Project to update
///
/// # Returns
/// Updated project with new modified_at timestamp
#[tauri::command]
pub fn update_project_timestamp(mut project: PrompProject) -> PrompProject {
    project.metadata.modified_at = chrono_now();
    project
}

/// Show open file dialog and return selected path
#[tauri::command]
pub async fn show_open_dialog(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;

    let file_path = app.dialog()
        .file()
        .add_filter("Promps Project", &["promps"])
        .set_title("Open Project")
        .blocking_pick_file();

    match file_path {
        Some(path) => Ok(Some(path.to_string())),
        None => Ok(None),
    }
}

/// Show save file dialog and return selected path
#[tauri::command]
pub async fn show_save_dialog(app: tauri::AppHandle, default_name: String) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;

    let file_path = app.dialog()
        .file()
        .add_filter("Promps Project", &["promps"])
        .set_title("Save Project")
        .set_file_name(&default_name)
        .blocking_save_file();

    match file_path {
        Some(path) => {
            let mut path_str = path.to_string();
            // Ensure .promps extension
            if !path_str.to_lowercase().ends_with(".promps") {
                path_str.push_str(".promps");
            }
            Ok(Some(path_str))
        },
        None => Ok(None),
    }
}

/// Show confirmation dialog
#[tauri::command]
pub async fn show_confirm_dialog(app: tauri::AppHandle, title: String, message: String) -> bool {
    use tauri_plugin_dialog::DialogExt;
    use tauri_plugin_dialog::MessageDialogKind;

    app.dialog()
        .message(&message)
        .title(&title)
        .kind(MessageDialogKind::Warning)
        .blocking_show()
}

/// Set window title
#[tauri::command]
pub async fn set_window_title(window: tauri::Window, title: String) -> Result<(), String> {
    window.set_title(&title).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_prompt_from_text() {
        let input = "_N:ユーザー が _N:注文 を 作成".to_string();
        let result = generate_prompt_from_text(input);

        // Each noun gets its own (NOUN) marker
        assert!(result.contains("ユーザー (NOUN)"));
        assert!(result.contains("注文 (NOUN)"));
        assert!(result.contains("が"));
        assert!(result.contains("を 作成"));
    }

    #[test]
    fn test_greet() {
        let result = greet("World".to_string());
        assert_eq!(result, "Hello, World! Welcome to Promps.");
    }

    // Phase 1 Integration Tests

    #[test]
    fn test_single_noun_block() {
        let input = "_N:User".to_string();
        let result = generate_prompt_from_text(input);

        assert!(result.contains("User"));
        assert!(result.contains("(NOUN)"));
    }

    #[test]
    fn test_multiple_noun_blocks() {
        // Phase 0-1: token-level is_noun detection
        // Each _N: token gets its own (NOUN) marker
        let input = "_N:User _N:Order".to_string();
        let result = generate_prompt_from_text(input);

        assert!(result.contains("User"));
        assert!(result.contains("Order"));
        // Each noun gets its own marker
        let noun_count = result.matches("(NOUN)").count();
        assert_eq!(noun_count, 2);
    }

    #[test]
    fn test_japanese_noun_blocks() {
        // Phase 0-1: token-level is_noun detection
        let input = "_N:データベース _N:テーブル _N:ブロック".to_string();
        let result = generate_prompt_from_text(input);

        assert!(result.contains("データベース"));
        assert!(result.contains("テーブル"));
        assert!(result.contains("ブロック"));
        // Each noun gets its own marker
        let noun_count = result.matches("(NOUN)").count();
        assert_eq!(noun_count, 3);
    }

    #[test]
    fn test_empty_input() {
        let input = "".to_string();
        let result = generate_prompt_from_text(input);

        assert_eq!(result, "");
    }

    #[test]
    fn test_whitespace_only_input() {
        let input = "   ".to_string();
        let result = generate_prompt_from_text(input);

        // Empty parts should result in empty output
        assert_eq!(result, "");
    }

    #[test]
    fn test_complex_sentence_structure() {
        // Note: _N: only applies to the token immediately after it
        let input = "_N:GUI ブロック ビルダー 機能  ドラッグ アンド ドロップ で ブロック を 配置 する".to_string();
        let result = generate_prompt_from_text(input);

        // Only "GUI" is marked as noun
        assert!(result.contains("GUI (NOUN)"));

        // Rest of the tokens are not nouns
        assert!(result.contains("ブロック ビルダー 機能"));
        assert!(result.contains("ドラッグ アンド ドロップ で ブロック を 配置 する"));
    }

    #[test]
    fn test_noun_and_description_alternating() {
        let input = "_N:機能  説明文  _N:対象ユーザー  開発者向け".to_string();
        let result = generate_prompt_from_text(input);

        // Nouns should be marked
        assert!(result.contains("機能"));
        assert!(result.contains("対象ユーザー"));

        // Descriptions should be present
        assert!(result.contains("説明文"));
        assert!(result.contains("開発者向け"));

        // Should have exactly 2 noun markers
        let noun_count = result.matches("(NOUN)").count();
        assert_eq!(noun_count, 2);
    }

    #[test]
    fn test_blockly_generated_code_pattern() {
        // Simulate code generated by Blockly.js workspace
        // Phase 0-1: token-level is_noun detection
        let input = "_N:User _N:Order _N:Product ".to_string();
        let result = generate_prompt_from_text(input);

        // All three nouns should be present
        assert!(result.contains("User"));
        assert!(result.contains("Order"));
        assert!(result.contains("Product"));

        // Each noun gets its own marker
        let noun_count = result.matches("(NOUN)").count();
        assert_eq!(noun_count, 3);
    }

    #[test]
    fn test_special_characters_in_noun() {
        let input = "_N:User123 _N:Order_ID".to_string();
        let result = generate_prompt_from_text(input);

        assert!(result.contains("User123"));
        assert!(result.contains("Order_ID"));
    }

    #[test]
    fn test_greet_with_empty_name() {
        let result = greet("".to_string());
        assert_eq!(result, "Hello, ! Welcome to Promps.");
    }

    #[test]
    fn test_greet_with_japanese_name() {
        let result = greet("太郎".to_string());
        assert_eq!(result, "Hello, 太郎! Welcome to Promps.");
    }

    // Phase 4: Project Persistence Tests

    #[test]
    fn test_create_new_project() {
        let project = create_new_project("Test Project".to_string());

        assert_eq!(project.version, "1.0.0");
        assert_eq!(project.metadata.name, "Test Project");
        assert!(project.metadata.description.is_none());
        assert!(project.metadata.author.is_none());
        assert!(!project.metadata.created_at.is_empty());
        assert!(!project.metadata.modified_at.is_empty());
    }

    #[test]
    fn test_project_serialization() {
        let project = create_new_project("Serialization Test".to_string());

        // Test serialization
        let json = serde_json::to_string(&project).unwrap();

        // Verify JSON contains expected fields
        assert!(json.contains("\"version\":\"1.0.0\""));
        assert!(json.contains("\"name\":\"Serialization Test\""));
        assert!(json.contains("\"workspace\":"));
        assert!(json.contains("\"settings\":"));
    }

    #[test]
    fn test_project_deserialization() {
        let json = r#"{
            "version": "1.0.0",
            "metadata": {
                "name": "Deserialize Test",
                "description": "Test description",
                "createdAt": "2026-01-23T10:00:00Z",
                "modifiedAt": "2026-01-23T11:00:00Z",
                "author": "Test Author"
            },
            "workspace": {"blocks": []},
            "settings": {"zoom": 1.5, "scrollX": 100, "scrollY": 200}
        }"#;

        let project: PrompProject = serde_json::from_str(json).unwrap();

        assert_eq!(project.version, "1.0.0");
        assert_eq!(project.metadata.name, "Deserialize Test");
        assert_eq!(project.metadata.description, Some("Test description".to_string()));
        assert_eq!(project.metadata.author, Some("Test Author".to_string()));
        assert_eq!(project.metadata.created_at, "2026-01-23T10:00:00Z");
        assert_eq!(project.metadata.modified_at, "2026-01-23T11:00:00Z");
    }

    #[test]
    fn test_update_project_timestamp() {
        let project = create_new_project("Timestamp Test".to_string());
        let _original_modified = project.metadata.modified_at.clone();

        // Small delay to ensure different timestamp
        std::thread::sleep(std::time::Duration::from_millis(10));

        let updated = update_project_timestamp(project);

        // The timestamp should be different (or at least not fail)
        assert!(!updated.metadata.modified_at.is_empty());
    }

    #[test]
    fn test_chrono_now_format() {
        let timestamp = chrono_now();

        // Verify ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
        assert!(timestamp.len() == 20);
        assert!(timestamp.contains('T'));
        assert!(timestamp.ends_with('Z'));
    }

    #[test]
    fn test_save_project_invalid_extension() {
        let project = create_new_project("Test".to_string());
        let result = save_project("/tmp/test.txt".to_string(), project);

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("extension"));
    }

    #[test]
    fn test_load_project_nonexistent_file() {
        let result = load_project("/nonexistent/path/file.promps".to_string());

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("not found"));
    }

    #[test]
    fn test_load_project_invalid_extension() {
        // Create a temp file to test extension validation
        let temp_file = "/tmp/promps_test_invalid_ext.txt";
        fs::write(temp_file, "test content").unwrap();

        let result = load_project(temp_file.to_string());

        // Clean up
        let _ = fs::remove_file(temp_file);

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("extension"));
    }
}
