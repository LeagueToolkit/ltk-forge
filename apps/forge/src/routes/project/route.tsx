import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useProjectStore } from "../../stores/project-store";
import { Button } from "@ltk-forge/ui";

function ProjectLayout() {
  const project = useProjectStore((s) => s.currentProject);
  const navigate = useNavigate();

  if (!project) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] flex flex-col">
        <div className="p-3 border-b border-[var(--color-border-default)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
            {project.config.display_name}
          </h2>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            v{project.config.version}
          </p>
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-0.5">
          <Button
            variant="ghost"
            intent="primary"
            className="justify-start text-xs px-2 h-7"
            onClick={() => navigate({ to: "/project/browser" })}
          >
            Assets
          </Button>
          <Button
            variant="ghost"
            intent="primary"
            className="justify-start text-xs px-2 h-7"
            onClick={() => navigate({ to: "/project/settings" })}
          >
            Settings
          </Button>
        </nav>

        <div className="p-2 border-t border-[var(--color-border-default)]">
          <Button
            variant="ghost"
            intent="primary"
            className="w-full justify-start text-xs px-2 h-7"
            onClick={() => {
              useProjectStore.getState().reset();
              navigate({ to: "/" });
            }}
          >
            Close Project
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/project")({
  component: ProjectLayout,
});
