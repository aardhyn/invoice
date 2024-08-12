import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

const DEFAULT_PORT = 3000;

dotenv.config({ path: "../.env" });

const { VITE_CLIENT_PORT } = process.env;
const port = VITE_CLIENT_PORT ? parseInt(VITE_CLIENT_PORT) : DEFAULT_PORT;

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: { port },
});
