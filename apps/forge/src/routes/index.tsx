import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface AppInfo {
  name: string;
  version: string;
}

function LandingPage() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    invoke<AppInfo>("get_app_info")
      .then(setAppInfo)
      .catch((err) => setError(String(err)));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: "16px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          margin: 0,
        }}
      >
        LTK Forge
      </h1>
      <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: "14px" }}>
        Visual editor for League of Legends modding
      </p>
      {appInfo && (
        <div
          style={{
            marginTop: "24px",
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: "var(--color-bg-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
          <span style={{ color: "var(--color-text-secondary)" }}>
            Backend connected &middot; v{appInfo.version}
          </span>
        </div>
      )}
      {error && (
        <div
          style={{
            marginTop: "24px",
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: "var(--color-bg-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
            }}
          />
          <span style={{ color: "#ef4444" }}>Backend error: {error}</span>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: LandingPage,
});
