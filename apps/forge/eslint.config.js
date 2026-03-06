import baseConfig from "@ltk-forge/eslint-config";

export default [
  ...baseConfig,
  {
    ignores: ["src-tauri/", "dist/", "routeTree.gen.ts"],
  },
];
