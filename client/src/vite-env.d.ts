/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * The port the client is running on.
   */
  readonly VITE_CLIENT_PORT: string;
  /**
   * The root URL of the API.
   */
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
