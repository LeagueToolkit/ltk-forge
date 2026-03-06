import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@ltk-forge/ui";
import { useProjectStore } from "../../stores/project-store";
import { AssetTree } from "../../components/project-browser/AssetTree";

function AssetBrowserPage() {
  const project = useProjectStore((s) => s.currentProject);
  const assets = useProjectStore((s) => s.assets);
  const totalAssetCount = useProjectStore((s) => s.totalAssetCount);
  const scanDurationMs = useProjectStore((s) => s.scanDurationMs);
  const isLoading = useProjectStore((s) => s.isLoading);
  const error = useProjectStore((s) => s.error);
  const scanAssets = useProjectStore((s) => s.scanAssets);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (project && assets.length === 0 && !isLoading) {
      scanAssets();
    }
  }, [project, assets.length, isLoading, scanAssets]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets..."
          size="sm"
          className="flex-1 h-7 text-xs"
        />
        <span className="text-xs text-[var(--color-text-tertiary)] shrink-0">
          {totalAssetCount} assets
          {scanDurationMs > 0 && ` (${scanDurationMs}ms)`}
        </span>
      </div>

      {/* Layer summary */}
      {project && project.layers.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
          {project.layers.map((layer) => (
            <span
              key={layer.name}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
            >
              {layer.name}{" "}
              <span className="text-[var(--color-text-tertiary)]">
                p{layer.priority} &middot; {layer.asset_count} files
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-tertiary)]">
            Scanning assets...
          </div>
        )}

        {error && (
          <div className="m-3 rounded-md bg-[var(--color-danger-500)]/10 border border-[var(--color-danger-500)]/20 px-3 py-2 text-xs text-[var(--color-danger-400)]">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <AssetTree assets={assets} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/project/browser")({
  component: AssetBrowserPage,
});
