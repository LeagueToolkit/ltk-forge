use crate::error::ProjectError;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::Path;

const FORGE_DIR: &str = ".forge";
const META_FILE: &str = ".forge-meta.json";
const CURRENT_VERSION: u32 = 1;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ForgeMeta {
    pub version: u32,
    pub last_cleanup: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ScratchInfo {
    pub version: u32,
    pub total_size_bytes: u64,
    pub last_cleanup: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ScratchEntryInfo {
    pub editor_type: String,
    pub asset_hash: String,
    pub size_bytes: u64,
    pub reason: String,
}

#[derive(Debug, Serialize)]
pub struct CleanupResult {
    pub removed_entries: Vec<ScratchEntryInfo>,
    pub freed_bytes: u64,
    pub remaining_bytes: u64,
}

/// Get the .forge directory path for a project.
pub fn forge_dir(project_root: &Path) -> std::path::PathBuf {
    project_root.join(FORGE_DIR)
}

/// Read .forge-meta.json, returning None if it doesn't exist.
fn read_meta(project_root: &Path) -> Result<Option<ForgeMeta>, ProjectError> {
    let meta_path = forge_dir(project_root).join(META_FILE);
    if !meta_path.exists() {
        return Ok(None);
    }
    let content = std::fs::read_to_string(&meta_path)?;
    let meta: ForgeMeta = serde_json::from_str(&content)?;
    Ok(Some(meta))
}

/// Write .forge-meta.json.
fn write_meta(project_root: &Path, meta: &ForgeMeta) -> Result<(), ProjectError> {
    let forge = forge_dir(project_root);
    std::fs::create_dir_all(&forge)?;
    let meta_path = forge.join(META_FILE);
    let content = serde_json::to_string_pretty(meta)?;
    std::fs::write(&meta_path, content)?;
    Ok(())
}

/// Get scratch directory info for a project.
pub fn get_scratch_info(project_root: &Path) -> Result<Option<ScratchInfo>, ProjectError> {
    let forge = forge_dir(project_root);
    if !forge.exists() {
        return Ok(None);
    }

    let meta = read_meta(project_root)?.unwrap_or(ForgeMeta {
        version: CURRENT_VERSION,
        last_cleanup: None,
    });

    let total_size = dir_size(&forge)?;

    Ok(Some(ScratchInfo {
        version: meta.version,
        total_size_bytes: total_size,
        last_cleanup: meta.last_cleanup.map(|dt| dt.to_rfc3339()),
    }))
}

/// Get a deterministic scratch path for an editor type and asset hash.
pub fn get_scratch_path(
    project_root: &Path,
    editor_type: &str,
    asset_hash: &str,
) -> std::path::PathBuf {
    forge_dir(project_root).join(editor_type).join(asset_hash)
}

/// Ensure the scratch directory exists for a given editor type and asset.
pub fn ensure_scratch_dir(
    project_root: &Path,
    editor_type: &str,
    asset_hash: &str,
) -> Result<std::path::PathBuf, ProjectError> {
    let path = get_scratch_path(project_root, editor_type, asset_hash);
    std::fs::create_dir_all(&path)?;

    // Ensure meta exists
    if read_meta(project_root)?.is_none() {
        write_meta(
            project_root,
            &ForgeMeta {
                version: CURRENT_VERSION,
                last_cleanup: None,
            },
        )?;
    }

    Ok(path)
}

/// Clean up stale scratch data entries that don't match current project assets.
pub fn cleanup_scratch(
    project_root: &Path,
    known_asset_hashes: &HashSet<String>,
    dry_run: bool,
) -> Result<CleanupResult, ProjectError> {
    let forge = forge_dir(project_root);
    if !forge.exists() {
        return Err(ProjectError::NoScratchDir(
            forge.to_string_lossy().to_string(),
        ));
    }

    let mut removed_entries = Vec::new();
    let mut freed_bytes = 0u64;

    // Walk editor type directories
    for entry in std::fs::read_dir(&forge)? {
        let entry = entry?;
        let path = entry.path();
        let file_name = entry.file_name().to_string_lossy().to_string();

        // Skip .forge-meta.json
        if !path.is_dir() {
            continue;
        }

        let editor_type = file_name;

        // Walk asset hash directories within each editor type
        for asset_entry in std::fs::read_dir(&path)? {
            let asset_entry = asset_entry?;
            let asset_path = asset_entry.path();

            if !asset_path.is_dir() {
                continue;
            }

            let asset_hash = asset_entry.file_name().to_string_lossy().to_string();

            // "global" is never stale
            if asset_hash == "global" {
                continue;
            }

            // Check if this asset hash is still in the project
            if !known_asset_hashes.contains(&asset_hash) {
                let size = dir_size(&asset_path)?;
                removed_entries.push(ScratchEntryInfo {
                    editor_type: editor_type.clone(),
                    asset_hash: asset_hash.clone(),
                    size_bytes: size,
                    reason: "orphaned".to_string(),
                });
                freed_bytes += size;

                if !dry_run {
                    std::fs::remove_dir_all(&asset_path)?;
                }
            }
        }
    }

    // Update meta with cleanup timestamp
    if !dry_run && !removed_entries.is_empty() {
        let mut meta = read_meta(project_root)?.unwrap_or(ForgeMeta {
            version: CURRENT_VERSION,
            last_cleanup: None,
        });
        meta.last_cleanup = Some(Utc::now());
        write_meta(project_root, &meta)?;
    }

    let remaining_bytes = dir_size(&forge)?;

    Ok(CleanupResult {
        removed_entries,
        freed_bytes,
        remaining_bytes,
    })
}

/// Calculate total size of a directory recursively.
fn dir_size(path: &Path) -> Result<u64, ProjectError> {
    let mut total = 0u64;
    if path.is_file() {
        return Ok(std::fs::metadata(path)?.len());
    }
    if path.is_dir() {
        for entry in std::fs::read_dir(path)? {
            let entry = entry?;
            let entry_path = entry.path();
            if entry_path.is_dir() {
                total += dir_size(&entry_path)?;
            } else {
                total += std::fs::metadata(&entry_path)?.len();
            }
        }
    }
    Ok(total)
}
