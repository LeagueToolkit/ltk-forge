import { createRootRoute, Outlet } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button } from "@ltk-forge/ui";

const titlebarButtonClass =
  "w-[46px] h-full rounded-none text-[var(--color-text-secondary)]";

function TitleBar() {
  const appWindow = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-between select-none h-[var(--titlebar-height)] bg-[var(--color-bg-secondary)] pl-3"
    >
      <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
        LTK Forge
      </span>
      <div className="flex h-full">
        <Button
          variant="ghost"
          intent="primary"
          className={`${titlebarButtonClass} text-sm hover:bg-[var(--color-bg-tertiary)]`}
          onClick={() => appWindow.minimize()}
        >
          &#x2013;
        </Button>
        <Button
          variant="ghost"
          intent="primary"
          className={`${titlebarButtonClass} text-xs hover:bg-[var(--color-bg-tertiary)]`}
          onClick={() => appWindow.toggleMaximize()}
        >
          &#x25A1;
        </Button>
        <Button
          variant="ghost"
          intent="danger"
          className={`${titlebarButtonClass} text-sm hover:bg-[var(--color-danger-600)] hover:text-white`}
          onClick={() => appWindow.close()}
        >
          &#x2715;
        </Button>
      </div>
    </div>
  );
}

function RootLayout() {
  return (
    <div className="flex flex-col h-full">
      <TitleBar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
