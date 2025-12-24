import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About LTK Forge</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 text-lg">
          LTK Forge is a visual editor for creating and editing League of Legends mods.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Features</h2>
        <ul className="space-y-2 text-gray-300">
          <li>
            🗺️ <strong>Map Editor</strong> - Edit .mapgeo environment files
          </li>
          <li>
            🧍 <strong>Model Viewer</strong> - View skinned meshes with animation playback
          </li>
          <li>
            ✨ <strong>VFX Editor</strong> - Create and preview particle effects
          </li>
          <li>
            🖼️ <strong>Texture Viewer</strong> - Preview textures with channel inspection
          </li>
          <li>
            📦 <strong>Build Integration</strong> - Package mods with league-mod
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Tech Stack</h2>
        <ul className="space-y-2 text-gray-300">
          <li>
            <strong>Framework:</strong> Tauri 2.0 with Rust backend
          </li>
          <li>
            <strong>Frontend:</strong> React 19 with TypeScript
          </li>
          <li>
            <strong>Routing:</strong> TanStack Router
          </li>
          <li>
            <strong>Styling:</strong> Tailwind CSS with base-ui components
          </li>
          <li>
            <strong>3D Rendering:</strong> Three.js (coming soon)
          </li>
        </ul>
      </div>
    </div>
  );
}
