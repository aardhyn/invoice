import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const DEFAULT_PORT = 5173;
function getClientPort() {
  const { VITE_CLIENT_PORT } = process.env;
  if (!VITE_CLIENT_PORT) return DEFAULT_PORT;

  const port = parseInt(VITE_CLIENT_PORT);
  if (isNaN(port)) {
    throw new Error(`VITE_CLIENT_PORT '${port}' is not a number`);
  }

  return port;
}

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    TanStackRouterVite({ routesDirectory: "src/route" }),
  ],
  server: { port: getClientPort() },
});
