// Prevents additional console window on Windows in release mode
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod modules;

use commands::{generate_prompt_from_text, greet};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            generate_prompt_from_text,
            greet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
