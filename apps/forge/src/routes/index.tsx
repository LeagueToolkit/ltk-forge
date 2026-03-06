import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { open } from "@tauri-apps/plugin-dialog";
import { Button } from "@ltk-forge/ui";
import { useProjectStore } from "../stores/project-store";
import { RecentProjectsList } from "../components/recent-projects/RecentProjectsList";

function LandingPage() {
  const navigate = useNavigate();
  const openProject = useProjectStore((s) => s.openProject);
  const isLoading = useProjectStore((s) => s.isLoading);
  const error = useProjectStore((s) => s.error);
  const clearError = useProjectStore((s) => s.clearError);

  const handleOpenProject = async (path?: string) => {
    clearError();
    const projectPath =
      path ?? (await open({ directory: true, multiple: false }));

    if (!projectPath) return;

    try {
      await openProject(projectPath);
      navigate({ to: "/project/browser" });
    } catch {
      // Error is set in the store
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] text-center">
          LTK Forge
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mt-1 mb-6">
          Visual editor for League of Legends modding
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            intent="primary"
            className="flex-1"
            onClick={() => navigate({ to: "/new-project" })}
          >
            New Project
          </Button>
          <Button
            variant="outline"
            intent="primary"
            className="flex-1"
            onClick={() => handleOpenProject()}
            disabled={isLoading}
          >
            {isLoading ? "Opening..." : "Open Project"}
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-[var(--color-danger-500)]/10 border border-[var(--color-danger-500)]/20 px-3 py-2 text-xs text-[var(--color-danger-400)] mb-4">
            {error}
          </div>
        )}

        {/* Recent projects */}
        <div>
          <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
            Recent Projects
          </h2>
          <RecentProjectsList onOpenProject={handleOpenProject} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: LandingPage,
});
