use crate::error::ProjectError;
use ltk_mod_project::ModProjectLayer;
use serde::Serialize;
use std::collections::HashMap;
use std::path::Path;
use std::time::Instant;
use xxhash_rust::xxh3::xxh3_64;

#[derive(Debug, Clone, Serialize)]
pub struct ScannedAsset {
    pub wad_name: String,
    pub relative_path: String,
    pub absolute_path: String,
    pub path_hash: u64,
    pub size_bytes: u64,
    pub layer_name: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ResolvedAssetInfo {
    pub wad_name: String,
    pub relative_path: String,
    pub path_hash: String,
    pub effective_layer: String,
    pub all_layers: Vec<String>,
    pub size_bytes: u64,
}

#[derive(Debug, Serialize)]
pub struct ScanResult {
    pub assets: Vec<ResolvedAssetInfo>,
    pub total_count: usize,
    pub scan_duration_ms: u64,
}

#[derive(Debug, Clone, Serialize)]
pub struct LayerScanInfo {
    pub name: String,
    pub priority: i32,
    pub description: Option<String>,
    pub asset_count: usize,
    pub total_size_bytes: u64,
}

/// Scan a single layer directory and return all discovered assets.
fn scan_layer(
    content_dir: &Path,
    layer: &ModProjectLayer,
) -> Result<Vec<ScannedAsset>, ProjectError> {
    let layer_dir = content_dir.join(&layer.name);
    if !layer_dir.exists() {
        return Ok(Vec::new());
    }

    let mut assets = Vec::new();

    // Walk the layer directory looking for WAD directories
    for entry in std::fs::read_dir(&layer_dir)? {
        let entry = entry?;
        let entry_path = entry.path();
        let file_name = entry.file_name().to_string_lossy().to_string();

        // WAD directories end with .wad.client or .wad
        if entry_path.is_dir()
            && (file_name.ends_with(".wad.client") || file_name.ends_with(".wad"))
        {
            let wad_name = file_name;
            scan_wad_directory(&entry_path, &wad_name, &layer.name, &mut assets)?;
        }
    }

    Ok(assets)
}

/// Recursively scan a WAD directory for asset files.
fn scan_wad_directory(
    wad_dir: &Path,
    wad_name: &str,
    layer_name: &str,
    assets: &mut Vec<ScannedAsset>,
) -> Result<(), ProjectError> {
    for entry in walkdir(wad_dir)? {
        let metadata = std::fs::metadata(&entry)?;
        if !metadata.is_file() {
            continue;
        }

        let relative_path = entry
            .strip_prefix(wad_dir)
            .map_err(|e| ProjectError::AssetError(e.to_string()))?
            .to_string_lossy()
            .replace('\\', "/");

        // Hash uses the WAD-relative path for modpkg compatibility
        let hash_input = format!("{}/{}", wad_name, relative_path);
        let path_hash = xxh3_64(hash_input.as_bytes());

        assets.push(ScannedAsset {
            wad_name: wad_name.to_string(),
            relative_path,
            absolute_path: entry.to_string_lossy().to_string(),
            path_hash,
            size_bytes: metadata.len(),
            layer_name: layer_name.to_string(),
        });
    }

    Ok(())
}

/// Simple recursive directory walk returning all file paths.
fn walkdir(dir: &Path) -> Result<Vec<std::path::PathBuf>, ProjectError> {
    let mut files = Vec::new();
    walk_recursive(dir, &mut files)?;
    Ok(files)
}

fn walk_recursive(dir: &Path, files: &mut Vec<std::path::PathBuf>) -> Result<(), ProjectError> {
    for entry in std::fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            walk_recursive(&path, files)?;
        } else {
            files.push(path);
        }
    }
    Ok(())
}

/// Scan all layers in a project and return per-layer info (counts and sizes).
pub fn scan_layers(
    project_root: &Path,
    layers: &[ModProjectLayer],
) -> Result<Vec<LayerScanInfo>, ProjectError> {
    let content_dir = project_root.join("content");
    let effective_layers = if layers.is_empty() {
        vec![ModProjectLayer::base()]
    } else {
        layers.to_vec()
    };

    let mut result = Vec::new();
    for layer in &effective_layers {
        let assets = scan_layer(&content_dir, layer)?;
        let total_size: u64 = assets.iter().map(|a| a.size_bytes).sum();
        result.push(LayerScanInfo {
            name: layer.name.clone(),
            priority: layer.priority,
            description: layer.description.clone(),
            asset_count: assets.len(),
            total_size_bytes: total_size,
        });
    }

    Ok(result)
}

/// Full asset scan with layer priority resolution.
pub fn scan_all_assets(
    project_root: &Path,
    layers: &[ModProjectLayer],
) -> Result<ScanResult, ProjectError> {
    let start = Instant::now();
    let content_dir = project_root.join("content");

    let effective_layers = if layers.is_empty() {
        vec![ModProjectLayer::base()]
    } else {
        layers.to_vec()
    };

    // Collect all assets from all layers
    let mut all_assets: Vec<ScannedAsset> = Vec::new();
    for layer in &effective_layers {
        all_assets.extend(scan_layer(&content_dir, layer)?);
    }

    // Build priority map: layer_name -> priority
    let priority_map: HashMap<&str, i32> = effective_layers
        .iter()
        .map(|l| (l.name.as_str(), l.priority))
        .collect();

    // Group by (wad_name, relative_path) to resolve priorities
    let mut grouped: HashMap<(String, String), Vec<ScannedAsset>> = HashMap::new();
    for asset in all_assets {
        let key = (asset.wad_name.clone(), asset.relative_path.clone());
        grouped.entry(key).or_default().push(asset);
    }

    // Resolve: pick effective layer (highest priority) for each asset
    let mut resolved: Vec<ResolvedAssetInfo> = Vec::with_capacity(grouped.len());
    for ((_wad, _rel), mut variants) in grouped {
        variants.sort_by(|a, b| {
            let pa = priority_map
                .get(a.layer_name.as_str())
                .copied()
                .unwrap_or(0);
            let pb = priority_map
                .get(b.layer_name.as_str())
                .copied()
                .unwrap_or(0);
            pb.cmp(&pa) // highest priority first
        });

        let effective = &variants[0];
        resolved.push(ResolvedAssetInfo {
            wad_name: effective.wad_name.clone(),
            relative_path: effective.relative_path.clone(),
            path_hash: format!("{:016x}", effective.path_hash),
            effective_layer: effective.layer_name.clone(),
            all_layers: variants.iter().map(|v| v.layer_name.clone()).collect(),
            size_bytes: effective.size_bytes,
        });
    }

    // Sort by WAD name then path for consistent ordering
    resolved.sort_by(|a, b| {
        a.wad_name
            .cmp(&b.wad_name)
            .then(a.relative_path.cmp(&b.relative_path))
    });

    let total_count = resolved.len();
    let duration = start.elapsed().as_millis() as u64;

    Ok(ScanResult {
        assets: resolved,
        total_count,
        scan_duration_ms: duration,
    })
}
