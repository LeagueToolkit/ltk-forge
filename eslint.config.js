import baseConfig from "@ltk-forge/eslint-config";

export default [
  ...baseConfig,
  {
    ignores: ["**/dist/", "**/node_modules/", "src-tauri/"],
  },
];
