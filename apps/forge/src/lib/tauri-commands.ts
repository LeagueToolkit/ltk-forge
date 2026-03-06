import { invoke } from "@tauri-apps/api/core";

// ── Shared types ──────────────────────────────────────────────────

export type Author = string | { name: string; role: string };

export type License = string | { name: string; url: string };

export interface LayerConfig {
  name: string;
  priority: number;
  description: string | null;
}

export interface TransformerConfig {
  name: string;
  patterns: string[];
  files: string[];
  options: Record<string, unknown> | null;
}

export interface ModProjectConfig {
  name: string;
  display_name: string;
  version: string;
  description: string;
  authors: Author[];
  license: License | null;
  tags: string[];
  champions: string[];
  maps: string[];
  layers: LayerConfig[];
  transformers: TransformerConfig[];
}

export interface LayerInfo {
  name: string;
  priority: number;
  description: string | null;
  asset_count: number;
  total_size_bytes: number;
}

export interface ScratchInfo {
  version: number;
  total_size_bytes: number;
  last_cleanup: string | null;
}

export interface ResolvedAssetInfo {
  wad_name: string;
  relative_path: string;
  path_hash: string;
  effective_layer: string;
  all_layers: string[];
  size_bytes: number;
}

export interface RecentProjectInfo {
  path: string;
  name: string;
  last_opened: string;
  exists: boolean;
}

export interface ScratchEntryInfo {
  editor_type: string;
  asset_hash: string;
  size_bytes: number;
  reason: "orphaned" | "stale";
}

// ── Request / Response types ──────────────────────────────────────

export interface CreateProjectRequest {
  name: string;
  display_name: string;
  description: string;
  version: string;
  path: string;
  author: string;
}

export interface CreateProjectResponse {
  root_path: string;
  config: ModProjectConfig;
}

export interface OpenProjectResponse {
  root_path: string;
  config: ModProjectConfig;
  layers: LayerInfo[];
  scratch_info: ScratchInfo | null;
}

export interface ScanAssetsResponse {
  assets: ResolvedAssetInfo[];
  total_count: number;
  scan_duration_ms: number;
}

export interface CleanupScratchResponse {
  removed_entries: ScratchEntryInfo[];
  freed_bytes: number;
  remaining_bytes: number;
}

// ── Invoke wrappers ───────────────────────────────────────────────

export function createProject(
  request: CreateProjectRequest,
): Promise<CreateProjectResponse> {
  return invoke("create_project", { request });
}

export function openProject(path: string): Promise<OpenProjectResponse> {
  return invoke("open_project", { path });
}

export function scanAssets(projectPath: string): Promise<ScanAssetsResponse> {
  return invoke("scan_assets", { projectPath });
}

export function getRecentProjects(): Promise<RecentProjectInfo[]> {
  return invoke("get_recent_projects");
}

export function removeRecentProject(path: string): Promise<void> {
  return invoke("remove_recent_project", { path });
}

export function cleanupScratch(
  projectPath: string,
  dryRun: boolean,
): Promise<CleanupScratchResponse> {
  return invoke("cleanup_scratch", { projectPath, dryRun });
}
