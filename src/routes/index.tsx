import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import clsx from "clsx";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to LTK Forge</h1>
        <p className="text-gray-400 text-lg">Visual editor for League of Legends modding</p>
      </div>

      <div className="flex justify-center gap-8 my-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src="/vite.svg"
            className="h-24 hover:drop-shadow-[0_0_2em_#747bff]"
            alt="Vite logo"
          />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noreferrer">
          <img
            src="/tauri.svg"
            className="h-24 hover:drop-shadow-[0_0_2em_#24c8db]"
            alt="Tauri logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
            className="h-24 hover:drop-shadow-[0_0_2em_#61dafb]"
            alt="React logo"
          />
        </a>
      </div>

      <div className="max-w-md mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
          className="space-y-4"
        >
          <input
            id="greet-input"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={clsx(
              "w-full px-4 py-2 rounded-lg font-medium transition-colors",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            )}
          >
            Greet
          </button>
        </form>
        {greetMsg && (
          <p className="mt-4 text-center text-lg font-semibold text-green-400">{greetMsg}</p>
        )}
      </div>
    </div>
  );
}
