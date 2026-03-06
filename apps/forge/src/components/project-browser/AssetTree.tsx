import { useState, useMemo } from "react";
import type { ResolvedAssetInfo } from "../../lib/tauri-commands";

interface AssetTreeProps {
  assets: ResolvedAssetInfo[];
  searchQuery: string;
}

interface WadGroup {
  wadName: string;
  assets: ResolvedAssetInfo[];
  totalSize: number;
}

export function AssetTree({ assets, searchQuery }: AssetTreeProps) {
  const [expandedWads, setExpandedWads] = useState<Set<string>>(new Set());

  const filteredGroups = useMemo(() => {
    const filtered = searchQuery
      ? assets.filter(
          (a) =>
            a.relative_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.wad_name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : assets;

    const grouped = new Map<string, ResolvedAssetInfo[]>();
    for (const asset of filtered) {
      const existing = grouped.get(asset.wad_name);
      if (existing) {
        existing.push(asset);
      } else {
        grouped.set(asset.wad_name, [asset]);
      }
    }

    const groups: WadGroup[] = [];
    for (const [wadName, wadAssets] of grouped) {
      groups.push({
        wadName,
        assets: wadAssets,
        totalSize: wadAssets.reduce((sum, a) => sum + a.size_bytes, 0),
      });
    }
    groups.sort((a, b) => a.wadName.localeCompare(b.wadName));
    return groups;
  }, [assets, searchQuery]);

  const toggleWad = (wadName: string) => {
    setExpandedWads((prev) => {
      const next = new Set(prev);
      if (next.has(wadName)) {
        next.delete(wadName);
      } else {
        next.add(wadName);
      }
      return next;
    });
  };

  if (filteredGroups.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-tertiary)]">
        {searchQuery ? "No assets match your search" : "No assets found"}
      </div>
    );
  }

  return (
    <div className="text-xs">
      {filteredGroups.map((group) => (
        <div key={group.wadName}>
          <button
            type="button"
            className="w-full flex items-center gap-1.5 px-2 py-1 hover:bg-[var(--color-bg-tertiary)] text-left"
            onClick={() => toggleWad(group.wadName)}
          >
            <span className="text-[var(--color-text-tertiary)] w-3">
              {expandedWads.has(group.wadName) ? "▾" : "▸"}
            </span>
            <span className="font-medium text-[var(--color-text-primary)]">
              {group.wadName}
            </span>
            <span className="text-[var(--color-text-tertiary)] ml-auto">
              {group.assets.length} files &middot;{" "}
              {formatBytes(group.totalSize)}
            </span>
          </button>

          {expandedWads.has(group.wadName) && (
            <div className="ml-4">
              {group.assets.map((asset) => (
                <AssetNode key={asset.path_hash} asset={asset} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AssetNode({ asset }: { asset: ResolvedAssetInfo }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[var(--color-bg-tertiary)] group">
      <span className="text-[var(--color-text-secondary)] flex-1 truncate">
        {asset.relative_path}
      </span>
      {asset.all_layers.length > 1 && (
        <LayerBadge
          effectiveLayer={asset.effective_layer}
          allLayers={asset.all_layers}
        />
      )}
      <span className="text-[var(--color-text-tertiary)] shrink-0">
        {formatBytes(asset.size_bytes)}
      </span>
    </div>
  );
}

function LayerBadge({
  effectiveLayer,
  allLayers,
}: {
  effectiveLayer: string;
  allLayers: string[];
}) {
  return (
    <span
      className="shrink-0 px-1 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20"
      title={`Override: ${allLayers.join(" > ")}`}
    >
      {effectiveLayer}
    </span>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}
