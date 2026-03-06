use crate::error::ProjectError;
use crate::project::{scanner, scratch};
use chrono::Utc;
use ltk_mod_project::{ModProject, ModProjectAuthor, ModProjectLayer};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::Path;
use tauri::Manager;

// ── Request / Response types ────────────────────────────────────────

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub display_name: String,
    pub description: String,
    pub version: String,
    pub path: String,
    pub author: String,
}

#[derive(Debug, Serialize)]
pub struct CreateProjectResponse {
    pub root_path: String,
    pub config: serde_json::Value,
}

#[derive(Debug, Serialize)]
pub struct OpenProjectResponse {
    pub root_path: String,
    pub config: serde_json::Value,
    pub layers: Vec<scanner::LayerScanInfo>,
    pub scratch_info: Option<scratch::ScratchInfo>,
}

#[derive(Debug, Serialize)]
pub struct ScanAssetsResponse {
    pub assets: Vec<scanner::ResolvedAssetInfo>,
    pub total_count: usize,
    pub scan_duration_ms: u64,
}

#[derive(Debug, Serialize)]
pub struct RecentProjectInfo {
    pub path: String,
    pub name: String,
    pub last_opened: String,
    pub exists: bool,
}

#[derive(Debug, Serialize)]
pub struct CleanupScratchResponse {
    pub removed_entries: Vec<scratch::ScratchEntryInfo>,
    pub freed_bytes: u64,
    pub remaining_bytes: u64,
}

// ── Recent projects persistence ─────────────────────────────────────

#[derive(Debug, Serialize, Deserialize)]
struct RecentProjectEntry {
    path: String,
    name: String,
    last_opened: String,
}

const MAX_RECENT_PROJECTS: usize = 20;

fn recent_projects_path(app_handle: &tauri::AppHandle) -> Result<std::path::PathBuf, ProjectError> {
    let app_data = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| ProjectError::IoError(format!("Failed to get app data dir: {e}")))?;
    std::fs::create_dir_all(&app_data)?;
    Ok(app_data.join("recent-projects.json"))
}

fn read_recent_projects(
    app_handle: &tauri::AppHandle,
) -> Result<Vec<RecentProjectEntry>, ProjectError> {
    let path = recent_projects_path(app_handle)?;
    if !path.exists() {
        return Ok(Vec::new());
    }
    let content = std::fs::read_to_string(&path)?;
    let entries: Vec<RecentProjectEntry> = serde_json::from_str(&content).unwrap_or_default();
    Ok(entries)
}

fn write_recent_projects(
    app_handle: &tauri::AppHandle,
    entries: &[RecentProjectEntry],
) -> Result<(), ProjectError> {
    let path = recent_projects_path(app_handle)?;
    let content = serde_json::to_string_pretty(entries)?;
    std::fs::write(&path, content)?;
    Ok(())
}

fn add_recent_project(
    app_handle: &tauri::AppHandle,
    project_path: &str,
    name: &str,
) -> Result<(), ProjectError> {
    let mut entries = read_recent_projects(app_handle)?;

    // Remove existing entry for this path (if any)
    entries.retain(|e| e.path != project_path);

    // Add at front
    entries.insert(
        0,
        RecentProjectEntry {
            path: project_path.to_string(),
            name: name.to_string(),
            last_opened: Utc::now().to_rfc3339(),
        },
    );

    // Cap at max
    entries.truncate(MAX_RECENT_PROJECTS);

    write_recent_projects(app_handle, &entries)
}

// ── Validation helpers ──────────────────────────────────────────────

fn validate_project_name(name: &str) -> Result<(), ProjectError> {
    if name.is_empty() {
        return Err(ProjectError::InvalidName(
            "Project name cannot be empty".to_string(),
        ));
    }
    if !name
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
    {
        return Err(ProjectError::InvalidName(format!(
            "Project name '{}' contains invalid characters. Only alphanumeric, hyphens, and underscores are allowed.",
            name
        )));
    }
    Ok(())
}

// ── Tauri commands ──────────────────────────────────────────────────

#[tauri::command]
pub fn create_project(request: CreateProjectRequest) -> Result<CreateProjectResponse, ProjectError> {
    validate_project_name(&request.name)?;

    let project_dir = Path::new(&request.path);

    // Check if directory exists and is non-empty
    if project_dir.exists() {
        let is_empty = std::fs::read_dir(project_dir)?.next().is_none();
        if !is_empty {
            return Err(ProjectError::DirectoryNotEmpty(request.path.clone()));
        }
    } else {
        std::fs::create_dir_all(project_dir)?;
    }

    // Create mod.config.json
    let mod_project = ModProject {
        name: request.name.clone(),
        display_name: request.display_name.clone(),
        version: request.version.clone(),
        description: request.description.clone(),
        authors: vec![ModProjectAuthor::Name(request.author.clone())],
        license: None,
        tags: Vec::new(),
        champions: Vec::new(),
        maps: Vec::new(),
        transformers: Vec::new(),
        layers: vec![ModProjectLayer::base()],
        thumbnail: None,
    };

    let config_json = serde_json::to_string_pretty(&mod_project)?;
    std::fs::write(project_dir.join("mod.config.json"), &config_json)?;

    // Create content/base directory
    std::fs::create_dir_all(project_dir.join("content").join("base"))?;

    let config_value: serde_json::Value = serde_json::from_str(&config_json)?;

    Ok(CreateProjectResponse {
        root_path: request.path,
        config: config_value,
    })
}

#[tauri::command]
pub fn open_project(
    path: String,
    app_handle: tauri::AppHandle,
) -> Result<OpenProjectResponse, ProjectError> {
    let project_root = Path::new(&path);

    if !project_root.is_dir() {
        return Err(ProjectError::NotADirectory(path.clone()));
    }

    // Read mod.config.json
    let config_path = project_root.join("mod.config.json");
    if !config_path.exists() {
        return Err(ProjectError::MissingConfig(format!(
            "No mod.config.json found at {}",
            config_path.display()
        )));
    }

    let config_str = std::fs::read_to_string(&config_path)?;
    let mod_project: ModProject =
        serde_json::from_str(&config_str).map_err(|e| ProjectError::InvalidConfig(e.to_string()))?;

    let config_value: serde_json::Value = serde_json::from_str(&config_str)?;

    // Scan layers for summary info
    let layers = scanner::scan_layers(project_root, &mod_project.layers)?;

    // Get scratch info
    let scratch_info = scratch::get_scratch_info(project_root)?;

    // Add to recent projects
    let _ = add_recent_project(&app_handle, &path, &mod_project.display_name);

    Ok(OpenProjectResponse {
        root_path: path,
        config: config_value,
        layers,
        scratch_info,
    })
}

#[tauri::command]
pub fn scan_assets(project_path: String) -> Result<ScanAssetsResponse, ProjectError> {
    let project_root = Path::new(&project_path);

    if !project_root.is_dir() {
        return Err(ProjectError::ProjectNotFound(project_path.clone()));
    }

    // Read config to get layer definitions
    let config_path = project_root.join("mod.config.json");
    let config_str = std::fs::read_to_string(&config_path)?;
    let mod_project: ModProject = serde_json::from_str(&config_str)?;

    let result = scanner::scan_all_assets(project_root, &mod_project.layers)?;

    Ok(ScanAssetsResponse {
        assets: result.assets,
        total_count: result.total_count,
        scan_duration_ms: result.scan_duration_ms,
    })
}

#[tauri::command]
pub fn get_recent_projects(
    app_handle: tauri::AppHandle,
) -> Result<Vec<RecentProjectInfo>, ProjectError> {
    let entries = read_recent_projects(&app_handle)?;

    Ok(entries
        .into_iter()
        .map(|e| {
            let exists = Path::new(&e.path).is_dir();
            RecentProjectInfo {
                path: e.path,
                name: e.name,
                last_opened: e.last_opened,
                exists,
            }
        })
        .collect())
}

#[tauri::command]
pub fn remove_recent_project(
    path: String,
    app_handle: tauri::AppHandle,
) -> Result<(), ProjectError> {
    let mut entries = read_recent_projects(&app_handle)?;
    entries.retain(|e| e.path != path);
    write_recent_projects(&app_handle, &entries)
}

#[tauri::command]
pub fn cleanup_scratch(
    project_path: String,
    dry_run: bool,
) -> Result<CleanupScratchResponse, ProjectError> {
    let project_root = Path::new(&project_path);

    if !project_root.is_dir() {
        return Err(ProjectError::ProjectNotFound(project_path.clone()));
    }

    // Get current asset hashes from project scan
    let config_path = project_root.join("mod.config.json");
    let config_str = std::fs::read_to_string(&config_path)?;
    let mod_project: ModProject = serde_json::from_str(&config_str)?;

    let scan = scanner::scan_all_assets(project_root, &mod_project.layers)?;
    let known_hashes: HashSet<String> = scan.assets.iter().map(|a| a.path_hash.clone()).collect();

    let result = scratch::cleanup_scratch(project_root, &known_hashes, dry_run)?;

    Ok(CleanupScratchResponse {
        removed_entries: result.removed_entries,
        freed_bytes: result.freed_bytes,
        remaining_bytes: result.remaining_bytes,
    })
}
