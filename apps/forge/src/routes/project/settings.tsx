import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@ltk-forge/ui";
import { useProjectStore } from "../../stores/project-store";
import { cleanupScratch } from "../../lib/tauri-commands";

function ProjectSettingsPage() {
  const project = useProjectStore((s) => s.currentProject);
  const [cleanupResult, setCleanupResult] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  if (!project) return null;

  const handleCleanup = async (dryRun: boolean) => {
    setIsCleaningUp(true);
    setCleanupResult(null);
    try {
      const result = await cleanupScratch(project.rootPath, dryRun);
      if (dryRun) {
        if (result.removed_entries.length === 0) {
          setCleanupResult("No stale scratch data found.");
        } else {
          setCleanupResult(
            `Found ${result.removed_entries.length} stale entries (${formatBytes(result.freed_bytes)}). Click "Clean Up" to remove.`,
          );
        }
      } else {
        setCleanupResult(
          `Removed ${result.removed_entries.length} entries, freed ${formatBytes(result.freed_bytes)}.`,
        );
      }
    } catch (err) {
      setCleanupResult(`Error: ${err}`);
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
        Project Settings
      </h1>

      {/* Metadata */}
      <Section title="Metadata">
        <InfoRow label="Name" value={project.config.name} />
        <InfoRow label="Display Name" value={project.config.display_name} />
        <InfoRow label="Version" value={project.config.version} />
        <InfoRow label="Description" value={project.config.description} />
        <InfoRow label="Path" value={project.rootPath} />
      </Section>

      {/* Layers */}
      <Section title="Layers">
        {project.layers.length === 0 ? (
          <p className="text-xs text-[var(--color-text-tertiary)]">
            No layers defined
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {project.layers.map((layer) => (
              <div
                key={layer.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-[var(--color-text-primary)]">
                  {layer.name}
                </span>
                <span className="text-[var(--color-text-tertiary)]">
                  priority {layer.priority} &middot; {layer.asset_count} files
                  &middot; {formatBytes(layer.total_size_bytes)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Scratch Data */}
      <Section title="Editor Scratch Data">
        {project.scratchInfo ? (
          <div className="flex flex-col gap-2">
            <InfoRow
              label="Size"
              value={formatBytes(project.scratchInfo.total_size_bytes)}
            />
            <InfoRow
              label="Last Cleanup"
              value={project.scratchInfo.last_cleanup ?? "Never"}
            />
            <div className="flex gap-2 mt-1">
              <Button
                variant="outline"
                intent="primary"
                className="text-xs"
                onClick={() => handleCleanup(true)}
                disabled={isCleaningUp}
              >
                Preview Cleanup
              </Button>
              <Button
                variant="outline"
                intent="danger"
                className="text-xs"
                onClick={() => handleCleanup(false)}
                disabled={isCleaningUp}
              >
                Clean Up
              </Button>
            </div>
            {cleanupResult && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {cleanupResult}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-tertiary)]">
            No scratch data directory exists yet
          </p>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
        {title}
      </h2>
      <div className="bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-default)] p-3">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-xs py-0.5">
      <span className="text-[var(--color-text-tertiary)] w-24 shrink-0">
        {label}
      </span>
      <span className="text-[var(--color-text-primary)] break-all">
        {value}
      </span>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

export const Route = createFileRoute("/project/settings")({
  component: ProjectSettingsPage,
});
