// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod project;

use serde::Serialize;

#[derive(Serialize)]
struct AppInfo {
    name: String,
    version: String,
}

#[tauri::command]
fn get_app_info() -> AppInfo {
    AppInfo {
        name: "LTK Forge".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            project::commands::create_project,
            project::commands::open_project,
            project::commands::scan_assets,
            project::commands::get_recent_projects,
            project::commands::remove_recent_project,
            project::commands::cleanup_scratch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
