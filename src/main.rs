// Prevents additional console window on Windows in release mode
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod modules;

use commands::{
    generate_prompt_from_text,
    greet,
    save_project,
    load_project,
    create_new_project,
    update_project_timestamp,
    show_open_dialog,
    show_save_dialog,
    show_confirm_dialog,
    set_window_title,
};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            generate_prompt_from_text,
            greet,
            save_project,
            load_project,
            create_new_project,
            update_project_timestamp,
            show_open_dialog,
            show_save_dialog,
            show_confirm_dialog,
            set_window_title,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
