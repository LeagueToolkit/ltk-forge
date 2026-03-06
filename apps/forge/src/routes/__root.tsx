import { createRootRoute, Outlet } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";

function TitleBar() {
  const appWindow = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      style={{
        height: "var(--titlebar-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--color-bg-secondary)",
        paddingLeft: "12px",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)" }}>
        LTK Forge
      </span>
      <div style={{ display: "flex", height: "100%" }}>
        <button
          onClick={() => appWindow.minimize()}
          style={{
            width: "46px",
            height: "100%",
            border: "none",
            background: "transparent",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-tertiary)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          &#x2013;
        </button>
        <button
          onClick={() => appWindow.toggleMaximize()}
          style={{
            width: "46px",
            height: "100%",
            border: "none",
            background: "transparent",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-tertiary)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          &#x25A1;
        </button>
        <button
          onClick={() => appWindow.close()}
          style={{
            width: "46px",
            height: "100%",
            border: "none",
            background: "transparent",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c42b1c")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
}

function RootLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TitleBar />
      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
