import { useState, useEffect } from "react";
import {
  type RecentProjectInfo,
  getRecentProjects,
  removeRecentProject,
} from "../../lib/tauri-commands";

interface RecentProjectsListProps {
  onOpenProject: (path: string) => void;
}

export function RecentProjectsList({ onOpenProject }: RecentProjectsListProps) {
  const [projects, setProjects] = useState<RecentProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const result = await getRecentProjects();
      setProjects(result);
    } catch {
      // Silently fail — recent projects are non-critical
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleRemove = async (path: string) => {
    try {
      await removeRecentProject(path);
      setProjects((prev) => prev.filter((p) => p.path !== path));
    } catch {
      // Silently fail
    }
  };

  if (loading) {
    return (
      <p className="text-xs text-[var(--color-text-tertiary)]">Loading...</p>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="text-xs text-[var(--color-text-tertiary)]">
        No recent projects
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {projects.map((project) => (
        <div
          key={project.path}
          className="group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
          onClick={() => {
            if (project.exists) onOpenProject(project.path);
          }}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          {/* Status dot */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              project.exists
                ? "bg-[var(--color-success-500)]"
                : "bg-[var(--color-danger-500)]/50"
            }`}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${
                project.exists
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-tertiary)] line-through"
              }`}
            >
              {project.name}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] truncate">
              {project.path}
            </p>
          </div>

          {/* Last opened */}
          <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0">
            {formatRelativeDate(project.last_opened)}
          </span>

          {/* Remove button */}
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger-400)] text-xs px-1 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(project.path);
            }}
          >
            &#x2715;
          </button>
        </div>
      ))}
    </div>
  );
}

function formatRelativeDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return "";
  }
}
