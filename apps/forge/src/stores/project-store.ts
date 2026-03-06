import { create } from "zustand";
import {
  type CreateProjectRequest,
  type LayerInfo,
  type ModProjectConfig,
  type ResolvedAssetInfo,
  type ScratchInfo,
  createProject as invokeCreateProject,
  openProject as invokeOpenProject,
  scanAssets as invokeScanAssets,
} from "../lib/tauri-commands";

interface ProjectState {
  currentProject: {
    rootPath: string;
    config: ModProjectConfig;
    layers: LayerInfo[];
    scratchInfo: ScratchInfo | null;
  } | null;

  // Asset browser
  assets: ResolvedAssetInfo[];
  totalAssetCount: number;
  scanDurationMs: number;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  createProject: (request: CreateProjectRequest) => Promise<string>;
  openProject: (path: string) => Promise<void>;
  scanAssets: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  assets: [],
  totalAssetCount: 0,
  scanDurationMs: 0,
  isLoading: false,
  error: null,

  createProject: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const response = await invokeCreateProject(request);
      set({
        currentProject: {
          rootPath: response.root_path,
          config: response.config,
          layers: [],
          scratchInfo: null,
        },
        assets: [],
        totalAssetCount: 0,
        isLoading: false,
      });
      return response.root_path;
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      throw err;
    }
  },

  openProject: async (path) => {
    set({ isLoading: true, error: null });
    try {
      const response = await invokeOpenProject(path);
      set({
        currentProject: {
          rootPath: response.root_path,
          config: response.config,
          layers: response.layers,
          scratchInfo: response.scratch_info,
        },
        assets: [],
        totalAssetCount: 0,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      throw err;
    }
  },

  scanAssets: async () => {
    const project = get().currentProject;
    if (!project) return;

    set({ isLoading: true, error: null });
    try {
      const response = await invokeScanAssets(project.rootPath);
      set({
        assets: response.assets,
        totalAssetCount: response.total_count,
        scanDurationMs: response.scan_duration_ms,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: String(err) });
      throw err;
    }
  },

  reset: () => {
    set({
      currentProject: null,
      assets: [],
      totalAssetCount: 0,
      scanDurationMs: 0,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
