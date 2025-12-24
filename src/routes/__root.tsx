import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="border-b border-gray-700 bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-100">LTK Forge</h1>
            <div className="flex gap-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
                activeProps={{
                  className: "text-white font-semibold",
                }}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition-colors"
                activeProps={{
                  className: "text-white font-semibold",
                }}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
