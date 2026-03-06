use std::fs;
use std::path::PathBuf;

fn main() {
    // Create a dummy dist directory with index.html if it doesn't exist.
    // This is needed so that `tauri_build::build()` (and rust-analyzer)
    // don't fail when `frontendDist` hasn't been built yet.
    let dist = PathBuf::from("../apps/forge/dist");
    if !dist.exists() {
        fs::create_dir_all(&dist).expect("failed to create dist directory");
        fs::write(dist.join("index.html"), "").expect("failed to create dummy index.html");
    }

    tauri_build::build()
}
