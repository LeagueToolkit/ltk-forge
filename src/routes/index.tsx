import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@base-ui/react/button';
import reactLogo from '../assets/react.svg';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Welcome to LTK Forge</h1>
      <p className="text-lg text-gray-600">Tauri v2 + React + TypeScript + TanStack Router</p>

      <div className="flex items-center gap-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noreferrer">
          <img src="/tauri.svg" className="h-24 w-24" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="h-24 w-24" alt="React logo" />
        </a>
      </div>

      <form
        className="flex flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void greet();
        }}
      >
        <input
          id="greet-input"
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button
          type="submit"
          className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
        >
          Greet
        </Button>
      </form>
      {greetMsg && <p className="text-xl font-semibold text-green-600">{greetMsg}</p>}
    </main>
  );
}
